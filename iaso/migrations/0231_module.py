# Generated by Django 3.2.15 on 2023-09-01 09:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0230_merge_20230829_2057"),
    ]

    operations = [
        migrations.CreateModel(
            name="Module",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
            ],
        ),
    ]