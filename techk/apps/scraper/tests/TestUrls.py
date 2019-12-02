from django.urls import reverse, resolve
import requests
import json


class TestUrls:

    def test_get_logs_api_url(self):
        response = requests.get('http://localhost:8000/api/logs')
        assert response.status_code == 200

    def test_get_logs_api_json_url(self):
        response = requests.get('http://localhost:8000/api/logs?format=json')
        assert response.status_code == 200 and json.loads(response.text)

    def test_get_home_page_to_scrap_url(self):
        response = requests.get('http://books.toscrape.com/catalogue/page-1.html')
        assert response.status_code == 200
