import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(REPO))

from scraper.company_discovery import parse_best_accountants, parse_pink_pages
from scraper.contact_extractor import attach_published_email, classify_company_emails, extract_emails
from scraper.deduplication import canonical_name, dedupe_companies
from scraper.validation import confidence_score, is_darwin_area, normalize_email, normalize_phone

BEST_HTML = """
<html><body>
  <h3>Nexia Edwards Marshall NT</h3>
  <div>
    <p>Nexia Edwards Marshall NT is an accounting practice based in Darwin City, Darwin. Specialises in: Business advisory, Taxation, Audit.</p>
    <p>Level 2, 80 Mitchell Street, Darwin NT 0800</p>
    <p>(08) 8981 5585</p>
    <a href="https://nexiaemnt.com.au/">Firm website</a>
  </div>
  <h3>RBA Chartered Accountants</h3>
  <div>
    <p>RBA Chartered Accountants (Woolner) is a Darwin NT firm. Specialises in: Family businesses, Agribusiness.</p>
    <p>Unit 20/16 Charlton Crt, Woolner NT 0820</p>
    <p>(08) 8981 2444</p>
    <a href="https://rbant.com.au/">Firm website</a>
  </div>
</body></html>
"""

PINK_HTML = """
<html><body>
  <div class="search-listing">
    <a href="https://pinkpages.com.au/businesses/bdo-10442637"><p>BDO</p></a>
    <div class="listing_address">72 Cavenagh St, DARWIN NT 0800 08 8... Click to show 08 8981 7066</div>
  </div>
  <div class="search-listing">
    <a href="https://pinkpages.com.au/businesses/sydney-only"><p>Sydney Only Tax</p></a>
    <div class="listing_address">1 George St, SYDNEY NSW 2000 02 9... Click to show 02 9000 0000</div>
  </div>
</body></html>
"""


class DarwinAccountingMvpTest(unittest.TestCase):
    def test_parsers_keep_darwin_and_drop_interstate(self):
        best = parse_best_accountants(BEST_HTML, "https://bestaccountantsaustralia.com.au/best/darwin/")
        names = {row["company_name"] for row in best}
        self.assertIn("Nexia Edwards Marshall NT", names)
        nexia = next(row for row in best if row["company_name"].startswith("Nexia"))
        self.assertEqual(nexia["website"], "https://nexiaemnt.com.au/")
        self.assertTrue(nexia["phone"])
        pink = parse_pink_pages(PINK_HTML, "https://pinkpages.com.au/services/ACCOUNTANTS-608/loc/darwin-nt-region-NT")
        pink_names = {row["company_name"] for row in pink}
        self.assertIn("BDO", pink_names)
        self.assertNotIn("Sydney Only Tax", pink_names)

    def test_dedupe_and_phones(self):
        self.assertEqual(canonical_name("BDO Pty Ltd"), canonical_name("BDO"))
        original, normalized = normalize_phone("(08) 8981 5585")
        self.assertEqual(original, "(08) 8981 5585")
        self.assertEqual(normalized, "+61889815585")
        rows, removed = dedupe_companies(
            [
                {"company_name": "BDO", "website": "https://www.bdo.com.au", "phone": "08 8981 7066"},
                {"company_name": "BDO Darwin", "website": "https://bdo.com.au/en-au/locations/darwin", "email": "darwin@bdo.com.au"},
            ]
        )
        self.assertEqual(len(rows), 1)
        self.assertEqual(removed, 1)
        self.assertEqual(rows[0]["email"], "darwin@bdo.com.au")

    def test_emails_never_guessed_or_personal(self):
        emails = extract_emails("info@nexiaemnt.com.au and jane@gmail.com and jane.smith@nexiaemnt.com.au", "https://nexiaemnt.com.au")
        values = [row["email"] for row in emails]
        self.assertIn("info@nexiaemnt.com.au", values)
        self.assertNotIn("jane@gmail.com", values)
        classified = classify_company_emails(emails)
        self.assertEqual(classified["info_email"], "info@nexiaemnt.com.au")
        self.assertIsNone(normalize_email("not-an-email"))
        person = attach_published_email(
            {"first_name": "Jane", "last_name": "Smith", "public_work_email": None, "source_url": "https://nexiaemnt.com.au/team"},
            emails,
        )
        self.assertEqual(person["public_work_email"], "jane.smith@nexiaemnt.com.au")
        unmatched = attach_published_email({"first_name": "Jane", "last_name": "Smith", "public_work_email": None}, [{"email": "info@nexiaemnt.com.au"}])
        self.assertIsNone(unmatched["public_work_email"])

    def test_confidence_and_location(self):
        self.assertTrue(is_darwin_area("72 Cavenagh St, Darwin NT 0800"))
        self.assertFalse(is_darwin_area("1 George St, Sydney NSW 2000"))
        score, status = confidence_score(official_website=True, source_count=2, has_contact=True, darwin_ok=True)
        self.assertGreaterEqual(score, 90)
        self.assertEqual(status, "verified_website")
        low, low_status = confidence_score(official_website=False, source_count=1, has_contact=False, darwin_ok=False)
        self.assertLess(low, 50)
        self.assertEqual(low_status, "uncertain")


if __name__ == "__main__":
    unittest.main()
