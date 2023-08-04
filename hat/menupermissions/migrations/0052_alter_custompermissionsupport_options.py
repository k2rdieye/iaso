# Generated by Django 3.2.15 on 2023-08-03 14:11

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("menupermissions", "0051_alter_custompermissionsupport_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="custompermissionsupport",
            options={
                "managed": False,
                "permissions": (
                    ("iaso_forms", "Formulaires"),
                    ("iaso_mappings", "Correspondances avec DHIS2"),
                    ("iaso_completeness", "Complétude des données"),
                    ("iaso_org_units", "Unités d'organisations"),
                    ("iaso_registry", "Registre"),
                    ("iaso_links", "Correspondances sources"),
                    ("iaso_users", "Users"),
                    ("iaso_users_managed", "Users managed"),
                    ("iaso_pages", "Pages"),
                    ("iaso_projects", "Projets"),
                    ("iaso_sources", "Sources"),
                    ("iaso_data_tasks", "Tâches"),
                    ("iaso_polio", "Polio"),
                    ("iaso_polio_config", "Polio config"),
                    ("iaso_submissions", "Soumissions"),
                    ("iaso_update_submission", "Editer soumissions"),
                    ("iaso_planning", "Planning"),
                    ("iaso_reports", "Reports"),
                    ("iaso_teams", "Equipes"),
                    ("iaso_assignments", "Attributions"),
                    ("iaso_polio_budget", "Budget Polio"),
                    ("iaso_entities", "Entities"),
                    ("iaso_storages", "Storages"),
                    ("iaso_completeness_stats", "Completeness stats"),
                    ("iaso_workflows", "Workflows"),
                    ("iaso_polio_budget_admin", "Budget Polio Admin"),
                    ("iaso_entity_duplicates_read", "Read Entity duplicates"),
                    ("iaso_entity_duplicates_write", "Write Entity duplicates"),
                    ("iaso_user_roles", "Manage user roles"),
                    ("iaso_datastore_read", "Read data store"),
                    ("iaso_datastore_write", "Write data store"),
                    ("iaso_org_unit_types", "Org unit types"),
                    ("iaso_org_unit_groups", "Org unit groups"),
                ),
            },
        ),
    ]
