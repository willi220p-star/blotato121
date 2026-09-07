"""Prospect research scraper built on the deployed Scrapling install."""

from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse

from scrapling.fetchers import Fetcher

SKIP_PATHS = {"/directory"}
TEAM_HINTS = ("team", "about", "people", "leadership", "founders", "staff", "our-story")
PRICING_HINTS = ("pricing", "plans", "packages", "price", "crm")
NEWS_HINTS = ("blog", "news", "insights", "updates", "resources", "articles")
MONEY_RE = re.compile(r"\$[\d,]+(?:\.\d{2})?(?:\s*(?:AUD|USD|/mo|/month|per month))?", re.I)
EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
PHONE_RE = re.compile(r"(?:\+?61\s?)?(?:0?4\d{2}[\s-]?\d{3}[\s-]?\d{3}|0\d\s?\d{4}\s?\d{4})")
TECH_PATTERNS = {
    "HubSpot": r"hs-scripts|js\.hs-scripts|hubspot",
    "Google Analytics 4": r"gtag/js|G-[A-Z0-9]+",
    "Google Tag Manager": r"googletagmanager\.com/gtm",
    "Meta Pixel": r"connect\.facebook\.net|fbq\(",
    "LinkedIn Insight": r"snap\.licdn\.com|linkedin\.com/insight",
    "Hotjar": r"static\.hotjar\.com",
    "Intercom": r"widget\.intercom\.io",
    "Calendly": r"calendly\.com",
    "Stripe": r"js\.stripe\.com",
    "Cloudflare": r"cdn-cgi/challenge|cloudflare",
    "Webflow": r"webflow",
    "Framer": r"framerusercontent|framer\.com",
    "WordPress": r"wp-content|wordpress",
    "Wix": r"wixstatic|wix\.com",
    "Squarespace": r"squarespace",
    "Shopify": r"cdn\.shopify\.com",
    "Next.js": r"_next/static",
    "React": r"react-dom|__NEXT_DATA__",
    "GoHighLevel": r"gohighlevel|leadconnectorhq",
    "Mailchimp": r"mailchimp|list-manage\.com",
    "Zapier": r"zapier\.com",
}


def _abs(base: str, href: str | None) -> str | None:
    if not href:
        return None
    href = href.strip()
    if href.startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    return urljoin(base, href)


def _same_host(url: str, host: str) -> bool:
    return urlparse(url).netloc.replace("www.", "") == host.replace("www.", "")


def _hrefs(page, base: str) -> list[tuple[str, str]]:
    out = []
    for a in page.css("a"):
        href = a.attrib.get("href") if hasattr(a, "attrib") else None
        text = " ".join(str(t).strip() for t in a.css("::text").getall() if str(t).strip())
        abs_url = _abs(base, href)
        if abs_url:
            out.append((text, abs_url))
    return out


def _html(page) -> str:
    for attr in ("body", "html", "content"):
        value = getattr(page, attr, None)
        if value:
            return value.decode("utf-8", "ignore") if isinstance(value, bytes) else str(value)
    return str(page)


def detect_tech(html: str, headers: dict | None = None) -> list[str]:
    blob = html
    if headers:
        blob += "\n" + json.dumps({str(k).lower(): str(v) for k, v in headers.items()})
    found = []
    for name, pattern in TECH_PATTERNS.items():
        if re.search(pattern, blob, re.I):
            found.append(name)
    return found


def classify_url(url: str, link_text: str = "") -> str | None:
    path = urlparse(url).path.lower()
    hay = f"{path} {link_text.lower()}"
    if any(h in hay for h in TEAM_HINTS):
        return "team_about"
    if any(h in hay for h in PRICING_HINTS):
        return "pricing"
    if any(h in hay for h in NEWS_HINTS):
        return "news_blog"
    return None


def fetch(url: str, timeout: int = 30):
    return Fetcher.get(url, timeout=timeout)


