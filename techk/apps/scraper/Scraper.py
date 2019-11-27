from bs4 import BeautifulSoup
import requests
from ..base.models import Book, Category
import re


class Scraper:

    def __init__(self, basePath, actualPath):
        
        self.basePath = basePath
        self.actualPath = actualPath

        # get BeautifulSoup Instance for aux
        main_BSHtml = self.getBSHtml(basePath+actualPath)

        # get categories from the page
        categoriesContainer = main_BSHtml.find(class_="side_categories")
        self.getCategories(categoriesContainer)

        self.getBooksRecursively(main_BSHtml)

    def getBSHtml(self, url): # Convierte el HTML obtenido en una instancia de BeautifulSoup
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
        except:
            return None

    # Get book information and save it in BD
    def saveBook(self, book):
        bookURL = self.basePath + book.get('href').strip()
        BSHtml = self.getBSHtml(bookURL)


        # try to get category name
        try:
            breadcrum = BSHtml.find(class_='breadcrumb')
            category_name = breadcrum.select('li > a')[2].get_text()
        except:
            category_name = "Default"

        # try to get title
        try:
            title = BSHtml.select('.product_main > h1')[0].get_text()
        except:
            title = "notitle"

        # try to get thumbnail
        try:
            thumbnail = BSHtml.select('#product_gallery .thumbnail img')[0].get('src')
        except:
            thumbnail = "noimage"

        # try to get price
        try:
            price = BSHtml.select('.product_main > .price_color')[0].get_text()
            price = float(price[2:-1])
        except:
            price = 0

        # try to get stock available
        try:
            stock = BSHtml.select('.product_main > .instock')[0].get_text().strip()
            stock = re.findall(r'\d+', stock)
            stock = stock[0]
        except:
            stock = 0

        # try to get description 
        try:
            description = BSHtml.select('#product_description')[0].findNext('p').get_text()
        except:
            description = "Sin descripción"

        # try to get UPC
        try:
            upc = BSHtml.find('th', text='UPC').findNext('td').get_text()
        except:
            upc = "NaN"
        
        # get category
        try:
            category = Category.objects.get(name=category_name)
        except:
            category = None
            print('Sin categoria')

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
            print('Se agregó el libro:', newBook.title)
        except Exception as e:
            print('No fue posible crear el libro:',str(e))

    
    # Save category in BD
    def saveCategory(self, category):
        try:
            newCategory = Category()
            newCategory.name = category.get_text().strip()
            newCategory.save()
            print('Se agregó la categoría:',newCategory.name)
        except Exception as e:
            print('No fue posible crear la categoría:', str(e))
            

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