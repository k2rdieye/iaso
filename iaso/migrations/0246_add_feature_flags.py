from django.db import migrations

feature_flags = [
    {"code": "ORG_UNIT_CHANGE_REQUEST", "name": "Request changes to org units."},
    {
        "code": "MOBILE_FORCE_OU_UPDATE",
        "name": "Mobile: Warn the user when the Org Units have been updated and force them to update.",
    },
    {
        "code": "MOBILE_FORCE_FORMS_UPDATE",
        "name": "Mobile: Warn the user when forms have been updated and force them to update.",
    },
    {"code": "MOBILE_CHECK_OU_UPDATE", "name": "Mobile: Warn the user when the Org Units have been updated."},
    {"code": "MOBILE_CHECK_FORMS_UPDATE", "name": "Mobile: Warn the user when forms have been updated."},
    {"code": "LIMIT_OU_DOWNLOAD_TO_ROOTS", "name": "Mobile: Limit download of orgunit to what the user has access to"},
    {"code": "REPORTS", "name": "Enable reports"},
    {"code": "ENTITY", "name": "Mobile: Show entities screen"},
    {"code": "MOBILE_FINALIZED_FORM_ARE_READ", "name": "Mobile: Finalized forms are read only"},
    {"code": "SHOW_DETAIL_MAP_ON_MOBILE", "name": "Mobile: Show map of OrgUnit"},
    {
        "code": "CHECK_POSITION_FOR_FORMS",
        "name": "Mobile: Enforce users are within reach of the Org Unit before starting a form.",
    },
    {"code": "SHOW_LINK_INSTANCE_REFERENCE", "name": "Show link instance reference"},
    {"code": "PLANNING", "name": "Mobile: Show planning screen"},
    {"code": "DATA_COLLECTION", "name": "Mobile: Show data collection screen"},
    {"code": "TRANSPORT_TRACKING", "name": "GPS des trajets"},
    {"code": "FORMS_AUTO_UPLOAD", "name": "Upload auto des f. finalisés"},
    {"code": "REQUIRE_AUTHENTICATION", "name": "Authentification"},
    {"code": "TAKE_GPS_ON_FORM", "name": "GPS à chaque formulaire"},
    {"code": "GPS_TRACKING", "name": "gps tracking"},
]


def create_feature_flags(apps, schema_editor):
    FeatureFlag = apps.get_model("iaso", "FeatureFlag")

    for flag in feature_flags:
        FeatureFlag.objects.update_or_create(**flag)


def reverse_create_feature_flags(apps, schema_editor):
    FeatureFlag = apps.get_model("iaso", "FeatureFlag")
    for flag in feature_flags:
        FeatureFlag.objects.get(**flag).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0245_auto_20231123_0912"),
    ]

    operations = [
        migrations.RunPython(create_feature_flags, reverse_create_feature_flags),
    ]
