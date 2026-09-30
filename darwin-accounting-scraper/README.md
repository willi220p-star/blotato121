# Darwin accounting research scraper

MVP research tool that finds **accounting firms in Darwin / Greater Darwin, NT** from public directories, crawls official websites, and extracts only publicly listed company, employee and contact information.

It does **not** crawl LinkedIn, guess emails, or bypass CAPTCHA, login, paywalls or robots.txt.

## Files created

```
darwin-accounting-scraper/
├── main.py
├── config.py
├── requirements.txt
├── README.md
├── scraper/
│   ├── company_discovery.py
│   ├── website_crawler.py
│   ├── employee_discovery.py
│   ├── contact_extractor.py
│   ├── social_sources.py
│   ├── deduplication.py
│   ├── validation.py
│   ├── exporters.py
│   └── http.py
├── database/database.py
├── output/
├── logs/
└── tests/
```

## How it works

1. **Discover** firms from Best Accountants Australia (Darwin ranking) and Pink Pages Darwin / Palmerston / Casuarina listings.
2. **Deduplicate** by name, website domain, phone and ABN.
3. **Crawl** each official website (home, about, contact, team, services) up to `MAX_PAGES_PER_DOMAIN`.
4. **Extract** published phones, business emails, ABN/ACN, social URLs, and staff names/titles.
5. **Score** confidence (website-verified vs directory-only).
6. **Export** CSV, JSON, SQLite and Excel.

Yellow Pages `/find/` is attempted only if robots allow; this environment currently receives HTTP 403 and the miss is logged instead of inventing listings.

## Install

```bash
python3 -m pip install -r darwin-accounting-scraper/requirements.txt
```

`lxml`, `requests` and `openpyxl` are enough for the MVP.

## Run

Interactive:

```bash
cd darwin-accounting-scraper
python3 main.py
```

Prompts:

- Location (default `Darwin, NT`)
- Business category (default `Accounting`)
- Maximum companies (default `80`)
- Maximum pages/domain (default `12`)
- Output format

Non-interactive:

```bash
python3 darwin-accounting-scraper/main.py --yes --max-companies 80 --max-pages 12
```

## Where data is saved

- `darwin-accounting-scraper/output/darwin_accounting_companies.csv`
- `darwin-accounting-scraper/output/darwin_accounting_employees.csv`
- `darwin-accounting-scraper/output/darwin_accounting_sources.csv`
- `darwin-accounting-scraper/output/darwin_accounting.json`
- `darwin-accounting-scraper/output/darwin_accounting.db`
- `darwin-accounting-scraper/output/Darwin_accounting_firms.xlsx`
- copies under `feeds/`
- errors: `darwin-accounting-scraper/logs/scraper.log`

## Known limitations

- Pink Pages HTML currently exposes about 20 Darwin-region cards even though the heading says 67 (the rest is not in the static HTML).
- Yellow Pages and Local Search return 403 from this environment.
- LinkedIn profile pages are never fetched; `/in/` URLs are kept only when an official site publishes them.
- Individual work emails appear only when a page shows `firstname.lastname@firm...` next to that person.
- Employee counts and private mobiles are not collected.
- Google/Bing are not scraped.

## Phase 2

- TPB public register (if robots allow a non-JS listing)
- Chamber of Commerce NT member directory pages
- More suburb-specific directory URLs
- Optional Playwright only for public JS directories that allow it
- SEEK/career pages for hiring signals
- ABN Lookup when a number is already published
