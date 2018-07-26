# -*- coding: utf-8 -*-

import logging
import io

from django.shortcuts import render
from django.shortcuts import redirect
from django.template import RequestContext, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.http import HttpResponseNotModified, HttpResponseServerError
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder

from PIL import Image
from PIL import ImageMath
from PIL import ImageChops

from fees import settings
from .models import Recette
from .models import Ingredient
from .models import Preparation
from .models import Photo
from .models import Categorie

from .forms import PhotoForm

from django.db.utils import IntegrityError

PAGE_COURANTE='current_page'
ACCUEIL='accueil'
PHOTOS='photos'
INGREDIENTS='ingredients'
PREPARATIONS='preparations'
RECETTES='recettes'


# Get an instance of a logger
logger = logging.getLogger('fees')

# Create your views here.
from django.http import HttpResponse

def index(request, filter=None):
    template = loader.get_template('index.html')
    request.session[PAGE_COURANTE] = ACCUEIL
    return  HttpResponse(template.render({}, request))

        
#
# Appelé pour retrouver les photos
# owner = me ou others ou all
def lis_photos_owner(request, owner):
    list_photos(request, owner=owner)
    
#
# Appelé pour retrouver les photos
# acces = private ou public
def lis_photos_acces(request, acces):
    list_photos(request, acces=acces)

#
# Appelé pour retrouver les photos
# owner = me  que les miennes publiques ou privées
# owner = others photos publiques sauf les miennes
# owner = all les miennes et celles des autres qui sont publiques
#
# acces = public les miennes publiques
# acces = private les miennes privées
#
# plus d'informations sur le Q ici
# https://docs.djangoproject.com/fr/1.11/topics/db/queries/
def list_photos(request,owner='me',acces=None,filter=None):
    request.session[PAGE_COURANTE] = PHOTOS
    detail = request.GET.dict().get('detail', 'true').lower() == "true"
    logger.debug("list_photos/acces/{}/owner/{}/auth/{}".format(acces, owner,request.user.is_authenticated))            
    template = loader.get_template('photolist.html')

    # recuperation du filtre dans la session
    if filter is None:
        filter = request.session.get('filter_photos', None)
    else:
        request.session['filter_photos']=filter
            

    if request.user.is_authenticated:
        if owner == 'all':
            photo_list = Photo.objects.filter((~Q(owner = request.user.username) & Q(acces = 'PUB'))| Q(owner = request.user.username)).order_by('code')
            acces = None
        elif owner == "others":
            photo_list = Photo.objects.filter(~Q(owner = request.user.username) & Q(acces = 'PUB')).order_by('code')
            acces = None
        elif owner == "me":
            if acces == 'all':
                photo_list = Photo.objects.filter(Q(owner = request.user.username)).order_by('code')
            elif acces == 'private':
                photo_list = Photo.objects.filter(Q(owner = request.user.username) & Q(acces = 'PRIV')).order_by('code')
            elif acces == 'public':
                photo_list = Photo.objects.filter(Q(owner = request.user.username) & Q(acces = 'PUB')).order_by('code')
            else:
                photo_list = Photo.objects.filter(Q(owner = request.user.username)).order_by('code')
                acces = 'all'
        else:
            photo_list = Photo.objects.filter(Q(owner = request.user.username)).order_by('code')
            acces = 'all'
            owner = 'me'
            
        if filter:
            photo_list = photo_list.filter(Q(code__icontains = filter) | Q(description__icontains = filter))
    else:
        photo_list = Photo.objects.filter(owner='anonyme')
           
        if filter:
            photo_list = photo_list.filter(Q(code__icontains = filter) | Q(description__icontains = filter)).order_by('code')
        else:
            photo_list = photo_list.order_by('code')

    if detail :
        # 10 lignes
        nb_elem = 10
    else:
        # 25 lignes
        nb_elem = 5 * 5
        
    paginator = Paginator(photo_list, nb_elem)

    page  = request.GET.get('page')
    try:
        photos = paginator.page(page)
    except PageNotAnInteger:
        photos = paginator.page(1)
    except EmptyPage:
        photos = paginator.page(1)

        
    # remplissage sert a palier pb template ou aucun calcul ne peut etre fait
    remplissage = 5 - (len(photos) % 5)
    if remplissage == 5:
        remplissage = range(0)
    else:
        remplissage = range(remplissage)
        
    return HttpResponse(template.render({'filter' : filter, 'photos' : photos, 'remplissage': remplissage, 'owner': owner, 'acces' : acces, 'detail' : detail}, request))


def list_recettes(request, filter=None):
    request.session[PAGE_COURANTE] = RECETTES
    template = loader.get_template('recettelist.html')
    recette_list = Recette.objects.all()
    nb_elem= 10
    paginator = Paginator(recette_list, nb_elem)

    page  = request.GET.get('page')
    try:
        recettes = paginator.page(page)
    except PageNotAnInteger:
        recettes = paginator.page(1)
    except EmptyPage:
        recetes = paginator.page(paginator_num_pages)

    return HttpResponse(template.render({'recettes' : recettes, 'nb_line': range(nb_elem)}, request))


