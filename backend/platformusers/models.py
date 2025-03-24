from django.db import models

# Create your models here.

class PlatformUsers(models.Model):
    
    uuid = models.UUIDField(unique=True, auto_created=True)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    token = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.username