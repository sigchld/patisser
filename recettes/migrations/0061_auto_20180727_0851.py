# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-27 06:51
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recettes', '0060_auto_20180727_0839'),
    ]

#    operations = [
#        migrations.AlterUniqueTogether(
#            name='categorie',
#            unique_together=set([('owner', 'categorie', 'groupe')]),
#        ),
#    ]