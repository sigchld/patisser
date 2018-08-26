# -*- coding: utf-8 -*-
import traceback
import logging
import io
import time
import math
import json
import re
from decimal import Decimal, ROUND_DOWN,  getcontext

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
from django.http import HttpResponseForbidden, HttpResponseRedirect, HttpResponseBadRequest
from django.http import HttpResponseNotModified, HttpResponseServerError
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import IntegrityError
from django.utils.datastructures import MultiValueDictKeyError
from django.views import View
from django.views.decorators.http import require_http_methods
#from django.core.exceptions import DoesNotExist
from recettes.models import Photo, Ingredient, Categorie, Preparation, ElementRecette, EtapePreparation, BasePreparation
from recettes.models import Recette, EtapeRecette, PreparationRecette

from fees import settings
from .energie import calcul_ingredients_recette
from .forms import RecetteForm
from .photorest import get_thumbnail

# Get an instance of a logger
LOGGER = logging.getLogger('fees')


class RecetteRest(View):
    """
    Acces REST Recette
    """
    def __init__(self):
        self.http_method_names = ['delete', 'post', 'put', 'get']

    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')

    def get(self, request, recette_id=None, categorie_id=None):
        """
        retourne une recette
        """
        if not recette_id or (recette_id == "all" and categorie_id is None):
            return HttpResponse("{ \"status\":-1, \"message\": \"il manque un paramètre\" }")

        if recette_id.lower() == "all":
            return get_recette_list(request, categorie_id)

        # il faut charger la recette...
        recette = None
        try:
            recette = Recette.objects.get(pk=recette_id)
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-1, \"message\": \recette inconnue\" }")

        if recette is None:
            return HttpResponse("{ \"status\":-1, \"message\": \recette inconnue\" }")

        try:
            if recette.acces != "PUB":
                if not request.user.is_authenticated and  recette.owner.username != request.user.username:
                    LOGGER.error("Loading acces interdit/recette/{}/{}/{}/{}/{}/".format(recette_id,
                                                                                         request.user.is_authenticated,
                                                                                         request.user.username,
                                                                                         recette.acces,
                                                                                         recette.owner))
                    return HttpResponse("{ \"status\":-1, \"message\": \"acces interdit\" }")
        except:
            LOGGER.error("Recette/recettes/{}".format(recette_id))
            return HttpResponse("{ \"status\":-1, \"message\": \"erreur interne\"  }")

        return HttpResponse("{{ \"status\": 0, \"message\": \"OK\", \"recette\": {} }}".format(recette.to_json()))

    # Mofification d'une recette
    def post(self, request, recette_id=None):
        """
        Modification d'une recette
        """
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "status " : -1, "message" : "Il faut être authentifié pour modifier une recette" }')

        if not recette_id:
            return HttpResponseServerError('{ "status" : -1, "message" : "Il faut indiquer une numéro de recette" }')

        try:
            form = RecetteForm(request.POST)
            if not form.is_valid():
                champs = ""
                for error in form.errors:
                    champs = champs + error + ", "
                return HttpResponseServerError('{{ "status" : -1, "message" : "saisie erronée: {}" }}'.format(champs))

            recette = None
            try:
                recette = Recette.objects.get(pk=recette_id)
                #except Recette.DoesNotExist:
            except:
                LOGGER.error("Loading recette inconnue/{}".format(recette_id))
                return HttpResponseServerError('{ "message" : "recette inconnu" }')

            if recette.owner.username != request.user.username:
                return HttpResponseServerError('{ "message" : "La recette ne vous appartient pas" }')

            # changement photo si il y a lieu
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
                    photo.owner = recette.owner
                    photo.acces = "PRIV"
                    photo.code = "I{}".format(math.trunc(time.time()))
                    photo.description = "Importée depuis formulaire ingrédient"
                    if recette.photo and  recette.photo.categorie:
                        photo.categorie = recette.photo.categorie
                    else:
                        photo.categorie = Categorie.objects.filter(Q(groupe="REC") & Q(categorie="aucune")).first()
                    photo.save()
                    recette.photo = photo
                    imported_photo = True
                except IOError:
                    pass

            except MultiValueDictKeyError:
                # pas de nouvelle photo
                pass

            # maj photo
            if not imported_photo:
                new_photo_id = request.POST.get('photo_id', None)
                LOGGER.debug("recette_modification/not imported/w_photo_id/{}/".format(new_photo_id))

                if new_photo_id:
                    if new_photo_id.isdigit() and (recette.photo is None or new_photo_id != recette.photo.id):
                        LOGGER.debug("recette_modification/new_photo_id/{}/".format(new_photo_id))
                        try:
                            recette.photo = Photo.objects.get(pk=new_photo_id)
                            LOGGER.debug("recette_modification/new_photo_id/{}/loaded".format(new_photo_id))
                        except Recette.DoesNotExist:
                            LOGGER.debug("recette_modification/new_photo_id/{}/not found".format(new_photo_id))
                    elif new_photo_id == "NONE":
                        recette.photo = None

            # nouvelle categorie ?
            new_categorie = request.POST.get('categorie', None)
            if new_categorie:
                try:
                    queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="REC") & Q(owner=request.user.username))
                    if queryset.count() == 1:
                        recette.categorie = queryset.first()
                    else:
                        queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="REC") & Q(acces='PUB'))
                        if queryset.count() == 1:
                            recette.categorie = queryset.first()
                        else:
                            return HttpResponseServerError('{ "message" : "saisie incomplète,  catégorie inconnues" }')
                except:
                    just_the_string = traceback.format_exc()
                    LOGGER.debug("recette_modification/categorie_obj/{}".format(just_the_string))


            # maj des champs standards
            for label in ('code',
                          'description',
                          'bonasavoir',
                          'acces'):
                setattr(recette, label, form.cleaned_data[label])

            # cas spécifique du code qui est en lettres majuscules
            setattr(recette, 'code', form.cleaned_data['code'].upper())

            recette.save()
            return HttpResponse('{ "message" : "OK" }')

        except IntegrityError:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "modification impossible" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

    # Création d'une recette
    def put(self, request, recette_id=None):
        """
        Création d'une recette
        """
        if not request.user.is_authenticated:
            return HttpResponseForbidden('{ "status " : -1, "message" : "Il faut être authentifié pour créer une recette" }')

        if recette_id is not None:
            return HttpResponseBadRequest('{ "status" : -1, "message" : "Il faut pas indiquer une numéro de recette" }')

        recette = Recette()
        recette.owner = request.user

        try:
            form = RecetteForm(request.POST)
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
                    photo.owner = recette.owner
                    photo.acces = "PRIV"
                    photo.code = "I{}".format(math.trunc(time.time()))
                    photo.description = "Importée depuis formulaire ingrédient"
                    if recette.photo and  recette.photo.categorie:
                        photo.categorie = recette.photo.categorie
                    else:
                        photo.categorie = Categorie.objects.filter(Q(groupe="REC") & Q(categorie="aucune")).first()
                    photo.save()
                    recette.photo = photo
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
                    if new_photo_id.isdigit() and recette.photo and new_photo_id != recette.photo.id:
                        recette.photo = Photo.objects.get(pk=new_photo_id)
                    elif new_photo_id == "NONE":
                        recette.photo = None

            # maj categorie
            new_categorie = request.POST.get('categorie', None)
            if new_categorie:
                try:
                    queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="REC") & Q(owner=request.user.username))
                    if queryset.count() == 1:
                        recette.categorie = queryset.first()
                    else:
                        queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="REC") & Q(acces='PUB'))
                        if queryset.count() == 1:
                            recette.categorie = queryset.first()
                        else:
                            return HttpResponseServerError('{ "message" : "saisie incomplète,  catégorie inconnues" }')
                except:
                    just_the_string = traceback.format_exc()
                    LOGGER.debug("recette_modification/categorie_obj/{}".format(just_the_string))


            # maj des champs standards
            for label in ('description',
                          'bonasavoir',
                          'acces'):
                setattr(recette, label, form.cleaned_data[label])

            # cas spécifique du code qui est en lettres majuscules
            setattr(recette, 'code', form.cleaned_data['code'].upper())

            recette.save()
            #return HttpResponse('{{ "status" : 0, "message" : "OK", "recette_id" : {} }}'.format(recette.id))
            return RecetteRest.get(self, request, recette.id)

        except IntegrityError:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "création impossible, code déjà utilisé" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')



    #
    # Suppresion d'une recette
    #
    def delete(self, request, recette_id=None):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "message" : "Il faut être authentifié pour supprimer une recette" }')

        try:
            recette = Recette.objects.get(pk=recette_id)
        except Recette.DoesNotExist:
            raise Http404('{ "message" : "recette introuvable" }')

        if recette.owner.username != request.user.username:
            return HttpResponseForbidden('{ "message" : "seul le propriétaire peu supprimer sa recette" }')


        nbref = len(recette.recetterecette_set.all())
        if nbref == 0:
            nbref = len(recette.baserecette_set.all())

        LOGGER.debug("Cette recette est déja utilisé {} fois".format(nbref))
        if nbref != 0:
            return HttpResponseForbidden("{{ \"status\": -1, \"message\" : \"Suppression impossible, la recette est referencée {} fois\" }}".format(nbref))
        try:
            recette.delete()
            return HttpResponse('{ "message" : "Suppression rélalisée" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            LOGGER.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')


