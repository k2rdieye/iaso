# Generated by Django 3.2.13 on 2022-06-15 13:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("polio", "0063_auto_20220614_1537"),
    ]

    operations = [
        migrations.AddField(
            model_name="campaign",
            name="last_budget_event",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="lastbudgetevent",
                to="polio.budgetevent",
            ),
        ),
        migrations.AlterField(
            model_name="budgetevent",
            name="campaign",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, related_name="budget_events", to="polio.campaign"
            ),
        ),
    ]
