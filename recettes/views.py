import logging
from django.shortcuts import render
from PIL import Image
from fees import settings


# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create your views here.
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the recettes index.")

def photo(request, photo_id):
    try:
        img = Image.open("{}/photos/{}".format(settings.BASE_DIR,photo_id))
	size = (128, 128)
        img.thumbnail(size)
	response = HttpResponse(content_type="image/png")
	img.save(response, "PNG")
	return response
        #with open("{}/photos/{}".format(settings.BASE_DIR,photo_id), "rb") as f:
        #    return HttpResponse(f.read(), content_type="image/png")
    except IOError:
        red = Image.new('RGBA', (1, 1), (255,0,0,0))
        response = HttpResponse(content_type="image/jpeg")
        red.save(response, "JPEG")
    return response


