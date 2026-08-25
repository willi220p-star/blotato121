import unittest

from lib.scrape import extract, validate_url
from scrapling.parser import Selector


class ScrapeHelpersTest(unittest.TestCase):
    def test_validate_url(self):
        self.assertEqual(validate_url("https://example.com/x"), "https://example.com/x")
        with self.assertRaises(ValueError):
            validate_url("file:///etc/passwd")
        with self.assertRaises(ValueError):
            validate_url("not-a-url")

    def test_extract_css_from_html(self):
        page = Selector("<html><head><title>Demo</title></head><body><h1>Hello</h1><p class='q'>One</p><p class='q'>Two</p></body></html>")
        payload = extract(page, css=".q::text")
        self.assertEqual(payload["title"], "Demo")
        self.assertEqual(payload["heading"], "Hello")
        self.assertEqual(payload["matches"], ["One", "Two"])


if __name__ == "__main__":
    unittest.main()
