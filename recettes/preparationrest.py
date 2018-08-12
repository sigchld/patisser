# -*- coding: utf-8 -*-
import traceback
import logging
import io
import time
import math
import json

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

from recettes.models import Photo, Ingredient, Categorie, Preparation
from fees import settings
from . energie import calcul_ingredients_preparation

# Get an instance of a logger
logger = logging.getLogger('fees')

class PreparationRest(View):
    """
    REst module pour les préparations
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
        # par defaut c'estt la photo blanche!
        if not preparation_id:
            return HttpResponse("{ \"status\":-1 }")

        # il faut charger la photo...
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
            logger.error("Loading IOError /photos/{}".format(preparation_id))
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

