from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^photos/(?P<photo_id>[0-9a-zA-Z._]+)(/.*)?$', views.photo, name='photo'),
]
