"""List-building enrichment for directories with no clean Clay/Apollo/FullEnrich API."""

from __future__ import annotations

import csv
import hashlib
import html
import io
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

from lib.company_research import EMAIL_RE, _html, fetch
from lib.signals import fetch_robots_text, is_linkedin_url, robots_allows

FEED_NAME = "dgk-list-enrichment"
FEED_VERSION = 1

PHONE_RE = re.compile(
    r"(?<!\d)("
    r"(?:\+?61[\s-]?)?(?:0?4\d{2}[\s-]?\d{3}[\s-]?\d{3})"
    r"|(?:\+?61[\s-]?)?(?:0?[2-8][\s-]?\d{4}[\s-]?\d{4})"
    r"|(?:\(\d{2}\)[\s-]?\d{4}[\s-]?\d{4})"
    r"|(?:[7-8]\d{3}[\s-]?\d{4})"
    r"|(?:13\d{2}[\s-]?\d{3}[\s-]?\d{3})"
    r")(?!\d)"
)
ABN_RE = re.compile(r"\bABN[:\s]*([0-9]{2}\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3})\b", re.I)
CAREVO_PROFILE_RE = re.compile(
    r"(https://carevo\.com\.au)?/providers/ndis/(?P<state>[a-z]{2,3})/(?P<suburb>[a-z0-9-]+)/(?P<slug>[a-z0-9-]+)",
    re.I,
)
TRACKER_HOSTS = (
    "carevo.com.au",
    "ndiscommission.gov.au",
    "myagedcare.gov.au",
    "facebook.com",
    "instagram.com",
    "tiktok.com",
    "googletagmanager.com",
    "google-analytics.com",
    "gstatic.com",
    "googleapis.com",
    "w3.org",
    "schema.org",
    "clarity.ms",
    "hotjar.com",
    "doubleclick.net",
    "segment.com",
    "cloudflare.com",
    "cloudflareinsights.com",
    "jsdelivr.net",
    "cdnjs.cloudflare.com",
    "unpkg.com",
    "fontawesome.com",
    "twitter.com",
    "x.com",
    "pinterest.com",
    "reddit.com",
    "youtube.com",
    "youtu.be",
)
SHARE_PATHS = ("/intent/", "/sharer", "/share-offsite", "/pin/create", "/share.php")
VISIBLE_URL_RE = re.compile(r"https?://[^\s<>\"']+", re.I)


