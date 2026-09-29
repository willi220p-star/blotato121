import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from src.nt_ndis.deduplication import canonical_name, dedupe_companies, dedupe_employees
from src.nt_ndis.discovery import aggregate_nt_private
from src.nt_ndis.email_finder import attach_published_email, company_email, extract_emails
from src.nt_ndis.employee_scraper import people_from_html
from src.nt_ndis.exporters import completeness, write_outputs
from src.nt_ndis.queries import company_discovery_queries, employee_queries, vacancy_queries
from src.nt_ndis.validation import classify_org_type, email_status, nt_locations
from src.nt_ndis.vacancy_scraper import vacancies_from_html
from lib.ndis_providers import parse_register_rows

REGISTER = """Provider business name,Legal name,ABN,Head office address,Website,Registration status,Period of registration in force until,Approved registration groups,Conditions of registration,Outlet name,Outlet address,Outlet phone
Loving Arms Care,LOVING ARMS CARE PTY LTD,93626262208,"DARWIN CITY, NT, 0800, AU",https://www.lovingarmscare.com.au,Approved,25 June 2027,Assist-Personal Activities; Participate Community,,HQ,"1 Smith ST, Darwin, NT, 0800, AU",+61080000001
Total Recreation,TOTAL RECREATION NT INC,92148147305,"CASUARINA, NT, 0810, AU",https://www.totalrecreation.org.au,Approved,31 May 2027,Group/Centre Activities; Participate Community,,TR,"Casuarina, NT, 0810, AU",+61080000002
Clinic NT,CLINIC ONLY PTY LTD,11111111111,"DARWIN CITY, NT, 0800, AU",https://clinic.example,Approved,1 January 2027,Therapeutic Supports,,Clinic,"Darwin, NT, 0800, AU",
East Arnhem,East Arnhem Regional Council,92334301078,"DARWIN CITY, NT, 0800, AU",https://www.eastarnhem.net.au,Approved,08 November 2027,Assist-Personal Activities,,Council,"Darwin, NT, 0800, AU",
Sole Trader,"NICHOLLS, TIMOTHY JOHN",22222222222,"DARWIN CITY, NT, 0800, AU",,Approved,1 January 2027,Therapeutic Supports,,Ortho,"Darwin, NT, 0800, AU",
Hunter Carers,HUNTER CARERS LTD,48055975927,"CARDIFF, NSW, 2285, AU",https://huntercarers.org.au,Approved,10 November 2028,Assist-Personal Activities; Supported Independent Living,,Hunter,"Cardiff, NSW, 2285, AU",
Revoked Co,REVOKED CARE PTY LTD,33333333333,"DARWIN CITY, NT, 0800, AU",,Revoked,1 January 2020,Assist-Personal Activities,,Old,"Darwin, NT, 0800, AU",
Alice Physio,ALICE SPRINGS THERAPY PTY LTD,44444444444,"ALICE SPRINGS, NT, 0870, AU",https://alice.example,Approved,1 January 2028,Therapeutic Supports,,Clinic,"Alice Springs, NT, 0870, AU",
"""

TEAM_HTML = """
<html><body>
  <meta name="description" content="Private NDIS support in Darwin and Palmerston." />
  <p>Contact us at info@lovingarmscare.com.au or call 08 8941 0000.</p>
  <a href="mailto:info@lovingarmscare.com.au">Email</a>
  <section class="team-card">
    <h3>Jane Smith</h3>
    <p>Operations Manager</p>
    <a href="mailto:jane.smith@lovingarmscare.com.au">Jane</a>
    <a href="https://www.linkedin.com/in/jane-smith-123">LinkedIn</a>
  </section>
  <a href="https://www.linkedin.com/company/loving-arms-care">Company LinkedIn</a>
  <h2>Current vacancies</h2>
  <script type="application/ld+json">
  {"@type":"JobPosting","title":"Support Coordinator","url":"/jobs/support-coordinator","datePosted":"2026-09-01","jobLocation":{"@type":"Place","address":{"addressLocality":"Darwin","addressRegion":"NT"}}}
  </script>
</body></html>
"""


