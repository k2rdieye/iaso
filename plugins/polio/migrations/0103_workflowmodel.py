# Generated by Django 3.2.15 on 2022-10-12 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0102_alter_budgetstep_options"),
    ]

    operations = [
        migrations.CreateModel(
            name="WorkflowModel",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("definition", models.JSONField()),
            ],
        ),
    ]
