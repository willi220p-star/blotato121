"""Hiring, expansion, and tech-stack signals that feed dgk-signal-source."""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urljoin, urlparse, urlencode

from lib.company_research import _html, _hrefs, _same_host, detect_tech, fetch

FEED_NAME = "dgk-signal-source"
FEED_VERSION = 1
LINKEDIN_HOSTS = ("linkedin.com", "www.linkedin.com")
SEEK_HOSTS = ("seek.com.au", "www.seek.com.au", "au.seek.com", "seek.com")

CAREER_HINTS = (
    "career",
    "careers",
    "jobs",
    "join-us",
    "joinourteam",
    "join-our-team",
    "work-with-us",
    "vacancies",
    "we-are-hiring",
)
ABOUT_HINTS = ("about", "our-story", "who-we-are", "our-team", "team")

HIRING_PATTERNS = [
    (r"\bwe(?:'re| are) hiring\b", 0.9),
    (r"\bnow hiring\b", 0.9),
    (r"\bjoin our team\b", 0.82),
    (r"\bwant to work with us\b", 0.8),
    (r"\b(?:current|open) (?:roles?|vacancies|positions|jobs)\b", 0.85),
    (r"\b(?:job|role) openings?\b", 0.85),
    (r"\bapply now\b", 0.62),
    (r"\bwe(?:'re| are) looking for\b", 0.7),
    (r"\bnow recruiting\b", 0.88),
]

ROLE_PATTERNS = [
    (r"marketing manager", "Marketing Manager"),
    (r"business development(?: manager)?|\bbdm\b", "Business Development"),
    (r"lead gen(?:eration)?", "Lead Generation"),
    (r"social media (?:manager|coordinator|marketer|specialist)", "Social Media"),
    (r"registered nurse|\brn\b", "Registered Nurse"),
    (r"support worker", "Support Worker"),
    (r"support coordinat(?:or|ion)", "Support Coordinator"),
    (r"sales manager", "Sales Manager"),
    (r"head of (?:growth|marketing|sales)", "Head of Growth/Marketing/Sales"),
    (r"picker[/\s-]?packer|pick(?:er)?\s*/\s*pack(?:er)?", "Picker/Packer"),
    (r"delivery driver", "Delivery Driver"),
    (r"shop assistant", "Shop Assistant"),
]

EXPANSION_PATTERNS = [
    (r"\bnew office\b", 0.88),
    (r"\bnow open(?:ing)? in\b", 0.86),
    (r"\bexpanding (?:to|into)\b", 0.9),
    (r"\bexpanding our (?:office|team|footprint|presence|locations?|headcount)\b", 0.86),
    (r"\bopened (?:a )?(?:new )?(?:office|location|branch)\b", 0.88),
    (r"\bgrowing (?:the |our )?team\b", 0.72),
    (r"\bheadcount\b", 0.7),
    (r"\bhiring across\b", 0.8),
    (r"\bsecond (?:office|location|site|store)\b", 0.84),
    (r"\bnew location\b", 0.82),
    (r"\b(?:two|2|\d+)\s+stores?\b", 0.8),
    (r"\boperating with \d+\s+stores?\b", 0.82),
]

AU_CITIES = (
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Hobart",
    "Canberra",
    "Darwin",
    "Palmerston",
    "Gold Coast",
    "Newcastle",
    "Wollongong",
    "Geelong",
    "Townsville",
    "Cairns",
    "Kogarah",
    "Auburn",
)

CITY_METRO = {
    "Sydney": "sydney",
    "Melbourne": "melbourne",
    "Brisbane": "brisbane",
    "Perth": "perth",
    "Adelaide": "adelaide",
    "Hobart": "hobart",
    "Canberra": "canberra",
    "Darwin": "darwin",
    "Palmerston": "darwin",
    "Gold Coast": "gold-coast",
    "Newcastle": "newcastle",
    "Wollongong": "wollongong",
    "Geelong": "geelong",
    "Townsville": "townsville",
    "Cairns": "cairns",
    "Kogarah": "kogarah",
    "Auburn": "auburn",
}

