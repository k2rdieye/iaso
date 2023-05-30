# Generated by Django 3.2.15 on 2022-10-14 10:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0172_auto_20221013_1046"),
    ]

    operations = [
        migrations.AddField(
            model_name="storagedevice",
            name="org_unit",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="iaso.orgunit"
            ),
        ),
        migrations.AddField(
            model_name="storagedevice",
            name="entity",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to="iaso.entity"
            ),
        ),
        migrations.AddField(
            model_name="storagedevice",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="storagedevice",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
