"""Shared constants for NT private NDIS provider intelligence."""

from __future__ import annotations

from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTER_CSV_URL = "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider/download-csv"
COMMISSION_FINDER_URL = "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider"
FINDER_URL = "https://www.ndis.gov.au/participants/working-providers/finding-providers/provider-finder"
USER_AGENT = "Mozilla/5.0 (compatible; NT-NDIS-intelligence/1.0; +https://github.com/willi220p-star/blotato121)"

UNKNOWN = "Not publicly available"
NOT_FOUND = "Not publicly available"

NT_LOCATIONS = (
    "Darwin",
    "Palmerston",
    "Alice Springs",
    "Katherine",
    "Tennant Creek",
    "Nhulunbuy",
    "Other NT",
)

LOCATION_HINTS = {
    "Darwin": (
        "darwin",
        "casuarina",
        "nightcliff",
        "parap",
        "stuart park",
        "winnellie",
        "larrakeyah",
        "fannie bay",
        "rapid creek",
        "coconut grove",
        "tiwi",
        "leanyer",
        "karama",
        "malak",
        "millner",
        "alawa",
        "anula",
        "moil",
        "jingili",
        "wagaman",
        "ludmilla",
        "marrara",
        "humpty doo",
        "howard springs",
        "coolalinga",
    ),
    "Palmerston": (
        "palmerston",
        "driver",
        "bakewell",
        "rosebery",
        "yarrawonga",
        "woodroffe",
        "gray",
        "farrar",
        "durack",
        "gunn",
        "zuccocoli",
        "marlow lagoon",
    ),
    "Alice Springs": (
        "alice springs",
        "ciccone",
        "the gap",
        "araluen",
        "gillen",
        "braitling",
        "east side",
        "sadadeen",
        "larapinta",
    ),
    "Katherine": ("katherine",),
    "Tennant Creek": ("tennant creek",),
    "Nhulunbuy": ("nhulunbuy", "gove"),
}

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
    "msn.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
}

PRIORITY_TITLES = (
    "ceo",
    "founder",
    "director",
    "managing director",
    "general manager",
    "operations manager",
    "service manager",
    "service delivery",
    "ndis manager",
    "disability services manager",
    "support coordination",
    "support coordinator",
    "specialist support",
    "client services",
    "participant services",
    "intake",
    "business development",
    "partnerships",
    "community engagement",
    "allied health manager",
    "practice manager",
    "clinical manager",
    "sil manager",
    "sda manager",
    "team leader",
    "hr manager",
    "people & culture",
    "people and culture",
)


def today_iso() -> str:
    return date.today().isoformat()
