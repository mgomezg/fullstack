from django.http import HttpResponse
from ..scraper.Scraper import Scraper

def index(request):
    scraper = Scraper("http://books.toscrape.com/catalogue/","page-50.html")
    return HttpResponse('Getting Books and Categories')