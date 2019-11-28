from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import *
from .models import *
from .Scraper import Scraper


def begin(request):
    try:
        scraper = Scraper("http://books.toscrape.com/catalogue/","page-50.html")
        return JsonResponse('[{"status":"ok"}]', safe=False)
    except Exception as e:
        return JsonResponse('[{"status":"error", "exception":'+str(e)+'}]', safe=False)

# Create your views here.
class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer