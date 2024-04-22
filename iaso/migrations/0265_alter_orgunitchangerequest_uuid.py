# Generated by Django 4.2.9 on 2024-03-08 10:01

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0264_data_delete_change_requests_duplicates_uuid"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orgunitchangerequest",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]