#
# calcul cout ingredient allergene pour une preparation
#
def calculIngredientsPreparation(preparation):
    from decimal import Decimal, getcontext
    getcontext().prec=4
    ingredients = {}
    allergene = False
    energie = 0
    cout = Decimal(0)

    for element in preparation.elements.all():
        ingredient = element.ingredient
        allergene = allergene or ingredient.allergene
        
        cout += ((element.quantite * ingredient.pu)/Decimal(1000))
        energie_ingredient =  (((element.quantite)/Decimal(100)) * ingredient.calorie)
        energie += energie_ingredient

        tmp = ingredients.get(ingredient.id)
        if tmp is None:
            tmp = {}
            tmp['quantite'] = 0
            tmp['energie'] = 0
            tmp['nom'] = ingredient.description
            ingredients[ingredient.id] = tmp;
            
        tmp['quantite'] += element.quantite
        tmp['energie'] += energie_ingredient

    return (energie, allergene, ingredients.values() , cout)


def calculIngredientsRecette(recette):
    from decimal import Decimal, getcontext
    getcontext().prec=4
    ingredients = {}
    allergene = False
    energie = 0
    cout = Decimal(0)
    preparations = recette.preparations.all()
    for preparationRecette in recette.preparations.all():
        preparation = preparationRecette.preparation
        quantite = preparationRecette.quantite

        for element in preparation.elements.all():
            ingredient = element.ingredient
            allergene = allergene or ingredient.allergene

            cout += (quantite/Decimal(100)) * ((element.quantite * ingredient.pu)/Decimal(1000))
            energie_ingredient = (quantite/Decimal(100)) * (((element.quantite)/Decimal(100)) * ingredient.calorie)
            energie += energie_ingredient

            logger.debug(u"----------------------- ingredient :{}/{}/{}/{}".format(ingredient.description,ingredient.pu,element.quantite,(quantite/Decimal(100)) * ((element.quantite * ingredient.pu)/Decimal(1000))))
            tmp = ingredients.get(ingredient.id)
            if tmp is None:
                tmp = {}
                tmp['quantite'] = 0
                tmp['energie'] = 0
                tmp['nom'] = ingredient.description
                ingredients[ingredient.id] = tmp;

            tmp['quantite'] += element.quantite
            tmp['energie'] += energie_ingredient

    return (energie, allergene, ingredients.values(), preparations, cout)

def detail_recette(request, recette_id):
    from decimal import getcontext
    getcontext().prec=2

    template = loader.get_template('recettedetail.html')
    recette = Recette.objects.get(id=recette_id)
    energie, allergene, ingredients, preparations, cout_total = calculIngredientsRecette(recette)
    energie_portion = energie / recette.portion
    cout_portion = cout_total / recette.portion
    return HttpResponse(template.render({'recette' : recette, 
                                         'ingredients' : ingredients,
                                         'preparations': preparations,
                                         'energie' : energie,
                                         'energie_portion' : energie_portion,
                                         'cout_total' : cout_total,
                                         'cout_portion' : cout_portion,
                                         'allergene' : allergene}, request))

#
# Appelé pour retrouver les ingredients
# owner = me ou others ou all

def list_ingredients_owner(request, owner):
    list_ingredients(request, owner=owner)
    
#
# Appelé pour retrouver les ingredients
# acces = private ou public
def list_ingredients_acces(request, acces):
    list_ingredients(request, acces=acces)

#
# Appelé pour retrouver les ingredients
# owner = me  que les miens publics ou privées
# owner = others ingredients publics sauf les miens
# owner = all les miens et ceux des autres qui sont publics
#
# acces = public les miens publics
# acces = private les miens privés
#
# plus d'informations sur le Q ici
# https://docs.djangoproject.com/fr/1.11/topics/db/queries/
def list_ingredients(request,owner='me',acces=None,filter=None):
    request.session[PAGE_COURANTE] = INGREDIENTS
    detail = request.GET.dict().get('detail', 'true').lower() == "true"
    logger.debug("list_ingredients/acces/{}/owner/{}/auth/{}".format(acces, owner,request.user.is_authenticated))            
    template = loader.get_template('ingredientlist.html')

    # recuperation du filtre dans la session
    if filter is None:
        filter = request.session.get('filter_ingredients', None)
    else:
        request.session['filter_ingredients']=filter
            

    if request.user.is_authenticated:
        if owner == 'all':
            ingredient_list = Ingredient.objects.filter((~Q(owner = request.user.username) & Q(acces = 'PUB'))| Q(owner = request.user.username)).order_by('code')
            acces = None
        elif owner == "others":
            ingredient_list = Ingredient.objects.filter(~Q(owner = request.user.username) & Q(acces = 'PUB')).order_by('code')
            acces = None
        elif owner == "me":
            if acces == 'all':
                ingredient_list = Ingredient.objects.filter(Q(owner = request.user.username)).order_by('code')
            elif acces == 'private':
                ingredient_list = Ingredient.objects.filter(Q(owner = request.user.username) & Q(acces = 'PRIV')).order_by('code')
            elif acces == 'public':
                ingredient_list = Ingredient.objects.filter(Q(owner = request.user.username) & Q(acces = 'PUB')).order_by('code')
            else:
                ingredient_list = Ingredient.objects.filter(Q(owner = request.user.username)).order_by('code')
                acces = 'all'
        else:
            ingredient_list = Ingredient.objects.filter(Q(owner = request.user.username)).order_by('code')
            acces = 'all'
            owner = 'me'
            
        if filter:
            ingredient_list = ingredient_list.filter(Q(code__icontains = filter) | Q(description__icontains = filter))
    else:
        ingredient_list =  Ingredient.objects.filter(owner='anonyme')
           
        if filter:
            ingredient_list = ingredient_list.filter(Q(code__icontains = filter) | Q(description__icontains = filter)).order_by('code')
        else:
            ingredient_list = ingredient_list.order_by('code')

    if detail :
        # 10 lignes
        nb_elem = 10
    else:
        # 25 lignes
        nb_elem = 5 * 5
        
    paginator = Paginator(ingredient_list, nb_elem)

    page  = request.GET.get('page')
    try:
        ingredients = paginator.page(page)
    except PageNotAnInteger:
        ingredients = paginator.page(1)
    except EmptyPage:
        ingredients = paginator.page(1)

        
    # remplissage sert a palier pb template ou aucun calcul ne peut etre fait
    remplissage = 5 - (len(ingredients) % 5)
    if remplissage == 5:
        remplissage = range(0)
    else:
        remplissage = range(remplissage)
        
    return HttpResponse(template.render({'filter' : filter, 'ingredients' : ingredients, 'remplissage': remplissage, 'owner': owner, 'acces' : acces, 'detail' : detail}, request))



