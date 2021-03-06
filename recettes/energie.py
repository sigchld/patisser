# -*- coding: utf-8 -*-
"""
Calculs du prix de revient
et des calories contenu dans une
préparation une recette
"""
import json
import logging

from decimal import Decimal, getcontext

from models import Ingredient
from models import Preparation
from models import Element

# Get an instance of a logger
LOGGER = logging.getLogger('fees')


def getDict(elements):
    LOGGER.debug(u"....................................................getdict {}".format(elements))
    res = {}
    for elem in elements:
        res[elem['id']] = elem
    return res

def addIng(ing1, ing2) :

    res = {}
    for key in ing1.keys():
        res[key] = add(ing1[key], ing2[key])
        LOGGER.debug(u"....................................................ing1 {} + ing2 {} = {}".format(ing1, ing2, res))
    return res

def addDict(dict1, dict2):
    res = []
    for key in dict1.keys():
        ing1 = dict1.get(key, None)
        ing2 = dict2.get(key, None)
        if ing2 is None:
            res.append(ing1)
        else:
            res.append(addIng(ing1, ing2))
            del dict2[key]

    for key in dict2.keys():
        ing1 = dict1.get(key, None)
        ing2 = dict2.get(key, None)
        if ing1 is None:
            res.append(ing2)
        else:
            res.append(addIng(ing1, ing2))

    LOGGER.debug(u"....................................................d1 {} + d2 {} = {}".format(dict1, dict2, res))
    return res

def add(vals1, vals2):
    LOGGER.debug(u"....................................................vals1 {}".format(vals1))
    LOGGER.debug(u"....................................................vals2 {}".format(vals2))
    
    if vals1 == []:
        return vals2
    if vals2 == []:
        return vals1

    if type(vals1) == tuple:
        result = []
        for var in range(len(vals1)):
            val1 = vals1[var]
            val2 = vals2[var]
            result.append(add(val1, val2))
        return tuple(result)
    elif type(vals1) in (int, Decimal, float):
        return vals1+vals2
    elif type(vals1) == bool:
        return vals1 or vals2
    elif type(vals1) == list:
        LOGGER.debug(u"....................................................getdict vals1 {}".format(vals1))
        dict1 = getDict(vals1)
        LOGGER.debug(u".................................................... vals2 {}".format(vals2))
        dict2 = getDict(vals2)
        return addDict(dict1, dict2)
    elif type(vals1) == str and type(vals2) == str:
        return vals1
    elif type(vals1) == unicode and type(vals2) == unicode:
        return vals1
    else:
        LOGGER.debug(u"/////////////////////////////////++++++++++++++++++type {}++++++++++++++++++\\\\\\\\\\\\\\\\\\\\".format(type(vals1)))



