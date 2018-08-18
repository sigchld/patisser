# -*- coding: utf-8 -*-
import traceback
import logging
import io
import time
import math
import json
import re

from PIL import Image
from PIL import ImageMath
from PIL import ImageChops

from django import http
from django.http import HttpResponse
from django.views.generic import ListView
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render
from django.shortcuts import redirect
from django.template import RequestContext, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.http import HttpResponseNotModified, HttpResponseServerError
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import IntegrityError
from django.utils.datastructures import MultiValueDictKeyError
from django.views import View
from django.views.decorators.http import require_http_methods
#from django.core.exceptions import DoesNotExist
from recettes.models import Photo, Ingredient, Categorie, Preparation, Element, EtapePreparation
from fees import settings
from . energie import calcul_ingredients_preparation

# Get an instance of a logger
logger = logging.getLogger('fees')

class PreparationEnergieEconomat(View):
    """
    REst module pour les retrouver la valeurs energétiaue et tous les élements d'une préparations (ingredients + bases)
    """
    def __init__(self):
        self.http_method_names = ['get']

    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')

    #
    def get(self, request, preparation_id=None):
        """
        /preparation/energie/no
        """
        if not preparation_id:
            return HttpResponse("{ \"status\":-1 }")

        # il faut charger la preparation...
        preparation = None
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
        except:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        logger.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            logger.error("Loading IOError /preparations/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-, \"message\": \"erreur interne\" }")

        (kcalories, kjoules, allergene,
         matieres_grasses, matieres_grasses_saturees,
         glucides, glucides_dont_sucres,
         fibres_alimentaires, proteines,
         sel, economat, cout) = calcul_ingredients_preparation(preparation)

        json_string = json.dumps({'cout':cout,
                                  'kcalories':kcalories,
                                  'kjoules':kjoules,
                                  'allergene':allergene,
                                  'matieres_grasses':matieres_grasses,
                                  'matieres_grasses_saturees':matieres_grasses_saturees,
                                  'glucides':glucides,
                                  'glucides_dont_sucres':glucides_dont_sucres,
                                  'fibres_alimentaires':fibres_alimentaires,
                                  'proteines':proteines,
                                  'sel':sel,
                                  'ingredients': economat},
                                 cls=DjangoJSONEncoder)
        return HttpResponse("{{ \"status\":0, \"message\": \"ok\", \"valeurs\":{} }}".format(json_string))


