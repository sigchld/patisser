# -*- coding: utf-8 -*-
"""
Django url
"""
from django.conf.urls import url
from django.views.generic import TemplateView

from . import views
from . import photorest
from . import ingredientrest
from . import preparationrest
from . import categorierest

from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.http import HttpResponseNotModified, HttpResponseServerError


urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'^login/$', views.my_login, name='login'),
    url(r'^logout/$', views.my_logout, name='logout'),

    url(r'^search$', views.search, name='search'),

    url(r'^photos/$', photorest.PhotoRest.as_view(), name='photo_blank'),
    url(r'^photos/$', photorest.PhotoRest.as_view(), name='photo_create'),
    url(r'^photos/$', photorest.PhotoRest.as_view(), name='photo_update'),
    url(r'^photos/(?P<photo_id>[0-9a-zA-Z._ -]+)$', photorest.PhotoRest.as_view(), name='photo'),
    url(r'^photos/categorie/(?P<categorie_id>[0-9a-zA-Z._ -]+)$', photorest.PhotoCategorieView.as_view(), name='photo_categorie'),

    url(r'^listphotos$', views.list_photos, name='list_photos'),
    url(r'^listphotos/owner/(?P<owner>[a-z]+)$', views.list_photos, name='list_photos_owner'),
    url(r'^listphotos/acces/(?P<acces>[a-z]+)$', views.list_photos, name='list_photos_acces'),

    url(r'^listr$', views.list_recettes, name='list_recettes'),
    url(r'^listr$', views.list_ingredients, name='recette_create'),
    url(r'^listrecettes/owner/(?P<owner>[a-z]+)$', views.list_recettes, name='list_recettes_owner'),
    url(r'^listrecettes/acces/(?P<acces>[a-z]+)$', views.list_recettes, name='list_recettes_acces'),
    url(r'^recette/(?P<ingredient_id>[0-9a-zA-Z._ -]+)$', ingredientrest.IngredientRest.as_view(), name='recette'),
    url(r'^recette/$', ingredientrest.IngredientRest.as_view(), name='recette_empty'),

    url(r'^listi$', views.list_ingredients, name='list_ingredients'),
    url(r'^listi$', views.list_ingredients, name='ingredient_create'),
    url(r'^listi$', views.list_ingredients, name='ingredient'),

    url(r'^listingredients/owner/(?P<owner>[a-z]+)$', views.list_ingredients, name='list_ingredients_owner'),
    url(r'^listingredients/acces/(?P<acces>[a-z]+)$', views.list_ingredients, name='list_ingredients_acces'),
    url(r'^ingredient/(?P<ingredient_id>[0-9]+)$', ingredientrest.IngredientRest.as_view(), name='ingredient'),
    url(r'^ingredient/(?P<ingredient_id>all)/categorie/(?P<categorie_id>[0-9]+)$', ingredientrest.IngredientRest.as_view(), name='ingredient_cat'),
    url(r'^ingredient/$', ingredientrest.IngredientRest.as_view(), name='ingredient_empty'),

    url(r'^listp$', views.list_preparations, name='list_preparations'),
    url(r'^listp$', views.list_ingredients, name='preparation_create'),
    url(r'^listpreparations/owner/(?P<owner>[a-z]+)$', views.list_preparations, name='list_preparations_owner'),
    url(r'^listpreparations/acces/(?P<acces>[a-z]+)$', views.list_preparations, name='list_preparations_acces'),
    
    url(r'^preparation/(?P<preparation_id>[0-9]+)/$', preparationrest.PreparationRest.as_view(), name='preparation'),
    url(r'^preparation/$', preparationrest.PreparationRest.as_view(), name='preparation_empty'),
    url(r'^preparation/(?P<preparation_id>[0-9]+)/nutrition/$', preparationrest.PreparationEnergieEconomat.as_view(), name='preparation_nutriton'),

    url(r'^preparation/(?P<preparation_id>[0-9]+)/ingredient/$', preparationrest.PreparationElement.as_view(), name='preparation_element'),
    url(r'^preparation/(?P<preparation_id>[0-9]+)/ingredient/(?P<element_id>[0-9a-zA-Z._ -]+)/$', preparationrest.PreparationElement.as_view(), name='preparation_element'),

    url(r'^preparation/(?P<preparation_id>[0-9]+)/base/$', preparationrest.PreparationBase.as_view(), name='preparation_element'),
    url(r'^preparation/(?P<preparation_id>[0-9]+)/base/(?P<base_id>[0-9a-zA-Z._ -]+)/$', preparationrest.PreparationBase.as_view(), name='preparation_element'),

    url(r'^preparation/(?P<preparation_id>[0-9]+)/etape/$', preparationrest.PreparationEtape.as_view(), name='preparation_element'),
    url(r'^preparation/(?P<preparation_id>[0-9]+)/etape/(?P<etape_id>[0-9a-zA-Z._ -]+)/$', preparationrest.PreparationEtape.as_view(), name='preparation_element'),
    url(r'^preparation/(?P<preparation_id>all)/categorie/(?P<categorie_id>[0-9a-zA-Z]+)$', preparationrest.PreparationRest.as_view(), name='ingredient_cat'),

    url(r'^detailp/(?P<preparation_id>[0-9]+)$', views.detail_preparation, name='detail_preparation'),

    url('^categories$', views.get_categorie, name='get_category'),
    url('^categorie/(?P<categorie_id>[A-Za-z0-9]+)/$', categorierest.CategorieRest.as_view(), name='categoryrest'),
]
