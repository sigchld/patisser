# -*- coding: utf-8 -*-
import traceback
import logging
import io
import time
import math

from PIL import Image
from PIL import ImageMath
from PIL import ImageChops

from django import http
from django.http import HttpResponse
from django.views.generic import ListView

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

from recettes.models import Photo, Ingredient, Categorie
from fees import settings
from .forms import IngredientForm


# Get an instance of a logger
logger = logging.getLogger('fees')

class IngredientRest(View):
    def __init__(self):
        self.http_method_names = ['delete', 'post', 'put']

    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')

    # Mofification d'un ingredient
    def post(self, request):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "message" : "Il faut être authentifié pour modifier un imgredient" }')

        try:
            form = IngredientForm(request.POST)
            if not form.is_valid():
                champs = ""
                for error in form.errors:
                    champs = champs + error + ", "
                return HttpResponseServerError('{{ "message" : "saisie erronée: {}" }}'.format(champs))
            ingredient_id = request.POST.get('id', None)
            ingredient = None
            try:
                ingredient = Ingredient.objects.get(pk=ingredient_id)
                #except Ingredient.DoesNotExist:
            except:
                logger.error("Loading ingredient inconnue/{}".format(ingredient_id))
                return HttpResponseServerError('{ "message" : "ingredient inconnu" }')

            if ingredient.owner.username != request.user.username:
                return HttpResponseServerError('{ "message" : "L\'ingredient ne vous appartient pas" }')

            # chargement photo si il y a lieu
            imported_photo = False
            try:
                myfile = request.FILES['photo']
                name = myfile.name
                logger.debug(u"PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)

                try:
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                    photo = Photo()
                    img = get_thumbnail(img)

                    f = io.BytesIO()
                    img.save(f, "PNG")
                    f.seek(0)
                    photo.thumbnail = f.read1(-1)
                    photo.owner = ingredient.owner
                    photo.acces = "PRIV"
                    photo.code = "I{}".format(math.trunc(time.time()))
                    photo.description = "Importée depuis formulaire ingrédient"
                    if ingredient.photo and  ingredient.photo.categorie:
                        photo.categorie = ingredient.photo.categorie
                    else:
                        photo.categorie = Categorie.objects.filter(Q(groupe="ING") & Q(categorie="aucune")).first()
                    photo.save()
                    ingredient.photo = photo
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
                    if new_photo_id.isdigit() and ingredient.photo and new_photo_id != ingredient.photo.id:
                        ingredient.photo = Photo.objects.get(pk=new_photo_id)
                    elif new_photo_id == "NONE":
                        ingredient.photo = None

            # maj categorie
            new_categorie = request.POST.get('categorie', None)
            if new_categorie:
                try:
                    queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="ING") & Q(owner=request.user.username))
                    if queryset.count() == 1:
                        ingredient.categorie = queryset.first()
                    else:
                        queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="ING") & Q(acces='PUB'))
                        if queryset.count() == 1:
                            ingredient.categorie = queryset.first()
                        else:
                            return HttpResponseServerError('{ "message" : "saisie incomplète,  catégorie inconnues" }')
                except:
                    just_the_string = traceback.format_exc()
                    logger.debug("ingredient_modification/categorie_obj/{}".format(just_the_string))


            # maj des champs standards
            for label in ('allergene',
                          'sel',
                          'fibres_alimentaires',
                          'pu',
                          'pp',
                          'kcalories',
                          'kjoules',
                          'matieres_grasses',
                          'matieres_grasses_saturees',
                          'glucides',
                          'glucides_dont_sucres',
                          'proteines',
                          'description',
                          'bonasavoir',
                          'acces'):
                setattr(ingredient, label, form.cleaned_data[label])

            # cas spécifique du code qui est en lettres majuscules
            setattr(ingredient, 'code', form.cleaned_data['code'].upper())

            ingredient.save()
            return HttpResponse('{ "message" : "OK" }')

        except IntegrityError:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "modification impossible" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')


    # Création d'un ingredient
    def put(self, request):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "message" : "Il faut être authentifié pour créer un imgredient" }')

        try:
            form = IngredientForm(request.PUT)
            if not form.is_valid():
                champs = ""
                for error in form.errors:
                    champs = champs + error + ", "
                return HttpResponseServerError('{{ "message" : "saisie erronée: {}" }}'.format(champs))

            ingredient = Ingredient()
            ingredient.owner = request.user

            # chargement photo si il y a lieu
            imported_photo = False
            try:
                myfile = request.FILES['photo']
                name = myfile.name
                logger.debug(u"PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)

                try:
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                    photo = Photo()
                    img = get_thumbnail(img)

                    f = io.BytesIO()
                    img.save(f, "PNG")
                    f.seek(0)
                    photo.thumbnail = f.read1(-1)
                    photo.owner = ingredient.owner
                    photo.acces = "PRIV"
                    photo.code = "I{}".format(math.trunc(time.time()))
                    photo.description = "Importée depuis formulaire ingrédient"
                    photo.categorie = Categorie.objects.filter(Q(groupe="ING") & Q(categorie="aucune")).first()
                    photo.save()
                    ingredient.photo = photo
                    imported_photo = True
                except IOError:
                    pass

            except MultiValueDictKeyError:
                # pas de nouvelle photo
                pass

            #  photo exitante
            if not imported_photo:
                try:
                    new_photo_id = request.PUT.get('photo_id', None)
                    if new_photo_id and new_photo_id.isdigit():
                        ingredient.photo = Photo.objects.get(pk=new_photo_id)
                except:
                    just_the_string = traceback.format_exc()
                    logger.debug("ingredient_creation/photo/{}".format(just_the_string))

            # categorie
            new_categorie = request.POST.get('categorie', None)
            if new_categorie:
                try:
                    queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="ING") & Q(owner=request.user.username))
                    if queryset.count() == 1:
                        ingredient.categorie = queryset.first()
                    else:
                        queryset = Categorie.objects.filter(Q(categorie=new_categorie) & Q(groupe="ING") & Q(acces='PUB'))
                        if queryset.count() == 1:
                            ingredient.categorie = queryset.first()

                except:
                    just_the_string = traceback.format_exc()
                    logger.debug("ingredient_modification/categorie_obj/{}".format(just_the_string))
                    ingredient.categorie = None

            if not ingredient.categorie:
                return HttpResponseServerError('{ "message" : "saisie incomplète,  catégorie inconnue ou privée" }')

            # maj des champs standards
            for label in (
                    'allergene',
                    'sel',
                    'fibres_alimentaires',
                    'pu',
                    'pp',
                    'kcalories',
                    'kjoules',
                    'matieres_grasses',
                    'matieres_grasses_saturees',
                    'glucides',
                    'glucides_dont_sucres',
                    'proteines',
                    'description',
                    'bonasavoir',
                    'acces'):
                setattr(ingredient, label, form.cleaned_data[label])

            # cas spécifique du code qui est en lettres majuscules
            setattr(ingredient, 'code', form.cleaned_data['code'].upper())


            ingredient.save()
            return HttpResponse('{ "message" : "OK" }')
        except IntegrityError:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "modification impossible" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

        return HttpResponse('{ "message" : "OK" }')

    # Recherche un ingredient
    def get(self, request, photo_id=None):
        # par defaut c'estt la photo blanche!
        if not photo_id:
            return  blank_photo()

        # il faut charger la photo...
        photo = None
        try:
            photo = Photo.objects.get(pk=photo_id)
            #except Photo.DoesNotExist:
        except:
            logger.error("Loading photos inconnue/{}".format(photo_id))

        try:
            if photo is not None:
                if photo.acces != "PUB":
                    if not request.user.is_authenticated and  photo.owner.username != request.user.username:
                        logger.error("Loading acces interdit1 /photos/{}/{}/{}/{}/{}/".format(photo_id, request.user.is_authenticated, request.user.username, photo.acces, photo.owner))
                        return blank_photo()

                if photo.thumbnail is not None:
                    logger.debug("Loading thumbnail /photos/{}".format(photo_id))

                    response = HttpResponse(content_type="image/png")
                    response.write(photo.thumbnail)
                    return response

                photo_id = photo.photo

            # ************************** ATTENTION
            # POUR MAINTENIR LA COMPATIBILITE avec les anciennes URL
            # ON maintient le chargent direct

            logger.debug("Loading img {}/photos/{}".format(settings.BASE_DIR, photo_id))
            img = Image.open("{}/photos/{}".format(settings.BASE_DIR,photo_id))
            img = get_thumbnail(img)

            if photo:
                try:
                    logger.debug("Loading writing img /photos/{}".format(photo_id))
                    f = io.BytesIO()
                    img.save(f, "PNG")
                    f.seek(0)
	            photo.thumbnail = f.read1(-1)
                    f.close()
                    photo.save()
                except:
                    pass

	    response = HttpResponse(content_type="image/png")
	    img.save(response, "PNG")
	    return response

        except IOError:
            logger.error("Loading IOError /photos/{}".format(photo_id))
            return blank_photo()

    #
    # Suppresion d'un ingrédient
    #
    def delete(self, request, ingredient_id=None):
        if not request.user.is_authenticated:
                return HttpResponseServerError('{ "message" : "Il faut être cuthentifié pour supprimer un imgredient" }')

        try:
            ingredient = Ingredient.objects.get(pk=ingredient_id)
        except Ingredient.DoesNotExist:
            raise Http404('{ "message" : "ingredient introuvable" }')

        if ingredient.owner.username != request.user.username:
            return HttpResponseForbidden('{ "message" : "seul le propriétaire peu supprimer l\'ingredient" }')


        #time.sleep(3)
        nbref = len(ingredient.element_set.all())

        logger.debug("Cette ingrédient est utilisé  {} fois".format(nbref))
        if nbref != 0:
            return HttpResponseForbidden("{{ \"message\" : \"Suppression impossible, l'ingrédient est referencé {} fois\" }}".format(nbref))
        try:
            ingredient.delete()
            return HttpResponse('{ "message" : "Suppression rélalisée" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')




def blank_photo():
    blank = Photo.objects.get(code='blank')
    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, blank.photo))
    size = (128, 128)
    img.thumbnail(size)
    response = HttpResponse(content_type="image/png")
    img.save(response, "PNG")
    return response

def distance2(a, b):
    return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2])

def get_thumbnail0(img):
    bg = Image.new(img.mode, img.size, img.getpixel((0,0)))
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        img=img.crop(bbox)
    else:
        return get_thumbnail(img)
    size = (128, 128)
    img.thumbnail(size)
    return img

def get_thumbnail(img):
    color = (255,255,255)
    thresh2=0
    image = img.convert("RGBA")
    red, green, blue, alpha = image.split()
    image.putalpha(ImageMath.eval("""convert(((((t - d(c, (r, g, b))) >> 31) + 1) ^ 1) * a, 'L')""",
        t=thresh2, d=distance2, c=color, r=red, g=green, b=blue, a=alpha))
    size = (128, 128)
    image.thumbnail(size)

    return image

def get_thumbnail1(img):
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        if item[0] == 255 and item[1] == 255 and item[2] == 255:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    size = (128, 128)
    img.thumbnail(size)
    return img
