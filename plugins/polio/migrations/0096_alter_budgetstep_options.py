# Generated by Django 3.2.15 on 2022-10-07 14:13

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("polio", "0095_budgetstep_deleted_at"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="budgetstep",
            options={"ordering": ["updated_at"]},
        ),
    ]
