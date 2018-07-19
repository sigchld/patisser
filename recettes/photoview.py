# -*- coding: utf-8 -*-
import traceback
import logging
import io

from django.http import HttpResponse
from django.views.generic import ListView
from recettes.models import Photo



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

from PIL import Image
from PIL import ImageMath
from PIL import ImageChops

from fees import settings
from .models import Photo
from .forms import PhotoForm

from django.db.utils import IntegrityError

from django.views import View
from django.views.decorators.http import require_http_methods


PAGE_COURANTE='page_courante'
ACCUEIL='accueil'
PHOTOS='photos'
INGREDIENTS='ingredients'
PREPARATIONS='preparations'
RECETTES='recettes'


# Get an instance of a logger
logger = logging.getLogger('fees')

class PhotoView(View):
    def __init__(self):
        self.xhttp_method_names = ['get', 'post', 'put', 'head']

    def Xdispatch(self, request, *args, **kwargs):
        logger.debug(request.method.lower())
        logger.debug(self.http_method_names)
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed) 
        else:
            handler = self.http_method_not_allowed
        return handler(self, request, args, kwargs)
    
    def post(self, request):
        pass
    
    # retrouve une photo

    def get(self, request, photo_id=None):
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

    # creation photo
    def put(self, request):
        if  not request.FILES['photo']:
            return HttpResponseServerError('{ "message" : "Il manque la photo" }')
            
        try:
            form = PhotoForm(request.PUT)
            if form.is_valid():
                myfile = request.FILES['photo']
                name = myfile.name 
                logger.debug("PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)
                photo = form.save(commit=False)
                photo.photo = filename
                photo.owner = request.user

                try:
                    img = Image.open("{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                except IOError:
                    blank = Photo.objects.get(code='blank')
                    img = Image.open("{}/photos/{}".format(settings.BASE_DIR, blank.photo))
                    img = get_thumbnail(img)

                f = io.BytesIO()
                img.save(f, "PNG")
                f.seek(0)
	        photo.thumbnail = f.read1(-1)
                f.close()
                photo.save()
                return HttpResponse('{ "message" : "OK" }')
        except IntegrityError:
            return HttpResponseServerError('{ "message" : "Le code est déjà utilisé" }')
        except Exception as error:
            import traceback
            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

    def delete(self, request, photo_id=None) :
        try:
            photo = Photo.objects.get(pk=photo_id)
        except Photo.DoesNotExist:
            raise Http404('{ "message" : "photo introuvable" }')

        if photo.owner.username != request.user.username:
            return HttpResponseForbidden('{ "message" : "seul le pripriétaire peu supprimer la photo" }')

        import time
        #time.sleep(3)
        nbref = len(photo.ingredient_set.all())
        nbref = nbref + len(photo.recette_set.all())
        nbref = nbref + len(photo.preparation_set.all())
        
        logger.debug("nb photos ref dans ingredient : {}".format(len(photo.ingredient_set.all())))
        if nbref != 0:
            return HttpResponseForbidden("{{ \"message\" : \"Suppression impossible, la photo est referencée {} fois\" }}".format(nbref))
        try:
            photo.delete()
            return HttpResponse('{ "message" : "Suppression rélaliser" }')
        except Exception as error:

            just_the_string = traceback.format_exc()
            logger.debug(just_the_string)
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

        
    @staticmethod
    def blank_photo():
        blank = Photo.objects.get(code='blank')
        img = Image.open("{}/photos/{}".format(settings.BASE_DIR, blank.photo))
        size = (128, 128)
        img.thumbnail(size)
        response = HttpResponse(content_type="image/png")
        img.save(response, "PNG")
        return response

#
# nouvelle photo
# info sur le multipart/form :
# https://simpleisbetterthancomplex.com/tutorial/2016/08/01/how-to-upload-files-with-django.html
def photo_create(request):
    if not request.user.is_authenticated:
        return  HttpResponseForbidden("""
        {
        "message" : "il faut se logger",
        }
        """)
        
    if request.method == "POST" and request.FILES['photo']:
        form = PhotoForm(request.POST)
        if form.is_valid():
            myfile = request.FILES['photo']
            name = myfile.name 
            logger.debug("PhotoFileName {}".format(name))
            fs = FileSystemStorage()
            filename = fs.save(name, myfile)
            photo = form.save(commit=False)
            photo.photo = filename
            photo.owner = request.user

            try:
                img = Image.open("{}/photos/{}".format(settings.BASE_DIR, filename))
                img = get_thumbnail(img)
            except IOError:
                blank = Photo.objects.get(code='blank')
                img = Image.open("{}/photos/{}".format(settings.BASE_DIR, blank.photo))
                img = get_thumbnail(img)

            f = io.BytesIO()
            img.save(f, "PNG")
            f.seek(0)
	    photo.thumbnail = f.read1(-1)
            f.close()
            photo.save()
            return redirect('/mesrecettes/listphotos')
    else:
        form = PhotoForm()
        return render(request, 'photo_edit.html', {'form': form})

def blank_photo():
    blank = Photo.objects.get(code='blank')
    img = Image.open("{}/photos/{}".format(settings.BASE_DIR, blank.photo))
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
    
def photo(request, photo_id=None):
    if request.method == "GET":
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
        
    if not request.user.is_authenticated:
        return HttpResponseForbidden('{ "message" : "il faut se logger" }')
    #https://thihara.github.io/Django-Req-Parsing/
    # django ne sait pa gerer le PUT... il faut un middleware approprié
    
    if request.method == "PUT" and request.FILES['photo']:
        try:
            form = PhotoForm(request.PUT)
            if form.is_valid():
                myfile = request.FILES['photo']
                name = myfile.name 
                logger.debug("PhotoFileName {}".format(name))
                fs = FileSystemStorage()
                filename = fs.save(name, myfile)
                photo = form.save(commit=False)
                photo.photo = filename
                photo.owner = request.user

                try:
                    img = Image.open("{}/photos/{}".format(settings.BASE_DIR, filename))
                    img = get_thumbnail(img)
                except IOError:
                    blank = Photo.objects.get(code='blank')
                    img = Image.open("{}/photos/{}".format(settings.BASE_DIR, blank.photo))
                    img = get_thumbnail(img)

                f = io.BytesIO()
                img.save(f, "PNG")
                f.seek(0)
	        photo.thumbnail = f.read1(-1)
                f.close()
                photo.save()
                return HttpResponse('{ "message" : "OK" }')
        except IntegrityError:
            return HttpResponseServerError('{ "message" : "Le code est déjà utilisé" }')
        except:
            return HttpResponseServerError('{ "message" : "erreur inattendue" }')

    if request.method != "DELETE":    
        raise Http404('{ "message" : "action interdite {}".format(request.method) }')

    try:
        photo = Photo.objects.get(pk=photo_id)
    except Photo.DoesNotExist:
        raise Http404('{ "message" : "photo introuvable" }')

    if photo.owner.username != request.user.username:
        return HttpResponseForbidden('{ "message" : "seul le pripriétaire peu supprimer la photo" }')

    import time
    #time.sleep(3)
    nbref = len(photo.ingredient_set.all())
    nbref = nbref + len(photo.recette_set.all())
    nbref = nbref + len(photo.preparation_set.all())
    logger.debug("nb photos ref dans ingredient : {}".format(len(photo.ingredient_set.all())))
    if nbref != 0:
        return HttpResponseForbidden("{{ \"message\" : \"Suppression impossible, la photo est referencée {} fois\" }}".format(nbref))
    photo.delete(
)
    return HttpResponse('{ "message" : "Suppression rélaliser" }')


