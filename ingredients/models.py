from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Photo(models.Model):
    DEFAULT_PK = 1
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    photo = models.ImageField(upload_to='photos',default='blank.png')
    def get_absolute_url(self):
        return "/recettes/{}".format(self.photo.name)
    def __unicode__(self):
        return "%s-%s" % (self.code, self.description)

class Categorie(models.Model):
    DEFAULT_PK = 1
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    def __unicode__(self):
        return "%s" % (self.description)

class Ingredient(models.Model):
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    pu = models.DecimalField(default=0, max_digits=6, decimal_places=2)
    calorie = models.DecimalField(default=0, max_digits=9, decimal_places=4)
    photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)
    allergene = models.BooleanField(default=False)

    def __unicode__(self):
        return self.description 

class Element(models.Model):
    quantite = models.DecimalField(default=0, max_digits=6, decimal_places=2)
    ingredient = models.ForeignKey(Ingredient)
    preparation = models.ForeignKey('Preparation', related_name='elements')
    def __unicode__(self):
        return "%s %s" % (self.ingredient.code,self.quantite)

class EtapePreparation(models.Model):
    preparation = models.ForeignKey('Preparation', related_name='etapes')
    titre =  models.CharField(max_length=200, default='')
    description = models.TextField(max_length=5000)
    def __unicode__(self):
        return self.titre


class Preparation(models.Model):
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)
    def __unicode__(self):
        return self.description 

class PreparationRecette(models.Model):
    quantite = models.IntegerField(default=100)
    preparation = models.ForeignKey(Preparation)
    recette = models.ForeignKey('Recette', related_name='preparations')
    def __unicode__(self):
        return "{}".format(self.preparation.code)

class EtapeRecette(models.Model):
    recette = models.ForeignKey('Recette', related_name='etapes')
    titre =  models.CharField(max_length=200, default='')
    description = models.TextField(max_length=5000)
    def __unicode__(self):
        return self.titre

class Recette(models.Model):
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    difficulte = models.IntegerField(default=0)
    categorie = models.ForeignKey(Categorie, default=Categorie.DEFAULT_PK)
    portion = models.IntegerField(default=1)
    photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)

    def image_tag(self):
        from django.utils.html import format_html
        return '<img width=200 height=200 src="/recettes/{}" />'.format(self.photo.url)
    image_tag.short_description = 'Image'
    image_tag.allow_tags = True

    def __unicode__(self):
        return "{}-{}".format(self.code, self.description)
