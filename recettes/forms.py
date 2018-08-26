# -*- coding: utf-8 -*-

from django import forms

from .models import Photo
from .models import Ingredient
from .models import Preparation
from .models import Recette

class PhotoForm(forms.ModelForm):
    groupe = forms.CharField(label='groupe', max_length=20)
    categorie = forms.CharField(label='categorie', max_length=20)
    class Meta:
        model = Photo
        fields = ['code', 'description', 'acces', 'photo']

class IngredientForm(forms.ModelForm):
    """
    Donnés formulaire saisie d'un ingredient
    """
    class Meta:
        model = Ingredient
        fields = ['id',
                  'code',
                  'description',
                  'bonasavoir',
                  'pu',
                  'pp',
                  'kcalories',
                  'kjoules',
                  'matieres_grasses',
                  'matieres_grasses_saturees',
                  'glucides',
                  'glucides_dont_sucres',
                  'proteines',
                  'sel',
                  'fibres_alimentaires',
                  'allergene',
                  'acces',]

class PreparationForm(forms.ModelForm):
    """
    Données du formulaire
    """
    class Meta:
        model = Preparation
        fields = ['id',
                  'code',
                  'description',
                  'bonasavoir',
                  'acces',]

class RecetteForm(forms.ModelForm):
    """
    Données du formulaire
    """
    class Meta:
        model = Recette
        fields = ['id',
                  'code',
                  'description',
                  'bonasavoir',
                  'acces',]
