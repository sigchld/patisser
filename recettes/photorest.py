# -*- coding: utf-8 -*-
import traceback
import logging
import io
import json

from django import http
from django.http import HttpResponse
from django.views.generic import ListView
from recettes.models import Photo
from django.core.serializers.json import DjangoJSONEncoder
import traceback

from django.shortcuts import render
from django.shortcuts import redirect
from django.template import RequestContext, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.core.files.storage import FileSystemStorage
from django.db.models.functions import Lower

from django.http import HttpResponse
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.http import HttpResponseNotModified, HttpResponseServerError

from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt

from PIL import Image
from PIL import ImageMath
from PIL import ImageChops

from fees import settings
from .models import Photo
from .models import Categorie
from .forms import PhotoForm

from django.db.utils import IntegrityError
from django.utils.datastructures import MultiValueDictKeyError
from django.views import View
from django.views.decorators.http import require_http_methods



# Get an instance of a logger
logger = logging.getLogger('fees')

class PhotoRest(View):
    def __init__(self):
        self.http_method_names = ['get', 'post', 'put', 'delete']

    def http_method_not_allowed(self, request, *args, **kwargs):
        logger.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')


    # Mofification d'une photo
    def post(self, request, photo_id=None):
        if not request.user.is_authenticated:
            return HttpResponseForbidden('{ "message" : "il faut se logger" }')

        if not photo_id or not photo_id.isdigit():
            return HttpResponseForbidden('{ "message" : "il faut l\'id de la photo" }')
        try:
            form = PhotoForm(request.POST)
            #if not form.is_valid():
            #    return HttpResponseServerError('{ "message" : "saisie incomplète" }')
            groupe = form['groupe'].value()
            categorie = form['categorie'].value()


            if groupe is None or categorie is None or groupe == "NONE" or categorie == "NONE":
                return HttpResponseServerError('{ "message" : "saisie incomplète, il manque le groupe ou la catégorie" }')

            photo = None
            try:
                photo = Photo.objects.get(pk=photo_id)
                #except Photo.DoesNotExist:
            except:
                logger.error("Loading photos inconnue/{}".format(photo_id))
                return HttpResponseServerError('{ "message" : "photo inconnue" }')

            if not request.user.is_authenticated and  photo.owner.username != request.user.username:
                return HttpResponseServerError('{ "message" : "la photo ne vous appartient pas" }')

            # on ne peut changer le groupe de la photo que si elle n'est pas utilisée.
            if photo.categorie is not None and groupe != photo.categorie.groupe:
                nbref = len(photo.ingredient_set.all())
                if nbref == 0:
                    nbref = nbref + len(photo.recette_set.all())
                if nbref == 0:
                    nbref = nbref + len(photo.preparation_set.all())
                if nbref <> 0:
                    return HttpResponseServerError('{ "message" : "la photo est référencée, on ne peut pas changer de groupes" }')

            try:
                myfile = request.FILES['photo']
                name = myfile.name
                logger.debug(u"PhotoFileName {}".format(name))
                file_storage = FileSystemStorage()
                filename = file_storage.save(name, myfile)
                photo.photo = filename

                try:
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                except IOError:
                    blank = Photo.objects.get(code='blank')
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, blank.photo))

                img = get_thumbnail(img)
                f_bytes = io.BytesIO()
                img.save(f_bytes, "PNG")
                f_bytes.seek(0)
                photo.thumbnail = f_bytes.read1(-1)

            except MultiValueDictKeyError:
                pass

            photo.description = request.POST.get('description', photo.description)
            photo.code = request.POST.get('code', photo.code)
            photo.acces = request.POST.get('acces', photo.acces)

            # traiter groupe / categorie
            if groupe is not None and categorie is not None and groupe != "NONE" and categorie != "NONE":
                groupe = groupe.upper()
                categorie = categorie.upper()

                #
                queryset = Categorie.objects.filter(Q(categorie = categorie) & Q(groupe = groupe) & Q(owner = request.user.username))
                if queryset.count() == 1:
                    photo.categorie = queryset.first()
                else:
                    queryset = Categorie.objects.filter(Q(categorie = categorie) & Q(groupe = groupe) & Q(acces = 'PUB'))
                    if queryset.count() == 1:
                        photo.categorie = queryset.first()
            else:
                photo.categorie = None

            photo.save()
            return HttpResponse('{ "message" : "OK" }')

        except IntegrityError:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "modification impossible" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

    # Recherche une photo
    def get(self, request, photo_id=None):
        """
        Retrouve une photo via son id
        si on ne trouve pas c'est la photo no_photo qui est retourée
        """
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
            img = Image.open("{}/photos/{}".format(settings.BASE_DIR, photo_id))
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

    # creation photo
    def put(self, request):
        if not request.user.is_authenticated:
            return HttpResponseForbidden('{ "message" : "il fat se logger" }')

        if  not request.FILES['photo']:
            return HttpResponseServerError('{ "message" : "Il manque la photo" }')

        try:
            form = PhotoForm(request.PUT)
            if form.is_valid():
                groupe = form['groupe'].value()
                categorie = form['categorie'].value()

                if not groupe or not categorie or groupe == "NONE" or categorie == "NONE":
                    return HttpResponseServerError('{ "message" : "saisie incomplète, il manque le groupe ou la catégorie" }')

                myfile = request.FILES['photo']
                name = myfile.name
                logger.debug(u"PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)
                photo = form.save(commit=False)
                photo.photo = filename
                photo.owner = request.user

                # traiter groupe / categorie

                groupe = groupe.upper()
                categorie = categorie.upper()

                #
                queryset = Categorie.objects.filter(Q(categorie = categorie) & Q(groupe = groupe) & Q(owner = request.user.username))
                if queryset.count() == 1:
                    photo.categorie = queryset.first()
                else:
                    queryset = Categorie.objects.filter(Q(categorie = categorie) & Q(groupe = groupe) & Q(acces = 'PUB'))
                    if queryset.count() == 1:
                        photo.categorie = queryset.first()
                    else:
                        return HttpResponseServerError('{ "message" : "saisie incomplète, groupe ou catégorie inconnus" }')


                try:
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                except IOError:
                    blank = Photo.objects.get(code='blank')
                    img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, blank.photo))
                    img = get_thumbnail(img)

                f = io.BytesIO()
                img.save(f, "PNG")
                f.seek(0)
	        photo.thumbnail = f.read1(-1)
                f.close()
                photo.save()
                return HttpResponse('{ "message" : "OK" }')
            else:
                return HttpResponseServerError('{ "message" : "Données invalides" }')
        except IntegrityError:
            return HttpResponseServerError('{ "message" : "Le code est déjà utilisé" }')
        except Exception as error:
            import traceback
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

    def delete(self, request, photo_id=None) :
        if not request.user.is_authenticated:
            return HttpResponseForbidden('{ "message" : "il fat se logger" }')

        try:
            photo = Photo.objects.get(pk=photo_id)
        except Photo.DoesNotExist:
            raise Http404('{ "message" : "photo introuvable" }')

        if photo.owner.username != request.user.username:
            return HttpResponseForbidden('{ "message" : "seul le propriétaire peu supprimer la photo" }')

        nbref = len(photo.ingredient_set.all())
        if nbref == 0: nbref = nbref + len(photo.recette_set.all())
        if nbref == 0: nbref = nbref + len(photo.preparation_set.all())

        if nbref != 0:
            return HttpResponseForbidden("{{ \"message\" : \"Suppression impossible, la photo est referencée {} fois\" }}".format(nbref))
        try:
            import os
            filename = u"{}/photos/{}".format(settings.BASE_DIR, photo.photo)
            if os.path.exists(filename):
                try:
                    os.remove(filename)
                    logger.error(u"Suppression de {}".format(filename))
                except:
                    logger.error(u"Suppression impossible de {}".format(filename))

            photo.delete()
            return HttpResponse('{ "message" : "Suppression rélalisée" }')
        except Exception as error:
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')


    @staticmethod
    def blank_photo():
        blank = Photo.objects.get(code='blank')
        img = Image.open(u"{}/photos/{}".format(settings.BASE_DIR, blank.photo))
        size = (128, 128)
        img.thumbnail(size)
        response = HttpResponse(content_type="image/png")
        img.save(response, "PNG")
        return response


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



class PhotoCategorieView(View):
    def __init__(self):
        self.http_method_names = ['get',]

    def get(self, request, categorie_id):
        try:
            categorie = Categorie.objects.get(pk=categorie_id)

            if request.user.is_authenticated:
                photos = Photo.objects.filter(Q(categorie = categorie)  & (Q(owner = request.user.username) | Q(acces = "PUB")))
            else:
                photos = Photo.objects.filter(Q(categorie = categorie)  & Q(acces = "PUB"))
        except:
            if request.user.is_authenticated:
                photos = Photo.objects.filter(Q(categorie__groupe = categorie_id) & (Q(owner = request.user.username) | Q(acces = "PUB")))
            else:
                photos = Photo.objects.filter(Q(categorie__groupe = categorie_id) & Q(acces = "PUB"))

        photos = photos.values('id', 'description').order_by(Lower('description'))
        data = '{{ "message" : {} }}'.format(json.dumps(list(photos), cls=DjangoJSONEncoder))

        return HttpResponse(data)
