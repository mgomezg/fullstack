from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *
from .Scraper import Scraper


def begin(request):
    try:
        workers = 2 # for Pool Processes
        scraper = Scraper("http://books.toscrape.com/catalogue/","page-1.html", workers)
        response_data = {
            'status' : 'ok'
        }
        return JsonResponse(response_data)
    except Exception as e:
        response_data = {
            'status' : 'error',
            'exception': str(e),
        }
        return JsonResponse(response_data)

# Create your views here.
class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
