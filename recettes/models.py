# -*- coding: utf-8 -*-
"""
Toutes les classes des différents objets qui seront persistés en BD
"""

from __future__ import unicode_literals

import json
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.core.serializers.json import DjangoJSONEncoder

ACCES = (
    ('PUB', 'public'),
    ('PRIV', 'privé')
)


class Photo(models.Model):
    """
    Stockage des images qui sont associées aux recettes préparations et ingrédients
    """
    DEFAULT_PK = 1
    code = models.CharField(max_length=50, blank=False)
    description = models.CharField(max_length=200)
    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_DEFAULT, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    photo = models.ImageField(default='blank.png')
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB", null=False)
    thumbnail = models.BinaryField(null=True, blank=True)
    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        return "/mesrecettes/photos/{}".format(self.photo.name)

    def __unicode__(self):
        return "{}-{}".format(self.code, self.description)

    def __repr__(self):
        return "{}-{}".format(self.code, self.description)

    def __str__(self):
        return "{}-{}".format(self.code, self.description)

    class Meta:
        unique_together = (("owner", "code"),)


class Categorie(models.Model):
    """
    Regroupement des photos recettes préparations et ingredients
    """
    GROUPE = (
        ('REC', 'recettes'),
        ('ING', 'ingrédients'),
        ('PREP', 'préparations'),
        ('MAT', 'matériel'),
        ('SANS', 'non affecté'),)

    DEFAULT_PK = 1
    categorie = models.CharField(max_length=10, null=False, blank=False)
    groupe = models.CharField(max_length=10, choices=GROUPE, default="SANS", null=False)
    description = models.CharField(max_length=40)

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_DEFAULT, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    class Meta:
        unique_together = (("owner", "categorie", "groupe"),)

    def __unicode__(self):
        return "%s" % (self.description)


class Ingredient(models.Model):
    """
    Ingrédient, la base, kcalorie pu ...
    """
    code = models.CharField(max_length=50, blank=False, null=False)
    description = models.CharField(max_length=200)
    bonasavoir = models.TextField(max_length=5000, default='', blank=True)
    pu = models.DecimalField(default=0, max_digits=6, decimal_places=2)
    pp = models.DecimalField(default=100, max_digits=6, decimal_places=0)
    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_DEFAULT, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")

    # ancien champ
    calorie = models.IntegerField(default=0)

    # nouveaux champs
    kcalories = models.IntegerField("Kilo calories", default=0)
    kjoules = models.IntegerField("Kilo joules", default=0)

    # détail de la composition de l'ingeédient
    # xx_inferieures indique valeur très faible non mesurable

    matieres_grasses_inferieures = models.BooleanField(default=False)
    matieres_grasses = models.DecimalField(max_digits=7, decimal_places=3, default=0)
    matieres_grasses_saturees = models.DecimalField("Dont acides gras saturés", max_digits=7, decimal_places=3, default=0)

    glucides_inferieures = models.BooleanField(default=False)
    glucides = models.DecimalField(max_digits=7, decimal_places=3, default=0)
    glucides_dont_sucres = models.DecimalField(max_digits=7, decimal_places=3, default=0)

    fibres_alimentaires_inferieures = models.BooleanField(default=False)
    fibres_alimentaires = models.DecimalField(max_digits=7, decimal_places=3, default=0)

    proteines_inferieures = models.BooleanField(default=False)
    proteines = models.DecimalField(max_digits=7, decimal_places=3, default=0)

    sel_inferieur = models.BooleanField(default=False)
    sel = models.DecimalField(max_digits=7, decimal_places=3, default=0)

    #pas de default quand on ajoute un champ a Photo
    photo = models.ForeignKey('Photo', on_delete=models.SET_NULL, null=True, blank=True)
    #photo = models.ForeignKey('Photo', default=Photo.objects.get(code='blank').id)
    allergene = models.BooleanField(default=False)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)

    def to_json(self):
        valeurs = {}
        valeurs['id'] = self.id
        valeurs['description'] = self.description
        valeurs['code'] = self.code
        valeurs['sel'] = self.sel
        valeurs['proteines'] = self.proteines
        valeurs['fibres_alimentaires'] = self.fibres_alimentaires
        valeurs['glucides'] = self.glucides
        valeurs['glucides_dont_sucres'] = self.glucides_dont_sucres
        valeurs['matieres_grasses'] = self.matieres_grasses
        valeurs['matieres_grasses_saturees'] = self.matieres_grasses_saturees
        valeurs['kcalories'] = self.kcalories
        valeurs['kjoules'] = self.kjoules
        
        return json.dumps(valeurs, cls=DjangoJSONEncoder)
    
    
    class Meta:
        unique_together = (("owner", "code"),)

    def __unicode__(self):
        return self.description

