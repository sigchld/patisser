from django.http import HttpResponse
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext, loader
from django.shortcuts import render

def index(request):
    #response = render_to_response('index.html', {}, context_instance=RequestContext(request))
    response = render(request, 'index.html', {})
    response.status_code = 200
    return response

def bad_request_view(request):
    #response = render_to_response('error.html', {}, context_instance=RequestContext(request))
    response = render(request, 'error.html', {})
    response.status_code = 400
    return response

def page_not_found_view(request):
    #response = render_to_response('error.html', {}, context_instance=RequestContext(request))
    response = render(request, 'error.html', {})
    response.status_code = 404
    return response


def error_view(request):
    #response = render_to_response('error.html', {}, context_instance=RequestContext(request))
    response = render(request, 'error.html', {})
    response.status_code = 500
    return response

def permission_denied_view(request):
    #response = render_to_response('error.html', {}, context_instance=RequestContext(request))
    response = render(request, 'error.html', {})
    response.status_code = 500
    return response


