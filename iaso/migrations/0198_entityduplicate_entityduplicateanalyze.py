# Generated by Django 3.2.15 on 2023-03-27 14:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0197_formpredefinedfilter"),
    ]

    operations = [
        migrations.CreateModel(
            name="EntityDuplicateAnalyze",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "algorithm",
                    models.CharField(
                        choices=[["inverse", "inverse"], ["namesim", "namesim"]], default="namesim", max_length=20
                    ),
                ),
                ("log", models.TextField(null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("metadata", models.JSONField(default=dict)),
                ("task", models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to="iaso.task")),
            ],
        ),
        migrations.CreateModel(
            name="EntityDuplicate",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "validation_status",
                    models.CharField(
                        choices=[("PENDING", "Pending"), ("VALIDATED", "Validated"), ("IGNORED", "Ignored")],
                        default="PENDING",
                        max_length=20,
                    ),
                ),
                (
                    "type_of_relation",
                    models.CharField(
                        choices=[("DUPLICATE", "Duplicate"), ("COUSIN", "Cousin"), ("PRODUCED", "Produced")],
                        default="DUPLICATE",
                        max_length=20,
                    ),
                ),
                ("similarity_score", models.SmallIntegerField(null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("metadata", models.JSONField(default=dict)),
                ("analyzes", models.ManyToManyField(related_name="duplicates", to="iaso.EntityDuplicateAnalyze")),
                (
                    "entity1",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="duplicates1", to="iaso.entity"
                    ),
                ),
                (
                    "entity2",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="duplicates2", to="iaso.entity"
                    ),
                ),
            ],
            options={
                "unique_together": {("entity1", "entity2")},
            },
        ),
    ]