class Element(models.Model):
    """
    Ingrédients nécessaires á la réalisation d'une préparation
    """
    quantite = models.DecimalField(default=0, max_digits=6, decimal_places=2)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.SET_NULL, null=True)
    preparation = models.ForeignKey('Preparation', related_name='elements')

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def to_json(self):
        valeurs = {}
        valeurs['element_id'] = self.id;
        valeurs['preparation_id'] = self.preparation.id
        valeurs['ingredient_id'] = self.ingredient.id
        valeurs['description'] = self.ingredient.description
        valeurs['code'] = self.ingredient.code
        valeurs['quantite'] = self.quantite
        return json.dumps(valeurs, cls=DjangoJSONEncoder)

    def __unicode__(self):
        return "%s %s" % (self.ingredient.code, self.quantite)

class BasePreparation(models.Model):
    """
    Autres préparations nécessaires á la réalisation d'une préparation
    Par exemple la crème pâtissière utilisée pour une creme diplomate
    """
    quantite = models.IntegerField(default=100)
    base = models.ForeignKey('Preparation', on_delete=models.SET_NULL, null=True)
    preparation = models.ForeignKey('Preparation', related_name='bases')

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "{}".format(self.preparation.code)


    def to_json(self):
        valeurs = {}
        valeurs['base_id'] = self.id;
        valeurs['preparation_id'] = self.preparation.id
        valeurs['base_preparation_id'] = self.base.id
        valeurs['quantite'] = self.quantite
        valeurs['description'] = self.base.description
        valeurs['code'] = self.base.code
        return json.dumps(valeurs, cls=DjangoJSONEncoder)
    
class EtapePreparation(models.Model):
    """
    Étapes de réalisation d'une préparation
    """
    preparation = models.ForeignKey('Preparation', related_name='etapes')
    nom = models.CharField(max_length=200, default='')
    description = models.TextField(max_length=5000, default='')
    ordre = models.IntegerField(default=0)
    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def to_json(self):
        valeurs = {}
        valeurs['etape_id'] = self.id;
        valeurs['preparation_id'] = self.preparation.id
        valeurs['description'] = self.description
        valeurs['nom'] = self.nom
        valeurs['ordre'] = self.ordre
        return json.dumps(valeurs, cls=DjangoJSONEncoder)
    
    def __unicode__(self):
        return self.nom

class Preparation(models.Model):
    """
    Préparation composée d'ingrédients
    TODO: et d'autres préparations i.e. crème au beure á base de meringue
    """
    code = models.CharField(max_length=50, blank=False)
    nom = models.CharField(max_length=200, default='')
    description = models.CharField(max_length=200, default='')
    bonasavoir = models.TextField(max_length=5000, default='', blank=True)
    #pas de default quand on ajoute un champ a Photo
    photo = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True)
    #photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("owner", "code"),)

    def __unicode__(self):
        return self.description

    def to_json(self):
        valeurs = {}
        valeurs['preparation_id'] = self.id
        valeurs['code'] = self.code
        valeurs['description'] = self.description
        valeurs['bonasavoir'] = self.bonasavoir
        valeurs['owner'] = self.owner.username
        valeurs['acces'] = self.acces
        valeurs['categorie'] = self.categorie.categorie
        valeurs['categorie_description'] = self.categorie.description
        valeurs['groupe'] = self.categorie.groupe
        return json.dumps(valeurs, cls=DjangoJSONEncoder)

class PreparationRecette(models.Model):
    """
    Association des Préparation à une recette
    """
    quantite = models.IntegerField(default=100)
    preparation = models.ForeignKey(Preparation)
    recette = models.ForeignKey('Recette', related_name='preparations')

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "{}".format(self.preparation.code)

class EtapeRecette(models.Model):
    """
    Les étapes de réalisation d'une recette
    """
    recette = models.ForeignKey('Recette', related_name='etapes')
    nom = models.CharField(max_length=200, default='')
    description = models.TextField(max_length=5000, default='')

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PRIV")

    def __unicode__(self):
        return self.nom

class Recette(models.Model):
    """
    Recette, composés de préparations et détapes de réalisation
    TODO: et pourquoi pas d'ingrédients supplémentaires
    """
    code = models.CharField(max_length=50, blank=False)
    nom = models.CharField(max_length=200)
    description = models.TextField(max_length=5000, default='')
    bonasavoir = models.TextField(max_length=5000, default='', blank=True)
    difficulte = models.IntegerField(default=0)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, blank=True)
    portion = models.IntegerField(default=1)

    #pas de default quand on ajoute un champ a Photo
    photo = models.ForeignKey(Photo, on_delete=models.SET_NULL, null=True)
    #photo = models.ForeignKey(Photo, default=Photo.objects.get(code='blank').id)

    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, to_field='username', default=User.objects.get(username='anonyme').username)
    acces = models.CharField(max_length=4, choices=ACCES, default="PUB")

    categorie = models.ForeignKey('Categorie', on_delete=models.SET_NULL, null=True, blank=True)

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
