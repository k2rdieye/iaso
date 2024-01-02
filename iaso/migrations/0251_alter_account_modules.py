# Generated by Django 3.2.22 on 2024-01-02 20:52

from django.db import migrations, models
import iaso.models.base


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0250_jsondatastore_org_unit_20231211_1016"),
    ]

    operations = [
        migrations.AlterField(
            model_name="account",
            name="modules",
            field=iaso.models.base.ChoiceArrayField(
                base_field=models.CharField(
                    choices=[
                        ("DATA_COLLECTION_FORMS", "Data collection - Forms"),
                        ("DEFAULT", "Default"),
                        ("DHIS2_MAPPING", "DHIS2 mapping"),
                        ("EMBEDDED_LINKS", "Embedded links"),
                        ("ENTITIES", "Entities"),
                        ("EXTERNAL_STORAGE", "External storage"),
                        ("PLANNING", "Planning"),
                        ("POLIO_PROJECT", "Polio project"),
                        ("REGISTRY", "Registry"),
                        ("TRYPELIM_PROJECT", "Trypelim project"),
                    ],
                    max_length=100,
                ),
                blank=True,
                default=list,
                null=True,
                size=None,
            ),
        ),
    ]
