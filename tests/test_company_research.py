import unittest

from lib.company_research import classify_url, detect_tech


class CompanyResearchHelpersTest(unittest.TestCase):
    def test_classify_url(self):
        self.assertEqual(classify_url("https://x.com/about", "About"), "team_about")
        self.assertEqual(classify_url("https://x.com/pricing", "Plans"), "pricing")
        self.assertEqual(classify_url("https://x.com/blog/post", "News"), "news_blog")
        self.assertIsNone(classify_url("https://x.com/contact", "Contact"))

    def test_detect_tech(self):
        html = """
        <script src="https://www.googletagmanager.com/gtm.js?id=GTM-X"></script>
        <script src="https://js.hs-scripts.com/123.js"></script>
        <link href="https://cdn.shopify.com/s/files/x.css">
        """
        stack = detect_tech(html)
        self.assertIn("Google Tag Manager", stack)
        self.assertIn("HubSpot", stack)
        self.assertIn("Shopify", stack)


if __name__ == "__main__":
    unittest.main()
