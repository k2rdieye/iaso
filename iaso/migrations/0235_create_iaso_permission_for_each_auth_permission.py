# Generated by Django 3.2.15 on 2023-09-15 11:57

from django.db import migrations
from django.contrib import auth
from iaso.models import Permission


def create_permisssions(apps, schema_editor):
    for permission in auth.models.Permission.objects.filter(codename__startswith="iaso_"):
        Permission.objects.get_or_create(permission=permission)


def reverse_create_permisssions(apps, schema_editor):
    Permission.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0234_permission"),
    ]

    operations = [
        migrations.RunPython(create_permisssions, reverse_create_permisssions),
    ]
