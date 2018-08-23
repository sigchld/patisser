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
from recettes.models import Photo, Ingredient, Categorie, Preparation, Element, EtapePreparation, BasePreparation
from fees import settings
from .energie import calcul_ingredients_preparation
from .forms import PreparationForm
from .photorest import get_thumbnail

# Get an instance of a logger
LOGGER = logging.getLogger('fees')


class PreparationRest(View):
    """
    Acces REST Preparation
    """
    def __init__(self):
        self.http_method_names = ['delete', 'post', 'put', 'get']
       
    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')
   
    def get(self, request, preparation_id=None, categorie_id=None):
        """
        retourne une préparation
        """
        if not preparation_id or (preparation_id == "all" and categorie_id is None):
            return HttpResponse("{ \"status\":-1 }")

        if preparation_id == "all":
            return get_preparation_list(request, categorie_id)

        # il faut charger l'preparation...
        preparation = None
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-1 }")

        if preparation is None:
            return HttpResponse("{ \"status\":-1 }")

        try:
            if preparation.acces != "PUB":
                if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                    LOGGER.error("Loading acces interdit/preparation/{}/{}/{}/{}/{}/".format(preparation_id,
                                                                                             request.user.is_authenticated,
                                                                                             request.user.username,
                                                                                             preparation.acces,
                                                                                             preparation.owner))
                    return HttpResponse("{ \"status\":-1 }")
        except:
            LOGGER.error("Preparation/preparations/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-1 }")

        return HttpResponse("{{ \"status\": 0, \"message\": \"OK\", \"preparation\": {} }}".format(preparation.to_json()))

    # Mofification d'une préparation
    def post(self, request, preparation_id=None):
        """
        Modification d'une préparation
        """
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "status " : -1, "message" : "Il faut être authentifié pour modifier une préparation" }')

        if not preparation_id:
            return HttpResponseServerError('{ "status" : -1, "message" : "Il faut indiquer une numéro de préparation" }')
                    
        try:
            form = PreparationForm(request.POST)
            if not form.is_valid():
                champs = ""
                for error in form.errors:
                    champs = champs + error + ", "
                return HttpResponseServerError('{{ "status" : -1, "message" : "saisie erronée: {}" }}'.format(champs))
            
            preparation2_id = request.POST.get('id', None)
            preparation = None
            try:
                preparation = Preparation.objects.get(pk=preparation_id)
                #except Preparation.DoesNotExist:
            except:
                LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
                return HttpResponseServerError('{ "message" : "preparation inconnu" }')

            if preparation.owner.username != request.user.username:
                return HttpResponseServerError('{ "message" : "La préparation ne vous appartient pas" }')

            # chargement photo si il y a lieu
            imported_photo = False
            try:
                myfile = request.FILES['photo']
                name = myfile.name
                LOGGER.debug(u"PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)

                try:
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                    photo = Photo()
                    img = get_thumbnail(img)
                    # sauvegarde photo
                    fic = io.BytesIO()
                    img.save(fic, "PNG")
                    fic.seek(0)
                    photo.thumbnail = fic.read1(-1)
                    photo.owner = preparation.owner
                    photo.acces = "PRIV"
                    photo.code = "I{}".format(math.trunc(time.time()))
                    photo.description = "Importée depuis formulaire ingrédient"
                    if preparation.photo and  preparation.photo.categorie:
                        photo.categorie = preparation.photo.categorie
                    else:
                        photo.categorie = Categorie.objects.filter(Q(groupe="PREP") & Q(categorie="aucune")).first()
                    photo.save()
                    preparation.photo = photo
                    imported_photo = True
                except IOError:
                    pass

            except MultiValueDictKeyError:
                # pas de nouvelle photo
                pass

            # maj photo
            if not imported_photo:
                new_photo_id = request.POST.get('photo_id', None)
                if new_photo_id:
                    if new_photo_id.isdigit() and preparation.photo and new_photo_id != preparation.photo.id:
                        preparation.photo = Photo.objects.get(pk=new_photo_id)
                    elif new_photo_id == "NONE":
                        preparation.photo = None

            # maj categorie
            new_categorie = request.POST.get('categorie', None)
            if new_categorie:
                try:
                    queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="PREP") & Q(owner=request.user.username))
                    if queryset.count() == 1:
                        preparation.categorie = queryset.first()
                    else:
                        queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="PREP") & Q(acces='PUB'))
                        if queryset.count() == 1:
                            preparation.categorie = queryset.first()
                        else:
                            return HttpResponseServerError('{ "message" : "saisie incomplète,  catégorie inconnues" }')
                except:
                    just_the_string = traceback.format_exc()
                    LOGGER.debug("preparation_modification/categorie_obj/{}".format(just_the_string))


            # maj des champs standards
            for label in ('code',
                          'description',
                          'bonasavoir',
                          'acces'):
                setattr(preparation, label, form.cleaned_data[label])

            # cas spécifique du code qui est en lettres majuscules
            setattr(preparation, 'code', form.cleaned_data['code'].upper())

            preparation.save()
            return HttpResponse('{ "message" : "OK" }')

        except IntegrityError:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "modification impossible" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

    # Création d'une préparation
    def put(self, request, preparation_id=None):
        """
        Modification d'une préparation
        """
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "status " : -1, "message" : "Il faut être authentifié pour modifier une préparation" }')

        if preparation_id is not None:
            return HttpResponseServerError('{ "status" : -1, "message" : "Il faut pas indiquer une numéro de préparation" }')

        preparation = Preparation()
        preparation.owner = request.user
        
        try:
            form = PreparationForm(request.POST)
            if not form.is_valid():
                champs = ""
                for error in form.errors:
                    champs = champs + error + ", "
                return HttpResponseServerError('{{ "status" : -1, "message" : "saisie erronée: {}" }}'.format(champs))    

            # chargement photo si il y a lieu
            imported_photo = False
            try:
                myfile = request.FILES['photo']
                name = myfile.name
                LOGGER.debug(u"PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)

                try:
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                    photo = Photo()
                    img = get_thumbnail(img)
                    # sauvegarde photo
                    fic = io.BytesIO()
                    img.save(fic, "PNG")
                    fic.seek(0)
                    photo.thumbnail = fic.read1(-1)
                    photo.owner = preparation.owner
                    photo.acces = "PRIV"
                    photo.code = "I{}".format(math.trunc(time.time()))
                    photo.description = "Importée depuis formulaire ingrédient"
                    if preparation.photo and  preparation.photo.categorie:
                        photo.categorie = preparation.photo.categorie
                    else:
                        photo.categorie = Categorie.objects.filter(Q(groupe="PREP") & Q(categorie="aucune")).first()
                    photo.save()
                    preparation.photo = photo
                    imported_photo = True
                except IOError:
                    pass

            except MultiValueDictKeyError:
                # pas de nouvelle photo
                pass

            # maj photo
            if not imported_photo:
                new_photo_id = request.POST.get('photo_id', None)
                if new_photo_id:
                    if new_photo_id.isdigit() and preparation.photo and new_photo_id != preparation.photo.id:
                        preparation.photo = Photo.objects.get(pk=new_photo_id)
                    elif new_photo_id == "NONE":
                        preparation.photo = None

            # maj categorie
            new_categorie = request.POST.get('categorie', None)
            if new_categorie:
                try:
                    queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="PREP") & Q(owner=request.user.username))
                    if queryset.count() == 1:
                        preparation.categorie = queryset.first()
                    else:
                        queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="PREP") & Q(acces='PUB'))
                        if queryset.count() == 1:
                            preparation.categorie = queryset.first()
                        else:
                            return HttpResponseServerError('{ "message" : "saisie incomplète,  catégorie inconnues" }')
                except:
                    just_the_string = traceback.format_exc()
                    LOGGER.debug("preparation_modification/categorie_obj/{}".format(just_the_string))


            # maj des champs standards
            for label in ('description',
                          'bonasavoir',
                          'acces'):
                setattr(preparation, label, form.cleaned_data[label])

            # cas spécifique du code qui est en lettres majuscules
            setattr(preparation, 'code', form.cleaned_data['code'].upper())

            preparation.save()
            return HttpResponse('{ "message" : "OK" }')

        except IntegrityError:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "création impossible, code déjà utilisé" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')


    
    #
    # Suppresion d'une préparation
    #
    def delete(self, request, preparation_id=None):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "message" : "Il faut être authentifié pour supprimer une preparation" }')

        try:
            preparation = Preparation.objects.get(pk=preparation_id)
        except Preparation.DoesNotExist:
            raise Http404('{ "message" : "preparation introuvable" }')

        if preparation.owner.username != request.user.username:
            return HttpResponseForbidden('{ "message" : "seul le propriétaire peu supprimer sa preparation" }')

        
        nbref = len(preparation.preparationrecette_set.all())
        if nbref == 0:
            nbref = len(preparation.basepreparation_set.all())
            
        LOGGER.debug("Cette préparation est déja utilisé {} fois".format(nbref))
        if nbref != 0:
            return HttpResponseForbidden("{{ \"status\": -1, \"message\" : \"Suppression impossible, la preparation est referencée {} fois\" }}".format(nbref))
        try:
            preparation.delete()
            return HttpResponse('{ "message" : "Suppression rélalisée" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')


