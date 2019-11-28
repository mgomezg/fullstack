from django.http import HttpResponse
from ..scraper.Scraper import Scraper
from rest_framework import viewsets
from .serializers import *
from .models import *

def index(request):
    scraper = Scraper("http://books.toscrape.com/catalogue/","page-50.html")
    return HttpResponse('Getting Books and Categories')
    
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer