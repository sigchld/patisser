# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-22 06:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recettes', '0052_auto_20180722_0607'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ingredient',
            old_name='proteines_inferieur',
            new_name='proteines_inferieures',
        ),
    ]