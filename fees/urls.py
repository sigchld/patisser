from django.conf.urls import include, url
from django.conf import settings
from . import views
from django.contrib import admin

admin.autodiscover()

handler400 = views.bad_request_view
handler403 = views.permission_denied_view
handler500 = views.error_view
handler404 = views.page_not_found_view

urlpatterns = [
    # Examples:
    url(r'^$', views.index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    #url(r'^term/',   include('term.urls')),
    #url(r'^cumuls/',   include('cumuls.urls')),
    #url(r'^oppo/',   include('oppotota.urls')),
    #url(r'^sessions/',   include('sessionsbis.urls')),
    #url(r'^adm/',   include('adm.urls')),

    #url(r'^paystore$', views.index, name='index'),
    #url(r'^paystore/term/',   include('term.urls')),
    #url(r'^paystore/cumuls/',   include('cumuls.urls')),
    #url(r'^paystore/oppo/',   include('oppotota.urls')),
    #url(r'^paystore/sessions/',   include('sessionsbis.urls')),
    #url(r'^paystore/adm/',   include('adm.urls')),
]