def detail_ingredient(request, ingredient_id):
    template = loader.get_template('ingredientdetail.html')
    ingredient = Ingredient.objects.get(id=ingredient_id)
    return HttpResponse(template.render({'ingredient' : ingredient}, request))


def list_preparations(request, filter=None):
    request.session[PAGE_COURANTE] = PREPARATIONS
    template = loader.get_template('preparationlist.html')
    preparation_list = Preparation.objects.all()
    nb_elem= 10
    paginator = Paginator(preparation_list, nb_elem)

    page  = request.GET.get('page')
    try:
        preparations = paginator.page(page)
    except PageNotAnInteger:
        preparations = paginator.page(1)
    except EmptyPage:
        preparations = paginator.page(paginator_num_pages)

    return HttpResponse(template.render({'preparations' : preparations, 'nb_line': range(nb_elem)}, request))


def detail_preparation(request, preparation_id):
    template = loader.get_template('preparationdetail.html')
    preparation = Preparation.objects.get(id=preparation_id)
    energie, allergene, ingredients, cout = calculIngredientsPreparation(preparation)
    return HttpResponse(template.render({'preparation' : preparation, 
                                         'ingredients' : ingredients,
                                         'energie' : energie,
                                         'cout' : cout,
                                         'allergene' : allergene}, request))


def search(request):
    filter = request.GET.get('_', None)
    logger.debug("search/{}/{}".format('photos', filter))
    page_courante = request.session.get(PAGE_COURANTE, ACCUEIL)
    if page_courante == ACCUEIL:
        return index(request, filter=filter)
    elif page_courante == PHOTOS:
        return list_photos(request, filter=filter)
    elif page_courante == INGREDIENTS:
        return list_ingredients(request, filter=filter)
    
    return index(request, filter=filter)

def my_logout(request):
    logout(request)
    return redirect('/mesrecettes/')
    return index(request)
    
def my_login(request):
    #logout(request)
    username = password = ''
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponse('{ "message" : "OK" }')
        else:
            return HttpResponseForbidden('{ "message" : "Acces interdit" }')
    else:
        return HttpResponseForbidden('{ "message" : "Login ou mot de passe erroné" }')
    #return render_to_response('login.html', context_instance=RequestContext(request))


def categorie(request):
    import json
    groupe = None

    if request.POST:
        logger.debug("categorie POST présent")            
        #return HttpResponseServerError("{ \"message\" : \"méthode non supportée\" }")
    groupe = request.POST.get('groupe', None)
    logger.debug("categorie {}".format( groupe))            

    if  groupe is None or [] == [ item for item in Categorie.GROUPE if item[0] == groupe]:
        if groupe == "ALL":
            return HttpResponse('{ "message" : "OK" }')
        else:
            return HttpResponseServerError("{ \"message\" : \"erreur groupe\" }")

    if request.user.is_authenticated:        
        queryset = Categorie.objects.filter((Q(owner = request.user.username) | Q(owner = 'anonyme') | Q(acces='PUB'))&Q(groupe=groupe)).values('id', 'categorie', 'groupe', 'description').order_by('description')
    else:
        queryset = Categorie.objects.filter((Q(owner = 'anonyme') | Q(acces = 'PUB')) & Q(groupe=groupe)).values('id', 'categorie', 'groupe', 'description').order_by('description')


    data = '{{ "message" : {} }}'.format(json.dumps(list(queryset), cls=DjangoJSONEncoder))
    logger.debug('categorie {}'.format(data))
    return HttpResponse(data)
