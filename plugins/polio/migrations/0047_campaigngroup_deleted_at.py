# Generated by Django 3.1.14 on 2022-04-08 12:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polio", "0046_campaigngroup"),
    ]

    operations = [
        migrations.AddField(
            model_name="campaigngroup",
            name="deleted_at",
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
