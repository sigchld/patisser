# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-08-18 19:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0073_auto_20180808_2016'),
    ]

    operations = [
        migrations.AddField(
            model_name='etapepreparation',
            name='ordre',
            field=models.IntegerField(default=0),
        ),
    ]
