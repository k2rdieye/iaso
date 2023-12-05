MODULE_PERMISSIONS = {
    "DATA_COLLECTION_FORMS": [
        "iaso_forms",
        "iaso_update_submission",
        "iaso_submissions",
        "iaso_completeness",
        "iaso_completeness_stats",
    ],
    "DEFAULT": [
        "iaso_org_units",
        "iaso_org_unit_types",
        "iaso_sources",
        "iaso_write_sources",
        "iaso_links",
        "iaso_data_tasks",
        "iaso_reports",
        "iaso_projects",
        "iaso_users",
        "iaso_user_roles",
        "iaso_teams",
        "iaso_modules",
    ],
    "DHIS2_MAPPING": ["iaso_mappings"],
    "EMBEDDED_LINKS": ["iaso_pages"],
    "ENTITIES": ["iaso_entities", "iaso_workflows", "iaso_entity_duplicates_write", "iaso_entity_duplicates_read"],
    "EXTERNAL_STORAGE": ["iaso_storages"],
    "PLANNING": ["iaso_assignments"],
    "POLIO_PROJECT": ["iaso_polio_config", "iaso_polio", "iaso_polio_budget_admin", "iaso_polio_budget"],
    "REGISTRY": ["iaso_registry", "iaso_test", "iaso_testtt", "iaso_testttr", "iaso_testttrr"],
}

MODULES = [
    {"name": "Data collection - Forms", "codename": "DATA_COLLECTION_FORMS"},
    {"name": "Default", "codename": "DEFAULT"},
    {"name": "DHIS2 mapping", "codename": "DHIS2_MAPPING"},
    {"name": "Embedded links", "codename": "EMBEDDED_LINKS"},
    {"name": "Entities", "codename": "ENTITIES"},
    {"name": "External storage", "codename": "EXTERNAL_STORAGE"},
    {"name": "Planning", "codename": "PLANNING"},
    {"name": "Polio project", "codename": "POLIO_PROJECT"},
    {"name": "Registry", "codename": "REGISTRY"},
]
