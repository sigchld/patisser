import logging

from django.shortcuts import render
from django.template import RequestContext, loader
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from PIL import Image
from fees import settings
from .models import Recette
from .models import Ingredient
from .models import Preparation

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create your views here.
from django.http import HttpResponse

def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render({}))


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


def list_recettes(request):
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
        
    return HttpResponse(template.render({'recettes' : recettes, 'nb_line': range(nb_elem)}))


def calculIngredientsRecette(recette):
    ingredients = {}
    allergene = False
    energie = 0
    preparations = recette.preparations.all()
    for preparationRecette in recette.preparations.all():
        preparation = preparationRecette.preparation
        quantite = preparationRecette.quantite

        for element in preparation.elements.all():
            ingredient = element.ingredient
            allergene = allergene or ingredient.allergene
            energie += quantite * ((element.quantite/100) * ingredient.calorie)
            tmp = ingredients.get(ingredient.id)
            if tmp is None:
                tmp = {}
                tmp['quantite'] = 0
                tmp['nom'] = ingredient.description
                ingredients[ingredient.id] = tmp;

            tmp['quantite'] += element.quantite
            #logger.debug("ingredient :{}".format(tmp['nom']))
    return (energie, allergene, ingredients.values(), preparations)

def detail_recette(request, recette_id):
    logger.debug("--------------------------- recette id :{}".format(recette_id))
    template = loader.get_template('recettedetail.html')
    recette = Recette.objects.get(id=recette_id)
    energie, allergene, ingredients, preparations = calculIngredientsRecette(recette)
    return HttpResponse(template.render({'recette' : recette, 
                                         'ingredients' : ingredients,
                                         'preparations': preparations,
                                         'energie' : energie,
                                         'allergene' : allergene}))


def list_ingredients(request):
    template = loader.get_template('ingredientlist.html')
    ingredient_list = Ingredient.objects.all()
    nb_elem= 10
    paginator = Paginator(ingredient_list, nb_elem)

    page  = request.GET.get('page')
    try:
        ingredients = paginator.page(page)
    except PageNotAnInteger:
        ingredients = paginator.page(1)
    except EmptyPage:
        ingredients = paginator.page(paginator_num_pages)
        
    return HttpResponse(template.render({'ingredients' : ingredients, 'nb_line': range(nb_elem)}))


def detail_ingredient(request, ingredient_id):
    template = loader.get_template('ingredientdetail.html')
    ingredients = Ingredient.objects.get(ingredient_id)
    return HttpResponse(template.render({'ingredients' : ingredients}))


def list_preparations(request):
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
        
    return HttpResponse(template.render({'preparations' : preparations, 'nb_line': range(nb_elem)}))


def detail_preparation(request, premaration_id):
    template = loader.get_template('preparationdetail.html')
    preparation = Preparation.objects.get(ingredient_id)
    return HttpResponse(template.render({'preparation' : preparation}))



