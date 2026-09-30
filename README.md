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

## ARRCS Darwin teams and positions

Roles-only workbook of past, present and future ARRCS teams in Darwin / Palmerston (no named people). Live job ads are Future.

```bash
python3 scripts/arrcs_darwin_teams.py
```

Writes `feeds/ARRCS_Darwin_teams_roles.xlsx`, plus JSON and CSV. Console download: `GET /download/arrcs-darwin-teams.xlsx`.

Scope: Darwin, Palmerston, Tiwi, Coconut Grove, Farrar, Casuarina, Maluka. Family Support (Mutitjulu / Alice Springs) and Flynn Lodge are excluded. SEEK `?keywords=ARRCS Darwin` is attempted as a search URL only; this environment currently gets Cloudflare 403 and individual SEEK `/job/` pages are never fetched. LinkedIn is not crawled. ARRCS `robots.txt` allows the crawl (`Disallow` empty).

## NDIS disability companies and non-profits

The [NDIS Provider Finder](https://www.ndis.gov.au/participants/working-providers/finding-providers/provider-finder) is a React search over registered providers. This project downloads the official NDIS Commission register CSV (robots-allowed) and keeps two kinds of Approved organisations:

- **Disability company** — Pty Ltd / Pty Limited with core disability registration groups
- **Non-profit** — Inc, Association, Foundation, Aboriginal Corporation, or Ltd without Pty plus core disability groups (usually limited by guarantee). Insurers and clinic brands are excluded.

Sole traders, partnerships, government, and clinic-only Pty Ltds (therapy / plan management / equipment only) are excluded. ACNC bulk data is not fetched (`data.gov.au` robots `Disallow: /`).

```bash
python3 scripts/ndis_provider_filter.py
```

Writes `feeds/NDIS_disability_nonprofit.xlsx`. Console: `GET /download/ndis-disability-nonprofit.xlsx`.

### LinkedIn organisation-page enrichment

Add confirmed LinkedIn organisation pages to the non-profit sheets:

```bash
python3 scripts/enrich_ndis_linkedin.py path/to/NDIS_disability_nonprofit.xlsx
```

The enrichment checks each non-profit's official website for a published
LinkedIn company, showcase, or school URL. It does not fetch LinkedIn pages,
does not include personal `/in/` profiles, and leaves uncertain matches blank.
The output adds the URL, profile name, source page, and discovery status.

### Public staff and profile enrichment

Add people published on official organization staff, leadership, board, and
structured-data pages, plus manually verified public search results:

```bash
python3 scripts/enrich_ndis_people.py path/to/NDIS_disability_nonprofit.xlsx \
  --public-search-results feeds/ndis-public-linkedin-search-results.json
```

The output preserves every original sheet and adds normalized `Organizations`
and `People` sheets joined by ABN. Each person includes role, source page,
confidence, and an individual LinkedIn URL when an official website or verified
public search result identifies the same person and current organization.
LinkedIn itself is not crawled, Apify is not used, and blank results do not mean
an organization has no employees.

### Disability position filtering

Filter public staff titles and research official career pages for disability
positions:

```bash
python3 scripts/ndis_disability_positions.py \
  feeds/NDIS_disability_nonprofit.xlsx
```

The resulting workbook adds `Disability Role People`, `Disability Job Openings`,
and `Company Role Summary`. Covered categories include disability support
workers, case managers, occupational therapists, behaviour support
practitioners, support coordinators, team leaders, service coordinators,
psychologists, social workers, recovery coaches, carers, allied health, nurses,
therapy assistants, and related care roles. The summary lists filtered position
titles and staff/opening counts for each company. Published links without a
closing date may be stale and should be checked manually.

## Darwin accounting firms

Discover Darwin / Palmerston accounting and bookkeeping practices from public
directories, crawl official websites, and extract published people and business
contacts.

```bash
python3 darwin-accounting-scraper/main.py --yes
```

Writes `feeds/Darwin_accounting_firms.xlsx`,
`feeds/darwin_accounting_companies.csv`,
`feeds/darwin_accounting_employees.csv`,
`feeds/darwin_accounting.db`, and
`reports/darwin-accounting-summary.md`. Console:
`GET /download/darwin-accounting.xlsx`.

LinkedIn is not crawled. Emails are stored only when published. Yellow Pages
returns HTTP 403 from this environment and is skipped.

## Darwin IT company and hiring database

Discover Darwin / Greater Darwin IT, ICT, MSP, software, cybersecurity and
related technology companies, then enrich official websites, employee-count
evidence, career pages and SEEK keyword search.

```bash
python3 scripts/darwin_it_research.py
```

Writes `feeds/Darwin_IT_company_database.xlsx`, `data/companies.csv`,
`data/vacancies.csv`, `data/sources.csv`, and
`reports/darwin-it-market-summary.md`. Console:
`GET /download/darwin-it-company-database.xlsx`.

Discovery starts from the ICTNT member directory, Chamber of Commerce NT,
InfoMSP, local directories and official-website search. Companies are
deduplicated by domain, name, LinkedIn slug and ABN. Employee ranges are never
converted to exact counts. Unknown values stay Unknown. SEEK individual `/job/`
pages are never fetched; a Cloudflare or robots block is recorded as
`Unable to verify`. LinkedIn is not crawled.

## NT private NDIS provider intelligence

Discover private and commercial NDIS providers operating in the Northern
Territory (Darwin, Palmerston, Alice Springs, Katherine, Tennant Creek,
Nhulunbuy and other NT locations), then enrich official websites for
public company, employee, email and vacancy data.

```bash
python3 scripts/nt_ndis_intelligence.py
```

Writes `feeds/NT_private_NDIS_provider_intelligence.xlsx`,
`output/companies.csv`, `output/employees.csv`, `output/vacancies.csv`,
`output/sources.csv`, `output/combined.csv`,
`output/nt-ndis-intelligence.json`, `output/nt-ndis-intelligence.sqlite`,
and `reports/nt-ndis-private-summary.md`. Console:
`GET /download/nt-ndis-intelligence.xlsx`.

Discovery starts from the official NDIS Commission register CSV. Government
departments, hospitals and councils are excluded. Pty Ltd providers are
prioritised, including allied health and plan management. Non-profits are
kept only when they operate as NDIS providers. Employee names, work emails
and vacancies are recorded only when published on an official company page.
Inferred emails are never silently stored as facts. LinkedIn is not crawled.
SEEK `/job/` pages are never fetched; a block is recorded as `blocked`.

## Upcoming earnings technical workbook

Generate the next 30 calendar days of Nasdaq earnings announcements with
market data and technical indicators:

```bash
python3 scripts/nasdaq_upcoming_earnings.py \
  --start 2026-09-07 \
  --days 30 \
  --us-only \
  --sort-market-cap \
  --out feeds/NASDAQ_US_upcoming_earnings_signals.xlsx
```

The workbook includes consensus EPS, prior-year EPS, price, 52-week range,
RSI, MACD, SMA/EMA 20/50/200, Bollinger Bands, stochastic, ADX, CCI,
momentum, VWMA, ATR, relative volume, 1/3/6-month returns and TradingView
technical ratings. Its one-month range is `price ± ATR(14) × √21`; this is a
volatility scenario, not a target, forecast or financial advice.

Earnings metadata comes from Nasdaq's calendar. Technical data comes from
TradingView's `/global/scan`, including the country classification used by
`--us-only`. `--sort-market-cap` orders every sheet from largest to smallest.
The workbook has dedicated Bullish, Bearish and Neutral signal sheets. Output:
`feeds/NASDAQ_US_upcoming_earnings_signals.xlsx` and CSV. Console:
`GET /download/nasdaq-upcoming-earnings.xlsx`.
