# Generated by Django 3.2.21 on 2023-09-18 09:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("wfp", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Entity",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name_plural": "Entities",
                "db_table": "iaso_entity",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="EntityType",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("is_active", models.BooleanField(default=False)),
            ],
            options={
                "db_table": "iaso_entitytype",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Form",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("form_id", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.TextField()),
                ("location_field", models.TextField(blank=True, null=True)),
                ("correlation_field", models.TextField(blank=True, null=True)),
                ("correlatable", models.BooleanField(default=False)),
                (
                    "possible_fields",
                    models.JSONField(
                        blank=True,
                        help_text="Questions present in all versions of the form, as a flat list.Automatically updated on new versions.",
                        null=True,
                    ),
                ),
                ("single_per_period", models.BooleanField(default=False)),
                ("periods_before_allowed", models.IntegerField(default=0)),
                ("periods_after_allowed", models.IntegerField(default=0)),
                ("derived", models.BooleanField(default=False)),
            ],
            options={
                "db_table": "iaso_form",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Instance",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("uuid", models.TextField(blank=True, null=True)),
                ("correlation_id", models.BigIntegerField(blank=True, null=True)),
                ("name", models.TextField(blank=True, null=True)),
                ("file", models.FileField(blank=True, null=True, upload_to="instances/")),
                ("file_name", models.TextField(blank=True, null=True)),
                ("json", models.JSONField(blank=True, null=True)),
                ("accuracy", models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True)),
                ("period", models.TextField(blank=True, db_index=True, null=True)),
                ("last_export_success_at", models.DateTimeField(blank=True, null=True)),
                ("deleted", models.BooleanField(default=False)),
                ("to_export", models.BooleanField(default=False)),
            ],
            options={
                "db_table": "iaso_instance",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="OrgUnit",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("uuid", models.TextField(blank=True, db_index=True, null=True)),
                ("custom", models.BooleanField(default=False)),
                ("validated", models.BooleanField(db_index=True, default=True)),
                (
                    "validation_status",
                    models.CharField(
                        choices=[("NEW", "new"), ("VALID", "valid"), ("REJECTED", "rejected")],
                        default="NEW",
                        max_length=25,
                    ),
                ),
                ("sub_source", models.TextField(blank=True, null=True)),
                ("source_ref", models.TextField(blank=True, db_index=True, null=True)),
                ("geom_ref", models.IntegerField(blank=True, null=True)),
                ("gps_source", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "iaso_orgunit",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="OrgUnitType",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("short_name", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "category",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("COUNTRY", "Country"),
                            ("REGION", "Region"),
                            ("DISTRICT", "District"),
                            ("HF", "Health Facility"),
                        ],
                        max_length=8,
                        null=True,
                    ),
                ),
                ("depth", models.PositiveSmallIntegerField(blank=True, null=True)),
            ],
            options={
                "managed": False,
            },
        ),
        migrations.AddField(
            model_name="journey",
            name="instance_id",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="visit",
            name="instance_id",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="journey",
            name="admission_criteria",
            field=models.CharField(
                blank=True, choices=[("MUAC", "MUAC"), ("WHZ", "WHZ"), ("OEDEMA", "OEDEMA")], max_length=255, null=True
            ),
        ),
        migrations.AlterField(
            model_name="journey",
            name="exit_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("DEATH", "Death"),
                    ("CURED", "Cured"),
                    ("DISMISSED_DUE_TO_CHEATING", "Dismissal"),
                    ("VOLUNTARY_WITH_DRAWAL", "Voluntary Withdrawal"),
                ],
                max_length=50,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="visit",
            name="org_unit",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to="wfp.orgunit"
            ),
        ),
    ]