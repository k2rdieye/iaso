# Generated by Django 2.2.4 on 2019-10-01 11:42

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("iaso", "0001_squashed_0026_adding_indexes_on_org_unit")]

    operations = [migrations.RenameField(model_name="orgunit", old_name="source", new_name="sub_source")]
