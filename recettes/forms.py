# -*- coding: utf-8 -*-

from django import forms

from .models import Photo
from .models import Ingredient

class PhotoForm(forms.ModelForm):
    groupe = forms.CharField(label='groupe', max_length=20)
    categorie = forms.CharField(label='categorie', max_length=20)
    class Meta:
        model = Photo
        fields = ['code', 'description', 'acces', 'photo']

class IngredientForm(forms.ModelForm):
    #groupe = forms.CharField(label='groupe', max_length=20)
    #categorie = forms.CharField(label='categorie', max_length=20)
    class Meta:
        model = Ingredient
        fields = ['code',
                  'description',
                  'bonasavoir',
                  'pu',
                  'pp']