OFFICE_NEAR_RE = re.compile(
    r"\b(?:office|offices|suite|level|street|st,|road|rd\b|avenue|ave\b|"
    r"nsw|vic|qld|wa|sa\b|nt\b|act\b|address|headquarters|\bhq\b|"
    r"stores?)\b",
    re.I,
)

LEADERSHIP_PATTERNS = [
    (r"\bappointed (?:as )?(?:ceo|managing director|director|head of)\b", 0.9),
    (r"\bnew (?:ceo|managing director|managing dir\.|director)\b", 0.82),
    (r"\bjoined as (?:ceo|managing director|director|head of)\b", 0.88),
    (r"\bwelcomes? .{0,60}(?:as|to the) (?:new )?(?:ceo|director|head of)\b", 0.8),
    (r"\bpromoted to (?:ceo|managing director|director|head of)\b", 0.84),
]

RELAUNCH_PATTERNS = [
    (r"\bnew website\b", 0.78),
    (r"\brelaunched\b", 0.86),
    (r"\bwebsite relaunch\b", 0.92),
    (r"\bwe(?:'ve| have) redesigned\b", 0.8),
    (r"\brebrand(?:ed|ing)\b", 0.7),
]

LINKEDIN_COMPANY_RE = re.compile(
    r"https?://(?:www\.)?linkedin\.com/company/[A-Za-z0-9_-]+/?",
    re.I,
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def signal_id(*parts: str) -> str:
    blob = "|".join(p.strip().lower() for p in parts)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()[:16]


def snippet_around(text: str, pattern: str, radius: int = 140) -> str:
    compact = re.sub(r"\s+", " ", text)
    match = re.search(pattern, compact, re.I)
    if not match:
        return compact[:240].strip()
    start = max(0, match.start() - radius)
    end = min(len(compact), match.end() + radius)
    snippet = compact[start:end].strip()
    if start > 0:
        snippet = "…" + snippet
    if end < len(compact):
        snippet = snippet + "…"
    return snippet


def page_kind(url: str, link_text: str = "") -> str:
    hay = f"{urlparse(url).path.lower()} {link_text.lower()}"
    if any(h in hay for h in CAREER_HINTS):
        return "careers"
    if any(h in hay for h in ABOUT_HINTS):
        return "about"
    return "other"


def office_cities(text: str) -> list[str]:
    """Cities that appear next to an office/address cue, not casual mentions."""
    compact = re.sub(r"\s+", " ", text or "")
    found: list[str] = []
    for city in AU_CITIES:
        for window in re.finditer(rf".{{0,90}}\b{re.escape(city)}\b.{{0,90}}", compact, re.I):
            if OFFICE_NEAR_RE.search(window.group(0)):
                found.append(city)
                break
    return found


def distinct_metros(cities: list[str]) -> list[str]:
    metros: list[str] = []
    seen: set[str] = set()
    for city in cities:
        metro = CITY_METRO.get(city, city.lower())
        if metro not in seen:
            seen.add(metro)
            metros.append(city)
    return metros


def extract_roles(text: str) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for pattern, label in ROLE_PATTERNS:
        if re.search(pattern, text, re.I) and label not in seen:
            seen.add(label)
            found.append(label)
    return found


def extract_linkedin_urls(*texts: str) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    for text in texts:
        for match in LINKEDIN_COMPANY_RE.findall(text or ""):
            url = match.rstrip("/")
            key = url.lower()
            if key not in seen:
                seen.add(key)
                found.append(url)
    return found


def seek_search_url(keywords: str) -> str:
    """Robots.txt Allow: *?keywords — never point at */job/ listings."""
    return "https://www.seek.com.au/jobs?" + urlencode({"keywords": keywords})


def is_linkedin_url(url: str) -> bool:
    host = urlparse(url).netloc.lower().removeprefix("www.")
    return host == "linkedin.com" or host.endswith(".linkedin.com")


def is_seek_host(url: str) -> bool:
    host = urlparse(url).netloc.lower().removeprefix("www.")
    return host in {"seek.com.au", "au.seek.com", "seek.com"} or host.endswith(".seek.com.au")


def is_seek_job_url(url: str) -> bool:
    return is_seek_host(url) and "/job/" in urlparse(url).path.lower()


def seek_url_allowed(url: str) -> bool:
    if not is_seek_host(url) or is_seek_job_url(url):
        return False
    query = parse_qs(urlparse(url).query)
    keys = {k.lower() for k in query}
    return "keywords" in keys or "advertiserid" in keys


def parse_robots_groups(robots_text: str) -> list[dict]:
    groups: list[dict] = []
    current = {"agents": [], "allow": [], "disallow": []}
    for raw in (robots_text or "").splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line:
            if current["agents"] and (current["allow"] or current["disallow"]):
                groups.append(current)
                current = {"agents": [], "allow": [], "disallow": []}
            continue
        if ":" not in line:
            continue
        field, value = line.split(":", 1)
        field = field.strip().lower()
        value = value.strip()
        if field == "user-agent":
            if current["agents"] and (current["allow"] or current["disallow"]):
                groups.append(current)
                current = {"agents": [], "allow": [], "disallow": []}
            current["agents"].append(value.lower())
        elif field == "allow":
            current["allow"].append(value)
        elif field == "disallow":
            current["disallow"].append(value)
    if current["agents"]:
        groups.append(current)
    return groups


def _wildcard_match(pattern: str, value: str) -> bool:
    if not pattern:
        return False
    regex = re.escape(pattern).replace(r"\*", ".*")
    if pattern.endswith("$"):
        regex = regex[:-1] + "$"
    return re.search(regex, value, re.I) is not None


def robots_allows(url: str, robots_text: str) -> bool:
    """Honor robots.txt. LinkedIn is always denied. SEEK only allows keyword/advertiser search."""
    if is_linkedin_url(url):
        return False
    if is_seek_host(url):
        return seek_url_allowed(url)

    parsed = urlparse(url)
    path_qs = parsed.path or "/"
    if parsed.query:
        path_qs += "?" + parsed.query

    groups = parse_robots_groups(robots_text)
    star = next((g for g in groups if "*" in g["agents"]), None)
    if not star:
        return True

    matches: list[tuple[int, bool]] = []
    for pattern in star["allow"]:
        if _wildcard_match(pattern, path_qs) or path_qs.startswith(pattern):
            matches.append((len(pattern), True))
    for pattern in star["disallow"]:
        if not pattern:
            continue
        if _wildcard_match(pattern, path_qs) or path_qs.startswith(pattern):
            matches.append((len(pattern), False))
    if not matches:
        return True
    matches.sort(key=lambda item: item[0], reverse=True)
    return matches[0][1]


def make_signal(
    signal_type: str,
    company: dict,
    *,
    evidence_url: str,
    evidence_source: str,
    snippet: str,
    confidence: float,
    role: str | None = None,
    extra: dict | None = None,
    queue: str = "tier1",
) -> dict:
    payload = {
        "id": signal_id(signal_type, company.get("domain", ""), evidence_url, role or "", snippet[:80]),
        "type": signal_type,
        "company_name": company.get("name"),
        "company_domain": company.get("domain"),
        "role": role,
        "evidence_url": evidence_url,
        "evidence_source": evidence_source,
        "snippet": snippet,
        "confidence": round(min(max(confidence, 0.0), 1.0), 2),
        "queue": queue,
        "detected_at": utc_now(),
    }
    if extra:
        payload.update(extra)
    return payload


def evidence_source(kind: str, url: str, company: dict) -> str:
    host = urlparse(url).netloc.lower().removeprefix("www.")
    domain = (company.get("domain") or "").lower().removeprefix("www.")
    if domain and host and host != domain and not host.endswith("." + domain):
        return "directory_profile"
    if kind == "careers":
        return "careers_page"
    if kind == "about":
        return "about_page"
    return "company_page"


def detect_text_signals(company: dict, url: str, text: str, kind: str) -> list[dict]:
    signals: list[dict] = []
    source = evidence_source(kind, url, company)

    hiring_hits = [(pat, conf) for pat, conf in HIRING_PATTERNS if re.search(pat, text, re.I)]
    if hiring_hits:
        best_pat, best_conf = max(hiring_hits, key=lambda item: item[1])
        if kind == "careers":
            best_conf = min(1.0, best_conf + 0.05)
        elif kind != "about":
            best_conf -= 0.12
        roles = extract_roles(text) if kind == "careers" else extract_roles(snippet_around(text, best_pat))
        if roles:
            for role in roles:
                signals.append(
                    make_signal(
                        "hiring",
                        company,
                        evidence_url=url,
                        evidence_source=source,
                        snippet=snippet_around(text, best_pat),
                        confidence=best_conf,
                        role=role,
                    )
                )
        else:
            signals.append(
                make_signal(
                    "hiring",
                    company,
                    evidence_url=url,
                    evidence_source=source,
                    snippet=snippet_around(text, best_pat),
                    confidence=best_conf,
                    role=None,
                )
            )

    for pat, conf in EXPANSION_PATTERNS:
        if re.search(pat, text, re.I):
            signals.append(
                make_signal(
                    "expansion",
                    company,
                    evidence_url=url,
                    evidence_source=source,
                    snippet=snippet_around(text, pat),
                    confidence=conf,
                )
            )
            break

    cities = distinct_metros(office_cities(text))
    if len(cities) >= 2 and not any(s["type"] == "expansion" and s["evidence_url"] == url for s in signals):
        signals.append(
            make_signal(
                "expansion",
                company,
                evidence_url=url,
                evidence_source=source,
                snippet=f"Offices or locations listed in {', '.join(cities)}.",
                confidence=0.58,
                extra={"locations": cities},
            )
        )

    for pat, conf in LEADERSHIP_PATTERNS:
        if re.search(pat, text, re.I):
            signals.append(
                make_signal(
                    "leadership_hire",
                    company,
                    evidence_url=url,
                    evidence_source=source,
                    snippet=snippet_around(text, pat),
                    confidence=conf,
                )
            )
            break

    for pat, conf in RELAUNCH_PATTERNS:
        if re.search(pat, text, re.I):
            signals.append(
                make_signal(
                    "website_relaunch",
                    company,
                    evidence_url=url,
                    evidence_source=source,
                    snippet=snippet_around(text, pat),
                    confidence=conf,
                )
            )
            break

    return signals


def diff_tech(previous: list[str] | None, current: list[str]) -> dict | None:
    prev = set(previous or [])
    curr = set(current)
    if previous is None:
        return None
    added = sorted(curr - prev)
    removed = sorted(prev - curr)
    if not added and not removed:
        return None
    return {"added": added, "removed": removed}


def snapshot_path(snapshots_dir: Path, domain: str) -> Path:
    safe = re.sub(r"[^a-z0-9.-]+", "-", domain.lower())
    return snapshots_dir / f"{safe}.json"


def load_snapshot(snapshots_dir: Path, domain: str) -> dict | None:
    path = snapshot_path(snapshots_dir, domain)
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def save_snapshot(snapshots_dir: Path, domain: str, tech: list[str]) -> Path:
    snapshots_dir.mkdir(parents=True, exist_ok=True)
    path = snapshot_path(snapshots_dir, domain)
    path.write_text(
        json.dumps({"captured_at": utc_now(), "domain": domain, "tech": tech}, indent=2),
        encoding="utf-8",
    )
    return path


def parse_seek_titles(html: str, text: str) -> list[str]:
    """Pull job titles from a SEEK *search* page without following /job/ links."""
    titles: list[str] = []
    for match in re.findall(r'data-automation="jobTitle"[^>]*>([^<]+)', html, flags=re.I):
        title = re.sub(r"\s+", " ", match).strip()
        if title and title not in titles:
            titles.append(title)
    if not titles:
        for pat, label in ROLE_PATTERNS:
            if re.search(pat, text, re.I) and label not in titles:
                titles.append(label)
    return titles[:12]


def _source_row(url: str, status: str, detail: str, kind: str) -> dict:
    return {"url": url, "status": status, "detail": detail, "kind": kind}


def _candidate_urls(company: dict, home_links: list[tuple[str, str]]) -> list[tuple[str, str]]:
    ordered: list[tuple[str, str]] = []
    seen: set[str] = set()

    def add(url: str | None, kind: str) -> None:
        if not url:
            return
        url = url.split("#")[0]
        if url in seen or is_linkedin_url(url) or is_seek_job_url(url):
            return
        seen.add(url)
        ordered.append((url, kind))

    add(company.get("website"), "home")
    for url in company.get("about_urls") or []:
        add(url, "about")
    for url in company.get("careers_urls") or []:
        add(url, "careers")
    host = company.get("domain") or ""
    for text, url in home_links:
        if host and not _same_host(url, host):
            continue
        kind = page_kind(url, text)
        if kind in {"careers", "about"}:
            add(url, kind)
    return ordered


def _origin(url: str) -> str | None:
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return None
    return f"{parsed.scheme}://{parsed.netloc}"


def fetch_robots_text(url: str, cache: dict, sources: list[dict]) -> str:
    origin = _origin(url)
    if not origin:
        return ""
    if origin in cache:
        return cache[origin]
    robots_url = urljoin(origin, "/robots.txt")
    try:
        page = fetch(robots_url)
        cache[origin] = str(page.get_all_text(strip=True) or "")
        sources.append(_source_row(robots_url, "ok", f"HTTP {getattr(page, 'status', '?')}", "robots"))
    except Exception as exc:  # noqa: BLE001
        cache[origin] = ""
        sources.append(_source_row(robots_url, "error", str(exc), "robots"))
    return cache[origin]


def detect_company(company: dict, snapshots_dir: Path, seek_state: dict | None = None) -> dict:
    website = company.get("website") or ""
    parsed = urlparse(website)
    origin = f"{parsed.scheme}://{parsed.netloc}" if parsed.scheme and parsed.netloc else website.rstrip("/")
    sources: list[dict] = []
    signals: list[dict] = []
    linkedin_urls = extract_linkedin_urls(company.get("linkedin_company_url") or "")
    tech: list[str] = []
    home_links: list[tuple[str, str]] = []
    robots_cache: dict[str, str] = {}
    seek_state = seek_state if seek_state is not None else {}

    homepage = company.get("website")
    if homepage:
        robots_text = fetch_robots_text(homepage, robots_cache, sources)
        try:
            if not robots_allows(homepage, robots_text):
                sources.append(_source_row(homepage, "skipped", "robots.txt disallow", "home"))
            else:
                page = fetch(homepage)
                status = getattr(page, "status", None)
                html = _html(page)
                text = str(page.get_all_text(strip=True) or "")
                home_links = _hrefs(page, homepage)
                tech = detect_tech(html, getattr(page, "headers", None))
                linkedin_urls.extend(extract_linkedin_urls(text, html, *[u for _, u in home_links]))
                sources.append(_source_row(str(getattr(page, "url", homepage)), "ok", f"HTTP {status}", "home"))
                if status and int(status) < 400:
                    signals.extend(detect_text_signals(company, homepage, text, "home"))
        except Exception as exc:  # noqa: BLE001
            sources.append(_source_row(homepage, "error", str(exc), "home"))

    for url, kind in _candidate_urls(company, home_links):
        if kind == "home":
            continue
        if is_linkedin_url(url):
            sources.append(_source_row(url, "skipped", "LinkedIn is not crawled (ToS / robots)", "linkedin"))
            linkedin_urls.extend(extract_linkedin_urls(url))
            continue
        robots_text = fetch_robots_text(url, robots_cache, sources)
        if not robots_allows(url, robots_text):
            sources.append(_source_row(url, "skipped", "robots.txt disallow", kind))
            continue
        try:
            page = fetch(url)
            status = getattr(page, "status", None)
            html = _html(page)
            text = str(page.get_all_text(strip=True) or "")
            linkedin_urls.extend(extract_linkedin_urls(text, html))
            if not tech:
                tech = detect_tech(html, getattr(page, "headers", None))
            if status and int(status) >= 400:
                sources.append(_source_row(str(getattr(page, "url", url)), "skipped", f"HTTP {status}", kind))
                continue
            sources.append(_source_row(str(getattr(page, "url", url)), "ok", f"HTTP {status}", kind))
            signals.extend(detect_text_signals(company, url, text, kind or page_kind(url)))
        except Exception as exc:  # noqa: BLE001
            sources.append(_source_row(url, "error", str(exc), kind))

    previous = load_snapshot(snapshots_dir, company.get("domain") or "unknown")
    previous_tech = previous.get("tech") if previous else None
    delta = diff_tech(previous_tech, tech)
    save_snapshot(snapshots_dir, company.get("domain") or "unknown", tech)
    if delta:
        signals.append(
            make_signal(
                "tech_stack_change",
                company,
                evidence_url=homepage or origin,
                evidence_source="tech_snapshot",
                snippet=f"Added {', '.join(delta['added']) or '—'}. Removed {', '.join(delta['removed']) or '—'}.",
                confidence=0.8,
                extra={"added": delta["added"], "removed": delta["removed"]},
            )
        )

    keywords = company.get("seek_keywords") or []
    for keyword in keywords:
        search_url = seek_search_url(keyword)
        if seek_state.get("blocked"):
            sources.append(
                _source_row(
                    search_url,
                    "skipped",
                    "SEEK already Cloudflare-blocked this run; not retrying every keyword",
                    "job_board",
                )
            )
            continue
        if not seek_url_allowed(search_url):
            sources.append(_source_row(search_url, "skipped", "SEEK URL not in Allow: *?keywords", "job_board"))
            continue
        try:
            page = fetch(search_url, timeout=20)
            status = getattr(page, "status", None)
            html = _html(page)
            text = str(page.get_all_text(strip=True) or "")
            if status == 403 or "just a moment" in text.lower() or "enable javascript and cookies" in text.lower():
                seek_state["blocked"] = True
                sources.append(
                    _source_row(
                        search_url,
                        "blocked",
                        "Cloudflare challenge on SEEK search (robots-allowed ?keywords= only; /job/ never fetched)",
                        "job_board",
                    )
                )
                continue
            if status and int(status) >= 400:
                sources.append(_source_row(search_url, "blocked", f"HTTP {status}", "job_board"))
                continue
            titles = parse_seek_titles(html, text)
            sources.append(_source_row(search_url, "ok", f"HTTP {status}; {len(titles)} titles", "job_board"))
            for title in titles:
                signals.append(
                    make_signal(
                        "hiring",
                        company,
                        evidence_url=search_url,
                        evidence_source="job_board_search",
                        snippet=f"SEEK search for {keyword!r} listed {title}.",
                        confidence=0.84,
                        role=title,
                    )
                )
        except Exception as exc:  # noqa: BLE001
            sources.append(_source_row(search_url, "error", str(exc), "job_board"))

    unique_li: list[str] = []
    seen_li: set[str] = set()
    for url in linkedin_urls:
        key = url.lower().rstrip("/")
        if key not in seen_li:
            seen_li.add(key)
            unique_li.append(url.rstrip("/"))

    # Dedupe signals by type+url+role, and collapse repeated expansion footprints.
    unique_signals: list[dict] = []
    seen_sig: set[tuple] = set()
    for row in signals:
        key = (row["type"], row.get("evidence_url"), row.get("role"))
        if key in seen_sig:
            continue
        seen_sig.add(key)
        unique_signals.append(row)

    expansions = [s for s in unique_signals if s["type"] == "expansion"]
    rest = [s for s in unique_signals if s["type"] != "expansion"]
    source_rank = {"careers_page": 0, "about_page": 1, "company_page": 2}
    expansions.sort(key=lambda s: (source_rank.get(s.get("evidence_source"), 9), -s.get("confidence", 0)))
    seen_footprint: set[tuple] = set()
    collapsed: list[dict] = []
    for row in expansions:
        footprint = (row.get("company_domain"), tuple(row.get("locations") or [row.get("snippet")]))
        if footprint in seen_footprint:
            continue
        seen_footprint.add(footprint)
        collapsed.append(row)
    unique_signals = rest + collapsed

    return {
        "company": company.get("name"),
        "domain": company.get("domain"),
        "tech": tech,
        "tech_snapshot": "updated" if previous else "created",
        "sources": sources,
        "signals": unique_signals,
        "linkedin_watch": [
            {
                "company_name": company.get("name"),
                "url": url,
                "note": "Not scraped. Recorded for official LinkedIn API or manual review only.",
            }
            for url in unique_li
        ],
    }


def build_feed(watchlist: dict, snapshots_dir: Path) -> dict:
    companies = watchlist.get("companies") or []
    queue = watchlist.get("queue") or "tier1"
    seek_state: dict = {}
    results = [detect_company(company, snapshots_dir, seek_state=seek_state) for company in companies]
    signals: list[dict] = []
    sources: list[dict] = []
    linkedin_watch: list[dict] = []
    for result in results:
        for row in result["signals"]:
            row["queue"] = row.get("queue") or queue
            signals.append(row)
        sources.extend(result["sources"])
        linkedin_watch.extend(result["linkedin_watch"])
    signals.sort(key=lambda row: (-row.get("confidence", 0), row.get("type"), row.get("company_name") or ""))
    return {
        "feed": watchlist.get("feed") or FEED_NAME,
        "version": FEED_VERSION,
        "generated_at": utc_now(),
        "queue": queue,
        "policy": {
            "linkedin": "Company page URLs are recorded only. LinkedIn robots.txt and ToS forbid automated crawling.",
            "seek": "Only robots-allowed search URLs with ?keywords= or ?advertiserid= are fetched. Individual /job/ listings are never requested.",
            "careers_about": "About Us and careers pages on the company host are scraped when robots.txt allows.",
        },
        "companies_scanned": [
            {
                "name": row["company"],
                "domain": row["domain"],
                "tech": row["tech"],
                "tech_snapshot": row["tech_snapshot"],
            }
            for row in results
        ],
        "sources": sources,
        "linkedin_watch": linkedin_watch,
        "signals": signals,
    }


def feed_markdown(feed: dict) -> str:
    lines = [
        f"# {feed.get('feed')}",
        "",
        f"Generated {feed.get('generated_at')}. Queue `{feed.get('queue')}`.",
        "",
        "## Policy",
        f"- LinkedIn: {feed['policy']['linkedin']}",
        f"- SEEK: {feed['policy']['seek']}",
        f"- Company sites: {feed['policy']['careers_about']}",
        "",
        "## Signals",
    ]
    if not feed.get("signals"):
        lines.append("- none this run")
    for row in feed.get("signals") or []:
        role = f" · {row['role']}" if row.get("role") else ""
        lines.append(
            f"- **{row['type']}**{role} @ {row.get('company_name')} "
            f"(confidence {row.get('confidence')}) — {row.get('evidence_url')}"
        )
        if row.get("snippet"):
            lines.append(f"  - {row['snippet']}")
    lines += ["", "## Sources"]
    for src in feed.get("sources") or []:
        lines.append(f"- `{src['status']}` {src['kind']}: {src['url']} — {src['detail']}")
    if feed.get("linkedin_watch"):
        lines += ["", "## LinkedIn watch (not scraped)"]
        for row in feed["linkedin_watch"]:
            lines.append(f"- {row['company_name']}: {row['url']}")
    return "\n".join(lines) + "\n"


def load_watchlist(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))
