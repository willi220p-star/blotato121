import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from src.darwin_it.careers.pages import extract_vacancies, plausible_it_job
from src.darwin_it.company.classify import classify_category, service_type, summarise_description
from src.darwin_it.discovery.ictnt import parse_ictnt_profiles
from src.darwin_it.discovery.seeds import load_seed_companies
from src.darwin_it.employees.extract import apply_employee_hint, extract_employee_count
from src.darwin_it.export.writers import completeness, summary_markdown, write_outputs
from src.darwin_it.validation.confidence import hiring_signal, research_confidence, size_segment, vacancy_status
from src.darwin_it.validation.dedupe import canonical_name, dedupe_companies, domain_key


class DarwinItResearchTest(unittest.TestCase):
    def test_seed_list_is_deduplicated_and_named(self):
        seeds = load_seed_companies()
        names = [row["company_name"] for row in seeds]
        self.assertGreaterEqual(len(seeds), 45)
        self.assertEqual(len(names), len(set(names)))
        self.assertIn("One IT Services", names)
        self.assertIn("New Future IT", names)
        self.assertIn("Portal Technology", names)

    def test_dedupes_legal_suffix_and_domain(self):
        self.assertEqual(canonical_name("NT Infotech Pty Ltd"), canonical_name("NT INFOTECH"))
        self.assertEqual(domain_key("https://www.oneitservices.com.au/about"), "oneitservices.com.au")
        rows = dedupe_companies(
            [
                {"company_name": "NT Infotech Pty Ltd", "company_website": "https://example.net/a"},
                {"company_name": "NT INFOTECH", "company_website": "https://example.net/a", "linkedin_url": "https://linkedin.com/company/nt-infotech"},
            ]
        )
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["linkedin_url"], "https://linkedin.com/company/nt-infotech")

    def test_employee_range_is_not_converted_to_exact(self):
        row = extract_employee_count("LinkedIn says 11-50 employees in Darwin.", "https://example.com", "Public LinkedIn snippet")
        self.assertEqual(row["employee_count"], "11-50")
        self.assertEqual(row["employee_count_type"], "range")
        self.assertEqual(row["employee_count_min"], "11")
        self.assertEqual(row["employee_count_max"], "50")
        stated = extract_employee_count("We have 25 staff supporting Darwin businesses.", "https://example.com/about", "Company website")
        self.assertEqual(stated["employee_count"], "25")
        self.assertEqual(stated["employee_count_type"], "company stated")
        missing = apply_employee_hint({"employee_count": "12"})
        self.assertEqual(missing["employee_count"], "Unknown")

    def test_size_and_signals_use_evidence_only(self):
        self.assertEqual(size_segment("11-50", "11", "50"), "11-50")
        self.assertEqual(size_segment("Unknown"), "Unknown")
        self.assertEqual(vacancy_status(2, 1, "YES", "Vacancies listed"), "Company + SEEK vacancies found")
        self.assertEqual(vacancy_status(0, 0, "YES", "Career page exists but no vacancy"), "Career page exists but no vacancy")
        self.assertEqual(hiring_signal(0, 0, "Unable to verify"), "Unknown")
        self.assertEqual(hiring_signal(0, 0, "OK"), "None")
        self.assertEqual(hiring_signal(4, 0, "Unable to verify"), "Strong")
        self.assertEqual(
            research_confidence(
                website="https://example.com",
                website_ok=True,
                employee_count="23",
                employee_type="estimated",
                vacancy_count=1,
                career_found="YES",
                darwin_verified=True,
            ),
            "High",
        )

    def test_classifies_msp_and_summarises_without_copying_long_text(self):
        self.assertEqual(classify_category("Darwin MSP delivering managed IT and cybersecurity"), "Managed Service Provider")
        self.assertEqual(service_type("custom software development for government"), "Software")
        summary = summarise_description("A" * 900, "Example", "Winnellie", "MSP")
        self.assertLessEqual(len(summary), 420)

    def test_extracts_jobposting_and_rejects_service_links(self):
        page = """
        <html><body>
          <script type="application/ld+json">
          {
            "@type":"JobPosting",
            "title":"Senior Systems Engineer",
            "url":"/careers/systems-engineer",
            "employmentType":"FULL_TIME",
            "jobLocation":{"address":{"addressLocality":"Darwin","addressRegion":"NT"}}
          }
          </script>
          <a href="/services/managed-it">Managed IT Services</a>
          <a href="/careers/helpdesk-technician">Helpdesk Technician</a>
          <h3>Desktop Support Engineers - Darwin &amp; Brisbane</h3>
          <a href="/Career/GetJobDescription?jobId=7&amp;title=.NET%20Senior%20Developer%2FTeam%20Lead">Apply Now</a>
        </body></html>
        """
        jobs = extract_vacancies(page, "https://example.com/careers")
        titles = {job["vacancy_title"] for job in jobs}
        self.assertIn("Senior Systems Engineer", titles)
        self.assertIn("Helpdesk Technician", titles)
        self.assertIn("Desktop Support Engineers - Darwin & Brisbane", titles)
        self.assertIn(".NET Senior Developer/Team Lead", titles)
        self.assertNotIn("Managed IT Services", titles)
        self.assertTrue(plausible_it_job("Network Engineer"))
        self.assertFalse(plausible_it_job("Contact"))

    def test_parses_ictnt_and_skips_alice_springs(self):
        html = """
        <a href="/ict-directory/205">One IT Services Darwin view profile</a>
        <a href="/ict-directory/1">Red Centre Technology Partners Alice-springs view profile</a>
        """
        rows = parse_ictnt_profiles(html)
        names = [row["company_name"] for row in rows]
        self.assertEqual(names, ["One IT Services"])

    def test_export_writes_three_tables_and_completeness(self):
        companies = [
            {
                "company_name": "Example MSP",
                "company_description": "Darwin MSP",
                "company_website": "https://example.com",
                "linkedin_url": "Not found",
                "employee_count": "11-50",
                "career_page_found": "YES",
                "company_vacancy_count": 1,
                "seek_vacancy_count": 0,
                "total_vacancy_count": 1,
                "research_confidence": "High",
            }
        ]
        vacancies = [
            {
                "company_name": "Example MSP",
                "vacancy_title": "Systems Engineer",
                "vacancy_source": "Company Career Page",
                "vacancy_url": "https://example.com/jobs/1",
                "vacancy_location": "Darwin",
                "employment_type": "FULL_TIME",
            }
        ]
        stats = completeness(companies, vacancies)
        self.assertEqual(stats["total_companies_found"], 1)
        self.assertEqual(stats["companies_with_employee_data"], 1)
        self.assertEqual(stats["official_career_vacancies"], 1)
        markdown = summary_markdown(companies, vacancies, stats)
        self.assertIn("Total companies discovered: **1**", markdown)
        with TemporaryDirectory() as tmp:
            data = Path(tmp) / "data"
            reports = Path(tmp) / "reports"
            feeds = Path(tmp) / "feeds"
            write_outputs(companies, vacancies, [], data_dir=data, reports_dir=reports, feeds_dir=feeds)
            self.assertTrue((data / "companies.csv").is_file())
            self.assertTrue((data / "vacancies.csv").is_file())
            self.assertTrue((data / "sources.csv").is_file())
            self.assertTrue((feeds / "Darwin_IT_company_database.xlsx").is_file())
            self.assertTrue((reports / "darwin-it-market-summary.md").is_file())


if __name__ == "__main__":
    unittest.main()
