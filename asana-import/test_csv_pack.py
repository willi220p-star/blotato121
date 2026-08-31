#!/usr/bin/env python3
"""Regression checks for the DGK Asana CSV pack."""

from __future__ import annotations

import csv
import unittest
from pathlib import Path

from generate_asana_csvs import (
    CLIENT_NAME_OPTIONS,
    CUSTOM_FIELD_HEADERS,
    HEADERS,
    main,
)

CSV_DIR = Path(__file__).resolve().parent / "csv"


class CsvPackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        main()

    def test_expected_files_exist(self) -> None:
        names = [
            "00_custom_field_seed.csv",
            "01_CLIENT_project_master_template.csv",
            "02_DGK_Social_Media_Content.csv",
            "03_DGK_Intern_Training.csv",
            "04_DGK_Internal_Admin.csv",
            "05_DGK_Dilip_Master_Tracker.csv",
            "06_DGK_Setup_Checklist.csv",
            "DGK_ALL_IN_ONE.csv",
        ]
        for name in names:
            self.assertTrue((CSV_DIR / name).is_file(), name)

    def test_all_in_one_contains_six_project_areas(self) -> None:
        path = CSV_DIR / "DGK_ALL_IN_ONE.csv"
        with path.open(encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        prefixes = {
            "00 FIELD SEED — delete these tasks after import",
            "🏢 CLIENT — [Client Name]",
            "📱 DGK — Social Media & Content",
            "🎓 DGK — Intern Training",
            "⚙️ DGK — Internal Admin",
            "📊 DGK — Dilip Master Tracker",
            "🛠️ DGK — Remaining setup",
        }
        found = {row["Section"].split(" | ", 1)[0] for row in rows}
        self.assertEqual(prefixes, found)
        self.assertGreater(len(rows), 100)

    def test_header_order_and_custom_fields(self) -> None:
        path = CSV_DIR / "01_CLIENT_project_master_template.csv"
        with path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.reader(handle)
            header = next(reader)
        self.assertEqual(header, HEADERS)
        self.assertEqual(len(CUSTOM_FIELD_HEADERS), 18)

    def test_utf8_bom(self) -> None:
        data = (CSV_DIR / "01_CLIENT_project_master_template.csv").read_bytes()[:3]
        self.assertEqual(data, b"\xef\xbb\xbf")

    def test_no_invented_clients(self) -> None:
        allowed = set(CLIENT_NAME_OPTIONS) | {""}
        for path in CSV_DIR.glob("*.csv"):
            with path.open(encoding="utf-8-sig", newline="") as handle:
                for row in csv.DictReader(handle):
                    self.assertIn(row["Client Name"], allowed, path.name)

    def test_sop_text_and_assignees(self) -> None:
        path = CSV_DIR / "04_DGK_Internal_Admin.csv"
        with path.open(encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        sop = next(row for row in rows if row["Name"].startswith("📋 TEAM SOP"))
        self.assertTrue(sop["Description"].startswith("STEP 1 — RECEIVE YOUR TASK"))
        self.assertIn("Do NOT ask via WhatsApp", sop["Description"])
        self.assertEqual(sop["Assignee"], "Support@dgkbusinessconsultancy.com")
        self.assertEqual(sop["Collaborators"], "Shuvang@dgkbusinessconsultancy.com")

    def test_collaborators_have_no_spaces_after_commas(self) -> None:
        for path in CSV_DIR.glob("*.csv"):
            with path.open(encoding="utf-8-sig", newline="") as handle:
                for row in csv.DictReader(handle):
                    self.assertNotIn(", ", row["Collaborators"], path.name)


if __name__ == "__main__":
    unittest.main()
