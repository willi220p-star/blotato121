"""Configurable defaults for Darwin accounting research."""

from __future__ import annotations

from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent
USER_AGENT = "Mozilla/5.0 (compatible; Darwin-accounting-research/1.0; +https://github.com/willi220p-star/blotato121)"
REQUEST_DELAY = 0.7
REQUEST_TIMEOUT = 18
MAX_RETRIES = 2
MAX_COMPANIES = 80
MAX_PAGES_PER_DOMAIN = 12
DEFAULT_LOCATION = "Darwin, NT"
DEFAULT_CATEGORY = "Accounting"

OUTPUT_DIR = ROOT / "output"
LOG_DIR = ROOT / "logs"
FEEDS_DIR = REPO_ROOT / "feeds"
REPORTS_DIR = REPO_ROOT / "reports"

BEST_ACCOUNTANTS_URL = "https://bestaccountantsaustralia.com.au/best/darwin/"
PINK_PAGES_URLS = (
    "https://pinkpages.com.au/services/ACCOUNTANTS-608/loc/darwin-nt-region-NT",
    "https://pinkpages.com.au/services/ACCOUNTANTS-608/loc/palmerston-NT",
    "https://pinkpages.com.au/services/ACCOUNTANTS-608/loc/casuarina-NT",
)

CRAWL_PATHS = (
    "/",
    "/about",
    "/about-us",
    "/about-us/",
    "/contact",
    "/contact-us",
    "/contact-us/",
    "/team",
    "/our-team",
    "/our-team/",
    "/people",
    "/staff",
    "/leadership",
    "/partners",
    "/our-people",
    "/services",
    "/accounting",
    "/tax",
    "/bookkeeping",
)

DARWIN_SUBURBS = (
    "Darwin",
    "Darwin City",
    "Darwin CBD",
    "Parap",
    "Stuart Park",
    "Fannie Bay",
    "Winnellie",
    "Coconut Grove",
    "Nightcliff",
    "Casuarina",
    "Palmerston",
    "Berrimah",
    "Yarrawonga",
    "Virginia",
    "Humpty Doo",
    "Woolner",
    "Larrakeyah",
    "Rapid Creek",
    "Leanyer",
    "Nakara",
    "Millner",
    "Driver",
    "Bellamack",
    "Bakewell",
    "Rosebery",
)

PERSONAL_EMAIL_DOMAINS = {
    "gmail.com",
    "googlemail.com",
    "yahoo.com",
    "yahoo.com.au",
    "hotmail.com",
    "hotmail.com.au",
    "outlook.com",
    "live.com",
    "icloud.com",
    "me.com",
}

PRIORITY_TITLES = (
    "director",
    "managing director",
    "owner",
    "founder",
    "partner",
    "principal",
    "accountant",
    "chartered",
    "cpa",
    "tax",
    "bookkeeper",
    "advisor",
    "adviser",
    "cfo",
    "practice manager",
    "client manager",
    "finance manager",
)

SEARCH_QUERIES = (
    "accountants Darwin NT",
    "accounting firms Darwin NT",
    "accountant Darwin Northern Territory",
    "CPA Darwin NT",
    "tax accountant Darwin",
    "business accountant Darwin",
    "bookkeeper Darwin NT",
    "accounting services Darwin",
    "chartered accountant Darwin",
    "accounting firm Palmerston NT",
)


def today_iso() -> str:
    return date.today().isoformat()
