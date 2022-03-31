# Generated by Django 3.1.14 on 2022-01-10 14:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


# Functions from the following migrations need manual copying.
# Move them and any dependencies into this file, then update the
# RunPython operations to refer to the local versions:
# plugins.polio.migrations.0020_fix_statuses FIXED


class Migration(migrations.Migration):

    replaces = [
        ("polio", "0001_initial"),
        ("polio", "0002_auto_20210505_0952"),
        ("polio", "0003_auto_20210505_1620"),
        ("polio", "0004_auto_20210505_1813"),
        ("polio", "0005_campaign_group"),
        ("polio", "0005_auto_20210525_1849"),
        ("polio", "0006_merge_20210602_1150"),
        ("polio", "0005_auto_20210528_1640"),
        ("polio", "0006_merge_20210602_0635"),
        ("polio", "0007_merge_20210602_1615"),
        ("polio", "0008_auto_20210603_1656"),
        ("polio", "0009_auto_20210604_1027"),
        ("polio", "0010_auto_20210608_0838"),
        ("polio", "0011_surge_surge_country_name"),
        ("polio", "0012_auto_20210611_0951"),
        ("polio", "0013_auto_20210629_1041"),
        ("polio", "0013_auto_20210615_1327"),
        ("polio", "0014_merge_20210630_1106"),
        ("polio", "0015_auto_20210630_2051"),
        ("polio", "0016_config"),
        ("polio", "0017_campaign_gpei_email"),
        ("polio", "0018_campaign_vials_requested"),
        ("polio", "0019_auto_20210715_1751"),
        ("polio", "0020_fix_statuses"),
        ("polio", "0021_auto_20210805_1750"),
        ("polio", "0022_auto_20210813_1319"),
        ("polio", "0023_countryusersgroup"),
        ("polio", "0024_countryusersgroup_language"),
        ("polio", "0023_linelistimport"),
        ("polio", "0025_merge_20210901_1222"),
        ("polio", "0026_auto_20210903_0821"),
        ("polio", "0027_campaign_creation_email_send_at"),
        ("polio", "0028_remove_campaign_budget_first_draft_submitted_at"),
        ("polio", "0029_campaign_country"),
        ("polio", "0030_campaign_country_data_migration_20211004_1157"),
        ("polio", "0027_urlcache"),
        ("polio", "0029_merge_20210930_0946"),
        ("polio", "0031_merge_20211008_1509"),
        ("polio", "0032_campaign_is_preventive"),
        ("polio", "0032_auto_20211024_2118"),
        ("polio", "0033_merge_20211028_1257"),
        ("polio", "0034_make_readonlyrole"),
        ("polio", "0035_spreadsheetimport"),
        ("polio", "0036_auto_20211203_1025"),
    ]

    initial = True

    dependencies = [
        ("iaso", "0088_group_domain"),
        ("iaso", "0102_page_type"),
        ("iaso", "0099_orgunittype_category"),
        ("iaso", "0085_merge_20210415_2144"),
        ("iaso", "0107_auto_20211001_1845"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Round",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("started_at", models.DateField(blank=True, null=True)),
                ("ended_at", models.DateField(blank=True, null=True)),
                ("mop_up_started_at", models.DateField(blank=True, null=True)),
                ("mop_up_ended_at", models.DateField(blank=True, null=True)),
                ("im_started_at", models.DateField(blank=True, null=True)),
                ("im_ended_at", models.DateField(blank=True, null=True)),
                ("lqas_started_at", models.DateField(blank=True, null=True)),
                ("lqas_ended_at", models.DateField(blank=True, null=True)),
                ("target_population", models.IntegerField(blank=True, null=True)),
                ("cost", models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True)),
                (
                    "awareness_of_campaign_planning",
                    models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
                ),
                (
                    "im_percentage_children_missed_in_household",
                    models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
                ),
                (
                    "im_percentage_children_missed_out_household",
                    models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
                ),
                ("lqas_district_failing", models.IntegerField(blank=True, null=True)),
                ("lqas_district_passing", models.IntegerField(blank=True, null=True)),
                ("main_awareness_problem", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "im_percentage_children_missed_in_plus_out_household",
                    models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Campaign",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("epid", models.CharField(blank=True, default=None, max_length=255, null=True)),
                ("obr_name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
                ("onset_at", models.DateField(blank=True, help_text="When the campaign starts", null=True)),
                ("three_level_call_at", models.DateField(blank=True, null=True, verbose_name="3 level call")),
                ("cvdpv_notified_at", models.DateField(blank=True, null=True, verbose_name="cVDPV Notication")),
                ("cvdpv2_notified_at", models.DateField(blank=True, null=True, verbose_name="cVDPV2 Notication")),
                ("pv_notified_at", models.DateField(blank=True, null=True, verbose_name="PV Notication")),
                ("pv2_notified_at", models.DateField(blank=True, null=True, verbose_name="PV2 Notication")),
                (
                    "virus",
                    models.CharField(
                        blank=True,
                        choices=[("PV1", "PV1"), ("PV2", "PV2"), ("PV3", "PV3"), ("cVDPV2", "cVDPV2")],
                        max_length=6,
                        null=True,
                    ),
                ),
                (
                    "vacine",
                    models.CharField(
                        blank=True,
                        choices=[("mOPV2", "mOPV2"), ("nOPV2", "nOPV2"), ("bOPV", "bOPV")],
                        max_length=5,
                        null=True,
                    ),
                ),
                (
                    "detection_status",
                    models.CharField(
                        choices=[("PENDING", "Pending"), ("ONGOING", "Ongoing"), ("FINISHED", "Finished")],
                        default="PENDING",
                        max_length=10,
                    ),
                ),
                (
                    "detection_responsible",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("WHO", "WHO"),
                            ("UNICEF", "UNICEF"),
                            ("NAT", "National"),
                            ("MOH", "MOH"),
                            ("PROV", "PROVINCE"),
                            ("DIST", "District"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                (
                    "detection_first_draft_submitted_at",
                    models.DateField(blank=True, null=True, verbose_name="1st Draft Submission"),
                ),
                (
                    "detection_rrt_oprtt_approval_at",
                    models.DateField(blank=True, null=True, verbose_name="RRT/OPRTT Approval"),
                ),
                (
                    "risk_assessment_status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("APPROVED", "Approved"),
                            ("TO_SUBMIT", "To Submit"),
                            ("SUBMITTED", "Submitted"),
                            ("REVIEWED", "Reviewed by RRT"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                (
                    "risk_assessment_responsible",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("WHO", "WHO"),
                            ("UNICEF", "UNICEF"),
                            ("NAT", "National"),
                            ("MOH", "MOH"),
                            ("PROV", "PROVINCE"),
                            ("DIST", "District"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("investigation_at", models.DateField(blank=True, null=True, verbose_name="Field Investigation Date")),
                (
                    "risk_assessment_first_draft_submitted_at",
                    models.DateField(blank=True, null=True, verbose_name="1st Draft Submission"),
                ),
                (
                    "risk_assessment_rrt_oprtt_approval_at",
                    models.DateField(blank=True, null=True, verbose_name="RRT/OPRTT Approval"),
                ),
                ("ag_nopv_group_met_at", models.DateField(blank=True, null=True, verbose_name="AG/nOPV Group")),
                ("dg_authorized_at", models.DateField(blank=True, null=True, verbose_name="DG Authorization")),
                (
                    "budget_status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("APPROVED", "Approved"),
                            ("TO_SUBMIT", "To Submit"),
                            ("SUBMITTED", "Submitted"),
                            ("REVIEWED", "Reviewed by RRT"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                (
                    "budget_responsible",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("WHO", "WHO"),
                            ("UNICEF", "UNICEF"),
                            ("NAT", "National"),
                            ("MOH", "MOH"),
                            ("PROV", "PROVINCE"),
                            ("DIST", "District"),
                        ],
                        max_length=10,
                        null=True,
                    ),
                ),
                ("eomg", models.DateField(blank=True, null=True, verbose_name="EOMG")),
                ("no_regret_fund_amount", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "initial_org_unit",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="campaigns",
                        to="iaso.orgunit",
                    ),
                ),
                (
                    "round_one",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="round_one",
                        to="polio.round",
                    ),
                ),
                (
                    "round_two",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="round_two",
                        to="polio.round",
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        limit_choices_to={"domain": "POLIO"},
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="campaigns",
                        to="iaso.group",
                    ),
                ),
                ("preperadness_spreadsheet_url", models.URLField(blank=True, null=True)),
                ("budget_submitted_at", models.DateField(blank=True, null=True, verbose_name="Budget Submission")),
                ("district_count", models.IntegerField(blank=True, null=True)),
                ("gpei_coordinator", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "payment_mode",
                    models.CharField(
                        blank=True, choices=[("DIRECT", "Direct"), ("DFC", "DFC")], max_length=10, null=True
                    ),
                ),
                ("verification_score", models.IntegerField(blank=True, null=True)),
                (
                    "unicef_disbursed_to_co_at",
                    models.DateField(blank=True, null=True, verbose_name="Disbursed to CO (UNICEF)"),
                ),
                (
                    "unicef_disbursed_to_moh_at",
                    models.DateField(blank=True, null=True, verbose_name="Disbursed to MOH (UNICEF)"),
                ),
                (
                    "who_disbursed_to_co_at",
                    models.DateField(blank=True, null=True, verbose_name="Disbursed to CO (WHO)"),
                ),
                (
                    "who_disbursed_to_moh_at",
                    models.DateField(blank=True, null=True, verbose_name="Disbursed to MOH (WHO)"),
                ),
                ("country_name_in_surge_spreadsheet", models.CharField(blank=True, max_length=256, null=True)),
                ("surge_spreadsheet_url", models.URLField(blank=True, null=True)),
                (
                    "preperadness_sync_status",
                    models.CharField(
                        choices=[
                            ("QUEUED", "Queued"),
                            ("ONGOING", "Ongoing"),
                            ("FAILURE", "Failed"),
                            ("FINISHED", "Finished"),
                        ],
                        default="FINISHED",
                        max_length=10,
                    ),
                ),
                ("gpei_email", models.EmailField(blank=True, max_length=254, null=True)),
                ("vials_requested", models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="Preparedness",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("spreadsheet_url", models.URLField()),
                ("national_score", models.DecimalField(decimal_places=2, max_digits=10, verbose_name="National Score")),
                ("regional_score", models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Regional Score")),
                ("district_score", models.DecimalField(decimal_places=2, max_digits=10, verbose_name="District Score")),
                ("payload", models.JSONField()),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("campaign", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="polio.campaign")),
            ],
        ),
        migrations.CreateModel(
            name="Surge",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("spreadsheet_url", models.URLField()),
                (
                    "who_recruitment",
                    models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Recruitment WHO"),
                ),
                (
                    "who_completed_recruitment",
                    models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Completed for WHO"),
                ),
                (
                    "unicef_recruitment",
                    models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Recruitment UNICEF"),
                ),
                (
                    "unicef_completed_recruitment",
                    models.DecimalField(decimal_places=2, max_digits=10, verbose_name="Completed for UNICEF"),
                ),
                ("payload", models.JSONField()),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("campaign", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="polio.campaign")),
                ("surge_country_name", models.CharField(default=True, max_length=250, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="Config",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(unique=True)),
                ("content", models.JSONField()),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        # migrations.RunPython(
        #     code=plugins.polio.migrations.0020_fix_statuses.fix_campaign_status,
        # ),
        migrations.RenameField(
            model_name="campaign",
            old_name="vials_requested",
            new_name="doses_requested",
        ),
        migrations.AddField(
            model_name="campaign",
            name="budget_rrt_oprtt_approval_at",
            field=models.DateField(blank=True, null=True, verbose_name="Budget Approval"),
        ),
        migrations.CreateModel(
            name="LineListImport",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("file", models.FileField(upload_to="uploads/linelist/% Y/% m/% d/")),
                ("import_result", models.JSONField()),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="CountryUsersGroup",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("country", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to="iaso.orgunit")),
                ("users", models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
                (
                    "language",
                    models.CharField(choices=[("FR", "Français"), ("EN", "English")], default="EN", max_length=32),
                ),
            ],
        ),
        migrations.AddField(
            model_name="campaign",
            name="creation_email_send_at",
            field=models.DateTimeField(blank=True, help_text="When and if we sent an email for creation", null=True),
        ),
        migrations.AddField(
            model_name="campaign",
            name="country",
            field=models.ForeignKey(
                blank=True,
                help_text="Country for campaign, set automatically from initial_org_unit",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="campaigns_country",
                to="iaso.orgunit",
            ),
        ),
        migrations.CreateModel(
            name="URLCache",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("url", models.URLField(unique=True)),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="campaign",
            name="is_preventive",
            field=models.BooleanField(default=False, help_text="Preventive campaign"),
        ),
        migrations.AlterField(
            model_name="campaign",
            name="obr_name",
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.RunSQL(
            sql='\nDO\n$do$\nBEGIN\n   IF NOT EXISTS (\n      SELECT FROM pg_catalog.pg_roles\n      WHERE  rolname = \'readonlyrole\') THEN\n      CREATE ROLE "readonlyrole";\n   END IF;\nEND\n$do$;\nGRANT USAGE ON SCHEMA PUBLIC TO "readonlyrole";\nGRANT SELECT ON TABLE \npolio_campaign,\npolio_config,\npolio_preparedness,\npolio_round,\npolio_surge\nTO "readonlyrole";\n',
        ),
        migrations.CreateModel(
            name="SpreadSheetImport",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("url", models.URLField()),
                ("content", models.JSONField()),
                ("spread_id", models.CharField(db_index=True, max_length=60)),
            ],
        ),
    ]
