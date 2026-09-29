"""Official website, LinkedIn (published on-site only), and Darwin location checks."""

from __future__ import annotations

import re
from urllib.parse import urljoin, urlparse

from lxml import html

from src.darwin_it.models import NOT_FOUND, UNKNOWN

DARWIN_SUBURBS = (
    "darwin",
    "palmerston",
    "berrimah",
    "winnellie",
    "casuarina",
    "coconut grove",
    "stuart park",
    "parap",
    "fannie bay",
    "ludmilla",
    "marrara",
    "yarrawonga",
    "pinelands",
    "nightcliff",
    "larrakeyah",
    "the gardens",
    "woolner",
    "bayview",
    "durack",
    "lyons",
    "alawa",
    "millner",
    "tiwi",
    "nakara",
    "brinkin",
    "jingili",
    "rapid creek",
    "coolalinga",
    "humpty doo",
    "howard springs",
    "driver",
    "gray",
    "bakewell",
    "rosebery",
    "zuccocoli",
    "zuccoci",
    "marlow lagoon",
    "farrar",
    "woodroffe",
    "munoora",
    "holtze",
    "east arm",
    "wishart",
    "hidden valley",
)

DIRECTORY_HOSTS = {
    "yellowpages.com.au",
    "truelocal.com.au",
    "hotfrog.com.au",
    "startlocal.com.au",
    "whereis.com",
    "infomsp.com",
    "linkedin.com",
    "facebook.com",
    "seek.com.au",
    "ictnt.asn.au",
    "chambernt.com.au",
}


def domain_from(url: str) -> str:
    host = urlparse(url or "").netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def is_directory_host(url: str) -> bool:
    host = domain_from(url)
    return any(host == item or host.endswith("." + item) for item in DIRECTORY_HOSTS)


def official_website(url: str) -> tuple[str, str, str]:
    if not url or url in {UNKNOWN, NOT_FOUND}:
        return NOT_FOUND, UNKNOWN, UNKNOWN
    if is_directory_host(url):
        return NOT_FOUND, UNKNOWN, "Directory URL rejected"
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        url = "https://" + url
        parsed = urlparse(url)
    domain = domain_from(url)
    return url, domain or UNKNOWN, "Official company website"


def extract_linkedin(content: str, base_url: str) -> str:
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return NOT_FOUND
    for href in document.xpath("//a/@href"):
        target = urljoin(base_url, href or "")
        parsed = urlparse(target)
        host = parsed.netloc.lower()
        if "linkedin.com" in host and "/company/" in parsed.path.lower():
            return f"{parsed.scheme}://{parsed.netloc}{parsed.path.rstrip('/')}"
    return NOT_FOUND


def extract_location(text: str, fallback_suburb: str = "") -> tuple[str, str, bool]:
    blob = (text or "").lower()
    found = []
    for suburb in DARWIN_SUBURBS:
        if re.search(rf"\b{re.escape(suburb)}\b", blob):
            found.append(suburb.title() if suburb != "darwin" else "Darwin")
    if "nt" in blob.split() or "northern territory" in blob:
        if "Darwin" not in found and fallback_suburb:
            found.append(fallback_suburb)
    suburb = fallback_suburb or (found[0] if found else UNKNOWN)
    darwin = bool(found) or bool(fallback_suburb)
    if not darwin:
        return UNKNOWN, suburb or UNKNOWN, False
    location = ", ".join(dict.fromkeys(found[:4])) or suburb
    if "NT" not in location and "Northern Territory" not in location:
        location = f"{location}, NT"
    return location, suburb, True
