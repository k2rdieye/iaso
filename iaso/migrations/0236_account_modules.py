# Generated by Django 3.2.15 on 2023-09-04 07:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0235_create_link_modules_and_permissions"),
    ]

    operations = [
        migrations.AddField(
            model_name="account",
            name="modules",
            field=models.ManyToManyField(related_name="account_modules", to="iaso.Module"),
        ),
    ]
