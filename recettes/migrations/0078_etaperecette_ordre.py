# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-08-26 18:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0077_elementrecette'),
    ]

    operations = [
        migrations.AddField(
            model_name='etaperecette',
            name='ordre',
            field=models.IntegerField(default=0),
        ),
    ]