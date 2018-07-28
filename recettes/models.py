# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

ACCES = (
    ('PUB', 'public'),
    ('PRIV', 'privé')
)


class Photo(models.Model):
    DEFAULT_PK = 1
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_DEFAULT, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    photo = models.ImageField(default='blank.png')
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB", null=False)
    thumbnail = models.BinaryField(null=True, blank=True)
    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    def get_absolute_url(self):
        return "/mesrecettes/photos/{}".format(self.photo.name)
    def __unicode__(self):
        return "%s-%s" % (self.code, self.description)
    class Meta:
        unique_together = (("owner", "code"),)

class Categorie(models.Model):
    GROUPE = (
        ('REC', 'recettes'),
        ('ING', 'ingrédients'),
        ('PREP', 'préparations'),
        ('MAT', 'matériel'),
        ('SANS', 'non affecté'),
    )

    DEFAULT_PK = 1
    categorie = models.CharField(max_length=10, null=False, blank=False)
    groupe = models.CharField(max_length=10, choices=GROUPE, default="ING", null=False)
    description = models.CharField(max_length=40)
    
    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_DEFAULT, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    class Meta:
        unique_together = (("owner", "categorie", "groupe"),)

    def __unicode__(self):
        return "%s" % (self.description)


    
class Ingredient(models.Model):
    code = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    bonasavoir = models.TextField(max_length=5000, default='', blank=True)
    pu = models.DecimalField(default=0, max_digits=6, decimal_places=2)
    pp = models.DecimalField(default=100, max_digits=6, decimal_places=0)
    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_DEFAULT, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")
    
    # ancien champ
    calorie = models.IntegerField(default=0)

    # nouveaux champs
    kcalories = models.IntegerField("Kilo calories", default=0)
    kjoules = models.IntegerField("Kilo joules", default=0);

    # détail de la composition de l'ingeédient
    # xx_inferieures indique valeur très faible non mesurable

    matieres_grasses_inferieures  = models.BooleanField(default=False)
    matieres_grasses = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    matieres_grasses_saturees = models.DecimalField("Dont acides gras saturés", max_digits=7, decimal_places=2, default=0)

    glucides_inferieures = models.BooleanField(default=False)
    glucides = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    glucides_dont_sucres = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    fibres_alimentaires_inferieures = models.BooleanField(default=False)
    fibres_alimentaires = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    proteines_inferieures = models.BooleanField(default=False)
    proteines = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    sel_inferieur = models.BooleanField(default=False)
    sel = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    
    #pas de default quand on ajoute un champ a Photo
    photo = models.ForeignKey('Photo', on_delete=models.SET_NULL, null=True,)
    #photo = models.ForeignKey('Photo', default=Photo.objects.get(code='blank').id)
    allergene = models.BooleanField(default=False)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = (("owner", "code"),)
    
    
    def __unicode__(self):
        return self.description 

class Element(models.Model):
    quantite = models.DecimalField(default=0, max_digits=6, decimal_places=2)
    ingredient = models.ForeignKey(Ingredient)
    preparation = models.ForeignKey('Preparation', related_name='elements')

    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    def __unicode__(self):
        return "%s %s" % (self.ingredient.code,self.quantite)

class EtapePreparation(models.Model):
    preparation = models.ForeignKey('Preparation', related_name='etapes')
    titre =  models.CharField(max_length=200, default='')
    description = models.TextField(max_length=5000, default='')

    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    def __unicode__(self):
        return self.titre

class Preparation(models.Model):
    code = models.CharField(max_length=50)
    titre =  models.CharField(max_length=200, default='')
    description = models.CharField(max_length=200, default='')
    bonasavoir = models.TextField(max_length=5000, default='', blank=True)
    #pas de default quand on ajoute un champ a Photo
    photo = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True)
    #photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)

    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("owner", "code"),)
    
    def __unicode__(self):
        return self.description 

class PreparationRecette(models.Model):
    quantite = models.IntegerField(default=100)
    preparation = models.ForeignKey(Preparation)
    recette = models.ForeignKey('Recette', related_name='preparations')

    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")
    
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    
    def __unicode__(self):
        return "{}".format(self.preparation.code)

class EtapeRecette(models.Model):
    recette = models.ForeignKey('Recette', related_name='etapes')
    titre =  models.CharField(max_length=200, default='')
    description = models.TextField(max_length=5000, default='')

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")
    
    def __unicode__(self):
        return self.titre

class Recette(models.Model):
    code = models.CharField(max_length=50)
    titre = models.CharField(max_length=200)
    description = models.TextField(max_length=5000, default='')
    bonasavoir = models.TextField(max_length=5000, default='', blank=True)
    difficulte = models.IntegerField(default=0)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, blank=True)
    portion = models.IntegerField(default=1)

    #pas de default quand on ajoute un champ a Photo
    photo = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True)
    #photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)

    owner = models.ForeignKey(get_user_model() , on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    
    def image_tag(self):
        from django.utils.html import format_html
        return '<img width=200 height=200 src="/recettes/{}" />'.format(self.photo.url)

    image_tag.short_description = 'Image'
    image_tag.allow_tags = True

    class Meta:
        unique_together = (("owner", "code"),)
    
    def __unicode__(self):
        return "{}-{}".format(self.code, self.description)
