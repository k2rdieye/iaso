# Generated by Django 3.2.13 on 2022-06-09 14:00

from django.db import migrations
import django_ltree.fields


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0147_calculate_team_path"),
    ]

    operations = [
        migrations.AlterField(
            model_name="team",
            name="path",
            field=django_ltree.fields.PathField(unique=True),
        ),
    ]