def get_preparation_list(request, categorie_id):
    try:
        if categorie_id.isdigit():
            categorie_obj = Categorie.objects.get(pk=categorie_id)
        else:
            categorie_obj = Categorie.objects.filter(Q(groupe="PREP") & Q(categorie=categorie_id))[0]
    except:
        just_the_string = traceback.format_exc()
        LOGGER.debug(just_the_string)
        return HttpResponse("{{ \"status\": -1, \"message\": {}}}".format(just_the_string))

    if request.user.is_authenticated:
        preparations = Preparation.objects.filter((~Q(owner=request.user.username) & Q(acces='PUB'))| Q(owner=request.user.username)).order_by('code')
    else:
        preparations = Preparation.objects.filter(Q(acces='PUB'))

    if categorie_obj is not None:
        LOGGER.debug("list_ingredient_result/categorie_obj/filtre/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
        preparations = preparations.filter(categorie=categorie_obj)

    nb_elements = 0
    res = "{ \"status\":0, \"message\": \"ok\",  \"preparations\": ["
    first = True
    for preparation in preparations:
        if first:
            first = False
        else:
            res = res + ","
        nb_elements += 1
        res = res + preparation.to_json()
    res = res + "], \"nb_perparations\":" + str(nb_elements) + "}"
    return HttpResponse(res)




class PreparationEnergieEconomat(View):
    """
    REst module pour les retrouver la valeurs energétiaue et tous les élements d'une préparations (ingredients + bases)
    """
    def __init__(self):
        self.http_method_names = ['get']

    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
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
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            LOGGER.error("Loading IOError /preparations/{}".format(preparation_id))
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
        LOGGER.warning(
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
            LOGGER.error("//////////////////////////////////// Loading preparation ingredient body {}".format(body))
            ingredient = Ingredient.objects.get(pk=body['ingredient_id'])
            quantite = body['quantite']
            quantite = quantite.strip()

            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-4, \"message\": \"saisie erronée\" }")
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except Ingredient.DoesNotExist:
            LOGGER.error("Loading ingredient inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(preparation_id))
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
                LOGGER.error("Loading element appartient pas preparation/{}/{}".format(preparation_id, element_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation et/ou element erronés\" }")
                
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"préparation inconnue\" }")
        except Element.DoesNotExist:
            LOGGER.error("Loading ingredient inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"element inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-5, \"message\": \"erreur json\" }")

        element.quantite = quantite
        element.save()

        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"element_id\": {}}}".format(element.id))



    def delete(self, request, preparation_id=None, element_id=None):
        """
        /preparation/preparation_id/elenent/element_id
        """
        LOGGER.error("Delete element/{}/{}".format(preparation_id, element_id))
        if (preparation_id is None) or (not preparation_id.isdigit()) or (element_id is None) or (not element_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        preparation_id = int(preparation_id)
        ingredient_id = int(preparation_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            element = Element.objects.get(pk=element_id)
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except Element.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
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
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            LOGGER.error("Loading IOError /preparations/{}".format(preparation_id))
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
        self.http_method_names = ['get', 'put', 'delete', 'post']

    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
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
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except Ingredient.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")

        etape = EtapePreparation()
        etape.description = body['description']
        etape.nom = body['nom']
        etape.ordre = body['ordre']
        etape.preparation = preparation
        etape.save()
        preparation.etapes.add(etape)
        preparation.save()
        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"etape_id\": {}}}".format(etape.id))

    def post(self, request, preparation_id, etape_id):
        """
        /preparation/no/elenent/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit() or not etape_id or not etape_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        etape_id = int(etape_id)

        try:
            body = json.loads(request.body)

            preparation = Preparation.objects.get(pk=preparation_id)
            etape = EtapePreparation.objects.get(pk=etape_id)

            if etape.preparation <> preparation:
                LOGGER.error("Loading element appartient pas preparation/{}/{}".format(preparation_id, etape_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation et/ou element erronés\" }")

        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"préparation inconnue\" }")
        except EtapePreparation.DoesNotExist:
            LOGGER.error("Loading ingredient inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"element inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-5, \"message\": \"erreur json\" }")

        ordre = body.get('ordre', None)
        if ordre:
            if re.match("^[0-9]+$", ordre):
                etape.ordre = ordre

        nom = body.get('nom', None)
        if nom:
            etape.nom = nom

        description = body.get('description', None)
        if description:
            etape.description = description

        etape.save()
        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"etape_id\": {}}}".format(etape.id))



    def delete(self, request, preparation_id=None, etape_id=None):
        """
        /preparation/preparation_id/etape/etape_id
        """
        LOGGER.error("Delete etape/{}/{}".format(preparation_id, etape_id))
        if (preparation_id is None) or (not preparation_id.isdigit()) or (etape_id is None) or (not etape_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        preparation_id = int(preparation_id)
        etape_id = int(etape_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            etape = EtapePreparation.objects.get(pk=etape_id)
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except EtapePreparation.DoesNotExist:
            LOGGER.error("Loading etape inconnue/{}".format(etape_id))
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
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            LOGGER.error("Loading IOError /preparations/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-, \"message\": \"erreur interne\" }")

        #for element in preparation.elements:
        response = PreparationEtape.etape_to_json_response(preparation.etapes.all())
        #json_string = json.dumps(preparation.elements, cls=DjangoJSONEncoder)
        return HttpResponse(response)


class PreparationBase(View):
    """
    REst module pour les préparations de base  d'une préparation
    """
    def __init__(self):
        """
        """
        View.__init__(self)
        self.http_method_names = ['get', 'put', 'post', 'delete']

    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')


    @staticmethod
    def base_to_json(base):
        return base.to_json()

    @staticmethod
    def bases_to_json_response(bases):
        nb_elements = 0
        # {{ \"status\":0, \"message\": \"ok\", \"nb_elements\" : 1, \"elements\":[{}] }}".format(json_string))
        res = "{ \"status\":0, \"message\": \"ok\",  \"bases\": ["
        first = True
        for base in bases:
            if first:
                first = False
            else:
                res = res + ","
            nb_elements += 1
            res = res + PreparationBase.base_to_json(base)
        res = res + "], \"nb_bases\":" + str(nb_elements) + "}"
        return res

    @staticmethod
    def is_cycle(preparation, base_preparation):
        
        trouve = False
        if isinstance(preparation, BasePreparation):
            preparations = preparation.base
        else:
            preparations = preparation

        LOGGER.debug("cycle ? : prep{} / paseprep{}".format(preparations.id, base_preparation.id))
        if preparations == base_preparation:
            return True
            
        for prep in preparations.bases.all():
            if prep == base_preparation:
                LOGGER.debug("cycle : {}".format(prep.id))
                trouve = True
            else:
                trouve = PreparationBase.is_cycle(prep, base_preparation)
            if trouve:
                break
        return trouve

    def put(self, request, preparation_id, base_id=None):
        """
        /preparation/no/base/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit() or base_id is not None:
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            body = json.loads(request.body)

            base_preparation = Preparation.objects.get(pk=body['preparation_id'])
            quantite = body['quantite']
            quantite = quantite.strip()

            if PreparationBase.is_cycle(preparation, base_preparation) or PreparationBase.is_cycle(base_preparation, preparation):
                return HttpResponse("{ \"status\":-4, \"message\": \"cycle de preparations\" }")

            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-4, \"message\": \"saisie erronée\" }")

            quantite = int(quantite)
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")

        base = BasePreparation()
        base.base = base_preparation
        base.quantite = quantite
        base.preparation = preparation
        base.save()
        #preparation.bases.add(base)
        #preparation.save()
        return HttpResponse(u"{{\"status\":0, \"message\": \"ok\", \"base_id\": {}, \"quantite\":{}, \"description\": \"{}\", \"code\": \"{}\" }}".format(base.id,
                                                                                                                                                          base.quantite,
                                                                                                                                                          base.base.description,
                                                                                                                                                          base.base.code))


    def post(self, request, preparation_id, base_id):
        """
        /preparation/no/base/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit() or not base_id or not base_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        base_id = int(base_id)
        
        try:
            body = json.loads(request.body)
            quantite = body['quantite']
            quantite = quantite.strip()
            if not re.match("^[0-9]+$", quantite):
                return HttpResponse("{ \"status\":-1, \"message\": \"quantité erronée\" }")

            quantite = int(quantite)
            if quantite > 100:
                return HttpResponse("{ \"status\":-1, \"message\": \"quantité erronée\" }")
            preparation = Preparation.objects.get(pk=preparation_id)
            base = BasePreparetion.objects.get(pk=base_id)

            if base.preparation <> preparation:
                LOGGER.error("Loading base appartient pas preparation/{}/{}".format(preparation_id, base_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation et/ou base erronés\" }")
                
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"préparation inconnue\" }")
        except BasePreparation.DoesNotExist:
            LOGGER.error("Loading base inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"base inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-5, \"message\": \"erreur json\" }")

        base.quantite = quantite
        base.save()

        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"base_id\": {}}}".format(base.id))



    def delete(self, request, preparation_id=None, base_id=None):
        """
        /preparation/preparation_id/base/base_id/
        """
        LOGGER.error("Delete base/{}/{}".format(preparation_id, base_id))
        if (preparation_id is None) or (not preparation_id.isdigit()) or (base_id is None) or (not base_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        preparation_id = int(preparation_id)
        base_id = int(base_id)
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
            base = BasePreparation.objects.get(pk=base_id)
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")
        except BasePreparation.DoesNotExist:
            LOGGER.error("Loading base preparation inconnue/{}".format(base_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"base inconnu\" }")


        #preparation.bases.delete(base)
        base.delete()
        #preparation.save()
        return HttpResponse("{\"status\":0, \"message\": \"ok\"}")


    #
    def get(self, request, preparation_id, base_id=None):
        """
        /preparation/no/base/no|none|all
        """
        if not preparation_id or not preparation_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        preparation_id = int(preparation_id)
        if base_id is not None and base_id.isdigit():
            try:
                base = BasePreparation.objects.get(pk=base_id)
                if base.preparation.id != preparation_id:
                    return HttpResponse("{{ \"status\": {} }}".format(-1))
                response = PreparationBase.bases_to_json_response([base])
            except BasePreparation.DoesNotExist:
                return HttpResponse("{ \"status\":-2 }")

            return HttpResponse(response)

        # il faut charger la prération pour retrouver les bases
        preparation = None
        try:
            preparation = Preparation.objects.get(pk=preparation_id)
        except:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        try:
            if preparation is not None:
                if preparation.acces != "PUB":
                    if not request.user.is_authenticated and  preparation.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /preparations/{}/{}/{}/{}/{}/".format(preparation_id, request.user.is_authenticated, request.user.username, preparation.acces, preparation.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"préparation inconnue\" }")

        except:
            LOGGER.error("Loading IOError /preparations/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-, \"message\": \"erreur interne\" }")

        response = PreparationBase.bases_to_json_response(preparation.bases.all())
        return HttpResponse(response)
