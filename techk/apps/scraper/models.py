# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Log(models.Model):
    pos = models.CharField(null=False, max_length=50)
    message = models.TextField(null=False)
    log_type = models.CharField(null=False, max_length=50)
    create_at = models.DateField(auto_now=True)