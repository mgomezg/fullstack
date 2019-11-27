from bs4 import BeautifulSoup
from .models import Log
from django.db import IntegrityError
from ..base.models import Book, Category
import requests
import re

class Scraper:

    def __init__(self, basePath, actualPath):
        
        self.createLog('__init__', 'Begin Scraper.py', 'Flag')

        self.basePath = basePath
        self.actualPath = actualPath

        # get BeautifulSoup Instance for aux
        main_BSHtml = self.getBSHtml(basePath+actualPath)

        # get categories from the page
        categoriesContainer = main_BSHtml.find(class_="side_categories")
        self.getCategories(categoriesContainer)

        # get books in all pages
        self.getBooksRecursively(main_BSHtml)

        self.createLog('__init__', 'Finish Scraper.py', 'Flag')

    def getBSHtml(self, url): # get new instance of BeautifulSoup from url
        html = requests.get(url).text
        return BeautifulSoup(html, 'html.parser')

    def getCategories(self, categoriesContainer):
        categories = categoriesContainer.find_all('a')
        for category in categories:
            self.saveCategory(category)

    def getBooks(self, booksActicle):
        books = booksActicle.select('article > h3 > a')
        for book in books:
            self.saveBook(book)
    
    def getNextPage(self, pagerContainer):
        nextPage = pagerContainer.select('.next > a')
        try:
            return nextPage[0].get('href')
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getNextPage', str(e) , 'Exception')
            return None

    # Get book information and save it in BD
    def saveBook(self, book):
        bookURL = self.basePath + book.get('href').strip()
        BSHtml = self.getBSHtml(bookURL)


        # try to get category name - REQUIRED (if has exception, it won't save this book)
        try:
            breadcrum = BSHtml.find(class_='breadcrumb')
            category_name = breadcrum.select('li > a')[2].get_text()
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getCategoryName', str(e) , 'Exception')
            return False

        # try to get title - REQUIRED (if has exception, it won't save this book)
        try:
            title = BSHtml.select('.product_main > h1')[0].get_text()
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getTitle', str(e) , 'Exception')
            return False


        # try to get price - REQUIRED (if has exception, it won't save this book)
        try:
            price = BSHtml.select('.product_main > .price_color')[0].get_text()
            price = float(price[2:-1])
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getPrice', str(e) , 'Exception')
            return False

        # try to get UPC - REQUIRED (if has exception, it won't save this book)
        try:
            upc = BSHtml.find('th', text='UPC').findNext('td').get_text()
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getUPC', str(e) , 'Exception')
            return False
        
        # get category - REQUIRED (if has exception, it won't save this book)
        try:
            category = Category.objects.get(name=category_name)
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getCategory', str(e) , 'Exception')
            return False

        # try to get thumbnail
        try:
            thumbnail = BSHtml.select('#product_gallery .thumbnail img')[0].get('src')
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getThumbnail', str(e) , 'Exception')
            thumbnail = "noimage"

        # try to get stock available
        try:
            stock = BSHtml.select('.product_main > .instock')[0].get_text().strip()
            stock = re.findall(r'\d+', stock)
            stock = stock[0]
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getStock', str(e) , 'Exception')
            stock = 0

        # try to get description 
        try:
            description = BSHtml.select('#product_description')[0].findNext('p').get_text()
        except (IndexError, AttributeError, TypeError) as e:
            self.createLog('getDescription', str(e) , 'Exception')
            description = "Sin descripción"

        # Save book
        try:
            newBook = Book()
            newBook.title = title
            newBook.category = category
            newBook.thumbnail = thumbnail
            newBook.price = price
            newBook.stock = stock
            newBook.description = description
            newBook.upc = upc
            newBook.save()
            self.createLog('createBook', 'Se agregó el libro: '+ newBook.title , 'Log')
        except IntegrityError as e:
            self.createLog('createBook', 'No fue posible crear el libro: ' + title + '. ' +str(e) , 'Exception')

    
    # Save category in BD
    def saveCategory(self, category):
        try:
            newCategory = Category()
            newCategory.name = category.get_text().strip()
            newCategory.save()
            self.createLog('createCategory', 'Se agregó la categoría: '+ newCategory.name , 'Log')
        except IntegrityError as e:
            self.createLog('createCategory', 'No fue posible crear la categoría: ' + category.get_text().strip() + '. ' +str(e) , 'Exception')
            

    def getBooksRecursively(self, BSHtml):

        # get books from the page
        bookActicles = BSHtml.find('ol', class_='row')
        self.getBooks(bookActicles)

        # get next page if exist
        pagerContainer = BSHtml.find(class_='pager')
        nextPage = self.getNextPage(pagerContainer)

        # if exist next page, bring books from next page
        if nextPage:
            nextPageUrl = self.basePath+nextPage
            nextBSHtml = self.getBSHtml(nextPageUrl)
            self.getBooksRecursively(nextBSHtml)
    
    def createLog(self, pos, message, logType):
        log = Log()
        log.pos = pos
        log.message = message 
        log.log_type = logType
        log.save()