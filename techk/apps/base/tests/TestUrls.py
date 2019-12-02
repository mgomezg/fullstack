from django.urls import reverse, resolve
import requests
import json


class TestUrls:

    def test_home_api_url(self):
        response = requests.get('http://localhost:8000/')
        assert response.status_code == 200

    def test_get_books_api_url(self):
        response = requests.get('http://localhost:8000/api/books')
        assert response.status_code == 200

    def test_get_books_api_json_url(self):
        response = requests.get('http://localhost:8000/api/books?format=json')
        assert response.status_code == 200 and json.loads(response.text)

    def test_get_categories_api_url(self):
        response = requests.get('http://localhost:8000/api/categories')
        assert response.status_code == 200

    def test_get_categories_api_json_url(self):
        response = requests.get('http://localhost:8000/api/categories?format=json')
        assert response.status_code == 200 and json.loads(response.text)
