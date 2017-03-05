from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^photos/(?P<photo_id>[0-9a-zA-Z._-]+)(/.*)?$', views.photo, name='photo'),
    url(r'^listr$', views.list_recettes, name='list'),
    url(r'^detailr/(?P<recette_id>[0-9]+)$', views.detail_recette, name='detail'),
    url(r'^listi$', views.list_ingredients, name='list'),
    url(r'^detaili/(?P<recette_id>[0-9]+)$', views.detail_ingredient, name='detail'),    
]
