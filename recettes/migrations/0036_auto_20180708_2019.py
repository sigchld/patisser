# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-08 20:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0035_auto_20180708_2013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='photo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='recettes.Photo'),
        ),
    ]
