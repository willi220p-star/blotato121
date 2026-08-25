# blotato121

Clone and run [Scrapling](https://github.com/D4Vinci/Scrapling) in this Cloud Agent so you can scrape pages from Cursor without setting it up again.

## What is deployed

- Source checkout: `cloned/scrapling` (gitignored, cloned from GitHub)
- Python package: `scrapling` 0.4.15 with `fetchers` extras
- Local console: `python3 server.py` on port 4173
- CLI: `python3 scripts/scrape.py https://example.com --css 'h1::text'`

## Setup

```bash
./scripts/install-scrapling.sh
```

The install script is idempotent: it reuses the existing clone, reinstalls the editable package, and refreshes browser deps.

## Scrape from the CLI

HTTP fetcher (fast, curl_cffi):

```bash
python3 scripts/scrape.py https://quotes.toscrape.com/ --css '.quote .text::text'
```

Stealthy or Chromium fetchers:

```bash
python3 scripts/scrape.py https://example.com --fetcher stealthy
python3 scripts/scrape.py https://example.com --fetcher dynamic
```

## Scrape from Python

```python
from scrapling.fetchers import Fetcher

page = Fetcher.get("https://quotes.toscrape.com/")
for quote in page.css(".quote"):
    print(quote.css(".text::text").get(), quote.css(".author::text").get())
```

See `examples/scrape_quotes.py`.

## Console UI

```bash
python3 server.py
```

Open `http://127.0.0.1:4173`, paste a URL, and scrape. `POST /api/scrape` accepts `{ "url", "fetcher", "css", "xpath" }`.