class NtNdisIntelligenceTest(unittest.TestCase):
    def test_classifies_private_and_excludes_government(self):
        self.assertEqual(classify_org_type("LOVING ARMS CARE PTY LTD", "Loving Arms"), "private_company")
        self.assertEqual(classify_org_type("TOTAL RECREATION NT INC", "Total Recreation"), "nonprofit_ndis")
        self.assertEqual(classify_org_type("NICHOLLS, TIMOTHY JOHN", "Ortho"), "sole_trader")
        self.assertIsNone(classify_org_type("East Arnhem Regional Council", "East Arnhem"))
        self.assertIsNone(classify_org_type("NORTHERN TERRITORY GOVERNMENT", "NT Health"))

    def test_nt_locations_from_public_address(self):
        self.assertEqual(nt_locations("1 Smith ST, Darwin, NT, 0800"), ["Darwin"])
        self.assertIn("Alice Springs", nt_locations("ALICE SPRINGS, NT, 0870, AU"))
        self.assertEqual(nt_locations("Cardiff, NSW, 2285"), [])

    def test_aggregate_keeps_nt_private_and_allied_health(self):
        rows = aggregate_nt_private(parse_register_rows(REGISTER))
        by_abn = {row["abn"]: row for row in rows}
        self.assertIn("93626262208", by_abn)
        self.assertIn("11111111111", by_abn)
        self.assertEqual(by_abn["11111111111"]["org_type"], "private_company")
        self.assertIn("22222222222", by_abn)
        self.assertEqual(by_abn["22222222222"]["org_type"], "sole_trader")
        self.assertIn("44444444444", by_abn)
        self.assertEqual(by_abn["44444444444"]["locations"], "Alice Springs")
        self.assertNotIn("92334301078", by_abn)
        self.assertNotIn("48055975927", by_abn)
        self.assertNotIn("33333333333", by_abn)
        self.assertEqual(by_abn["93626262208"]["ndis_provider"], "yes")
        self.assertEqual(by_abn["93626262208"]["nt_operation_verified"], "yes")

    def test_dedupes_abn_domain_and_employees(self):
        self.assertEqual(canonical_name("Loving Arms Care Pty Ltd"), "loving arms care")
        companies = dedupe_companies(
            [
                {"abn": "93626262208", "company_name": "Loving Arms Care Pty Ltd", "website": "", "phone": ""},
                {"abn": "93626262208", "company_name": "Loving Arms", "website": "https://www.lovingarmscare.com.au", "phone": "0889410000"},
            ]
        )
        self.assertEqual(len(companies), 1)
        self.assertEqual(companies[0]["website"], "https://www.lovingarmscare.com.au")
        people = dedupe_employees(
            [
                {"company_id": "1", "full_name": "Jane Smith", "linkedin_url": ""},
                {"company_id": "1", "full_name": "Jane Smith", "linkedin_url": "https://www.linkedin.com/in/jane-smith-123"},
            ]
        )
        self.assertEqual(len(people), 1)
        self.assertTrue(people[0]["linkedin_url"])

    def test_public_emails_reject_personal_and_never_invent(self):
        emails = extract_emails(
            "info@lovingarmscare.com.au please email jane@gmail.com and admin@lovingarmscare.com.au",
            "https://www.lovingarmscare.com.au",
        )
        values = [row["email"] for row in emails]
        self.assertIn("info@lovingarmscare.com.au", values)
        self.assertNotIn("jane@gmail.com", values)
        self.assertEqual(company_email(emails), "info@lovingarmscare.com.au")
        self.assertEqual(email_status("info@lovingarmscare.com.au", "https://www.lovingarmscare.com.au"), "verified_public")
        self.assertEqual(email_status("guess@lovingarmscare.com.au", "https://www.lovingarmscare.com.au", "inferred"), "inferred")
        self.assertEqual(email_status("", ""), "unavailable")
        person = attach_published_email(
            {"first_name": "Jane", "last_name": "Smith", "work_email": "Not publicly available"},
            [{"email": "jane.smith@lovingarmscare.com.au", "email_type": "public", "email_verified": True, "email_status": "verified_public"}],
        )
        self.assertEqual(person["work_email"], "jane.smith@lovingarmscare.com.au")
        unmatched = attach_published_email(
            {"first_name": "Jane", "last_name": "Smith", "work_email": "Not publicly available"},
            [{"email": "info@lovingarmscare.com.au", "email_type": "public", "email_verified": True, "email_status": "verified_public"}],
        )
        self.assertEqual(unmatched["work_email"], "Not publicly available")

    def test_people_and_vacancies_from_official_html(self):
        company = {"company_id": "93626262208", "company_name": "Loving Arms Care", "abn": "93626262208", "locations": "Darwin"}
        people = people_from_html(TEAM_HTML, "https://www.lovingarmscare.com.au/team", company)
        names = {row["full_name"] for row in people}
        self.assertIn("Jane Smith", names)
        jane = next(row for row in people if row["full_name"] == "Jane Smith")
        self.assertEqual(jane["job_title"], "Operations Manager")
        self.assertEqual(jane["priority_role"], "yes")
        jobs = vacancies_from_html(TEAM_HTML, "https://www.lovingarmscare.com.au/careers", company)
        titles = {row["job_title"] for row in jobs}
        self.assertIn("Support Coordinator", titles)

    def test_search_queries_cover_nt_locations(self):
        queries = company_discovery_queries()
        self.assertTrue(any("Darwin" in query for query in queries))
        self.assertTrue(any("Alice Springs" in query for query in queries))
        self.assertTrue(any("Katherine" in query for query in queries))
        self.assertTrue(employee_queries("Loving Arms Care"))
        self.assertTrue(vacancy_queries("Loving Arms Care"))

    def test_exports_csv_json_sqlite_and_summary(self):
        companies = [
            {
                "company_id": "93626262208",
                "company_name": "Loving Arms Care",
                "trading_name": "Loving Arms Care",
                "legal_name": "LOVING ARMS CARE PTY LTD",
                "abn": "93626262208",
                "org_type": "private_company",
                "description": "Private NDIS support in Darwin.",
                "services": "Assist-Personal Activities",
                "locations": "Darwin",
                "address": "Darwin NT",
                "phone": "08 8941 0000",
                "website": "https://www.lovingarmscare.com.au",
                "email": "info@lovingarmscare.com.au",
                "linkedin": "Not publicly available",
                "employee_count": "Not publicly available",
                "employee_count_min": "",
                "employee_count_max": "",
                "employee_count_source": "Not publicly available",
                "employee_count_source_url": "",
                "ndis_provider": "yes",
                "ndis_evidence": "Approved registration groups",
                "nt_operation_verified": "yes",
                "scrape_status": "ok",
                "research_confidence": "High",
                "source_urls": "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider",
                "last_verified": "2026-09-29",
            }
        ]
        employees = [
            {
                "company_id": "93626262208",
                "company_name": "Loving Arms Care",
                "abn": "93626262208",
                "first_name": "Jane",
                "last_name": "Smith",
                "full_name": "Jane Smith",
                "job_title": "Operations Manager",
                "department": "Operations",
                "location": "Darwin",
                "linkedin_url": "https://www.linkedin.com/in/jane-smith-123",
                "work_email": "jane.smith@lovingarmscare.com.au",
                "email_type": "public",
                "email_verified": True,
                "email_status": "verified_public",
                "source_url": "https://www.lovingarmscare.com.au/team",
                "source_type": "official website",
                "verification_status": "high",
                "priority_role": "yes",
            }
        ]
        vacancies = [
            {
                "company_id": "93626262208",
                "company_name": "Loving Arms Care",
                "job_title": "Support Coordinator",
                "location": "Darwin NT",
                "employment_type": "Full-time",
                "description": "Published JobPosting",
                "date_posted": "2026-09-01",
                "job_url": "https://www.lovingarmscare.com.au/jobs/support-coordinator",
                "source": "Company Career Page",
                "active": "yes",
                "last_checked": "2026-09-29",
            }
        ]
        sources = [
            {
                "company_id": "93626262208",
                "employee_id": "",
                "vacancy_id": "",
                "source_type": "NDIS Commission register",
                "source_url": "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider",
                "source_title": "Approved NT provider",
                "retrieved_at": "2026-09-29",
            }
        ]
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            stats = write_outputs(
                companies,
                employees,
                vacancies,
                sources,
                output_dir=root / "output",
                data_dir=root / "data",
                feeds_dir=root / "feeds",
                reports_dir=root / "reports",
            )
            self.assertEqual(stats["total_companies_discovered"], 1)
            self.assertEqual(stats["total_employees_found"], 1)
            self.assertTrue((root / "output" / "companies.csv").is_file())
            self.assertTrue((root / "output" / "nt-ndis-intelligence.json").is_file())
            self.assertTrue((root / "output" / "nt-ndis-intelligence.sqlite").is_file())
            self.assertTrue((root / "feeds" / "NT_private_NDIS_provider_intelligence.xlsx").is_file())
            markdown = (root / "reports" / "nt-ndis-private-summary.md").read_text(encoding="utf-8")
            self.assertIn("Total companies discovered", markdown)

    def test_pipeline_enriches_mocked_official_site(self):
        from src.nt_ndis.pipeline import run_research

        discovered = [
            {
                "company_id": "93626262208",
                "company_name": "Loving Arms Care",
                "trading_name": "Loving Arms Care",
                "legal_name": "LOVING ARMS CARE PTY LTD",
                "abn": "93626262208",
                "org_type": "private_company",
                "description": "Not publicly available",
                "services": "Assist-Personal Activities",
                "locations": "Darwin",
                "address": "Darwin NT",
                "website": "https://www.lovingarmscare.com.au",
                "phone": "Not publicly available",
                "email": "Not publicly available",
                "linkedin": "Not publicly available",
                "employee_count": "Not publicly available",
                "employee_count_min": "",
                "employee_count_max": "",
                "employee_count_source": "Not publicly available",
                "employee_count_source_url": "",
                "ndis_provider": "yes",
                "ndis_evidence": "Approved",
                "nt_operation_verified": "yes",
                "source_urls": "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider",
                "last_verified": "2026-09-29",
                "scrape_status": "register_only",
                "research_confidence": "Medium",
            }
        ]

        def fake_fetch(url, **_kwargs):
            return {"ok": True, "status": 200, "url": url, "text": TEAM_HTML, "error": "", "source_status": "OK"}

        with TemporaryDirectory() as tmp, patch(
            "src.nt_ndis.pipeline.discover_companies", return_value=(discovered, ["[DISCOVERED] mock"])
        ), patch("src.nt_ndis.company_scraper.fetch", side_effect=fake_fetch), patch(
            "src.nt_ndis.pipeline.fetch", side_effect=fake_fetch
        ):
            root = Path(tmp)
            payload = run_research(
                output_dir=root / "output",
                data_dir=root / "data",
                feeds_dir=root / "feeds",
                reports_dir=root / "reports",
                cache_path=root / "cache.json",
                log_path=root / "run.log",
                workers=1,
                seek=False,
            )
            company = payload["companies"][0]
            self.assertEqual(company["email"], "info@lovingarmscare.com.au")
            self.assertIn("Private NDIS support", company["description"])
            self.assertTrue(payload["employees"])
            self.assertTrue(any(row["job_title"] == "Support Coordinator" for row in payload["vacancies"]))
            stats = completeness(payload["companies"], payload["employees"], payload["vacancies"])
            self.assertEqual(stats["total_verified_nt_ndis_providers"], 1)


if __name__ == "__main__":
    unittest.main()
