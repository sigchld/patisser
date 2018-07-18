from django.conf.urls import include, url
from django.conf import settings
from . import views
from django.contrib import admin
from django.contrib.auth import urls


admin.autodiscover()

#handler400 = views.bad_request_view
#handler403 = views.permission_denied_view
#handler500 = views.error_view
#handler404 = views.page_not_found_view

urlpatterns = [
    # Examples:
    #
    # plus utile, traite dans une vue specifique
    #url('^mesrecettes/', include('django.contrib.auth.urls')),
    url(r'^$', views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^mesrecettes/', include('recettes.urls')),
]

