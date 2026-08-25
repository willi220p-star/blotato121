import unittest

from lib.enrich import (
    clay_rows,
    extract_carevo_profile_urls,
    parse_carevo_profile,
    parse_lsnt_referral_text,
    parse_zipleaf_profile,
)
from lib.signals import robots_allows


LSNT_FIXTURE = """
Firm Name Address Contact
Firm Referral List - Business/commercial 9 July 2026
Firm Count = 12Region - Darwin
Tel
Fax
Bowden McCormack Lawyers 8941 6355
8941 6366
Suite 4 Level 1 Northgate
Plaza
101 Mitchell Street
Darwin  NT  0800
Tel
Fax
Bradley Solicitors Pty Ltd 8941 1677
2/33 Paspaley Place
Cullen Bay  NT  0820
Tel
Fax
Cozens Johansen Lawyers Pty
Ltd
8911 1280
Level 1,
48-50 Smith Street
Darwin  NT  0800
"""

CAREVO_HTML = """
<a href="/providers/ndis/nt/darwin-city/horizon-community-services-2">Horizon</a>
<a href="/providers/ndis/nt/darwin-city/help-for-all-pty-ltd">Help</a>
<a href="/providers/ndis/nt/darwin-city/cairns">Cairns</a>
<a href="/go/horizon">skip outbound</a>
"""

ZIPLEAF_HTML = """
<h1>HHAccountant</h1>
<a href="https://hhaccountant.com.au/">Website</a>
<p>Level 16, Charles Darwin Centre 19 Smith Street Mall, Darwin City NT 0800</p>
<p>0422315568</p>
<p>hello@hhaccountant.com.au</p>
"""


class EnrichHelpersTest(unittest.TestCase):
    def test_carevo_profile_urls_skip_go_and_city_slugs(self):
        urls = extract_carevo_profile_urls(CAREVO_HTML, "https://carevo.com.au/providers/ndis/nt/darwin-city")
        self.assertEqual(len(urls), 2)
        self.assertTrue(any("horizon-community-services-2" in u for u in urls))
        self.assertFalse(any("/go/" in u for u in urls))
        self.assertFalse(any(u.endswith("/cairns") for u in urls))

    def test_carevo_profile_parse(self):
        html = "<h1>Horizon Community Services | NDIS in Darwin City, NT</h1><p>Call 0432 070 448</p>"
        row = parse_carevo_profile(html, "Call 0432 070 448", "https://carevo.com.au/providers/ndis/nt/darwin-city/horizon", {"id": "x", "vertical": "ndis", "name": "Carevo", "source_type": "directory", "city": "Darwin", "state": "NT"})
        self.assertEqual(row["company_name"], "Horizon Community Services")
        self.assertEqual(row["phone"], "0432 070 448")
        self.assertEqual(row["vertical"], "ndis")

    def test_lsnt_pdf_firms(self):
        source = {"id": "lsnt", "vertical": "legal", "name": "LSNT", "source_type": "association", "city": "Darwin", "state": "NT"}
        rows = parse_lsnt_referral_text(LSNT_FIXTURE, source, "https://example.com/firms.pdf")
        names = [r["company_name"] for r in rows]
        self.assertIn("Bowden McCormack Lawyers", names)
        self.assertIn("Bradley Solicitors Pty Ltd", names)
        self.assertTrue(any("Cozens Johansen" in n for n in names))
        bowden = next(r for r in rows if r["company_name"] == "Bowden McCormack Lawyers")
        self.assertEqual(bowden["phone"], "8941 6355")

    def test_zipleaf_profile(self):
        source = {"id": "z", "vertical": "accounting", "name": "ZipLeaf", "source_type": "local_listing", "city": "Darwin", "state": "NT"}
        row = parse_zipleaf_profile(ZIPLEAF_HTML, "HHAccountant 0422315568 hello@hhaccountant.com.au Darwin NT", "https://au.zipleaf.com/Companies/HHAccountant", source)
        self.assertEqual(row["company_name"], "HHAccountant")
        self.assertEqual(row["website"], "https://hhaccountant.com.au/")
        self.assertEqual(row["domain"], "hhaccountant.com.au")
        self.assertTrue(row["phone"])
        self.assertEqual(row["email"], "hello@hhaccountant.com.au")

    def test_1300_and_glued_landline(self):
        from lib.enrich import first_phone

        self.assertEqual(first_phone("Call 1300 391 330 today"), "1300 391 330")
        self.assertEqual(first_phone("McCormack Legal 7913 7114GPO Box 2874"), "7913 7114")

    def test_clay_shape(self):
        rows = clay_rows(
            [
                {
                    "company_name": "Acme",
                    "website": "https://acme.test",
                    "domain": "acme.test",
                    "email": "",
                    "phone": "08 0000 0000",
                    "city": "Darwin",
                    "state": "NT",
                    "vertical": "legal",
                    "source_name": "LSNT",
                    "source_url": "https://example.com",
                }
            ]
        )
        self.assertEqual(rows[0]["industry"], "legal")
        self.assertEqual(rows[0]["linkedin_url"], "")

    def test_carevo_go_disallow(self):
        robots = "User-agent: *\nAllow: /\nDisallow: /go/\n"
        self.assertTrue(robots_allows("https://carevo.com.au/providers/ndis/nt/darwin-city", robots))
        self.assertFalse(robots_allows("https://carevo.com.au/go/horizon", robots))


if __name__ == "__main__":
    unittest.main()
