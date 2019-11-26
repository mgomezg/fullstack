
from bs4 import BeautifulSoup
import requests
from ..base.models import Book, Category


class Scraper:

    def __init__(self, basePath, actualPath): # RECIBE LA URL PRINCIPAL DEL SITIO
        
        self.basePath = basePath
        self.actualPath = actualPath

        # get BeautifulSoup Instance for aux
        main_BSHtml = self.getBSHtml(basePath+actualPath)

        # get categories from the page
        categoriesContainer = main_BSHtml.find(class_="side_categories")
        #self.getCategories(categoriesContainer)

        print('-----')

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
        print(book.get('href').strip())
    
    # Save category in BD
    def saveCategory(self, category):
        print(category.get_text().strip())



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
            print('next page:',nextPageUrl)
            nextBSHtml = self.getBSHtml(nextPageUrl)
            self.getBooksRecursively(nextBSHtml)
