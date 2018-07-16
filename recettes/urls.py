from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'^search$', views.search, name='search'),    

    url(r'^photos/$', views.photo, name='photo_create'),
    url(r'^photos/(?P<photo_id>[0-9a-zA-Z._ -]+)(/.*)?$', views.photo, name='photo'),

    url(r'^listr$', views.list_recettes, name='list_recette'),
    url(r'^detailr/(?P<recette_id>[0-9]+)$', views.detail_recette, name='detail_recette'),

    url(r'^listi$', views.list_ingredients, name='list'),
    url(r'^detaili/(?P<ingredient_id>[0-9]+)$', views.detail_ingredient, name='detail_ingredient'),

    url(r'^listp$', views.list_preparations, name='list_preparation'),
    url(r'^detailp/(?P<preparation_id>[0-9]+)$', views.detail_preparation, name='detail_preparation'),        

    url(r'^listphotos$', views.list_photos, name='list_photos'),
    url(r'^listphotos/owner/(?P<owner>[a-z]+)$', views.list_photos, name='list_photos_owner'),
    url(r'^listphotos/acces/(?P<acces>[a-z]+)$', views.list_photos, name='list_photos_acces'),
    
]
