# Generated by Django 3.2.15 on 2022-10-06 15:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polio", "0094_auto_20221006_1137"),
    ]

    operations = [
        migrations.AddField(
            model_name="budgetstep",
            name="deleted_at",
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
