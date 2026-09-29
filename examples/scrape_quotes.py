"""Fetch the first quotes from https://quotes.toscrape.com with Scrapling."""

from scrapling.fetchers import Fetcher

page = Fetcher.get("https://quotes.toscrape.com/", timeout=30)
quotes = page.css(".quote")
for quote in quotes[:5]:
    text = quote.css(".text::text").get()
    author = quote.css(".author::text").get()
    print(f"{text} — {author}")
print(f"status={page.status} count={len(quotes)}")
