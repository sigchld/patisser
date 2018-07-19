from django.conf.urls import url
from django.views.generic import TemplateView

from . import views
from . import photoview

urlpatterns = [
    #url(r'^about/$', TemplateView.as_view(template_name="index.html")),
    url(r'^about/$', photoview.PhotoView.as_view()),
    url(r'^$', views.index, name='index'),

    url(r'^login/$', views.my_login, name='login'),
    url(r'^logout/$', views.my_logout, name='logout'),

    url(r'^search$', views.search, name='search'),    

    url(r'^photos/$', photoview.PhotoView.as_view(), name='photo_create'),
    url(r'^photos/$', photoview.PhotoView.as_view(), name='photo_update'),
    url(r'^photos/(?P<photo_id>[0-9a-zA-Z._ -]+)$', photoview.PhotoView.as_view(), name='photo'),

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
