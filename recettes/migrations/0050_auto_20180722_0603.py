# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-22 06:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0049_auto_20180721_1513'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ingredient',
            old_name='matieges_grasses_inferieures',
            new_name='matieres_grasses_inferieures',
        ),
        migrations.AlterField(
            model_name='element',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='etapepreparation',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='etaperecette',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='preparation',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='preparationrecette',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='recette',
            name='date_modification',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
