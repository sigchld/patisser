# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-09 14:13
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0043_auto_20180709_1409'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='owner',
            field=models.ForeignKey(default='anonyme', null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to=settings.AUTH_USER_MODEL, to_field='username'),
        ),
    ]
