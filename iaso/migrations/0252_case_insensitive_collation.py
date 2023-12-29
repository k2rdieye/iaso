# Generated by Django 4.2.8 on 2023-12-29 12:58

from django.contrib.postgres.operations import CreateCollation
from django.db import migrations


class Migration(migrations.Migration):
    """
    `CITextField` is deprecated in Django 4.2
    https://docs.djangoproject.com/en/4.2/releases/4.2/#id1

    https://adamj.eu/tech/2023/02/23/migrate-django-postgresql-ci-fields-case-insensitive-collation/

    Collations are more featureful and correct.
    A collation is a specification of how to compare and sort strings.

    `provider="icu"`: tells PostgreSQL to use the ICU library
    (International Components for Unicode) for this collation.

    `locale="und-u-ks-level2"`: language tag with extensions
        - `und`: undetermined language, which activates the Unicode "root collation"
        - `-u-`:
            - specifies that what follows are extra “Extension U” Unicode attributes
            - https://www.unicode.org/reports/tr35/tr35-collation.html#Collation_Settings
        - `ks-level2`
            - `ks` defines the collation strength (here to level 2)
            - https://unicode-org.github.io/icu/userguide/collation/concepts.html#comparison-levels

    - `deterministic=False`: tells PostgreSQL the collation is non-deterministic
        - https://www.postgresql.org/docs/current/collation.html#COLLATION-NONDETERMINISTIC
    """

    dependencies = [
        ("iaso", "0251_merge_20231212_0857"),
    ]

    operations = [
        CreateCollation(
            "case_insensitive",
            provider="icu",
            locale="und-u-ks-level2",
            deterministic=False,
        ),
    ]