def get_recette_list(request, categorie_id):
    try:
        if categorie_id.isdigit():
            categorie_obj = Categorie.objects.get(pk=categorie_id)
        else:
            categorie_obj = Categorie.objects.filter(Q(groupe="REC") & Q(categorie=categorie_id))[0]
    except:
        just_the_string = traceback.format_exc()
        LOGGER.debug(just_the_string)
        return HttpResponse("{{ \"status\": -1, \"message\": {}}}".format(just_the_string))

    if request.user.is_authenticated:
        recettes = Recette.objects.filter((~Q(owner=request.user.username) & Q(acces='PUB'))| Q(owner=request.user.username)).order_by('code')
    else:
        recettes = Recette.objects.filter(Q(acces='PUB'))

    if categorie_obj is not None:
        LOGGER.debug("list_ingredient_result/categorie_obj/filtre/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
        recettes = recettes.filter(categorie=categorie_obj)

    nb_elements = 0
    res = "{ \"status\":0, \"message\": \"ok\",  \"recettes\": ["
    first = True
    for recette in recettes:
        if first:
            first = False
        else:
            res = res + ","
        nb_elements += 1
        res = res + recette.to_json()
    res = res + "], \"nb_perparations\":" + str(nb_elements) + "}"
    return HttpResponse(res)




class RecetteEnergieEconomat(View):
    """
    REst module pour les retrouver la valeurs energétiaue et tous les élements d'une recettes (ingredients + bases)
    """
    def __init__(self):
        self.http_method_names = ['get']

    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "status":-1, "message" : "Méthode non supportée" }')

    #
    def get(self, request, recette_id=None):
        """
        /recette/energie/no
        """
        if not recette_id:
            return HttpResponse("{ \"status\":-1, \"message\" : \"il manque le numéro de recette\" }")

        # il faut charger la recette...
        recette = None
        try:
            recette = Recette.objects.get(pk=recette_id)
        except:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        try:
            if recette is not None:
                if recette.acces != "PUB":
                    if not request.user.is_authenticated and  recette.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /recettes/{}/{}/{}/{}/{}/".format(recette_id, request.user.is_authenticated, request.user.username, recette.acces, recette.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        except:
            LOGGER.error("Loading IOError /recettes/{}".format(recette_id))
            return HttpResponse("{ \"status\":-1, \"message\": \"erreur interne\" }")

        (kcalories, kjoules, allergene,
         matieres_grasses, matieres_grasses_saturees,
         glucides, glucides_dont_sucres,
         fibres_alimentaires, proteines,
         sel, economat, cout) = calcul_ingredients_recette(recette)

        getcontext().rouding=ROUND_DOWN
        getcontext().prec = 12
        for element in economat:
            element['quantite'] = element['quantite'].quantize(Decimal('0.01'))
            element['cout'] = element['cout'].quantize(Decimal('0.01'))
            pass

        json_string = json.dumps({'cout': cout.quantize(Decimal('0.01')),
                                  'kcalories': kcalories.quantize(Decimal('0')),
                                  'kjoules':kjoules.quantize(Decimal('0')),
                                  'allergene':allergene,
                                  'matieres_grasses': matieres_grasses.quantize(Decimal('0.001')),
                                  'matieres_grasses_saturees':matieres_grasses_saturees.quantize(Decimal('0.001')),
                                  'glucides':glucides.quantize(Decimal('0.001')),
                                  'glucides_dont_sucres':glucides_dont_sucres.quantize(Decimal('0.001')),
                                  'fibres_alimentaires':fibres_alimentaires.quantize(Decimal('0.001')),
                                  'proteines':proteines,
                                  'sel':sel.quantize(Decimal('0.001')),
                                  'ingredients': economat},
                                 cls=DjangoJSONEncoder)
        return HttpResponse("{{ \"status\":0, \"message\": \"ok\", \"valeurs\":{} }}".format(json_string))


