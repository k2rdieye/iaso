import json
from io import StringIO
from typing import List, Dict
from unittest import skip, mock

from django.contrib.auth.models import User, Permission
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.template import Engine, Context
from rest_framework import status

from iaso.models import OrgUnit, OrgUnitType
from iaso.test import APITestCase
from plugins.polio.budget.models import BudgetProcess, BudgetStep, MailTemplate
from plugins.polio.budget.workflow import Transition, Node, Workflow
from plugins.polio.models import Campaign, Round

# Hardcoded workflow for testing.

transition_defs = [
    {
        "key": "submit_budget",
        "label": "Submit budget",
        # "required_fields": ["files"],
        "required_fields": [],
        "displayed_fields": ["comment"],
        "from_node": "-",
        "to_node": "budget_submitted",
        "teams_ids_can_transition": [],
    },
    {
        "key": "accept_budget",
        "label": "Accept budget",
        "required_fields": [],
        "displayed_fields": ["comment"],
        "from_node": "budget_submitted",
        "to_node": "accepted",
        "color": "green",
    },
    {
        "key": "reject_budget",
        "label": "Provide feedback",
        "required_fields": [],
        "displayed_fields": ["comment"],
        "from_node": "budget_submitted",
        "to_node": "rejected",
        "color": "primary",
    },
]

node_defs = [
    {"key": None, "label": "No budget"},
    {"key": "budget_submitted", "label": "Budget submitted"},
    {"key": "accepted", "label": "Budget accepted"},
    {"key": "rejected", "label": "Budget rejected"},
]


def get_workflow():
    transitions = [Transition(**transition_def) for transition_def in transition_defs]
    nodes = [Node(**node_def) for node_def in node_defs]
    return Workflow(transitions=transitions, nodes=nodes, categories=[])


