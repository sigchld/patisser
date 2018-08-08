from django.conf.urls import url
from django.views.generic import TemplateView

from . import views
from . import photoview
from . import ingredientview

from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.http import HttpResponseNotModified, HttpResponseServerError


urlpatterns = [
    #url(r'^about/$', TemplateView.as_view(template_name="index.html")),
    url(r'^$', views.index, name='index'),

    url(r'^login/$', views.my_login, name='login'),
    url(r'^logout/$', views.my_logout, name='logout'),

    url(r'^search$', views.search, name='search'),    

    url(r'^photos/$', photoview.PhotoView.as_view(), name='photo_blank'),
    url(r'^photos/$', photoview.PhotoView.as_view(), name='photo_create'),
    url(r'^photos/$', photoview.PhotoView.as_view(), name='photo_update'),
    url(r'^photos/(?P<photo_id>[0-9a-zA-Z._ -]+)$', photoview.PhotoView.as_view(), name='photo'),
    url(r'^photos/categorie/(?P<categorie_id>[0-9a-zA-Z._ -]+)$', photoview.PhotoCategorieView.as_view(), name='photo_categorie'),
    
    url(r'^listphotos$', views.list_photos, name='list_photos'),
    url(r'^listphotos/owner/(?P<owner>[a-z]+)$', views.list_photos, name='list_photos_owner'),
    url(r'^listphotos/acces/(?P<acces>[a-z]+)$', views.list_photos, name='list_photos_acces'),

    url(r'^listr$', views.list_recettes, name='list_recettes'),
    url(r'^listr$', views.list_ingredients, name='recette_create'),
    url(r'^listrecettes/owner/(?P<owner>[a-z]+)$', views.list_recettes, name='list_recettes_owner'),
    url(r'^listrecettes/acces/(?P<acces>[a-z]+)$', views.list_recettes, name='list_recettes_acces'),
    url(r'^recette/(?P<ingredient_id>[0-9a-zA-Z._ -]+)$', ingredientview.IngredientView.as_view(), name='recette'),
    url(r'^recette/$', ingredientview.IngredientView.as_view(), name='recette_empty'),

    url(r'^detailr/(?P<recette_id>[0-9]+)$', views.detail_recette, name='detail_recette'),

    url(r'^listi$', views.list_ingredients, name='list_ingredients'),
    url(r'^listi$', views.list_ingredients, name='ingredient_create'),
    url(r'^listi$', views.list_ingredients, name='ingredient'),
    #url(r'^detaili/(?P<ingredient_id>[0-9]+)$', views.detail_ingredient, name='detail_ingredient'),
    url(r'^listingredients/owner/(?P<owner>[a-z]+)$', views.list_ingredients, name='list_ingredients_owner'),
    url(r'^listingredients/acces/(?P<acces>[a-z]+)$', views.list_ingredients, name='list_ingredients_acces'),
    url(r'^ingredient/(?P<ingredient_id>[0-9a-zA-Z._ -]+)$', ingredientview.IngredientView.as_view(), name='ingredient'),
    url(r'^ingredient/$', ingredientview.IngredientView.as_view(), name='ingredient_empty'),

    
    url(r'^listp$', views.list_preparations, name='list_preparations'),
    url(r'^listp$', views.list_ingredients, name='preparation_create'),
    url(r'^listpreparations/owner/(?P<owner>[a-z]+)$', views.list_preparations, name='list_preparations_owner'),
    url(r'^listpreparations/acces/(?P<acces>[a-z]+)$', views.list_preparations, name='list_preparations_acces'),
    url(r'^preparation/(?P<ingredient_id>[0-9a-zA-Z._ -]+)$', ingredientview.IngredientView.as_view(), name='preparation'),
    url(r'^preparation/$', ingredientview.IngredientView.as_view(), name='preparation_empty'),

    
    url(r'^detailp/(?P<preparation_id>[0-9]+)$', views.detail_preparation, name='detail_preparation'),        


    url('^categories$', views.get_categorie, name='get_category'),
]
