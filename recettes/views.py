# -*- coding: utf-8 -*-

import logging
import traceback
import json

from django.shortcuts import redirect
from django.template import loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpResponseForbidden
from django.http import HttpResponseServerError
from django.contrib.auth import authenticate, login, logout
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.functions import Lower
from django.http import HttpResponse

from .models import Recette
from .models import Ingredient
from .models import Preparation
from .models import Photo
from .models import Categorie

from .energie import calcul_ingredients_recette
from .energie import calcul_ingredients_preparation

PAGE_COURANTE = 'current_page'
ACCUEIL = 'accueil'
PHOTOS = 'photos'
INGREDIENTS = 'ingredients'
PREPARATIONS = 'preparations'
RECETTES = 'recettes'


# Get an instance of a logger
LOGGER = logging.getLogger('fees')

# Create your views here.


def index(request):
    """ page d'accueil """
    template = loader.get_template('index.html')
    request.session[PAGE_COURANTE] = ACCUEIL
    return  HttpResponse(template.render({}, request))


#
# Appelé pour retrouver les photos
# owner = me ou others ou all
def lis_photos_owner(request, owner):
    """  liste des photos appartenant à un owner """
    list_photos(request, owner=owner)

#
# Appelé pour retrouver les photos
# acces = private ou public
def lis_photos_acces(request, acces):
    """ liste des photos suivant l'acces """
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
def list_photos(request, owner='me', acces=None, filtre=None):
    """ point d'entree principal liste photos """
    request.session[PAGE_COURANTE] = PHOTOS
    detail = request.GET.dict().get('detail', 'true').lower() == "true"

    groupe = request.GET.dict().get('groupe', None)
    categorie = request.GET.dict().get('categorie', None)

    # Maj session
    if groupe is  None and request.session.get('photos_groupe', None) is not None:
        groupe = request.session.get('photos_groupe', None)

    if categorie is None and request.session.get('photos_categorie', None) is not None:
        categorie = request.session.get('photos_categorie', None)

    # Conversion None -> ALL
    if groupe is None:
        groupe = "ALL"
    if categorie is None:
        categorie = "ALL"

    categorie_obj = None
    try:
        # traiter le cas de ALL / ALL
        LOGGER.debug("list_photos_query/categorie_obj/{}/{}".format(groupe, categorie))
        categorie_obj = Categorie.objects.get(Q(groupe=groupe)
                                              & Q(categorie=categorie)) #, categorie=categorie)
        LOGGER.debug("list_photos_result/categorie_obj/{}/{}"
                     .format(categorie_obj.groupe, categorie_obj.categorie))
        #except Photo.DoesNotExist:
    except:
        just_the_string = traceback.format_exc()
        LOGGER.debug("list_photos/categorie_obj/{}".format(just_the_string))


    request.session['photos_categorie'] = categorie
    request.session['photos_groupe'] = groupe

    LOGGER.debug("list_photos/acces/{}/owner/{}/auth/{}"
                 .format(acces, owner, request.user.is_authenticated))
    template = loader.get_template('photolist.html')

    # recuperation du filtre dans la session
    if filtre is None:
        filtre = request.session.get('filter_photos', None)
    else:
        request.session['filter_photos'] = filtre

    if request.user.is_authenticated:
        if owner == 'all':
            photo_list = Photo.objects.filter((~Q(owner=request.user.username) &
                                               Q(acces='PUB')) |
                                              Q(owner=request.user.username)).order_by('code')
            acces = None
        elif owner == "others":
            photo_list = Photo.objects.filter(~Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
            acces = None
        elif owner == "me":
            if acces == 'all':
                photo_list = Photo.objects.filter(Q(owner=request.user.username)).order_by('code')
            elif acces == 'private':
                photo_list = Photo.objects.filter(Q(owner=request.user.username) & Q(acces='PRIV')).order_by('code')
            elif acces == 'public':
                photo_list = Photo.objects.filter(Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
            else:
                photo_list = Photo.objects.filter(Q(owner=request.user.username)).order_by('code')
                acces = 'all'
        else:
            photo_list = Photo.objects.filter(Q(owner=request.user.username)).order_by('code')
            acces = 'all'
            owner = 'me'

        if filtre:
            photo_list = photo_list.filter(Q(code__icontains=filter) | Q(description__icontains=filter))
    else:
        photo_list = Photo.objects.filter(Q(acces='PUB'))

        if filtre:
            photo_list = photo_list.filter(Q(code__icontains=filter) | Q(description__icontains=filter)).order_by('code')
        else:
            photo_list = photo_list.order_by('code')

    if categorie_obj is not None:
        photo_list = photo_list.filter(categorie=categorie_obj)
    elif  groupe != "ALL":
        photo_list = photo_list.filter(categorie__groupe=groupe)

    if detail:
        # 10 lignes
        nb_elem = 10
    else:
        # 25 lignes
        nb_elem = 5 * 5

    paginator = Paginator(photo_list, nb_elem)

    page = request.GET.get('page')
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

    return HttpResponse(template.render({'filter' : filtre, 'photos' : photos,
                                         'remplissage': remplissage,
                                         'owner': owner, 'acces' :
                                         acces, 'detail' : detail},
                                        request))

#
# Retourne la liste des ingredients
# owner = me ou others ou all
def list_ingredients_owner(request, owner):
    """ retournr la liste des ingrédients sur le critère owner (me/others/all) """
    list_ingredients(request, owner=owner)

#
# Appelé pour retrouver les ingredients
# acces = private ou public
def list_ingredients_acces(request, acces):
    """ retournr la liste des ingrédients sur le critère de l'accès (private/public)"""
    list_ingredients(request, acces=acces)

#
# Appelé pour retrouver les ingredients
# plus d'informations sur le Q ici
# https://docs.djangoproject.com/fr/1.11/topics/db/queries/
def list_ingredients(request, owner='me', acces=None, filtre=None):
    """ liste des ingrédients sartisfaisant les critères suivants :
    owner = me  que les miens publics ou privées
    owner = others ingredients publics sauf les miens
    owner = all les miens et ceux des autres qui sont publics

    acces = public les miens publics
    acces = private les miens privés
    """
    request.session[PAGE_COURANTE] = INGREDIENTS
    detail = request.GET.dict().get('detail', 'true').lower() == "true"
    LOGGER.debug("list_ingredients/acces/{}/owner/{}/auth/{}".format(acces, owner,request.user.is_authenticated))
    template = loader.get_template('ingredientlist.html')

    groupe = "ING"
    categorie = request.GET.dict().get('categorie', None)

    if categorie is None and request.session.get('ingredients_categorie', None) is not None:
        categorie = request.session.get('ingredients_categorie', None)

    # Conversion None -> ALL
    #if groupe is None:
    #    groupe = "ALL"
    if categorie is None:
        categorie = "ALL"

    categorie_obj = None
    try:
        # traiter le cas de ALL / ALL
        LOGGER.debug("list_ingredient_query/categorie_obj/{}/{}".format(groupe, categorie))
        categorie_obj = Categorie.objects.get(Q(groupe=groupe) & Q(categorie=categorie))
        LOGGER.debug("list_ingredient_result/categorie_obj/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
        # verifier les droits d'acces
        #except Photo.DoesNotExist:
    except:
        just_the_string = traceback.format_exc()
        LOGGER.debug("list_photos/categorie_obj/{}".format(just_the_string))

    request.session['ingredients_categorie'] = categorie
    request.session['ingredients_groupe'] = groupe

    # recuperation du filtre dans la session
    if filtre is None:
        filtre = request.session.get('filter_ingredients', None)
    else:
        request.session['filter_ingredients'] = filtre

    if request.user.is_authenticated:
        if owner == 'all':
              ingredient_list = Ingredient.objects.filter((~Q(owner=request.user.username) & Q(acces='PUB'))| Q(owner=request.user.username)).order_by('code')
              acces = None
        elif owner == "others":
              ingredient_list = Ingredient.objects.filter(~Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
              acces = None
        elif owner == "me":
            if acces == 'all':
                ingredient_list = Ingredient.objects.filter(Q(owner=request.user.username)).order_by('code')
            elif acces == 'private':
                ingredient_list = Ingredient.objects.filter(Q(owner=request.user.username) & Q(acces='PRIV')).order_by('code')
            elif acces == 'public':
                ingredient_list = Ingredient.objects.filter(Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
            else:
                ingredient_list = Ingredient.objects.filter(Q(owner=request.user.username)).order_by('code')
                acces = 'all'
        else:
            ingredient_list = Ingredient.objects.filter(Q(owner=request.user.username)).order_by('code')
            acces = 'all'
            owner = 'me'

        if filtre:
            ingredient_list = ingredient_list.filter(Q(code__icontains=filtre) | Q(description__icontains=filtre))
    else:
        ingredient_list = Ingredient.objects.filter(Q(acces='PUB'))

        if filtre:
            ingredient_list = ingredient_list.filter(Q(code__icontains=filtre) | Q(description__icontains=filtre)).order_by('code')
        else:
            ingredient_list = ingredient_list.order_by('code')

    if categorie_obj is not None:
        LOGGER.debug("list_ingredient_result/categorie_obj/filtre/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
        ingredient_list = ingredient_list.filter(categorie=categorie_obj)

    if detail:
        # 10 lignes
        nb_elem = 10
    else:
        # 25 lignes
        nb_elem = 5 * 5

    paginator = Paginator(ingredient_list, nb_elem)

    page = request.GET.get('page')
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

    #
    # constitution de la liste des noms
    categories = []
    categories.append(('NONE', 'Choisir..'))
    categories.append(('ING', 'INGRÉDIENTS'))
    categorie_ing = Categorie.objects.filter(groupe="ING").order_by(Lower('description'))
    for cat in categorie_ing:
        categories.append((cat.id, cat.description))

    return HttpResponse(template.render({'filter' : filtre, 'ingredients' : ingredients, 'remplissage': remplissage, 'owner': owner, 'acces' : acces, 'detail' : detail, "msg_error" : "", "categories_photos" : categories}, request))


#
# NE PLUS UTILISER
def detail_ingredient(request, ingredient_id):
    """ détail d'un ingrédient """
    template = loader.get_template('ingredientdetail.html')
    ingredient = Ingredient.objects.get(id=ingredient_id)
    return HttpResponse(template.render({'ingredient' : ingredient}, request))


#
# Appelé pour retrouver les préparations
# owner = me ou others ou all
def list_preparations_owner(request, owner):
    """ retourne les préparations sue le critère owner """
    list_preparations(request, owner=owner)

#
# Appelé pour retrouver les préparations
# acces = private ou public
def list_preparations_acces(request, acces):
    """ retourne les préparations sur le critère d'accès """
    list_preparations(request, acces=acces)

#
# Appelé pour retrouver les préparations
#
# plus d'informations sur le Q ici
# https://docs.djangoproject.com/fr/1.11/topics/db/queries/
def list_preparations(request, owner='me', acces=None, filter=None):
    """ liste des préparations satisfaisant les critères suivants :
    owner = me  que les miens publics ou privées
    owner = others ingredients publics sauf les miens
    owner = all les miens et ceux des autres qui sont publics

    acces = public les miens publics
    acces = private les miens privés

    filter ...
    """
    request.session[PAGE_COURANTE] = PREPARATIONS
    detail = request.GET.dict().get('detail', 'true').lower() == "true"
    template = loader.get_template('preparationlist.html')
    groupe = "PREP"
    categorie = request.GET.dict().get('categorie', None)


    if categorie is None and request.session.get('preparations_categorie', None) is not None:
        categorie = request.session.get('preparations_categorie', None)

    # Conversion None -> ALL
    if categorie is None:
        categorie = "ALL"

    categorie_obj = None
    try:
        # traiter le cas de ALL / ALL
        LOGGER.debug("list_preparation_query/categorie_obj/{}/{}".format(groupe, categorie))
        categorie_obj = Categorie.objects.get(Q(groupe=groupe) & Q(categorie=categorie)) #, categorie=categorie)
        LOGGER.debug("list_preparation_result/categorie_obj/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
    except:
        just_the_string = traceback.format_exc()
        LOGGER.debug("list_preparation/categorie_obj/{}".format(just_the_string))


    request.session['preparations_categorie'] = categorie
    request.session['preparations_groupe'] = groupe

    # recuperation du filtre dans la session
    if filter is None:
        filter = request.session.get('filter_preparations', None)
    else:
        request.session['filter_preparations'] = filter

    if request.user.is_authenticated:
        if owner == 'all':
            preparation_list = Preparation.objects.filter(
                (~Q(owner=request.user.username) & Q(acces='PUB')) |
                Q(owner=request.user.username)).order_by('code')
            acces = None
        elif owner == "others":
            preparation_list = Preparation.objects.filter(
                ~Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
            acces = None
        elif owner == "me":
            if acces == 'all':
                preparation_list = Preparation.objects.filter(
                    Q(owner=request.user.username)).order_by('code')
            elif acces == 'private':
                preparation_list = Preparation.objects.filter(
                    Q(owner=request.user.username) & Q(acces='PRIV')).order_by('code')
            elif acces == 'public':
                preparation_list = Preparation.objects.filter(
                    Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
            else:
                preparation_list = Preparation.objects.filter(
                    Q(owner=request.user.username)).order_by('code')
                acces = 'all'
        else:
            preparation_list = Preparation.objects.filter(Q(owner=request.user.username)).order_by('code')
            acces = 'all'
            owner = 'me'

        if filter:
            preparation_list = preparation_list.filter(Q(code__icontains=filter) | Q(description__icontains=filter))
    else:
        preparation_list = Preparation.objects.filter(Q(acces='PUB'))

        if filter:
            preparation_list = preparation_list.filter(Q(code__icontains=filter) | Q(description__icontains=filter)).order_by('code')
        else:
            preparation_list = preparation_list.order_by('code')

    if categorie_obj is not None:
        LOGGER.debug("*************************** list_preparation_result/categorie_obj/filter/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
        preparation_list = preparation_list.filter(categorie=categorie_obj)

    if detail:
        # 10 lignes
        nb_elem = 10
    else:
        # 25 lignes
        nb_elem = 5 * 5

    paginator = Paginator(preparation_list, nb_elem)

    page  = request.GET.get('page')
    try:
        preparations = paginator.page(page)
    except PageNotAnInteger:
        preparations = paginator.page(1)
    except EmptyPage:
        preparations = paginator.page(1)


    # remplissage sert a palier pb template ou aucun calcul ne peut etre fait
    remplissage = 5 - (len(preparations) % 5)
    if remplissage == 5:
        remplissage = range(0)
    else:
        remplissage = range(remplissage)

    #
    # constitution de la liste des catégories des préparations
    categories_preparations = []
    categories_preparations.append(('NONE', 'Choisir..'))
    categories_preparations.append(('PREP', 'PRÉPARATIONS'))
    categorie_prep = Categorie.objects.filter(groupe="PREP").order_by(Lower('description'))
    for cat in categorie_prep:
        categories_preparations.append((cat.id, cat.description))
    #
    # constitution de lq liste des catégories des ingrédients
    categories_ingredients = []
    categories_ingredients.append(('NONE', 'Choisir..'))
    categorie_ing = Categorie.objects.filter(groupe="ING").order_by(Lower('description'))
    for cat in categorie_ing:
        categories_ingredients.append((cat.id, cat.description))

    return HttpResponse(template.render({'filter' : filter, 'preparations' : preparations,
                                         'remplissage': remplissage, 'owner': owner, 'acces' : acces, 'detail' : detail, "msg_error" : "",
                                         "categories_photos" : categories_preparations, 'categories_ingredients' : categories_ingredients}, request))


#
# Retourne le détail (HTML) d'une préraration
def detail_preparation(request, preparation_id):
    """ formulaire de présentation d'une préparation """
    template = loader.get_template('preparationdetail.html')
    preparation = Preparation.objects.get(id=preparation_id)
    energie, allergene, ingredients, cout = calculIngredientsPreparation(preparation)
    return HttpResponse(template.render({'preparation' : preparation,
                                         'ingredients' : ingredients,
                                         'energie' : energie,
                                         'cout' : cout,
                                         'allergene' : allergene}, request))


#
# Appelé pour retrouver les recettes
# owner = me ou others ou all
def list_recettes_owner(request, owner):
    """ liste recettes critère owner me, others, all """
    list_recettes(request, owner=owner)

#
# Appelé pour retrouver les préparations
# acces = private ou public
def list_recettes_acces(request, acces):
    """ lite recettes sur critère acces : PUB / PRIV """
    list_recettes(request, acces=acces)

#
# Appelé pour retrouver les recettes
# plus d'informations sur le Q ici
# https://docs.djangoproject.com/fr/1.11/topics/db/queries/
def list_recettes(request, owner='me', acces=None, filter=None):
    """ retourne la page html de la liste des recettes suivants les critères suivants  :
 owner = me  que les miens publics ou privées
 owner = others ingredients publics sauf les miens
 owner = all les miens et ceux des autres qui sont publics

 acces = public les miens publics
 acces = private les miens privés

    """
    request.session[PAGE_COURANTE] = RECETTES
    detail = request.GET.dict().get('detail', 'true').lower() == "true"
    template = loader.get_template('recettelist.html')
    groupe = "REC"
    categorie = request.GET.dict().get('categorie', None)


    if categorie is None and request.session.get('recettes_categorie', None) is not None:
        categorie = request.session.get('recettes_categorie', None)

    # Conversion None -> ALL
    #if groupe is None:
    #    groupe = "ALL"
    if categorie is None:
        categorie = "ALL"

    categorie_obj = None
    try:
        # traiter le cas de ALL / ALL
        LOGGER.debug("list_recette_query/categorie_obj/{}/{}".format(groupe, categorie))
        categorie_obj = Categorie.objects.get(Q(groupe=groupe) & Q(categorie=categorie))
        LOGGER.debug("list_recette_result/categorie_obj/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
    except:
        just_the_string = traceback.format_exc()
        LOGGER.debug("list_recette/categorie_obj/{}".format(just_the_string))


    request.session['recettes_categorie'] = categorie
    request.session['recettes_groupe'] = groupe

    # recuperation du filtre dans la session
    if filter is None:
        filter = request.session.get('filter_recettes', None)
    else:
        request.session['filter_recettes'] = filter

    if request.user.is_authenticated:
        if owner == 'all':
            recette_list = Recette.objects.filter(
                (~Q(owner = request.user.username) & Q(acces='PUB')) |
                Q(owner = request.user.username)).order_by('code')
            acces = None
        elif owner == "others":
            recette_list = Recette.objects.filter(
                ~Q(owner = request.user.username) &
                Q(acces='PUB')).order_by('code')
            acces = None
        elif owner == "me":
            if acces == 'all':
                recette_list = Recette.objects.filter(
                    Q(owner=request.user.username)).order_by('code')
            elif acces == 'private':
                recette_list = Recette.objects.filter(
                    Q(owner=request.user.username) & Q(acces='PRIV')).order_by('code')
            elif acces == 'public':
                recette_list = Recette.objects.filter(
                    Q(owner=request.user.username) & Q(acces='PUB')).order_by('code')
            else:
                recette_list = Recette.objects.filter(
                    Q(owner=request.user.username)).order_by('code')
                acces = 'all'
        else:
            recette_list = Recette.objects.filter(Q(owner=request.user.username)).order_by('code')
            acces = 'all'
            owner = 'me'

        if filter:
            recette_list = recette_list.filter(
                Q(code__icontains=filter) |
                Q(description__icontains=filter))
    else:
        recette_list =  Recette.objects.filter(Q(acces='PUB'))

        if filter:
            recette_list = recette_list.filter(Q(code__icontains=filter) |
                                               Q(description__icontains=filter)).order_by('code')
        else:
            recette_list = recette_list.order_by('code')

    if categorie_obj is not None:
        LOGGER.debug("list_recette_result/categorie_obj/filter/{}/{}".format(categorie_obj.groupe, categorie_obj.categorie))
        recette_list = recette_list.filter(categorie=categorie_obj)

    if detail:
        # 10 lignes
        nb_elem = 10
    else:
        # 25 lignes
        nb_elem = 5 * 5

    paginator = Paginator(recette_list, nb_elem)

    page  = request.GET.get('page')
    try:
        recettes = paginator.page(page)
    except PageNotAnInteger:
        recettes = paginator.page(1)
    except EmptyPage:
        recettes = paginator.page(1)


    # remplissage sert a palier pb template ou aucun calcul ne peut etre fait
    remplissage = 5 - (len(recettes) % 5)
    if remplissage == 5:
        remplissage = range(0)
    else:
        remplissage = range(remplissage)

    #
    # constitution de la liste des noms
    categories = []
    categories.append(('NONE', 'Choisir..'))
    #categories.append(('ALL', 'TOUTES'))
    #categories.append(('ING', 'INGRÉDIENTS'))
    categories.append(('REC', 'RECETTES'))
    #categories.append(('PREP','PRÉPARATIONS'))
    #categories.append(('MAT', 'USTENSILES'))
    categorie_ing = Categorie.objects.filter(groupe="PREP").order_by(Lower('description'))

    
    # constitution de lq liste des catégories des ingrédients
    categories_ingredients = []
    categories_ingredients.append(('NONE', 'Choisir..'))
    categorie_ing = Categorie.objects.filter(groupe="ING").order_by(Lower('description'))
    for cat in categorie_ing:
        categories_ingredients.append((cat.id, cat.description))

        
    for cat in categorie_ing:
        categories.append((cat.id, cat.description))

    return HttpResponse(template.render({'filter' : filter, 'recettes' : recettes,
                                         'remplissage': remplissage, 'owner': owner,
                                         'acces' : acces, 'detail' : detail, "msg_error" : "", "categories_photos" : categories,
                                         'categories_ingredients' : categories_ingredients}, request))



def search(request):
    """ recherche textuelle, à partir de la loupe """
    filter = request.GET.get('_', None)
    LOGGER.debug("search/{}/{}".format('photos', filter))
    page_courante = request.session.get(PAGE_COURANTE, ACCUEIL)
    if page_courante == ACCUEIL:
        return index(request, filter=filter)
    elif page_courante == PHOTOS:
        return list_photos(request, filtre=filter)
    elif page_courante == INGREDIENTS:
        return list_ingredients(request, filtre=filter)

    return index(request, filtre=filter)

def my_logout(request):
    """ deconnexion de l'utilisateur """
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


def get_categorie(request):
    """ retourne une liste de catégories associées au groupe """
    groupe = None

    if request.POST:
        LOGGER.debug("categorie POST présent")
        #return HttpResponseServerError("{ \"message\" : \"méthode non supportée\" }")
        groupe = request.POST.get('groupe', None)

        
    LOGGER.debug("categorie {}".format( groupe))

    if  groupe is None or [] == [ item for item in Categorie.GROUPE if item[0] == groupe]:
        if groupe == "ALL":
            return HttpResponse('{ "message" : "OK" }')
        else:
            return HttpResponseServerError("{ \"message\" : \"erreur groupe\" }")

    if request.user.is_authenticated:        
        queryset = Categorie.objects.filter((Q(owner=request.user.username) | Q(owner='anonyme') | Q(acces='PUB'))&Q(groupe=groupe)).values('id', 'categorie', 'groupe', 'description').order_by('description')
    else:
        queryset = Categorie.objects.filter((Q(owner='anonyme') | Q(acces='PUB')) & Q(groupe=groupe)).values('id', 'categorie', 'groupe', 'description').order_by('description')


    data = '{{ "message" : {} }}'.format(json.dumps(list(queryset), cls=DjangoJSONEncoder))
    LOGGER.debug('categorie {}'.format(data))
    return HttpResponse(data)