class RecetteElement(View):
    """
    Rest module pour les elements d'une recette
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
            res = res + RecetteElement.element_to_json(element)
        res = res + "], \"nb_elements\":" + str(nb_elements) + "}"
        return res

    def put(self, request, recette_id, element_id=None):
        """
        /recette/no/elenent/no|none|all
        """
        if not recette_id or not recette_id.isdigit() or element_id is not None:
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        try:
            recette = Recette.objects.get(pk=recette_id)
            body = json.loads(request.body)
            LOGGER.error("//////////////////////////////////// Loading recette ingredient body {}".format(body))
            ingredient = Ingredient.objects.get(pk=body['ingredient_id'])
            quantite = body['quantite']
            quantite = quantite.strip()

            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-4, \"message\": \"saisie erronée\" }")
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")
        except Ingredient.DoesNotExist:
            LOGGER.error("Loading ingredient inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")

        element = ElementRecette()
        element.ingredient = ingredient
        element.quantite = body['quantite']
        element.recette = recette
        element.save()
        recette.elements.add(element)
        recette.save()
        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"element_id\": {}}}".format(element.id))


    def post(self, request, recette_id, element_id):
        """
        /recette/no/elenent/no|none|all
        """
        if not recette_id or not recette_id.isdigit() or not element_id or not element_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        element_id = int(element_id)

        try:
            body = json.loads(request.body)
            quantite = body['quantite']
            quantite = quantite.strip()
            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-1, \"message\": \"saisie erronée\" }")

            recette = Recette.objects.get(pk=recette_id)
            element = Element.objects.get(pk=element_id)

            if element.recette <> recette:
                LOGGER.error("Loading element appartient pas recette/{}/{}".format(recette_id, element_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"recette et/ou element erronés\" }")

        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"recette inconnue\" }")
        except Element.DoesNotExist:
            LOGGER.error("Loading ingredient inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"element inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(recette_id))
            return HttpResponse("{ \"status\":-5, \"message\": \"erreur json\" }")

        element.quantite = quantite
        element.save()

        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"element_id\": {}}}".format(element.id))



    def delete(self, request, recette_id=None, element_id=None):
        """
        /recette/recette_id/elenent/element_id
        """
        LOGGER.error("Delete element/{}/{}".format(recette_id, element_id))
        if (recette_id is None) or (not recette_id.isdigit()) or (element_id is None) or (not element_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        recette_id = int(recette_id)
        ingredient_id = int(recette_id)
        try:
            recette = Recette.objects.get(pk=recette_id)
            element = Element.objects.get(pk=element_id)
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")
        except Element.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"ingredient inconnu\" }")


        #recette.elements.delete(element)
        element.delete()
        #recette.save()
        return HttpResponse("{\"status\":0, \"message\": \"ok\"}")


    #
    def get(self, request, recette_id, element_id=None):
        """
        /recette/no/elenent/no|none|all
        """
        if not recette_id or not recette_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        if element_id is not None and element_id.isdigit():
            try:
                element = Element.objects.get(pk=element_id)
                if element.recette.id != recette_id:
                    return HttpResponse("{{ \"status\": {} }}".format(-1))
                response = RecetteElement.elements_to_json_response([element])
            except Element.DoesNotExist:
                return HttpResponse("{ \"status\":-2 }")

            return HttpResponse(response)

        # il faut charger la prération pour retrouver les ingredients
        recette = None
        try:
            recette = Recette.objects.get(pk=recette_id)
        except:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        try:
            if recette is not None:
                if recette.acces != "PUB":
                    if not request.user.is_authenticated and  recette.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /recettes/{}/{}/{}/{}/{}/".format(recette_id, request.user.is_authenticated, request.user.username, recette.acces, recette.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        except:
            LOGGER.error("Loading IOError /recettes/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"erreur interne\" }")

        #for element in recette.elements:
        response = RecetteElement.elements_to_json_response(recette.elements.all())
        #json_string = json.dumps(recette.elements, cls=DjangoJSONEncoder)
        return HttpResponse(response)




class RecetteEtape(View):
    """
    REst module pour les elements d'une recette
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
            res = res + RecetteEtape.etape_to_json(etape)
        res = res + "], \"nb_etapes\":" + str(nb_etapes) + "}"
        return res

    def put(self, request, recette_id, etape_id=None):
        """
        /recette/no/etape/
        """
        if not recette_id or not recette_id.isdigit() or etape_id is not None:
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        try:
            recette = Recette.objects.get(pk=recette_id)
            body = json.loads(request.body)
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        etape = EtapeRecette()
        etape.description = body['description']
        etape.nom = body['nom']
        etape.ordre = body['ordre']
        etape.recette = recette
        etape.save()
        #TODO:faut-il le faire
        #recette.etapes.add(etape)
        #recette.save()
        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"etape_id\": {}}}".format(etape.id))

    def post(self, request, recette_id, etape_id):
        """
        /recette/no/elenent/no|none|all
        """
        if not recette_id or not recette_id.isdigit() or not etape_id or not etape_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        etape_id = int(etape_id)

        try:
            body = json.loads(request.body)

            recette = Recette.objects.get(pk=recette_id)
            etape = EtapeRecette.objects.get(pk=etape_id)

            if etape.recette <> recette:
                LOGGER.error("Loading element appartient pas recette/{}/{}".format(recette_id, etape_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"recette et/ou element erronés\" }")

        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"recette inconnue\" }")
        except EtapeRecette.DoesNotExist:
            LOGGER.error("Loading ingredient inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"element inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(recette_id))
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



    def delete(self, request, recette_id=None, etape_id=None):
        """
        /recette/recette_id/etape/etape_id
        """
        LOGGER.error("Delete etape/{}/{}".format(recette_id, etape_id))
        if (recette_id is None) or (not recette_id.isdigit()) or (etape_id is None) or (not etape_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        recette_id = int(recette_id)
        etape_id = int(etape_id)
        try:
            recette = Recette.objects.get(pk=recette_id)
            etape = EtapeRecette.objects.get(pk=etape_id)
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")
        except EtapeRecette.DoesNotExist:
            LOGGER.error("Loading etape inconnue/{}".format(etape_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"etape inconnu\" }")


        #recette.elements.delete(element)
        etape.delete()
        #recette.save()
        return HttpResponse("{\"status\":0, \"message\": \"ok\"}")


    #
    def get(self, request, recette_id, etape_id=None):
        """
        /recette/recette_id/etape/etape_id/
        """
        if not recette_id or not recette_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        if etape_id is not None and etape_id.isdigit():
            try:
                etape_id = int(etape_id)
                etape = EtapeRecette.objects.get(pk=etape_id)
                if etape.recette.id != recette_id:
                    return HttpResponse("{{ \"status\": {} }}".format(-1))
                response = RecetteElement.elements_to_json_response([etape])
            except EtapeRecette.DoesNotExist:
                return HttpResponse("{ \"status\":-2 }")

            return HttpResponse(response)

        # il faut charger la prération pour retrouver les ingredients
        recette = None
        try:
            recette = Recette.objects.get(pk=recette_id)
        except:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        try:
            if recette is not None:
                if recette.acces != "PUB":
                    if not request.user.is_authenticated and  recette.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /recettes/{}/{}/{}/{}/{}/".format(recette_id, request.user.is_authenticated, request.user.username, recette.acces, recette.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        except:
            LOGGER.error("Loading IOError /recettes/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"erreur interne\" }")

        #for element in recette.elements:
        response = RecetteEtape.etape_to_json_response(recette.etapes.all())
        #json_string = json.dumps(recette.elements, cls=DjangoJSONEncoder)
        return HttpResponse(response)


class RecettePreparation(View):
    """
    REst module pour les recettes de base  d'une recette
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
    def preparation_to_json(preparation):
        return preparation.to_json()

    @staticmethod
    def preparations_to_json_response(preparations):
        nb_elements = 0
        # {{ \"status\":0, \"message\": \"ok\", \"nb_elements\" : 1, \"elements\":[{}] }}".format(json_string))
        res = "{ \"status\":0, \"message\": \"ok\",  \"preparations\": ["
        first = True
        for preparation in preparations:
            if first:
                first = False
            else:
                res = res + ","
            nb_elements += 1
            res = res + RecettePreparation.preparation_to_json(preparation)
        res = res + "], \"nb_preparations\":" + str(nb_elements) + "}"
        return res

    @staticmethod
    def is_cycle(preparation, base_preparation):

        trouve = False
        if isinstance(preparation, BasePreparation):
            preparation = preparation.base
        else:
            preparation = preparation

        LOGGER.debug("cycle ? : prep{} / paseprep{}".format(preparations.id, base_preparation.id))
        if preparation == base_preparation.preparation:
            return True

        for prep in preparations.bases.all():
            if prep == base_preparations:
                LOGGER.debug("cycle : {}".format(prep.id))
                trouve = True
            else:
                trouve = RecettePreparation.is_cycle(prep, base_preparation)
            if trouve:
                break
        return trouve
 


    def put(self, request, recette_id, preparation_id=None):
        """
        /recette/no/preparation/
        """
        if not recette_id or not recette_id.isdigit() or preparation_id is not None:
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        try:
            recette = Recette.objects.get(pk=recette_id)
            body = json.loads(request.body)

            preparation = Recette.objects.get(pk=body['preparation_id'])
            quantite = body['quantite']
            quantite = quantite.strip()

            if not re.match("^[0-9]+([.][0-9]+)?$", quantite):
                return HttpResponse("{ \"status\":-4, \"message\": \"saisie erronée\" }")

            if RecettePreparation.is_cycle(preparation, preparation.base) or RecettePreparation.is_cycle(preparation.base, preparation):
                return HttpResponse("{ \"status\":-4, \"message\": \"cycle de preparations\" }")

            quantite = int(quantite)
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")
        except Preparation.DoesNotExist:
            LOGGER.error("Loading preparation inconnue/{}".format(preparation_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"preparation inconnue\" }")        
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"preparation inconnue\" }")

        preparation_recette = PreparationRecette()
        preparation_recette.preparation = preparation
        preparation_recette.quantite = quantite
        preparation_recette.recette = recette
        preparation_recette.save()

        return HttpResponse(u"{{\"status\":0, \"message\": \"ok\", \"base_id\": {}, \"quantite\":{}, \"description\": \"{}\", \"code\": \"{}\" }}".format(base.id,
                                                                                                                                                          base.quantite,
                                                                                                                                                          base.base.description,
                                                                                                                                                          base.base.code))
    def post(self, request, recette_id, base_id):
        """
        /recette/no/base/no|none|all
        """
        if not recette_id or not recette_id.isdigit() or not base_id or not base_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
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
            recette = Recette.objects.get(pk=recette_id)
            base = BasePreparetion.objects.get(pk=base_id)

            if base.recette <> recette:
                LOGGER.error("Loading base appartient pas recette/{}/{}".format(recette_id, base_id))
                return HttpResponse("{ \"status\":-2, \"message\": \"recette et/ou base erronés\" }")

        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"recette inconnue\" }")
        except BaseRecette.DoesNotExist:
            LOGGER.error("Loading base inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-4, \"message\": \"base inconnu\" }")
        except KeyError:
            LOGGER.error("Loading json erroné/{}".format(recette_id))
            return HttpResponse("{ \"status\":-5, \"message\": \"erreur json\" }")

        base.quantite = quantite
        base.save()

        return HttpResponse("{{\"status\":0, \"message\": \"ok\", \"base_id\": {}}}".format(base.id))



    def delete(self, request, recette_id=None, base_id=None):
        """
        /recette/recette_id/base/base_id/
        """
        LOGGER.error("Delete base/{}/{}".format(recette_id, base_id))
        if (recette_id is None) or (not recette_id.isdigit()) or (base_id is None) or (not base_id.isdigit()):
            return HttpResponse("{ \"status\":-1, \"message\":\"erreur données\"}")

        recette_id = int(recette_id)
        base_id = int(base_id)
        try:
            recette = Recette.objects.get(pk=recette_id)
            base = BaseRecette.objects.get(pk=base_id)
        except Recette.DoesNotExist:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")
        except BaseRecette.DoesNotExist:
            LOGGER.error("Loading base recette inconnue/{}".format(base_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"base inconnu\" }")


        #recette.bases.delete(base)
        base.delete()
        #recette.save()
        return HttpResponse("{\"status\":0, \"message\": \"ok\"}")


    #
    def get(self, request, recette_id, preparation_id=None):
        """
        /recette/no/base/no|none|all
        """
        if not recette_id or not recette_id.isdigit():
            return HttpResponse("{ \"status\":-1 }")

        recette_id = int(recette_id)
        if preparation_id is not None and preparation_id.isdigit():
            try:
                preparation_recette = PreparationRecette.objects.get(pk=preparation_id)
                if preparation_recette.recette.id != recette_id:
                    return HttpResponse("{{ \"status\": {} }}".format(-1))
                response = RecettePreparation.preparations_to_json_response([preparation_recette])
            except PreparationRecette.DoesNotExist:
                return HttpResponse("{ \"status\":-2 }")

            return HttpResponse(response)

        # il faut charger la prération pour retrouver les bases
        recette = None
        try:
            recette = Recette.objects.get(pk=recette_id)
        except:
            LOGGER.error("Loading recette inconnue/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        try:
            if recette is not None:
                if recette.acces != "PUB":
                    if not request.user.is_authenticated and  recette.owner.username != request.user.username:
                        LOGGER.error("Loading acces interdit1 /recettes/{}/{}/{}/{}/{}/".format(recette_id, request.user.is_authenticated, request.user.username, recette.acces, recette.owner))
                        return HttpResponseForbidden("{ \"status\":-3, \"message\": \"acces interdit\" }")
            else:
                return HttpResponse("{ \"status\":-2, \"message\": \"recette inconnue\" }")

        except:
            LOGGER.error("Loading IOError /recettes/{}".format(recette_id))
            return HttpResponse("{ \"status\":-2, \"message\": \"erreur interne\" }")

        response = RecettePreparation.preparations_to_json_response(recette.preparations.all())
        return HttpResponse(response)
