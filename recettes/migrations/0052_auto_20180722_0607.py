# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-22 06:07
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0051_auto_20180722_0605'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ingredient',
            old_name='fibres',
            new_name='fibres_alimentaires',
        ),
        migrations.RenameField(
            model_name='ingredient',
            old_name='fibres_inferieures',
            new_name='fibres_alimentaires_inferieures',
        ),
    ]