def research_company(start_url: str, max_pages: int = 18) -> dict:
    start_url = start_url.rstrip("/") + "/" if start_url.count("/") <= 2 else start_url
    parsed = urlparse(start_url)
    host = parsed.netloc
    origin = f"{parsed.scheme}://{host}"

    robots = fetch(urljoin(origin, "/robots.txt"))
    robots_text = str(robots.get_all_text(strip=True) or "")
    sitemap = fetch(urljoin(origin, "/sitemap.xml"))
    sitemap_html = _html(sitemap)
    sitemap_urls = re.findall(r"<loc>\s*(.*?)\s*</loc>", sitemap_html, flags=re.I)

    home = fetch(origin + "/")
    home_links = _hrefs(home, origin + "/")
    candidates: list[str] = [origin + "/"]
    for url in sitemap_urls:
        if _same_host(url, host):
            candidates.append(url.split("#")[0])
    for text, url in home_links:
        kind = classify_url(url, text)
        if kind and _same_host(url, host):
            candidates.append(url.split("#")[0])

    ordered = []
    seen = set()
    for url in candidates:
        path = urlparse(url).path.rstrip("/") or "/"
        if path in SKIP_PATHS or url in seen:
            continue
        seen.add(url)
        ordered.append(url)
        if len(ordered) >= max_pages:
            break

    pages = []
    tech = Counter()
    people = []
    prices = []
    posts = []
    emails = set()
    phones = set()

    for url in ordered:
        page = fetch(url)
        html = _html(page)
        text = str(page.get_all_text(strip=True) or "")
        title = str(page.css("title::text").get() or "")
        headings = [str(h).strip() for h in page.css("h1::text, h2::text").getall() if str(h).strip()]
        kind = classify_url(url) or ("home" if urlparse(url).path in {"", "/"} else "other")
        stack = detect_tech(html, getattr(page, "headers", None))
        for item in stack:
            tech[item] += 1
        emails.update(EMAIL_RE.findall(text))
        phones.update(PHONE_RE.findall(text))
        for amount in MONEY_RE.findall(text):
            prices.append({"url": url, "amount": amount, "context_kind": kind})
        if kind == "news_blog" or "/blog/" in urlparse(url).path:
            posts.append({"url": url, "title": title, "headings": headings[:8]})
        if kind == "team_about":
            # Capture likely people lines near founder/team language.
            for line in text.split("\n"):
                if re.search(r"\b(founder|ceo|director|consultant|specialist|grew up|based)\b", line, re.I):
                    people.append(line.strip())
        pages.append(
            {
                "url": url,
                "status": getattr(page, "status", None),
                "kind": kind,
                "title": title,
                "headings": headings[:12],
                "tech": stack,
                "excerpt": text[:1600],
            }
        )

    # Dedupe prices while keeping order
    seen_prices = set()
    unique_prices = []
    for row in prices:
        key = (row["amount"], row["url"])
        if key in seen_prices:
            continue
        seen_prices.add(key)
        unique_prices.append(row)

    return {
        "researched_at": datetime.now(timezone.utc).isoformat(),
        "company_url": origin,
        "host": host,
        "robots": robots_text[:1500],
        "skipped": sorted(SKIP_PATHS),
        "pages_crawled": len(pages),
        "tech_stack_signals": dict(tech.most_common()),
        "contacts": {"emails": sorted(emails), "phones": sorted(phones)},
        "pricing_signals": unique_prices[:40],
        "team_about_signals": people[:20],
        "news_blog": posts,
        "pages": pages,
    }


def to_markdown(report: dict) -> str:
    lines = [
        f"# Company research: {report['host']}",
        "",
        f"Researched at {report['researched_at']} with Scrapling from {report['company_url']}.",
        "",
        "## Contacts",
        f"- Emails: {', '.join(report['contacts']['emails']) or 'none found'}",
        f"- Phones: {', '.join(report['contacts']['phones']) or 'none found'}",
        "",
        "## Tech stack signals",
    ]
    if report["tech_stack_signals"]:
        for name, count in report["tech_stack_signals"].items():
            lines.append(f"- {name} ({count} page hits)")
    else:
        lines.append("- none detected")
    lines += ["", "## Pricing signals"]
    if report["pricing_signals"]:
        for row in report["pricing_signals"][:25]:
            lines.append(f"- {row['amount']} on {row['url']}")
    else:
        lines.append("- none found")
    lines += ["", "## Team / about"]
    if report["team_about_signals"]:
        for line in report["team_about_signals"][:12]:
            lines.append(f"- {line}")
    else:
        lines.append("- no dedicated team copy extracted")
    lines += ["", "## News / blog"]
    if report["news_blog"]:
        for post in report["news_blog"]:
            lines.append(f"- [{post['title']}]({post['url']})")
    else:
        lines.append("- none found")
    lines += ["", "## Pages crawled"]
    for page in report["pages"]:
        lines.append(f"- `{page['status']}` {page['kind']}: {page['url']} — {page['title']}")
    if report.get("skipped"):
        lines += ["", "## Skipped (robots.txt)", *[f"- {p}" for p in report["skipped"]]]
    return "\n".join(lines) + "\n"
