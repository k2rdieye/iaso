# Generated by Django 3.2.22 on 2024-02-15 16:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0261_config"),
    ]

    operations = [
        migrations.AlterField(
            model_name="entity",
            name="name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
