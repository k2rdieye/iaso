# Generated by Django 3.1.14 on 2022-03-23 10:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0045_auto_20220308_1410"),
    ]

    operations = [
        migrations.DeleteModel(
            name="IMStatsCache",
        ),
        migrations.DeleteModel(
            name="LQASIMCache",
        ),
    ]