class PreparationElement(View):
    """
    REst module pour les elements d'une préparation
    """
    def __init__(self):
        """
        """
        View.__init__(self)
        self.http_method_names = ['get', 'put', 'post', 'delete']

    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')


    @staticmethod
    def element_to_json(element):
        return element.to_json()

    @staticmethod
    def elements_to_json_response(elements):
        nb_elements = 0
        # {{ \"status\":0, \"message\": \"ok\", \"nb_elements\" : 1, \"elements\":[{}] }}".format(json_string))
        res = "{ \"status\":0, \"message\": \"ok\",  \"elements\": ["
        first = True
        for element in elements:
            if first:
                first = False
            else:
                res = res + ","
            nb_elements += 1
            res = res + PreparationElement.element_to_json(element)
        res = res + "], \"nb_elements\":" + str(nb_elements) + "}"
        return res
    
    def put(self, request, preparation_id, element_id=None):
        """
        /preparation/no/elenent/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit() or element_id is not None:
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            body = json.loads(request.body)
            logger.error("//////////////////////////////////// Loading preparation ingredient body {}".format(body))
            ingredient = Ingredient.objects.get(pk=body['ingredient_id'])
            quantite = body['quantite']
            quantite = quantite.strip()

            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-4, \"message\": \"saisie erronée\" }")
        except Preparation.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except Ingredient.DoesNotExist:
            logger.error("Loading ingredient inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")
        except KeyError:
            logger.error("Loading json erroné/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")

        element = Element()
        element.ingredient = ingredient
        element.quantite = body['quantite']
        element.preparation = preparation
        element.save()
        preparation.elements.add(element)
        preparation.save()
        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"element_id\": {}}}".format(element.id))


    def post(self, request, preparation_id, element_id):
        """
        /preparation/no/elenent/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit() or not element_id or not element_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        element_id = int(element_id)
        
        try:
            body = json.loads(request.body)
            quantite = body['quantite']
            quantite = quantite.strip()
            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-1, \"message\": \"saisie erronée\" }")

            preparation = Preparation.objects.get(pk=preparation_id)
            element = Element.objects.get(pk=element_id)

            if element.preparation <> preparation:
                logger.error("Loading element appartient pas preparation/{}/{}".format(preparation_id, element_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation et/ou element erronés\" }")
                
        except Preparation.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"préparation inconnue\" }")
        except Element.DoesNotExist:
            logger.error("Loading ingredient inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"element inconnu\" }")
        except KeyError:
            logger.error("Loading json erroné/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-5, \"message\": \"erreur json\" }")

        element.quantite = quantite
        element.save()

        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"element_id\": {}}}".format(element.id))


    
    def delete(self, request, preparation_id=None, element_id=None):
        """
        /preparation/preparation_id/elenent/element_id
        """
        logger.error("Delete element/{}/{}".format(preparation_id, element_id))
        if (preparation_id is None) or (not preparation_id.isdigit()) or (element_id is None) or (not element_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        preparation_id = int(preparation_id)
        ingredient_id = int(preparation_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            element = Element.objects.get(pk=element_id)
        except Preparation.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except Element.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")


        #preparation.elements.delete(element)
        element.delete()
        #preparation.save()
        return HttpResponse("{\"status\":0, \"message\": \"ok\"}")
    

    #
    def get(self, request, preparation_id, element_id=None):
        """
        /preparation/no/elenent/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        if element_id is not None and element_id.isdigit():
            try:
                element = Element.objects.get(pk=element_id)
                if element.preparation.id != preparation_id:
                    return HttpResponse("{{ \"status\": {} }}".format(-1))
                response = PreparationElement.elements_to_json_response([element])
            except Element.DoesNotExist:
                return HttpResponse("{ \"status\":-2 }")
            
            return HttpResponse(response)
        
        # il faut charger la prération pour retrouver les ingredients
        preparation = None
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
        except:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        logger.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            logger.error("Loading IOError /preparations/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-, \"message\": \"erreur interne\" }")

        #for element in preparation.elements:
        response = PreparationElement.elements_to_json_response(preparation.elements.all())
        #json_string = json.dumps(preparation.elements, cls=DjangoJSONEncoder)
        return HttpResponse(response)


class PreparationEtape(View):
    """
    REst module pour les elements d'une préparation
    """
    def __init__(self):
        """
        """
        View.__init__(self)
        self.http_method_names = ['get', 'put', 'delete']

    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')


    @staticmethod
    def etape_to_json(etape):
        return etape.to_json()

    @staticmethod
    def etape_to_json_response(etapes):
        nb_etapes = 0
        # {{ \"status\":0, \"message\": \"ok\", \"nb_elements\" : 1, \"elements\":[{}] }}".format(json_string))
        res = "{ \"status\":0, \"message\": \"ok\",  \"etapes\": ["
        first = True
        for etape in etapes:
            if first:
                first = False
            else:
                res = res + ","
            nb_etapes += 1
            res = res + PreparationEtape.etape_to_json(etape)
        res = res + "], \"nb_etapes\":" + str(nb_etapes) + "}"
        return res

    def put(self, request, preparation_id, etape_id=None):
        """
        /preparation/no/etape/
        """
        if not preparation_id or not preparation_id.isdigit() or etape_id is not None:
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            body = json.loads(request.body)
        except Preparation.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except Ingredient.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")

        etape = EtapePreparation()
        etape.description = body['description']
        etape.nom = body['nom']
        etape.ordre = body['ordre']
        etape.preparation = preparation
        etape.save()
        preparation.etape.add(etape)
        preparation.save()
        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"etape_id\": {}}}".format(etape.id))


    def delete(self, request, preparation_id=None, etape_id=None):
        """
        /preparation/preparation_id/etape/etape_id
        """
        logger.error("Delete etape/{}/{}".format(preparation_id, etape_id))
        if (preparation_id is None) or (not preparation_id.isdigit()) or (etape_id is None) or (not etape_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        preparation_id = int(preparation_id)
        etape_id = int(etape_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            etape = EtapePreparation.objects.get(pk=etape_id)
        except Preparation.DoesNotExist:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except EtapePreparation.DoesNotExist:
            logger.error("Loading etape inconnue/{}".format(etape_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"etape inconnu\" }")


        #preparation.elements.delete(element)
        etape.delete()
        #preparation.save()
        return HttpResponse("{\"status\":0, \"message\": \"ok\"}")


    #
    def get(self, request, preparation_id, etape_id=None):
        """
        /preparation/preparation_id/etape/etape_id/
        """
        if not preparation_id or not preparation_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        if etape_id is not None and etape_id.isdigit():
            try:
                etape_id = int(etape_id)
                etape = EtapePreparation.objects.get(pk=etape_id)
                if etape.preparation.id != preparation_id:
                    return HttpResponse("{{ \"status\": {} }}".format(-1))
                response = PreparationElement.elements_to_json_response([etape])
            except EtapePreparation.DoesNotExist:
                return HttpResponse("{ \"status\":-2 }")
            
            return HttpResponse(response)
        
        # il faut charger la prération pour retrouver les ingredients
        preparation = None
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
        except:
            logger.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        logger.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            logger.error("Loading IOError /preparations/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-, \"message\": \"erreur interne\" }")

        #for element in preparation.elements:
        response = PreparationEtape.etape_to_json_response(preparation.etapes.all())
        #json_string = json.dumps(preparation.elements, cls=DjangoJSONEncoder)
        return HttpResponse(response)