@mock.patch("plugins.polio.budget.models.get_workflow", get_workflow)
@mock.patch("plugins.polio.budget.serializers.get_workflow", get_workflow)
class TeamAPITestCase(APITestCase):
    fixtures = ["user.yaml"]
    c: Campaign
    user: User

    def jsonListContains(self, actual: List[Dict], expected: List[Dict]):
        "Check that each dict in the expect list is contained as a subset of a dict in actual"

        def dictContains(actual_d, expected_d):
            for k, v in expected_d.items():
                if not actual_d[k] == v:
                    return False
            return True

        for d in expected:
            self.assertTrue(any(dictContains(actual_d, d) for actual_d in actual), f"{d} not found in {actual}")

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = User.objects.get(username="test")
        cls.user.user_permissions.add(Permission.objects.get(codename="iaso_polio_budget"))
        # Campaign.
        cls.campaign = Campaign.objects.create(
            obr_name="test campaign",
            account=cls.user.iaso_profile.account,
            country=OrgUnit.objects.create(name="ANGOLA"),
        )
        # Budget Processes.
        cls.budget_process_1 = BudgetProcess.objects.create(created_by=cls.user)
        cls.budget_process_2 = BudgetProcess.objects.create(created_by=cls.user)
        # Rounds.
        cls.round_1 = Round.objects.create(number=1, campaign=cls.campaign, budget_process=cls.budget_process_1)
        cls.round_2 = Round.objects.create(number=2, campaign=cls.campaign, budget_process=cls.budget_process_1)
        cls.round_3 = Round.objects.create(number=3, campaign=cls.campaign, budget_process=cls.budget_process_2)
        # Budget Steps.
        cls.budget_step_1 = BudgetStep.objects.create(budget_process=cls.budget_process_1, created_by=cls.user)
        cls.budget_step_2 = BudgetStep.objects.create(budget_process=cls.budget_process_1, created_by=cls.user)

    def test_simple_get_list(self):
        self.client.force_login(self.user)
        response = self.client.get("/api/polio/budget/")
        response_data = self.assertJSONResponse(response, 200)

        budget_processes = response_data["results"]
        for budget_process in budget_processes:
            self.assertEqual(len(budget_process.keys()), 7)
            self.assertIn("created_at", budget_process)
            self.assertIn("updated_at", budget_process)
            self.assertIn("id", budget_process)
            self.assertEqual(budget_process["obr_name"], "test campaign")
            self.assertEqual(budget_process["country_name"], "ANGOLA")
            self.assertEqual(budget_process["current_state"], {"key": "-", "label": "-"})
            self.assertIn("round_numbers", budget_process)

        self.assertEqual(budget_processes[0]["round_numbers"], [1, 2])
        self.assertEqual(budget_processes[1]["round_numbers"], [3])

    def test_simple_get_list_with_all_fields(self):
        self.client.force_login(self.user)
        response = self.client.get("/api/polio/budget/?fields=:all")
        response_data = self.assertJSONResponse(response, 200)

        expected_possible_states = [
            {"key": None, "label": "No budget"},
            {"key": "budget_submitted", "label": "Budget submitted"},
            {"key": "accepted", "label": "Budget accepted"},
            {"key": "rejected", "label": "Budget rejected"},
        ]
        expected_next_transitions = [
            {
                "key": "submit_budget",
                "label": "Submit budget",
                "help_text": "",
                "allowed": True,
                "reason_not_allowed": None,
                "required_fields": [],
                "displayed_fields": ["comment"],
                "color": None,
                "emails_destination_team_ids": [],
            }
        ]
        expected_possible_transitions = [
            {
                "key": "submit_budget",
                "label": "Submit budget",
                "help_text": "",
                "allowed": None,
                "reason_not_allowed": None,
                "required_fields": [],
                "displayed_fields": ["comment"],
                "color": None,
            },
            {
                "key": "accept_budget",
                "label": "Accept budget",
                "help_text": "",
                "allowed": None,
                "reason_not_allowed": None,
                "required_fields": [],
                "displayed_fields": ["comment"],
                "color": "green",
            },
            {
                "key": "reject_budget",
                "label": "Provide feedback",
                "help_text": "",
                "allowed": None,
                "reason_not_allowed": None,
                "required_fields": [],
                "displayed_fields": ["comment"],
                "color": "primary",
            },
        ]
        expected_timeline = {"categories": []}
        for budget_process in response_data["results"]:
            self.assertEqual(len(budget_process.keys()), 11)
            self.assertIn("created_at", budget_process)
            self.assertIn("updated_at", budget_process)
            self.assertIn("id", budget_process)
            self.assertEqual(budget_process["obr_name"], "test campaign")
            self.assertEqual(budget_process["country_name"], "ANGOLA")
            self.assertEqual(budget_process["current_state"], {"key": "-", "label": "-"})
            self.assertEqual(budget_process["possible_states"], expected_possible_states)
            self.assertEqual(budget_process["next_transitions"], expected_next_transitions)
            self.assertEqual(budget_process["possible_transitions"], expected_possible_transitions)
            self.assertEqual(budget_process["timeline"], expected_timeline)
            self.assertIn("round_numbers", budget_process)

    def test_list_select_fields(self):
        self.client.force_login(self.user)
        response = self.client.get("/api/polio/budget/?fields=obr_name,country_name")
        response_data = self.assertJSONResponse(response, 200)
        for budget_process in response_data["results"]:
            self.assertEqual(budget_process["obr_name"], "test campaign")
            self.assertEqual(budget_process["country_name"], "ANGOLA")
            self.assertEqual(list(budget_process.keys()), ["obr_name", "country_name"])

    def test_transition_to(self):
        self.client.force_login(self.user)
        prev_budget_step_count = BudgetStep.objects.count()
        response = self.client.get("/api/polio/budget/")
        response_data = self.assertJSONResponse(response, 200)

        for budget_process in response_data["results"]:
            self.assertEqual(budget_process["obr_name"], "test campaign")

        fake_file = StringIO("hello world")
        fake_file.name = "mon_fichier.txt"

        response = self.client.post(
            "/api/polio/budget/transition_to/",
            data={
                "transition_key": "submit_budget",
                "budget_process": self.budget_process_1.id,
                "comment": "hello world2",
                "files": [fake_file],
            },
        )
        response_data = self.assertJSONResponse(response, 201)
        self.assertEqual(response_data["result"], "success")

        step_id = response_data["id"]
        budget_step = BudgetStep.objects.get(id=step_id)

        # Check the relations: BudgetStep ----> BudgetProcess <---- Round
        self.round_1.refresh_from_db()
        self.assertEqual(budget_step.budget_process, self.round_1.budget_process)

        budget_process = BudgetProcess.objects.get(id=budget_step.budget_process.pk)
        self.assertEqual(budget_process.current_state_key, "budget_submitted")
        self.assertEqual(budget_process.current_state_label, "Budget submitted")

        # Check that we have only created one step.
        new_budget_step_count = BudgetStep.objects.count()
        self.assertEqual(prev_budget_step_count + 1, new_budget_step_count)

        self.assertEqual(budget_step.files.count(), 1)
        response = self.client.get(f"/api/polio/budgetsteps/{budget_step.id}/")
        response_data = self.assertJSONResponse(response, 200)
        file = response_data["files"][0]
        self.assertTrue(file["file"].startswith("http"))  # should be an url
        self.assertEqual(file["filename"], fake_file.name)

    def test_step_files(self):
        self.client.force_login(self.user)
        prev_budget_step_count = BudgetStep.objects.count()
        response = self.client.get("/api/polio/budget/")
        response_data = self.assertJSONResponse(response, 200)

        campaigns = response_data["results"]
        for c in campaigns:
            self.assertEqual(c["obr_name"], "test campaign")

        fake_file = StringIO("hello world")
        fake_file.name = "mon_fichier.txt"

        response = self.client.post(
            "/api/polio/budget/transition_to/",
            data={
                "transition_key": "submit_budget",
                "budget_process": self.budget_process_1.id,
                "comment": "hello world2",
                "files": [fake_file],
            },
        )
        response_data = self.assertJSONResponse(response, 201)
        self.assertEqual(response_data["result"], "success")

        step_id = response_data["id"]
        budget_step = BudgetStep.objects.get(id=step_id)

        # Check the relations: BudgetStep ----> BudgetProcess <---- Round
        self.round_1.refresh_from_db()
        self.assertEqual(budget_step.budget_process, self.round_1.budget_process)

        # Check that we have only created one step.
        new_budget_step_count = BudgetStep.objects.count()
        self.assertEqual(prev_budget_step_count + 1, new_budget_step_count)

        self.assertEqual(budget_step.files.count(), 1)
        response = self.client.get(f"/api/polio/budgetsteps/{budget_step.id}/")
        response_data = self.assertJSONResponse(response, 200)
        file = response_data["files"][0]
        self.assertTrue(file["file"].startswith("http"))  # should be an url
        self.assertEqual(file["filename"], fake_file.name)

        file_id = budget_step.files.first().id
        self.assertEqual(file["id"], file_id)
        self.assertEqual(file["permanent_url"], f"/api/polio/budgetsteps/{budget_step.id}/files/{file_id}/")

        response = self.client.get(f"/api/polio/budgetsteps/{budget_step.id}/files/{file_id}/")
        self.assertIsInstance(response, HttpResponse)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND, response)
        self.assertTrue(len(response.url) > 0)

    def test_transition_to_link(self):
        self.client.force_login(self.user)
        prev_budget_step_count = BudgetStep.objects.count()
        response = self.client.get("/api/polio/budget/")
        response_data = self.assertJSONResponse(response, 200)

        campaigns = response_data["results"]
        for c in campaigns:
            self.assertEqual(c["obr_name"], "test campaign")

        fake_file = StringIO("hello world")
        fake_file.name = "mon_fichier.txt"

        response = self.client.post(
            "/api/polio/budget/transition_to/",
            data={
                "transition_key": "submit_budget",
                "budget_process": self.budget_process_1.id,
                "comment": "hello world2",
                "files": [fake_file],
                "links": json.dumps(
                    [
                        {
                            "url": "http://helloworld",
                            "alias": "hello world",
                        },
                        {
                            "alias": "mon petit lien",
                            "url": "https://lien.com",
                        },
                    ]
                ),
            },
        )
        response_data = self.assertJSONResponse(response, 201)
        self.assertEqual(response_data["result"], "success")

        step_id = response_data["id"]
        budget_step = BudgetStep.objects.get(id=step_id)

        # Check the relations: BudgetStep ----> BudgetProcess <---- Round
        self.round_1.refresh_from_db()
        self.assertEqual(budget_step.budget_process, self.round_1.budget_process)

        # Check the new state of `BudgetProcess`.
        budget_process = self.round_1.budget_process
        response = self.client.get(f"/api/polio/budget/{budget_process.id}/")
        response_data = self.assertJSONResponse(response, 200)
        self.assertEqual(response_data["current_state"]["key"], "budget_submitted")
        self.assertEqual(response_data["updated_at"], budget_process.updated_at.isoformat().replace("+00:00", "Z"))

        # Check that we have only created one step.
        new_budget_step_count = BudgetStep.objects.count()
        self.assertEqual(prev_budget_step_count + 1, new_budget_step_count)

        self.assertEqual(budget_step.files.count(), 1)

        response = self.client.get(f"/api/polio/budgetsteps/{budget_step.id}/")
        response_data = self.assertJSONResponse(response, 200)
        file = response_data["files"][0]
        self.assertTrue(file["file"].startswith("http"))  # should be an url
        self.assertEqual(file["filename"], fake_file.name)

        links = response_data["links"]
        self.jsonListContains(
            links,
            [
                {"url": "http://helloworld", "alias": "hello world"},
                {"alias": "mon petit lien", "url": "https://lien.com"},
            ],
        )

    def test_transition_to_link_json(self):
        # Check it work when sending JSON too.
        self.client.force_login(self.user)
        prev_budget_step_count = BudgetStep.objects.count()
        response = self.client.get("/api/polio/budget/")
        response_data = self.assertJSONResponse(response, 200)

        campaigns = response_data["results"]
        for c in campaigns:
            self.assertEqual(c["obr_name"], "test campaign")

        response = self.client.post(
            "/api/polio/budget/transition_to/",
            data={
                "transition_key": "submit_budget",
                "budget_process": self.budget_process_1.id,
                "comment": "hello world2",
                "links": [
                    {
                        "url": "http://helloworld",
                        "alias": "hello world",
                    },
                    {
                        "alias": "mon petit lien",
                        "url": "https://lien.com",
                    },
                ],
            },
            format="json",
        )
        response_data = self.assertJSONResponse(response, 201)
        self.assertEqual(response_data["result"], "success")

        step_id = response_data["id"]
        budget_step = BudgetStep.objects.get(id=step_id)

        # Check the relations: BudgetStep ----> BudgetProcess <---- Round
        self.round_1.refresh_from_db()
        self.assertEqual(budget_step.budget_process, self.round_1.budget_process)

        # Check the new state of `BudgetProcess`.
        budget_process = self.round_1.budget_process
        response = self.client.get(f"/api/polio/budget/{budget_process.id}/")
        response_data = self.assertJSONResponse(response, 200)
        self.assertEqual(response_data["current_state"]["key"], "budget_submitted")
        self.assertEqual(response_data["updated_at"], budget_process.updated_at.isoformat().replace("+00:00", "Z"))

        # Check that we have only created one step.
        new_budget_step_count = BudgetStep.objects.count()
        self.assertEqual(prev_budget_step_count + 1, new_budget_step_count)

        response = self.client.get(f"/api/polio/budgetsteps/{budget_step.id}/")
        response_data = self.assertJSONResponse(response, 200)

        links = response_data["links"]
        self.jsonListContains(
            links,
            [
                {"url": "http://helloworld", "alias": "hello world"},
                {"alias": "mon petit lien", "url": "https://lien.com"},
            ],
        )

    def test_next_steps_after_transition(self):
        budget_process = self.budget_process_2
        round = self.round_3
        self.client.force_login(self.user)
        prev_budget_step_count = BudgetStep.objects.count()

        response = self.client.get(f"/api/polio/budget/{budget_process.id}/?fields=:all")
        response_data = self.assertJSONResponse(response, 200)
        self.assertEqual(response_data["obr_name"], "test campaign")

        self.assertEqual(response_data["current_state"]["key"], "-")
        self.assertTrue(isinstance(response_data["next_transitions"], list))
        transitions = response_data["next_transitions"]
        self.assertEqual(len(transitions), 1)
        self.assertEqual(transitions[0]["key"], "submit_budget")
        self.assertEqual(transitions[0]["allowed"], True)

        # Post to change status
        response = self.client.post(
            "/api/polio/budget/transition_to/",
            data={
                "transition_key": "submit_budget",
                "budget_process": budget_process.id,
                "comment": "hello world2",
            },
        )
        response_data = self.assertJSONResponse(response, 201)
        self.assertEqual(response_data["result"], "success")
        step_id = response_data["id"]

        # Check new status on campaign
        response = self.client.get(f"/api/polio/budget/{budget_process.id}/?fields=:all")
        response_data = self.assertJSONResponse(response, 200)

        self.assertEqual(response_data["obr_name"], "test campaign")
        self.assertEqual(response_data["current_state"]["key"], "budget_submitted")
        self.assertTrue(isinstance(response_data["updated_at"], str) and len(response_data["updated_at"]) > 0)
        self.assertTrue(isinstance(response_data["next_transitions"], list))
        transitions = response_data["next_transitions"]
        self.assertEqual(len(transitions), 2)
        self.jsonListContains(
            transitions,
            [
                {
                    "key": "accept_budget",
                    "allowed": True,
                },
                {
                    "key": "reject_budget",
                    "allowed": True,
                },
            ],
        )

        # Do a second transition.
        response = self.client.post(
            "/api/polio/budget/transition_to/",
            data={
                "transition_key": "accept_budget",
                "budget_process": budget_process.id,
                "comment": "I'm accepting the budget",
            },
        )
        response_data = self.assertJSONResponse(response, 201)
        self.assertEqual(response_data["result"], "success")
        # Check that we have only created one step.
        new_budget_step_count = BudgetStep.objects.count()
        self.assertEqual(prev_budget_step_count + 2, new_budget_step_count)

        # Check new status on campaign
        response = self.client.get(f"/api/polio/budget/{budget_process.id}/?fields=:all")
        response_data = self.assertJSONResponse(response, 200)

        self.assertEqual(response_data["obr_name"], "test campaign")
        self.assertEqual(response_data["current_state"]["key"], "accepted")
        self.assertTrue(isinstance(response_data["updated_at"], str) and len(response_data["updated_at"]) > 0)
        self.assertTrue(isinstance(response_data["next_transitions"], list))

        # Final transition there is none after
        self.assertEqual(len(response_data["next_transitions"]), 0)

    def test_mail_template_init(self):
        text = """
        hello, {{user}}
        """
        mt = MailTemplate(slug="hello", text_template=text, html_template=text, subject_template="hey")
        mt.full_clean()
        mt.save()
        template = Engine.get_default().from_string(mt.text_template)
        context = Context({"user": "olivier"})
        r = template.render(context)
        self.assertEqual(
            r,
            """
        hello, olivier
        """,
        )

    def test_mail_template_invalid(self):
        text = """
        hello, {{user:dwadwa}}
        """
        mt = MailTemplate(slug="hello", html_template=text, text_template=text, subject_template="hey")
        with self.assertRaises(ValidationError):
            mt.full_clean()
            mt.save()

    @skip("for debug")
    def test_mail_template_include(self):
        # Just to check if include works inside string template
        text = """  hello, {{user}}
        
    {%include "_files.html" with files=files only %}
    {%include "_links.html" with links=links only %}
        """
        mt = MailTemplate(slug="hello", template=text, subject_template="hey")
        mt.full_clean()
        mt.save()
        template = Engine.get_default().from_string(mt.template)
        context = Context({"user": "olivier", "files": [{"path": "http://example.com/test.txt", "name": "test.txt"}]})
        r = template.render(context)
        self.assertEqual(
            r,
            """
        hello, olivier
        """,
        )

    def test_csv_export(self):
        self.client.force_login(self.user)
        r = self.client.get("/api/polio/budget/export_csv/?fields=obr_name")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r["Content-Type"], "text/csv")
        self.assertEqual(r.content, b"OBR name\r\ntest campaign\r\ntest campaign\r\n")

    def test_csv_export_date(self):
        self.client.force_login(self.user)
        budget_step = BudgetStep.objects.create(
            budget_process=self.budget_process_1,
            transition_key="submit_budget",
            node_key_to="budget_submitted",
            created_by=self.user,
        )
        response = self.client.get("/api/polio/budget/export_csv/?fields=updated_at")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "text/csv")
        d = budget_step.created_at.strftime("%Y-%m-%d")
        self.assertEqual(response.content.decode(), f"Last update\r\n2024-02-01\r\n2024-02-01\r\n")
