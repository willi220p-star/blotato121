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

## Prospect / company research

Pull team/about copy, pricing signals, blog posts, and tech-stack hints from a company site:

```bash
python3 scripts/research_company.py https://dgkbusinessconsultancy.com \
  --json-out research/dgk-business-consultancy.json \
  --md-out research/dgk-business-consultancy.md
```

The crawler follows the sitemap, skips paths disallowed by `robots.txt` (`/directory` on DGK), and stays on the same host.

## Signal detection (`dgk-signal-source`)

Scan a watchlist for hiring, expansion, leadership-hire, website-relaunch, and tech-stack-change signals. Output is the JSON feed at `feeds/dgk-signal-source.json`. Default names: Rice Spice & Dice, Triple R Community Service, and DGK.

```bash
python3 scripts/detect_signals.py \
  --watchlist feeds/watchlist.json \
  --out feeds/dgk-signal-source.json
```

Sources:

- Company **About Us** and **careers** pages (robots.txt honored)
- **SEEK** search URLs with `?keywords=` only (robots `Allow: *?keywords`). Individual `*/job/` listings are never fetched. SEEK currently returns Cloudflare 403 from this environment; the miss is recorded on the feed instead of invented jobs.
- **LinkedIn company pages are not crawled.** URLs found on the company site are listed under `linkedin_watch` for the official API or manual review.

Tech-stack changes compare the current homepage stack against `research/signal-snapshots/<domain>.json`. The first run creates the baseline; later runs emit `tech_stack_change` when tools appear or disappear.

`GET /api/signals` serves the latest feed. `POST /api/signals` runs a scan.

## List-building enrichment (`dgk-list-enrichment`)

Fill gaps Clay, Apollo, and FullEnrich leave on sites without a list API: niche directories, association member PDFs, and local listings.

```bash
python3 scripts/enrich_list.py \
  --sources feeds/enrichment-sources.json \
  --out feeds/dgk-list-enrichment.json
```

Default Darwin/NT sources:

- **NDIS** — Carevo suburb listings (`/providers/ndis/nt/darwin-city`), profile pages followed, `/go/` redirects skipped
- **Legal** — Law Society NT public firm-referral PDFs
- **Accounting** — ZipLeaf company pages (search is robots-disallowed)
- **Physio** — Australian Physiotherapy Association [Find a Physio](https://choose.physio/find-a-physio) (NT hubs: Darwin, Katherine, Alice Springs, Tennant Creek, Nhulunbuy). DGK `/directory` is not crawled (robots).

Output includes `records` plus a `clay` array and `feeds/dgk-list-enrichment.clay.csv` ready to import. LinkedIn URLs are left blank for those tools to enrich. `GET /api/enrich` / `POST /api/enrich` expose the same feed on the console.
