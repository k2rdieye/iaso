# Generated by Django 2.2.4 on 2019-10-04 09:12

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("iaso", "0005_auto_20191003_1321")]

    operations = [
        migrations.AddField(
            model_name="algorithmrun", name="ended_at", field=models.DateTimeField(blank=True, null=True)
        ),
        migrations.AddField(model_name="algorithmrun", name="finished", field=models.BooleanField(default=False)),
        migrations.AddField(
            model_name="algorithmrun",
            name="result",
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True),
        ),
    ]
