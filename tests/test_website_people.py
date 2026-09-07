import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from openpyxl import Workbook, load_workbook

from lib.website_people import (
    extract_people_from_html,
    normalise_person_linkedin_url,
    organisations_from_workbook,
    write_enriched_workbook,
)


class WebsitePeopleTest(unittest.TestCase):
    def test_normalise_person_linkedin_url(self):
        self.assertEqual(
            normalise_person_linkedin_url(
                "https://au.linkedin.com/in/jane-smith-123/?trk=profile"
            ),
            "https://www.linkedin.com/in/jane-smith-123",
        )
        self.assertEqual(
            normalise_person_linkedin_url("https://linkedin.com/company/example"),
            "",
        )

    def test_extracts_official_link_and_structured_person(self):
        page = """
        <html><body>
          <section class="team-card">
            <h3>Jane Smith</h3>
            <p>Chief Executive Officer</p>
            <a href="https://www.linkedin.com/in/jane-smith-123">LinkedIn</a>
          </section>
          <script type="application/ld+json">
            {"@type":"Person","name":"David Jones","jobTitle":"Director"}
          </script>
          <p>Heidi Coleman – Head Of Finance</p>
          <h3>Tre Manning-Watson</h3>
          <p>Regional Manager – Northern Territory &amp; South Australia</p>
          <h3>Jack Hatcher</h3>
          <p>Regional Manager – Cairns</p>
        </body></html>
        """
        people = extract_people_from_html(page, "https://example.org/our-team")
        by_name = {person["person_name"]: person for person in people}
        self.assertEqual(
            by_name["Jane Smith"]["linkedin_profile_url"],
            "https://www.linkedin.com/in/jane-smith-123",
        )
        self.assertIn("Chief Executive Officer", by_name["Jane Smith"]["role"])
        self.assertEqual(by_name["David Jones"]["role"], "Director")
        self.assertEqual(by_name["Heidi Coleman"]["role"], "Head Of Finance")
        self.assertEqual(
            by_name["Tre Manning-Watson"]["role"],
            "Regional Manager – Northern Territory & South Australia",
        )
        self.assertEqual(by_name["Jack Hatcher"]["role"], "Regional Manager – Cairns")

    def test_excludes_article_headings_that_are_not_people(self):
        page = """
        <html><body>
          <article>
            <h2>How you pay for providers</h2>
            <p>Before your Plan Manager starts helping you manage your plan.</p>
            <h3>Meet Our Team</h3>
            <p>Our team includes experienced managers.</p>
          </article>
        </body></html>
        """
        self.assertEqual(
            extract_people_from_html(page, "https://example.org/content-hub/article"),
            [],
        )

    def test_writes_joined_people_sheet(self):
        with TemporaryDirectory() as tmp:
            source = Path(tmp) / "source.xlsx"
            destination = Path(tmp) / "result.xlsx"
            workbook = Workbook()
            how = workbook.active
            how.title = "How to use"
            how.append(["Guide"])
            organisations = workbook.create_sheet("National non-profits")
            organisations.append(
                [
                    "category",
                    "business_name",
                    "legal_name",
                    "abn",
                    "website",
                    "linkedin_company_url",
                ]
            )
            organisations.append(
                [
                    "nonprofit",
                    "Example Care",
                    "Example Care Ltd",
                    "123 456 789 01",
                    "https://example.org",
                    "https://www.linkedin.com/company/example-care",
                ]
            )
            workbook.save(source)
            organisation_map = organisations_from_workbook(source)
            results = {
                "12345678901": {
                    "status": "people found",
                    "pages_checked": ["https://example.org/team"],
                    "people": [
                        {
                            "person_name": "Jane Smith",
                            "role": "CEO",
                            "linkedin_profile_url": "https://www.linkedin.com/in/jane-smith",
                            "source_type": "official website LinkedIn link",
                            "source_url": "https://example.org/team",
                            "confidence": "high",
                        }
                    ],
                }
            }
            summary = write_enriched_workbook(
                source,
                destination,
                organisation_map,
                results,
            )
            output = load_workbook(destination)
            self.assertIn("Organizations", output.sheetnames)
            self.assertIn("People", output.sheetnames)
            self.assertEqual(output["People"]["D2"].value, "Jane Smith")
            self.assertEqual(
                output["People"]["F2"].hyperlink.target,
                "https://www.linkedin.com/in/jane-smith",
            )
            self.assertEqual(summary["public_people"], 1)


if __name__ == "__main__":
    unittest.main()
