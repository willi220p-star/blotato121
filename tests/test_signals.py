import unittest

from lib.signals import (
    detect_text_signals,
    diff_tech,
    extract_linkedin_urls,
    extract_roles,
    is_seek_job_url,
    parse_seek_titles,
    robots_allows,
    seek_search_url,
    seek_url_allowed,
    snippet_around,
)


COMPANY = {"name": "Triple R Community Service", "domain": "triplerccs.com.au"}

SEEK_ROBOTS = """
User-agent: *
Disallow: */job/
Disallow: *?
Allow: *?advertiserid
Allow: *?keywords
"""


class SignalHelpersTest(unittest.TestCase):
    def test_hiring_from_careers_copy(self):
        text = "Want to work with us? Please fill this form and send it to us by clicking Apply Now. We are looking for a Support Worker."
        signals = detect_text_signals(
            COMPANY,
            "https://www.triplerccs.com.au/career/",
            text,
            "careers",
        )
        hiring = [s for s in signals if s["type"] == "hiring"]
        self.assertTrue(hiring)
        self.assertEqual(hiring[0]["evidence_source"], "careers_page")
        self.assertEqual(hiring[0]["role"], "Support Worker")
        self.assertGreaterEqual(hiring[0]["confidence"], 0.7)

    def test_expansion_ignores_expanding_our_work(self):
        text = "We are committed to continuous self-improvement, constantly refining and expanding our work to ensure quality."
        signals = detect_text_signals(COMPANY, "https://www.triplerccs.com.au/about-us/", text, "about")
        self.assertFalse([s for s in signals if s["type"] == "expansion"])

    def test_expansion_from_multi_office_copy(self):
        text = "Sydney: World Tower, Level 16, NSW 2000. Melbourne: 67 Plumpton Avenue, Glenroy VIC 3046."
        signals = detect_text_signals(
            COMPANY,
            "https://www.triplerccs.com.au/career/",
            text,
            "careers",
        )
        expansion = [s for s in signals if s["type"] == "expansion"]
        self.assertTrue(expansion)
        self.assertIn("Sydney", expansion[0]["locations"])
        self.assertIn("Melbourne", expansion[0]["locations"])

    def test_city_mentions_without_addresses_are_not_expansion(self):
        text = "Trusted by more than 20+ businesses. National reach from Darwin. Clients in Sydney and Melbourne."
        signals = detect_text_signals(
            {"name": "DGK Business Consultancy", "domain": "dgkbusinessconsultancy.com"},
            "https://dgkbusinessconsultancy.com/",
            text,
            "home",
        )
        self.assertFalse([s for s in signals if s["type"] == "expansion"])

    def test_rice_spice_dice_two_stores(self):
        text = (
            "Rice Spice Dice has commenced its business since 2012 and are currently "
            "operating with 2 stores in Kogarah and Auburn with 10-15 employees. "
            "21 Station Street, Kogarah, NSW 2217."
        )
        company = {"name": "Rice Spice & Dice", "domain": "ricespicedice.com.au"}
        signals = detect_text_signals(
            company,
            "https://au.zipleaf.com/Companies/Ricespicedice",
            text,
            "about",
        )
        expansion = [s for s in signals if s["type"] == "expansion"]
        self.assertTrue(expansion)
        self.assertEqual(expansion[0]["evidence_source"], "directory_profile")
        self.assertGreaterEqual(expansion[0]["confidence"], 0.8)
        self.assertFalse([s for s in signals if s["type"] == "hiring"])

    def test_grocery_roles(self):
        self.assertIn("Delivery Driver", extract_roles("Hiring a delivery driver for Auburn"))
        self.assertIn("Picker/Packer", extract_roles("Picker/Packer wanted"))

    def test_expansion_explicit_new_office(self):
        text = "We are expanding our footprint and opened a new office in Brisbane this quarter."
        signals = detect_text_signals(COMPANY, "https://example.com/about", text, "about")
        expansion = [s for s in signals if s["type"] == "expansion"]
        self.assertEqual(len(expansion), 1)
        self.assertGreaterEqual(expansion[0]["confidence"], 0.85)

    def test_leadership_and_relaunch(self):
        text = "Jane Lee joined as Managing Director after we relaunched the website last month."
        signals = detect_text_signals(COMPANY, "https://example.com/about", text, "about")
        types = {s["type"] for s in signals}
        self.assertIn("leadership_hire", types)
        self.assertIn("website_relaunch", types)

    def test_tech_diff(self):
        self.assertIsNone(diff_tech(None, ["Cloudflare"]))
        self.assertIsNone(diff_tech(["Cloudflare"], ["Cloudflare"]))
        delta = diff_tech(["Cloudflare", "HubSpot"], ["Cloudflare", "GoHighLevel"])
        self.assertEqual(delta["added"], ["GoHighLevel"])
        self.assertEqual(delta["removed"], ["HubSpot"])

    def test_seek_policy(self):
        search = seek_search_url("Marketing Manager")
        self.assertIn("keywords=", search)
        self.assertTrue(seek_url_allowed(search))
        self.assertTrue(robots_allows(search, SEEK_ROBOTS))
        job = "https://www.seek.com.au/job/12345"
        self.assertTrue(is_seek_job_url(job))
        self.assertFalse(seek_url_allowed(job))
        self.assertFalse(robots_allows(job, SEEK_ROBOTS))

    def test_linkedin_never_allowed(self):
        url = "https://www.linkedin.com/company/dgk-business-consultancy"
        self.assertFalse(robots_allows(url, "User-agent: *\nAllow: /"))
        self.assertEqual(extract_linkedin_urls("Find us at " + url), [url])

    def test_roles_and_snippet(self):
        self.assertEqual(extract_roles("Hiring a Marketing Manager and a BDM"), ["Marketing Manager", "Business Development"])
        snippet = snippet_around("aaa " + ("x" * 20) + " we're hiring tomorrow", r"we(?:'re| are) hiring")
        self.assertIn("hiring", snippet.lower())

    def test_parse_seek_titles_without_job_urls(self):
        html = '<a data-automation="jobTitle">Marketing Manager</a><a href="/job/99">secret</a>'
        titles = parse_seek_titles(html, "unrelated")
        self.assertEqual(titles, ["Marketing Manager"])


if __name__ == "__main__":
    unittest.main()
