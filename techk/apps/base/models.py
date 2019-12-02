from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=40, null=False, unique=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=120, null=False)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.FloatField(null=False)
    stock = models.IntegerField(null=False)
    upc = models.CharField(max_length=20, null=False)
    thumbnail = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title