# Generated by Django 2.1.11 on 2019-12-18 13:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("iaso", "0022_auto_20191218_1110")]

    operations = [
        migrations.AddField(
            model_name="device",
            name="projects",
            field=models.ManyToManyField(blank=True, related_name="devices", to="iaso.Project"),
        )
    ]