def is_usable_website(url: str | None) -> bool:
    if not url:
        return False
    url = html.unescape(url).strip().rstrip(".,);")
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    path = parsed.path.lower()
    if path.endswith((".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".woff", ".woff2", ".gif", ".ico")):
        return False
    if any(hint in path for hint in SHARE_PATHS):
        return False
    if "zipleaf." in host or is_linkedin_url(url) or "/go/" in url:
        return False
    return not any(skip in host for skip in TRACKER_HOSTS)


def first_usable_website(html_src: str | None, text: str | None) -> str | None:
    """Prefer the listing's visible URL (ZipLeaf shows it as text, not an <a>)."""
    decoded_html = html.unescape(html_src or "")
    compact = re.sub(r"\s+", " ", html.unescape(text or ""))
    candidates: list[str] = []
    for match in VISIBLE_URL_RE.finditer(compact):
        candidates.append(match.group(0).rstrip(".,);"))
    for href in re.findall(r'href="(https?://[^"]+)"', decoded_html, flags=re.I):
        candidates.append(html.unescape(href))
    for candidate in candidates:
        if is_usable_website(candidate):
            return html.unescape(candidate).strip().rstrip(".,);")
    return None


SKIP_SLUGS = {
    "cairns",
    "darwin",
    "palmerston",
    "sydney",
    "melbourne",
    "brisbane",
    "perth",
    "adelaide",
    "hobart",
    "canberra",
}
SKIP_NAME_FRAGMENTS = (
    "skip to",
    "subscribe",
    "cookie",
    "privacy",
    "login",
    "add your business",
    "update this listing",
    "news search",
    "australia business",
    "contact us",
)
LSNT_HEADER_RE = re.compile(
    r"^(firm name|address|contact|tel|fax|firm referral list|firm count|region)\b",
    re.I,
)
ADDRESS_LINE_RE = re.compile(
    r"\b(street|st\b|road|rd\b|avenue|terrace|place|mall|level|suite|plaza|centre|center|"
    r"gpo box|po box|darwin|parap|casuarina|nakara|cullen bay|adelaide)\b",
    re.I,
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def record_id(*parts: str) -> str:
    blob = "|".join(p.strip().lower() for p in parts if p)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()[:16]


def domain_of(url: str | None) -> str | None:
    if not url:
        return None
    host = urlparse(url).netloc.lower().removeprefix("www.")
    return host or None


def clean_phone(raw: str) -> str:
    return re.sub(r"\s+", " ", raw).strip()


def first_email(text: str) -> str | None:
    found = EMAIL_RE.findall(text or "")
    for item in found:
        if item.lower().endswith((".png", ".jpg", ".svg", ".webp")):
            continue
        if "example.com" in item.lower() or "sentry.io" in item.lower():
            continue
        return item
    return None


def first_phone(text: str) -> str | None:
    match = PHONE_RE.search(text or "")
    return clean_phone(match.group(1)) if match else None


def looks_like_name(value: str) -> bool:
    text = (value or "").strip()
    if len(text) < 3 or len(text) > 90:
        return False
    low = text.lower()
    if any(frag in low for frag in SKIP_NAME_FRAGMENTS):
        return False
    if low.startswith(("http", "www.")):
        return False
    return bool(re.search(r"[A-Za-z]", text))


def make_record(
    *,
    company_name: str,
    source: dict,
    source_url: str,
    website: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    address: str | None = None,
    notes: str | None = None,
    extra: dict | None = None,
) -> dict:
    website = website or None
    if website and is_linkedin_url(website):
        website = None
    row = {
        "id": record_id(source.get("id", ""), company_name, website or "", phone or ""),
        "company_name": company_name.strip(),
        "domain": domain_of(website),
        "website": website,
        "email": email,
        "phone": phone,
        "address": address,
        "city": source.get("city"),
        "state": source.get("state"),
        "vertical": source.get("vertical"),
        "source_id": source.get("id"),
        "source_name": source.get("name"),
        "source_type": source.get("source_type"),
        "source_url": source_url,
        "notes": notes,
        "enriched_at": utc_now(),
    }
    if extra:
        row.update(extra)
    return row


def extract_carevo_profile_urls(html: str, list_url: str) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for match in CAREVO_PROFILE_RE.finditer(html or ""):
        slug = match.group("slug").lower()
        if slug in SKIP_SLUGS:
            continue
        path = f"/providers/ndis/{match.group('state').lower()}/{match.group('suburb').lower()}/{slug}"
        if "/go/" in path:
            continue
        url = urljoin(list_url, path)
        if url not in seen:
            seen.add(url)
            found.append(url)
    return found


def parse_carevo_profile(html: str, text: str, url: str, source: dict) -> dict | None:
    title = None
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", flags=re.I | re.S)
    if h1:
        title = re.sub(r"<[^>]+>", " ", h1.group(1))
        title = re.sub(r"\s+", " ", title).split("|")[0].strip()
        title = re.sub(r"\s+NDIS in.*$", "", title, flags=re.I).strip()
    if not looks_like_name(title or ""):
        # Fallback: first substantial line that isn't nav.
        for line in (text or "").splitlines():
            line = line.strip()
            if looks_like_name(line) and "carevo" not in line.lower():
                title = line
                break
    if not looks_like_name(title or ""):
        slug = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ").title()
        title = slug
    phone = first_phone(text)
    email = first_email(text)
    # Carevo hides provider websites behind /go/ redirects (robots Disallow).
    website = None
    return make_record(
        company_name=title or "Unknown provider",
        source=source,
        source_url=url,
        website=website,
        email=email,
        phone=phone,
        notes="NDIS provider listing (Carevo). Outbound /go/ website redirects not followed.",
    )


def parse_zipleaf_profile(html: str, text: str, url: str, source: dict) -> dict | None:
    title = None
    for tag in ("h1", "h2", "h3"):
        for raw in re.findall(rf"<{tag}[^>]*>(.*?)</{tag}>", html or "", flags=re.I | re.S):
            candidate = re.sub(r"<[^>]+>", " ", raw)
            candidate = re.sub(r"Update This Listing", "", candidate, flags=re.I)
            candidate = re.sub(r"\s+", " ", candidate).strip()
            if looks_like_name(candidate):
                title = candidate
                break
        if title:
            break
    compact = re.sub(r"\s+", " ", text or "")
    if not looks_like_name(title or ""):
        about = re.search(r"About ([A-Z][A-Za-z0-9 &'-]{2,60})", compact)
        title = about.group(1).strip() if about else None
    if not looks_like_name(title or ""):
        slug = urlparse(url).path.rstrip("/").split("/")[-1]
        slug = re.sub(r"_\d+$", "", slug).replace("-", " ")
        title = slug
    phone = first_phone(compact)
    email = first_email(compact)
    website = first_usable_website(html, compact)
    address = None
    addr = re.search(r"(\d+[^.]{8,80}(?:Darwin|Kogarah|Sydney|NT|NSW|VIC|QLD|WA|SA)[^.]{0,40})", compact)
    if addr:
        address = addr.group(1).strip()
    return make_record(
        company_name=title or "Unknown listing",
        source=source,
        source_url=url,
        website=website,
        email=email,
        phone=phone,
        address=address,
    )


def parse_lsnt_referral_text(text: str, source: dict, source_url: str) -> list[dict]:
    lines = [re.sub(r"\s+", " ", line).strip() for line in (text or "").splitlines()]
    lines = [line for line in lines if line]
    records: list[dict] = []
    name_buf: list[str] = []
    address_buf: list[str] = []

    def flush(name: str, phone: str | None) -> None:
        name = re.sub(r"\s+", " ", name).strip(" |-")
        if not looks_like_name(name):
            return
        address = ", ".join(address_buf).strip(", ") or None
        records.append(
            make_record(
                company_name=name,
                source=source,
                source_url=source_url,
                phone=phone,
                address=address,
                notes="Law Society NT public firm referral list (PDF).",
            )
        )

    for line in lines:
        if LSNT_HEADER_RE.match(line) and not PHONE_RE.search(line):
            continue
        phone_match = PHONE_RE.search(line)
        if phone_match:
            before = line[: phone_match.start()].strip(" |-")
            phone = clean_phone(phone_match.group(1))
            if before:
                name_buf.append(before)
            name = " ".join(name_buf).strip()
            flush(name, phone)
            name_buf = []
            address_buf = []
            after = line[phone_match.end() :].strip()
            if after and ADDRESS_LINE_RE.search(after):
                address_buf.append(after)
            continue
        if ADDRESS_LINE_RE.search(line) and records:
            records[-1]["address"] = ", ".join(
                part for part in [records[-1].get("address"), line] if part
            )
            continue
        if looks_like_name(line) and not ADDRESS_LINE_RE.search(line):
            name_buf.append(line)
    return records


def pdf_text(raw: bytes) -> str:
    from io import BytesIO

    from pypdf import PdfReader

    reader = PdfReader(BytesIO(raw))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def _page_payload(page) -> tuple[str, str]:
    return _html(page), str(page.get_all_text(strip=True) or "")


def enrich_source(source: dict, robots_cache: dict, sources_log: list[dict], max_profiles: int) -> list[dict]:
    parser = source.get("parser")
    records: list[dict] = []

    def allowed(url: str) -> bool:
        if is_linkedin_url(url) or "/go/" in url:
            return False
        robots = fetch_robots_text(url, robots_cache, sources_log)
        return robots_allows(url, robots)

    if parser == "carevo_list":
        list_url = source["list_url"]
        if not allowed(list_url):
            sources_log.append({"url": list_url, "status": "skipped", "detail": "robots.txt disallow", "kind": "list"})
            return []
        page = fetch(list_url)
        html, _text = _page_payload(page)
        sources_log.append({"url": list_url, "status": "ok", "detail": f"HTTP {getattr(page, 'status', '?')}", "kind": "list"})
        profile_urls = extract_carevo_profile_urls(html, list_url)[: max_profiles]
        if not source.get("follow_profiles"):
            for url in profile_urls:
                slug = urlparse(url).path.rstrip("/").split("/")[-1].replace("-", " ").title()
                records.append(make_record(company_name=slug, source=source, source_url=url))
            return records
        for url in profile_urls:
            if not allowed(url):
                sources_log.append({"url": url, "status": "skipped", "detail": "robots.txt disallow", "kind": "profile"})
                continue
            try:
                profile = fetch(url)
                status = getattr(profile, "status", None)
                if status and int(status) >= 400:
                    sources_log.append({"url": url, "status": "skipped", "detail": f"HTTP {status}", "kind": "profile"})
                    continue
                html, text = _page_payload(profile)
                row = parse_carevo_profile(html, text, url, source)
                if row:
                    records.append(row)
                sources_log.append({"url": url, "status": "ok", "detail": f"HTTP {status}", "kind": "profile"})
            except Exception as exc:  # noqa: BLE001
                sources_log.append({"url": url, "status": "error", "detail": str(exc), "kind": "profile"})
        return records

    if parser == "zipleaf_profile":
        for url in source.get("profile_urls") or []:
            if not allowed(url):
                sources_log.append({"url": url, "status": "skipped", "detail": "robots.txt disallow", "kind": "profile"})
                continue
            try:
                page = fetch(url)
                status = getattr(page, "status", None)
                if status and int(status) >= 400:
                    sources_log.append({"url": url, "status": "skipped", "detail": f"HTTP {status}", "kind": "profile"})
                    continue
                html, text = _page_payload(page)
                row = parse_zipleaf_profile(html, text, url, source)
                if row:
                    records.append(row)
                sources_log.append({"url": url, "status": "ok", "detail": f"HTTP {status}", "kind": "profile"})
            except Exception as exc:  # noqa: BLE001
                sources_log.append({"url": url, "status": "error", "detail": str(exc), "kind": "profile"})
        return records

    if parser == "lsnt_pdf":
        index = source.get("list_url")
        if index:
            if allowed(index):
                page = fetch(index)
                sources_log.append({"url": index, "status": "ok", "detail": f"HTTP {getattr(page, 'status', '?')}", "kind": "list"})
            else:
                sources_log.append({"url": index, "status": "skipped", "detail": "robots.txt disallow", "kind": "list"})
        for pdf_url in source.get("pdf_urls") or []:
            if not allowed(pdf_url):
                sources_log.append({"url": pdf_url, "status": "skipped", "detail": "robots.txt disallow", "kind": "pdf"})
                continue
            try:
                page = fetch(pdf_url)
                raw = page.body if isinstance(getattr(page, "body", None), bytes) else None
                if not raw:
                    sources_log.append({"url": pdf_url, "status": "error", "detail": "empty PDF body", "kind": "pdf"})
                    continue
                text = pdf_text(raw)
                rows = parse_lsnt_referral_text(text, source, pdf_url)
                records.extend(rows)
                sources_log.append(
                    {"url": pdf_url, "status": "ok", "detail": f"HTTP {getattr(page, 'status', '?')}; {len(rows)} firms", "kind": "pdf"}
                )
            except Exception as exc:  # noqa: BLE001
                sources_log.append({"url": pdf_url, "status": "error", "detail": str(exc), "kind": "pdf"})
        return records

    raise ValueError(f"Unknown parser: {parser}")


def clay_rows(records: list[dict]) -> list[dict]:
    """Shape records for paste/import into Clay, Apollo, or FullEnrich."""
    rows = []
    for rec in records:
        rows.append(
            {
                "company_name": rec.get("company_name"),
                "website": rec.get("website") or "",
                "domain": rec.get("domain") or "",
                "email": rec.get("email") or "",
                "phone": rec.get("phone") or "",
                "city": rec.get("city") or "",
                "state": rec.get("state") or "",
                "industry": rec.get("vertical") or "",
                "linkedin_url": "",
                "source": rec.get("source_name") or "",
                "source_url": rec.get("source_url") or "",
            }
        )
    return rows


def build_enrichment(config: dict) -> dict:
    sources = config.get("sources") or []
    max_profiles = int(config.get("max_profiles_per_source") or 8)
    robots_cache: dict[str, str] = {}
    sources_log: list[dict] = []
    records: list[dict] = []
    for source in sources:
        records.extend(enrich_source(source, robots_cache, sources_log, max_profiles))
    unique: list[dict] = []
    seen: set[tuple] = set()
    for row in records:
        key = (row.get("vertical"), (row.get("company_name") or "").lower(), row.get("phone") or row.get("website"))
        if key in seen:
            continue
        seen.add(key)
        unique.append(row)
    unique.sort(key=lambda r: ((r.get("vertical") or ""), (r.get("company_name") or "").lower()))
    return {
        "feed": config.get("feed") or FEED_NAME,
        "version": FEED_VERSION,
        "generated_at": utc_now(),
        "policy": {
            "linkedin": "Never crawled. Leave linkedin_url empty for Clay/Apollo/FullEnrich to fill.",
            "apis": "These sources have no public list API. Scrapling reads robots-allowed HTML/PDF pages.",
            "skipped": "DGK /directory, Carevo /go/, ZipLeaf Search.html and listing contact forms.",
        },
        "counts": {
            "records": len(unique),
            "ndis": sum(1 for r in unique if r.get("vertical") == "ndis"),
            "accounting": sum(1 for r in unique if r.get("vertical") == "accounting"),
            "legal": sum(1 for r in unique if r.get("vertical") == "legal"),
        },
        "sources": sources_log,
        "records": unique,
        "clay": clay_rows(unique),
    }


def enrichment_markdown(feed: dict) -> str:
    lines = [
        f"# {feed.get('feed')}",
        "",
        f"Generated {feed.get('generated_at')}. {feed['counts']['records']} records "
        f"(NDIS {feed['counts']['ndis']} · accounting {feed['counts']['accounting']} · legal {feed['counts']['legal']}).",
        "",
        "## Records",
    ]
    if not feed.get("records"):
        lines.append("- none this run")
    for row in feed.get("records") or []:
        contact = row.get("phone") or row.get("email") or row.get("website") or "no contact"
        lines.append(f"- **{row.get('vertical')}** {row.get('company_name')} — {contact} ({row.get('source_name')})")
    lines += ["", "## Sources"]
    for src in feed.get("sources") or []:
        lines.append(f"- `{src['status']}` {src['kind']}: {src['url']} — {src['detail']}")
    return "\n".join(lines) + "\n"


def clay_csv(feed: dict) -> str:
    buf = io.StringIO()
    fields = ["company_name", "website", "domain", "email", "phone", "city", "state", "industry", "linkedin_url", "source", "source_url"]
    writer = csv.DictWriter(buf, fieldnames=fields)
    writer.writeheader()
    for row in feed.get("clay") or []:
        writer.writerow(row)
    return buf.getvalue()


def load_enrichment_config(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))
