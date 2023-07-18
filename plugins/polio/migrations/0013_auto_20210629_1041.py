# Generated by Django 3.1.12 on 2021-06-29 10:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polio", "0012_auto_20210611_0951"),
    ]

    operations = [
        migrations.AddField(
            model_name="round",
            name="awareness_of_campaign_planning",
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="round",
            name="im_percentage_children_missed_in_household",
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="round",
            name="im_percentage_children_missed_out_household",
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="round",
            name="lqas_district_failing",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="round",
            name="lqas_district_passing",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="round",
            name="main_awareness_problem",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
