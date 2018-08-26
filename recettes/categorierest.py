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

from recettes.models import Categorie
from fees import settings


# Get an instance of a logger
LOGGER = logging.getLogger('fees')

class CategorieRest(View):
    def __init__(self):
        self.http_method_names = ['get', 'put', 'delete', 'post']

    def http_method_not_allowed(self, request, *args, **kwargs):
        LOGGER.warning(
            'Method Not Allowed (%s): %s', request.method, request.path,
            extra={'status_code': 405, 'request': request}
        )
        return http.HttpResponseNotAllowed(self._allowed_methods(), '{ "message" : "Méthode non supportée" }')

    # Mofification d'une catégorie
    def post(self, request):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "message" : "Il faut être authentifié pour modifier une catégorie" }')
        return HttpResponse('{\"status\":-2, "message" : "erreur inattendie" }')


    # Création d'une categéorie
    def put(self, request):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ "message" : "Il faut être authentifié pour créer une catégorie" }')
        return HttpResponse('{\"status\":-2, "message" : "erreur inattendue" }')

    #
    # Suppresion d'une catégorie
    #
    def delete(self, request, ingredient_id=None):
        if not request.user.is_authenticated:
            return HttpResponseServerError('{ \"status\":-2, "message" : "Il faut être authentifié pour supprimer une catégorie" }')
        return HttpResponseServerError('{ \"status\":-2, "message" : "erreur inattendue" }')


    
    # Recherche une catégorie aves son id ou une liste de catégorie assiciées à un groupe
    def get(self, request, categorie_id=None):

        if not categorie_id:
            return HttpResponse("{ \"status\":-1 }")


        if not categorie_id.isdigit():
            return get_categorie_list(request, categorie_id)

        
        # il faut charger la categorie...
        categorie = None
        try:
            categorie = Categorie.objects.get(pk=categorie_id)
        except Categorie.DoesNotExist:
            LOGGER.error("Loading categories inconnue/{}".format(categorie_id))
            return HttpResponse("{ \"status\":-1 }")

        if categorie is None:
            return HttpResponse("{ \"status\":-1 }")

        try:
            if categorie.acces != "PUB":
                if not request.user.is_authenticated and  categorie.owner.username != request.user.username:
                    LOGGER.error("Loading acces interdit/categories/{}/{}/{}/{}/{}/".format(categorie_id, request.user.is_authenticated, request.user.username, categorie.acces, categorie.owner))
                    return HttpResponse("{ \"status\":-2, \"message\": \"acces interdit\" }")
        except:
            LOGGER.error("Categorie/categories/{}".format(categorie_id))
            return HttpResponse("{ \"status\":-3, \"message\": \"erreur interne\"}")

        return HttpResponse("{{ \"status\": 0, \"message\": \"OK\", \"categorie\": {} }}".format(categorie.to_json()))



def get_categorie_list(request, groupe_id):
    try:
        groupe_id = groupe_id.upper()
        if groupe_id == "ALL":
            categories = Categorie.objects.all()
        else:
            categories = Categorie.objects.filter(groupe=groupe_id)
    except:
        return HttpResponse("{ \"status\": -1, \"message\": \"erreur interne\"}")

    res = "{ \"status\":0, \"message\": \"ok\",  \"categories\": ["
    nb_elements = 0
    first = True
    
    for categorie in categories:
        if categorie.acces != "PUB":
            if not request.user.is_authenticated and  categorie.owner.username != request.user.username:
                continue
        if first:
            first = False
        else:
            res = res + ","
        nb_elements += 1
        res = res + categorie.to_json()
                   
    res = res + "], \"nb_categories\":" + str(nb_elements) + "}"
    return HttpResponse(res);