def calcul_ingredients(preparation):
    """
    Valeur nutritionnelle et prix d'une préparation et ses bases
    """
    LOGGER.debug(u"/////////////////////////////////++++++++++++++++++preparation calcul_ingredient preparation {}++++++++++++++++++\\\\\\\\\\\\\\\\\\\\".format(preparation.id))
    getcontext().prec = 4
    ingredients = {}
    allergene = False
    kcalories_total = Decimal(0)
    kjoules_total = Decimal(0)
    matieres_grasses_total = Decimal(0)
    matieres_grasses_saturees_total = Decimal(0)
    glucides_total = Decimal(0)
    glucides_dont_sucres_total = Decimal(0)
    fibres_alimentaires_total = Decimal(0)
    proteines_total = Decimal(0)
    sel_total = Decimal(0)

    cout_total = Decimal(0)

    for element in preparation.elements.all():
        ingredient = element.ingredient
        allergene = allergene or ingredient.allergene
        LOGGER.debug(u"/////////////////////////////////++++++++++++++++++preparation calcul_ingredient {}++++++++++++++++++\\\\\\\\\\\\\\\\\\\\".format(ingredient.id))
        # pour chaque ingrédient
        cout = ((element.quantite * ingredient.pu)/Decimal(ingredient.pp))
        kjoules = (((element.quantite)/Decimal(100)) * ingredient.kjoules)
        kcalories = (((element.quantite)/Decimal(100)) * ingredient.kcalories)
        matieres_grasses = (((element.quantite)/Decimal(100)) * ingredient.matieres_grasses)
        glucides = (((element.quantite)/Decimal(100)) * ingredient.glucides)
        glucides_dont_sucres = (((element.quantite)/Decimal(100)) * ingredient.glucides_dont_sucres)
        matieres_grasses_saturees = (((element.quantite)/Decimal(100)) * ingredient.matieres_grasses_saturees)
        fibres_alimentaires = (((element.quantite)/Decimal(100)) * ingredient.fibres_alimentaires)
        proteines = (((element.quantite)/Decimal(100)) * ingredient.proteines)
        sel = (((element.quantite)/Decimal(100)) * ingredient.sel)

        # totaux pour la préparation
        cout_total += cout
        kjoules_total += kjoules
        kcalories_total += kcalories
        matieres_grasses_total += matieres_grasses
        matieres_grasses_saturees_total += matieres_grasses_saturees
        glucides_total += glucides
        glucides_dont_sucres_total += glucides_dont_sucres
        fibres_alimentaires_total += fibres_alimentaires
        proteines_total += proteines
        sel_total += sel

        tmp = ingredients.get(ingredient.id)
        if tmp is None:
            tmp = {}
            tmp['quantite'] = Decimal(0)
            #tmp['kjoules'] = Decimal(0)
            #tmp['kcalories'] = Decimal(0)
            #tmp['matieres_grasses'] = Decimal(0)
            #tmp['matieres_grasses_saturees'] = Decimal(0)
            #tmp['glucides'] = Decimal(0)
            #tmp['glucides_dont_sucre'] = Decimal(0)
            #tmp['fibres_alimentaires'] = Decimal(0)
            #tmp['proteines'] = Decimal(0)
            #tmp['sel'] = Decimal(0)
            tmp['description'] = ingredient.description
            tmp['code'] = ingredient.code
            tmp['id'] = ingredient.id
            tmp['cout'] = Decimal(0)
            ingredients[ingredient.id] = tmp

        tmp['quantite'] += element.quantite
        #tmp['kjoules'] += kjoules
        #tmp['kcalories'] += kcalories
        #tmp['matieres_grasses'] += matieres_grasses
        #tmp['matieres_grasses_saturees'] += matieres_grasses_saturees
        #tmp['glucides'] += glucides
        #tmp['glucides_dont_sucre'] += glucides_dont_sucres
        #tmp['fibres_alimentaires'] += fibres_alimentaires
        #tmp['proteines'] += proteines
        #tmp['sel'] += sel
        tmp['cout'] += cout


    return (kcalories_total, kjoules_total, allergene,
            matieres_grasses_total, matieres_grasses_saturees_total,
            glucides_total, glucides_dont_sucres_total,
            fibres_alimentaires_total, proteines_total,
            sel_total, ingredients.values(),
            cout_total)

#
# calcul cout ingredient allergene pour une preparation et ses bases
#
def calcul_ingredients_preparation(preparation):
    """
    Valeur nutritionnelle et prix d'une préparation et ses bases
    """

    LOGGER.debug(u"/////////////////////////////////++++++++++++++++++preparation {}++++++++++++++++++\\\\\\\\\\\\\\\\\\\\".format(preparation.id))
    res = calcul_ingredients(preparation)

    for base_preparation in preparation.bases.all():
        res = add(res, calcul_ingredients_preparation(base_preparation.base))
    LOGGER.debug(u".......{} ".format(res))
    return res



#
# calcul cout ingredient allergene pour la preparation d'une recette et ses bases
#
def calcul_ingredients_preparation_recette(preparation_recette):
    """
    Valeur nutritionnelle et prix d'une préparation dúne recette et ses bases
    """

    LOGGER.debug(u"/////////////////////////////////++++++++++++++++++preparation recette {}++++++++++++++++++\\\\\\\\\\\\\\\\\\\\".format(preparation_recette.id))
    res = calcul_ingredients(preparation_recette.preparation)

    for base_preparation in preparation_recette.preparation.bases.all():
        res = add(res, calcul_ingredients_preparation(base_preparation.base))
    LOGGER.debug(u".......{} ".format(res))
    return res


def calcul_ingredients_recette(recette):
    """
    Valeur nutritionnelle cout d'une recette ingredients et economat, bases incluses
    """

    LOGGER.debug(u"/////////////////////////////////++++++++++++++++++recette{}++++++++++++++++++\\\\\\\\\\\\\\\\\\\\".format(recette.id))
    res = calcul_ingredients(recette)

    for preparation_recette in recette.preparations.all():
        res = add(res, calcul_ingredients_preparation_recette(preparation_recette))
    LOGGER.debug(u".......{} ".format(res))
    return res
