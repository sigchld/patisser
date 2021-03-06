# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-08 20:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('recettes', '0040_auto_20180708_2039'),
    ]

    operations = [
        migrations.AddField(
            model_name='preparation',
            name='acces',
            field=models.CharField(choices=[('PUB', 'public'), ('PRIV', 'priv\xe9')], default='PUB', max_length=4),
        ),
        migrations.AddField(
            model_name='preparation',
            name='owner',
            field=models.ForeignKey(default='anonyme', null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, to_field='username'),
        ),
    ]
