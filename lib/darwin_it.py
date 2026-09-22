"""Research Darwin / Palmerston IT companies, published jobs, and resume emails."""

from __future__ import annotations

import html as html_module
import json
import re
import threading
import time
import urllib.robotparser
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from lxml import html
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

USER_AGENT = "Mozilla/5.0 (compatible; Darwin-IT-research/1.0)"
ICTNT_ORIGIN = "https://www.ictnt.asn.au"
ICTNT_LIST_URL = f"{ICTNT_ORIGIN}/ict-list-view"
ICTNT_CRAWL_DELAY = 3.0
SEEK_DARWIN_IT = (
    "https://www.seek.com.au/jobs-in-information-communication-technology/in-All-Darwin-NT"
)
NTG_JOBS_HOME = "https://jobs.nt.gov.au/"
NTG_JOB_DETAIL = "https://jobs.nt.gov.au/Home/JobDetails?rtfId={rtf_id}"

DARWIN_HINTS = (
    "darwin",
    "palmerston",
    "winnellie",
    "casuarina",
    "stuart park",
    "parap",
    "nightcliff",
    "coconut grove",
    "humpty doo",
    "howard springs",
    "berrimah",
    "woolner",
    "fannie bay",
    "larrakeyah",
    "tiwi",
    "northern territory",
    " nt",
    "nt ",
    "nt,",
)
NOT_DARWIN_HINTS = (
    "alice springs",
    "katherine",
    "nhulunbuy",
    "tennant creek",
    "mutitjulu",
)
NATIONAL_NAME_HINTS = (
    "dxc",
    "dialog",
    "nec",
    "kinetic",
    "salesforce",
    "nbn",
    "ricoh",
    "intersystems",
    "vocus",
    "msp corporation",
    "asi solutions",
    "techsend",
)

IT_ROLE_RULES: tuple[tuple[str, re.Pattern], ...] = (
    (
        "Software Developer / Engineer",
        re.compile(
            r"\b(?:software|full[- ]stack|backend|front[- ]end|frontend|\.net|java|"
            r"python|integration|application)\s+(?:developer|engineer)s?\b|"
            r"\b(?:developer|programmer|software engineer)s?\b",
            re.I,
        ),
    ),
    (
        "Systems / Infrastructure Engineer",
        re.compile(
            r"\b(?:systems?|infrastructure|windows|linux|unix|virtualisation|"
            r"virtualization)\s+(?:engineer|administrator|admin|specialist)\b|"
            r"\bsysadmin\b|\bsystem administrator\b",
            re.I,
        ),
    ),
    (
        "Network Engineer",
        re.compile(r"\bnetwork\s+(?:engineer|administrator|specialist|technician)\b", re.I),
    ),
    (
        "Cybersecurity",
        re.compile(
            r"\b(?:cyber\s*security|information security|security (?:analyst|engineer|"
            r"consultant|specialist|officer)|soc analyst|penetration tester)\b",
            re.I,
        ),
    ),
    (
        "Cloud / Microsoft 365",
        re.compile(
            r"\b(?:cloud|azure|aws|microsoft 365|m365|office 365|sharepoint|intune)"
            r"\s+(?:engineer|architect|consultant|administrator|specialist)\b|"
            r"\bcloud engineer\b",
            re.I,
        ),
    ),
    (
        "DevOps / Platform",
        re.compile(r"\b(?:devops|sre|platform engineer|site reliability)\b", re.I),
    ),
    (
        "Data / Database",
        re.compile(
            r"\b(?:data (?:engineer|analyst|scientist)|database (?:administrator|"
            r"developer)|dba|bi developer)\b",
            re.I,
        ),
    ),
    (
        "Web Developer / Designer",
        re.compile(r"\b(?:web|wordpress|frontend)\s+(?:developer|designer|engineer)\b", re.I),
    ),
    (
        "IT Support / Helpdesk",
        re.compile(
            r"\b(?:it|ict|desktop|service desk|help ?desk|field|technical)\s+"
            r"(?:support|technician|officer|engineer|analyst)\b|"
            r"\b(?:support officer|support technician|support engineer|"
            r"helpdesk|service desk)\b",
            re.I,
        ),
    ),
    (
        "Project / Business Analyst",
        re.compile(
            r"\b(?:(?:it|ict|technical|digital) )?project manager\b|"
            r"\bbusiness analyst\b|\bscrum master\b",
            re.I,
        ),
    ),
    (
        "ICT Manager / Team Lead",
        re.compile(
            r"\b(?:it|ict|technical|service desk|operations|digital)\s+"
            r"(?:manager|lead|director|head)\b|"
            r"\bteam lead(?:er)?\b|\btechnical operations\b",
            re.I,
        ),
    ),
    (
        "ICT Consultant",
        re.compile(
            r"\b(?:it|ict|technology|technical|digital|erp|crm)\s+consultant\b|"
            r"\bconsultant\b",
            re.I,
        ),
    ),
    (
        "Other IT Role",
        re.compile(
            r"\b(?:solution architect|enterprise architect|test analyst|"
            r"qa engineer|software tester|product owner|change manager|"
            r"release manager|service manager)\b",
            re.I,
        ),
    ),
)
CAREER_HINTS = (
    "career",
    "careers",
    "jobs",
    "job",
    "vacancies",
    "vacancy",
    "work-with-us",
    "work-for-us",
    "join-us",
    "join-our-team",
    "employment",
    "opportunities",
    "current-opportunities",
    "we-are-hiring",
)
ATS_HOSTS = (
    "seek.com.au",
    "ethicaljobs.com.au",
    "livehire.com",
    "employmenthero.com",
    "workdayjobs.com",
    "myworkdayjobs.com",
    "bamboohr.com",
    "greenhouse.io",
    "lever.co",
    "smartrecruiters.com",
    "jobs.nt.gov.au",
    "careers.nec.com",
    "dxc.com",
    "kineticit.com.au",
)
JOB_CONTEXT_RE = re.compile(
    r"\b(?:apply|career|careers|employment|hiring|job|jobs|join|opening|openings|"
    r"opportunit(?:y|ies)|position|positions|recruit|recruitment|role|roles|"
    r"vacancy|vacancies|work with us|we are hiring)\b",
    re.I,
)
JOB_ROLE_NOUN_RE = re.compile(
    r"\b(?:administrator|analyst|architect|consultant|developer|engineer|"
    r"lead|leader|manager|officer|programmer|specialist|technician|"
    r"tester|designer|director|head)\b",
    re.I,
)
NON_JOB_TITLE_RE = re.compile(
    r"^(?:a career|about |benefits? |career in|careers?:|contact |do |how |"
    r"learn |our |read more|see |the |view |we |what |why |send us)|"
    r"\b(?:privacy policy|terms of|cookie|read more|view all jobs)\b",
    re.I,
)
SERVICE_TITLE_RE = re.compile(
    r"^(?:managed it(?: services)?|it support|ict support|cyber ?security|"
    r"cloud(?: services)?|web design|software development|consulting|"
    r"microsoft 365|computer repairs?)$",
    re.I,
)
EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
JUNK_EMAIL_RE = re.compile(
    r"@(?:sentry\.io|example\.|wixpress\.|sentry-next|cloudflare|schema\.org)|"
    r"^(?:noreply|no-reply|donotreply|webmaster|privacy|legal|mailer-daemon)@",
    re.I,
)
SKIP_EMAIL_HOSTS = {
    "ictnt.asn.au",
    "sentry.io",
    "wixpress.com",
    "example.com",
    "schema.org",
    "embedgooglemap.net",
}
CAREERS_LOCAL = re.compile(
    r"^(?:careers?|jobs?|recruitment|hr|people|talent|employment|vacancies|"
    r"apply|applications|hiring)(?:[-_.].*)?$",
    re.I,
)
GENERAL_LOCAL = re.compile(
    r"^(?:info|information|contact|hello|admin|office|enquir(?:y|ies)|"
    r"inquir(?:y|ies)|reception|team|support)(?:[-_.].*)?$",
    re.I,
)
GMAIL_HOSTS = {"gmail.com", "googlemail.com"}
FREE_INBOX_HOSTS = GMAIL_HOSTS | {
    "hotmail.com",
    "outlook.com",
    "live.com.au",
    "yahoo.com",
    "yahoo.com.au",
    "icloud.com",
}
PHONE_RE = re.compile(
    r"(?:\+?61\s?)?(?:0?4\d{2}[\s-]?\d{3}[\s-]?\d{3}|0[2378]\s?\d{4}\s?\d{4}|1300\s?\d{3}\s?\d{3}|13\s?\d{2}\s?\d{2})"
)

_local = threading.local()


def _session() -> requests.Session:
    session = getattr(_local, "session", None)
    if session is None:
        session = requests.Session()
        session.headers.update(
            {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/json;q=0.9",
            }
        )
        _local.session = session
    return session


def _clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html_module.unescape(value or "")).strip()


def _absolute(base: str, href: str | None) -> str:
    if not href:
        return ""
    href = href.strip()
    if href.startswith(("javascript:", "#")):
        return ""
    if href.startswith("mailto:"):
        return href
    return urljoin(base, href)


def _canonical(url: str) -> str:
    parsed = urlparse(url)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", "")).rstrip("/")


def _host(url: str) -> str:
    return urlparse(url).netloc.lower().split(":", 1)[0].removeprefix("www.")


def _robots_allows(url: str, timeout: int) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    try:
        response = _session().get(robots_url, timeout=timeout, allow_redirects=True)
        if response.status_code in {401, 403}:
            return False
        if response.status_code >= 400:
            return True
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(robots_url)
        parser.parse(response.text.splitlines())
        return parser.can_fetch(USER_AGENT, url)
    except requests.RequestException:
        return True


def is_darwin_location(value: str) -> bool:
    text = f" { _clean_text(value).lower() } "
    if any(hint in text for hint in NOT_DARWIN_HINTS):
        if any(hint in text for hint in ("darwin", "palmerston", "winnellie", "casuarina")):
            return True
        return False
    return any(hint in text for hint in DARWIN_HINTS)


def classify_it_role(title: str) -> str:
    value = _clean_text(title)
    if not value:
        return ""
    for category, pattern in IT_ROLE_RULES:
        if pattern.search(value):
            return category
    return ""


def plausible_it_job_title(title: str) -> bool:
    value = _clean_text(title)
    words = value.split()
    return bool(
        2 <= len(words) <= 18
        and classify_it_role(value)
        and JOB_ROLE_NOUN_RE.search(value)
        and not NON_JOB_TITLE_RE.search(value)
        and not SERVICE_TITLE_RE.fullmatch(value)
        and "?" not in value
    )


def _email_host(email: str) -> str:
    return email.rsplit("@", 1)[-1].lower()


def _email_local(email: str) -> str:
    return email.split("@", 1)[0]


def published_emails(content: str, page_url: str = "") -> list[str]:
    found: list[str] = []
    for match in EMAIL_RE.findall(content or ""):
        email = match.strip().strip(".,;:<>()[]\"'").lower()
        host = _email_host(email)
        if JUNK_EMAIL_RE.search(email) or host in SKIP_EMAIL_HOSTS:
            continue
        if email not in found:
            found.append(email)
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return found
    for anchor in document.xpath("//a[starts-with(@href, 'mailto:')]"):
        href = anchor.get("href") or ""
        address = href.split(":", 1)[-1].split("?", 1)[0].strip().lower()
        host = _email_host(address) if "@" in address else ""
        if not address or host in SKIP_EMAIL_HOSTS or JUNK_EMAIL_RE.search(address):
            continue
        if address not in found:
            found.append(address)
    return found


def rank_resume_email(emails: list[str], website: str = "") -> dict:
    company_host = _host(website) if website else ""
    scored: list[tuple[int, str, str]] = []
    for email in emails:
        host = _email_host(email)
        local = _email_local(email)
        score = 0
        kind = "other published email"
        if CAREERS_LOCAL.match(local):
            score, kind = 100, "careers / HR inbox"
        elif re.search(r"(recruit|talent|people|hr)", local, re.I):
            score, kind = 95, "careers / HR inbox"
        elif GENERAL_LOCAL.match(local):
            score, kind = 70, "general company inbox"
        elif host in GMAIL_HOSTS:
            score, kind = 55, "published Gmail"
        elif host in FREE_INBOX_HOSTS:
            score, kind = 45, "published personal inbox"
        elif company_host and (host == company_host or host.endswith("." + company_host)):
            score, kind = 60, "named company inbox"
        else:
            score, kind = 40, "other published email"
        if host in GMAIL_HOSTS and CAREERS_LOCAL.match(local):
            score, kind = 110, "published Gmail careers inbox"
        scored.append((score, email, kind))
    if not scored:
        return {
            "best_resume_email": "",
            "email_type": "none published",
            "gmail_email": "",
            "other_emails": "",
        }
    scored.sort(key=lambda item: (-item[0], item[1]))
    best_email, best_kind = scored[0][1], scored[0][2]
    gmails = [email for email in emails if _email_host(email) in GMAIL_HOSTS]
    others = [email for email in emails if email != best_email]
    return {
        "best_resume_email": best_email,
        "email_type": best_kind,
        "gmail_email": "; ".join(gmails),
        "other_emails": "; ".join(others),
    }


def parse_ictnt_list(content: str) -> list[dict]:
    document = html.fromstring(content)
    companies: list[dict] = []
    seen: set[str] = set()
    cards = document.xpath("//div[contains(@class,'list-item')] | //li[contains(@class,'views-row')]")
    if not cards:
        cards = document.xpath("//a[contains(@href, '/ict-directory/')]/ancestor::*[self::li or self::div][1]")
    for card in cards:
        anchor = card.xpath(".//a[contains(@href, '/ict-directory/')][1]")
        if not anchor:
            continue
        href = urljoin(ICTNT_ORIGIN, anchor[0].get("href") or "")
        if href in seen:
            continue
        strong = card.xpath(".//strong")
        name = _clean_text(strong[0].text_content()) if strong else ""
        location_bits = card.xpath(".//div[contains(@class,'left-column')]")
        location_text = _clean_text(location_bits[0].text_content()) if location_bits else _clean_text(card.text_content())
        if not name:
            name = re.sub(r"\s*view profile.*$", "", location_text, flags=re.I)
            name = re.sub(r"(Darwin|Palmerston|Katherine|Alice[- ]Springs)\s*$", "", name, flags=re.I).strip()
        location = "Darwin"
        if re.search(r"alice[- ]springs", location_text, re.I):
            location = "Alice Springs"
        elif re.search(r"katherine", location_text, re.I):
            location = "Katherine"
        elif re.search(r"palmerston", location_text, re.I):
            location = "Palmerston"
        if not name:
            continue
        seen.add(href)
        companies.append(
            {
                "name": name,
                "profile_url": href,
                "location": location,
                "source": "ICTNT directory",
            }
        )
    return companies


def parse_ictnt_profile(content: str, profile_url: str) -> dict:
    document = html.fromstring(content)
    name = ""
    here = document.xpath("//h2[contains(., 'You are here')]/following::h2[1]/text()")
    if here:
        name = _clean_text(here[0])
    if not name:
        headings = [_clean_text(value) for value in document.xpath("//h2/text()")]
        name = next((value for value in headings if value and value not in {"ICT Companies", "You are here"}), "")
    website = ""
    email = ""
    phone = ""
    address = ""
    for anchor in document.xpath("//a[@href]"):
        href = (anchor.get("href") or "").strip()
        text = _clean_text(anchor.text_content()).lower()
        if href.startswith("mailto:"):
            candidate = href.split(":", 1)[-1].split("?", 1)[0]
            if _email_host(candidate) not in SKIP_EMAIL_HOSTS and not email:
                email = candidate
        elif text == "visit company website" or (
            href.startswith("http")
            and "ictnt.asn.au" not in href
            and "captovate.com" not in href
            and "embedgooglemap" not in href
            and "123movies" not in href
            and "linkedin.com" not in href
            and "facebook.com" not in href
            and not website
        ):
            website = href
    body = _clean_text(document.text_content())
    contact = body[body.find("Contact Us") : body.find("Contact Us") + 240] if "Contact Us" in body else ""
    phone_match = PHONE_RE.search(contact or body)
    if phone_match:
        phone = _clean_text(phone_match.group(0))
    address_match = re.search(
        r"(?:Level\s+\d+[^\.]{0,80}|^\d+/\d+[^\.]{0,80}|PO Box[^.]{0,60}|"
        r"\d+\s+[A-Z][A-Za-z]+ Street[^.]{0,60})",
        contact,
        re.I,
    )
    if address_match:
        address = _clean_text(address_match.group(0))
    return {
        "name": name,
        "website": website,
        "directory_email": email,
        "phone": phone,
        "address": address,
        "profile_url": profile_url,
        "source": "ICTNT directory",
    }


def load_extra_companies(path: Path) -> list[dict]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    companies = []
    for item in payload.get("companies") or []:
        companies.append(
            {
                "name": item["name"],
                "website": item.get("website") or "",
                "careers_url": item.get("careers_url") or "",
                "suburb": item.get("suburb") or "Darwin",
                "focus": item.get("focus") or "",
                "source": item.get("source") or "local research",
                "national": bool(item.get("national")),
                "employer_type": item.get("employer_type") or "Private IT company",
                "directory_email": "",
                "phone": "",
                "address": item.get("suburb") or "",
                "profile_url": "",
                "location": "Darwin",
            }
        )
    return companies


def website_from_email(email: str) -> str:
    host = _email_host(email)
    if not host or host in FREE_INBOX_HOSTS or host in SKIP_EMAIL_HOSTS:
        return ""
    return f"https://www.{host}/"


def merge_companies(directory: list[dict], extras: list[dict]) -> list[dict]:
    merged: dict[str, dict] = {}
    for item in directory + extras:
        if item.get("location") and not is_darwin_location(item["location"]) and item.get("location") != "Darwin":
            continue
        key = re.sub(r"[^a-z0-9]+", "", (item.get("name") or "").lower())
        if not key:
            continue
        current = merged.get(key) or {
            "name": item.get("name"),
            "website": "",
            "careers_url": "",
            "suburb": item.get("suburb") or item.get("location") or "Darwin",
            "focus": item.get("focus") or "",
            "source": item.get("source") or "",
            "national": bool(item.get("national")),
            "employer_type": item.get("employer_type") or "Private IT company",
            "directory_email": "",
            "phone": item.get("phone") or "",
            "address": item.get("address") or "",
            "profile_url": item.get("profile_url") or "",
            "location": "Darwin",
        }
        for field in ("website", "careers_url", "focus", "directory_email", "phone", "address", "profile_url"):
            if item.get(field) and not current.get(field):
                current[field] = item[field]
        current["source"] = "; ".join(
            sorted({part for part in (current.get("source"), item.get("source")) if part})
        )
        if item.get("national"):
            current["national"] = True
        if item.get("employer_type") and current["employer_type"] == "Private IT company":
            current["employer_type"] = item["employer_type"]
        merged[key] = current
    for item in merged.values():
        if not item.get("website") and item.get("directory_email"):
            item["website"] = website_from_email(item["directory_email"])
        name = (item.get("name") or "").lower()
        if any(hint in name for hint in NATIONAL_NAME_HINTS):
            item["national"] = True
    return sorted(merged.values(), key=lambda row: str(row.get("name") or "").lower())


def scrape_ictnt_directory(timeout: int = 20, delay: float = ICTNT_CRAWL_DELAY) -> list[dict]:
    if not _robots_allows(ICTNT_LIST_URL, timeout):
        return []
    response = _session().get(ICTNT_LIST_URL, timeout=timeout, allow_redirects=True)
    response.raise_for_status()
    companies = []
    for item in parse_ictnt_list(response.text):
        if not is_darwin_location(item.get("location") or "Darwin"):
            continue
        time.sleep(delay)
        if not _robots_allows(item["profile_url"], timeout):
            companies.append({**item, "website": "", "directory_email": ""})
            continue
        try:
            page = _session().get(item["profile_url"], timeout=timeout, allow_redirects=True)
            page.raise_for_status()
            companies.append({**item, **parse_ictnt_profile(page.text, item["profile_url"])})
        except requests.RequestException:
            companies.append({**item, "website": "", "directory_email": ""})
    return companies


def _career_pages(home_url: str, content: str, extra: str = "", limit: int = 7) -> list[str]:
    parsed = urlparse(home_url)
    ordered = [home_url]
    if extra:
        ordered.append(extra)
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return ordered[:limit]
    scored: list[tuple[int, str]] = []
    for anchor in document.xpath("//a[@href]"):
        target = _absolute(home_url, anchor.get("href"))
        if not target.startswith("http"):
            continue
        target_parsed = urlparse(target)
        text = _clean_text(" ".join(anchor.itertext()))
        low = f"{target_parsed.path} {text}".lower()
        score = sum(hint in low for hint in CAREER_HINTS)
        if not score:
            continue
        same_host = target_parsed.netloc.lower() == parsed.netloc.lower()
        ats = any(target_parsed.netloc.lower().endswith(host) for host in ATS_HOSTS)
        if same_host or ats:
            scored.append((score, _canonical(target)))
    for _, url in sorted(scored, key=lambda item: (-item[0], len(item[1]))):
        if url not in ordered:
            ordered.append(url)
        if len(ordered) >= limit:
            break
    return ordered


def _walk_json(value):
    if isinstance(value, list):
        for item in value:
            yield from _walk_json(item)
    elif isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _walk_json(child)


def _location_text(value) -> str:
    if isinstance(value, list):
        return "; ".join(filter(None, (_location_text(item) for item in value)))
    if not isinstance(value, dict):
        return _clean_text(str(value or ""))
    address = value.get("address") or value
    if not isinstance(address, dict):
        return _clean_text(str(address or ""))
    return ", ".join(
        str(address.get(key) or "").strip()
        for key in ("addressLocality", "addressRegion", "addressCountry")
        if address.get(key)
    )


def extract_job_openings(content: str, source_url: str) -> list[dict]:
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return []
    found: list[dict] = []
    for script in document.xpath("//script[@type='application/ld+json']/text()"):
        try:
            payload = json.loads(script)
        except (TypeError, ValueError):
            continue
        for item in _walk_json(payload):
            kinds = item.get("@type")
            kinds = kinds if isinstance(kinds, list) else [kinds]
            if "JobPosting" not in kinds:
                continue
            title = _clean_text(str(item.get("title") or ""))
            if not plausible_it_job_title(title):
                continue
            valid = str(item.get("validThrough") or "")
            if valid and valid[:10] < date.today().isoformat():
                continue
            found.append(
                {
                    "role_category": classify_it_role(title),
                    "position_title": title,
                    "job_url": urljoin(source_url, str(item.get("url") or source_url)),
                    "source_page": source_url,
                    "status": "Published JobPosting",
                    "date_posted": str(item.get("datePosted") or ""),
                    "valid_through": valid,
                    "location": _location_text(item.get("jobLocation")),
                    "employment_type": _clean_text(str(item.get("employmentType") or "")),
                }
            )
    for heading in document.xpath("//h1|//h2|//h3|//a[@href]"):
        title = _clean_text(" ".join(heading.itertext()))
        href = heading.get("href") if heading.tag == "a" else ""
        target = urljoin(source_url, href) if href else source_url
        if not plausible_it_job_title(title):
            continue
        if heading.tag == "a" and not JOB_CONTEXT_RE.search(f"{urlparse(target).path} {title}"):
            if not any(urlparse(target).netloc.lower().endswith(host) for host in ATS_HOSTS):
                continue
        elif heading.tag != "a" and not JOB_CONTEXT_RE.search(source_url + " " + title):
            parent = _clean_text(heading.getparent().text_content() if heading.getparent() is not None else "")
            if not JOB_CONTEXT_RE.search(parent):
                continue
        found.append(
            {
                "role_category": classify_it_role(title),
                "position_title": title,
                "job_url": target,
                "source_page": source_url,
                "status": "Published careers-page listing; closing date not supplied",
                "date_posted": "",
                "valid_through": "",
                "location": "",
                "employment_type": "",
            }
        )
    unique: dict[tuple[str, str], dict] = {}
    for opening in found:
        key = (opening["job_url"].lower().rstrip("/"), opening["position_title"].lower())
        current = unique.get(key)
        if current is None or (
            opening["status"] == "Published JobPosting"
            and current["status"] != "Published JobPosting"
        ):
            unique[key] = opening
    return list(unique.values())


def job_matches_company(opening: dict, company: dict) -> bool:
    location = opening.get("location") or ""
    title = opening.get("position_title") or ""
    blob = f"{location} {title} {opening.get('job_url') or ''}"
    if company.get("national"):
        return is_darwin_location(blob)
    if location and not is_darwin_location(location):
        if any(hint in location.lower() for hint in NOT_DARWIN_HINTS):
            return False
    return True


def discover_company(company: dict, timeout: int = 12) -> dict:
    website = (company.get("website") or "").strip()
    careers_hint = (company.get("careers_url") or "").strip()
    emails = []
    if company.get("directory_email"):
        emails.append(company["directory_email"].lower())
    openings: list[dict] = []
    pages_checked: list[str] = []
    status = "no official website"
    if website and not website.startswith(("http://", "https://")):
        website = "https://" + website
    if not website:
        ranked = rank_resume_email(emails)
        return {
            **company,
            **ranked,
            "openings": [],
            "jobs_available": 0,
            "pages_checked": [],
            "research_status": status,
            "website": "",
        }
    if not _robots_allows(website, timeout):
        ranked = rank_resume_email(emails, website)
        return {
            **company,
            **ranked,
            "openings": [],
            "jobs_available": 0,
            "pages_checked": [],
            "research_status": "blocked by robots.txt",
            "website": website,
        }
    try:
        response = _session().get(website, timeout=timeout, allow_redirects=True)
        response.raise_for_status()
    except requests.RequestException as exc:
        ranked = rank_resume_email(emails, website)
        return {
            **company,
            **ranked,
            "openings": [],
            "jobs_available": 0,
            "pages_checked": [],
            "research_status": f"official website error: {type(exc).__name__}",
            "website": website,
        }
    home_url = response.url
    pages = _career_pages(home_url, response.text, extra=careers_hint)
    for index, page_url in enumerate(pages):
        if not _robots_allows(page_url, timeout):
            continue
        try:
            page = response if index == 0 and page_url.rstrip("/") == _canonical(home_url) else _session().get(
                page_url, timeout=timeout, allow_redirects=True
            )
            if page is not response:
                page.raise_for_status()
            content = page.text
            final_url = page.url
        except requests.RequestException:
            continue
        pages_checked.append(final_url)
        emails.extend(published_emails(content, final_url))
        for opening in extract_job_openings(content, final_url):
            if job_matches_company(opening, company):
                openings.append(opening)
    unique: dict[tuple[str, str], dict] = {}
    for opening in openings:
        key = (opening["job_url"].lower().rstrip("/"), opening["position_title"].lower())
        unique.setdefault(key, opening)
    openings = list(unique.values())
    emails = list(dict.fromkeys(emails))
    ranked = rank_resume_email(emails, home_url)
    if openings:
        status = "jobs published"
    elif any("career" in page.lower() or "job" in page.lower() for page in pages_checked):
        status = "careers page found; no current Darwin IT listing extracted"
    else:
        status = "official site checked; no published IT jobs extracted"
    return {
        **company,
        **ranked,
        "website": home_url,
        "openings": openings,
        "jobs_available": len(openings),
        "pages_checked": pages_checked,
        "research_status": status,
        "all_emails": emails,
    }


def discover_many(companies: list[dict], workers: int = 8, timeout: int = 12) -> list[dict]:
    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futures = {pool.submit(discover_company, company, timeout): company for company in companies}
        for future in as_completed(futures):
            company = futures[future]
            try:
                results.append(future.result())
            except Exception as exc:  # noqa: BLE001
                results.append(
                    {
                        **company,
                        "best_resume_email": company.get("directory_email") or "",
                        "email_type": "directory email only" if company.get("directory_email") else "none published",
                        "gmail_email": "",
                        "other_emails": "",
                        "openings": [],
                        "jobs_available": 0,
                        "pages_checked": [],
                        "research_status": f"discovery error: {type(exc).__name__}",
                    }
                )
    return sorted(results, key=lambda row: (-row.get("jobs_available", 0), str(row.get("name") or "").lower()))


def parse_ntg_job_detail(content: str, url: str) -> dict | None:
    document = html.fromstring(content)
    body = _clean_text(document.text_content())
    if re.search(r"vacancy is no longer available", body, re.I):
        return None
    title = _clean_text(" ".join(document.xpath("//h1//text() | //title/text()")))
    title = re.sub(r"\s*[|\-].*$", "", title).strip()
    if not title or len(title) < 4:
        return None
    emails = [email for email in published_emails(content) if email.endswith("@nt.gov.au")]
    location = "Darwin" if is_darwin_location(body) else ""
    return {
        "role_category": classify_it_role(title) or "Other IT Role",
        "position_title": title,
        "job_url": url,
        "source_page": url,
        "status": "NT Government official vacancy page",
        "date_posted": "",
        "valid_through": "",
        "location": location or "Darwin Region",
        "employment_type": "",
        "contact_email": emails[0] if emails else "apply via jobs.nt.gov.au",
    }


def attach_ntg_jobs(results: list[dict], detail_urls: list[str], timeout: int = 15) -> list[dict]:
    openings: list[dict] = []
    emails: list[str] = []
    for url in detail_urls:
        if not _robots_allows(url, timeout):
            continue
        try:
            response = _session().get(url, timeout=timeout, allow_redirects=True)
            response.raise_for_status()
        except requests.RequestException:
            continue
        parsed = parse_ntg_job_detail(response.text, response.url)
        if not parsed:
            continue
        if parsed.get("contact_email") and parsed["contact_email"].endswith("@nt.gov.au"):
            emails.append(parsed["contact_email"])
        openings.append({k: v for k, v in parsed.items() if k != "contact_email"})
    if not openings and not emails:
        return results
    for row in results:
        if "corporate and digital" in (row.get("name") or "").lower() or row.get("name") == "Department of Corporate and Digital Development":
            existing = {(item["job_url"], item["position_title"]) for item in row.get("openings") or []}
            for opening in openings:
                key = (opening["job_url"], opening["position_title"])
                if key not in existing:
                    row.setdefault("openings", []).append(opening)
            row["jobs_available"] = len(row.get("openings") or [])
            if emails:
                row["all_emails"] = list(dict.fromkeys((row.get("all_emails") or []) + emails))
                ranked = rank_resume_email(row["all_emails"], row.get("website") or "")
                row.update(ranked)
            if row["jobs_available"]:
                row["research_status"] = "jobs published"
            break
    return results


def _style(sheet, widths: dict[str, int]) -> None:
    fill = PatternFill("solid", fgColor="D9FF4F")
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    for cell in sheet[1]:
        cell.fill = fill
        cell.font = Font(bold=True, color="14160F")
        cell.alignment = Alignment(wrap_text=True, vertical="top")
    for row in sheet.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(wrap_text=True, vertical="top")
    headers = [cell.value for cell in sheet[1]]
    for number, header in enumerate(headers, 1):
        sheet.column_dimensions[get_column_letter(number)].width = widths.get(header, 22)


def _link_cells(sheet, header: str) -> None:
    headers = [cell.value for cell in sheet[1]]
    if header not in headers:
        return
    col = headers.index(header) + 1
    for row in range(2, sheet.max_row + 1):
        cell = sheet.cell(row, col)
        value = str(cell.value or "")
        if value.startswith("http"):
            cell.hyperlink = value
            cell.style = "Hyperlink"


def write_workbook(path: Path, results: list[dict], captured_at: str) -> dict:
    hiring = [row for row in results if row.get("jobs_available")]
    openings: list[dict] = []
    for row in results:
        for opening in row.get("openings") or []:
            openings.append({**opening, "company": row.get("name"), "website": row.get("website")})
    workbook = Workbook()

    how = workbook.active
    how.title = "How to use"
    how_rows = [
        ("Darwin IT companies, jobs and resume emails", ""),
        ("Captured at (UTC)", captured_at),
        ("Companies researched", len(results)),
        ("Companies currently hiring on a researched page", len(hiring)),
        ("Published IT job listings extracted", len(openings)),
        ("", ""),
        ("What this workbook contains", ""),
        ("Companies", "Darwin / Palmerston IT, ICT, software, MSP and related digital employers."),
        ("Jobs", "Titles, counts and links published on official websites or official vacancy pages."),
        ("Emails", "Best published inbox for a resume, plus any published Gmail."),
        ("", ""),
        ("Sources", ""),
        ("ICTNT directory", ICTNT_LIST_URL),
        ("Official company websites", "Homepage, contact and careers pages. robots.txt honoured."),
        ("NT Government jobs", NTG_JOBS_HOME),
        ("SEEK", "Listing/search URLs only. Individual SEEK /job/ pages are not fetched."),
        ("LinkedIn / Apify", "Not used."),
        ("", ""),
        ("Email rules", ""),
        ("Best resume email", "Prefer careers@, jobs@, hr@, recruitment@, then info@ / contact@, then a named company inbox."),
        ("Gmail", "Included only when the company publishes a Gmail address. Most Darwin IT firms use a company domain."),
        ("Never invented", "Blank means no public email was published on the pages checked."),
        ("", ""),
        ("Limits", ""),
        ("Not every IT trader", "This is a deep public-source pass, not a guarantee of every sole trader in Darwin."),
        ("Stale ads", "Listings without a closing date can stay on a site after the role is filled."),
        ("National firms", "DXC, NEC, Kinetic, Salesforce and similar are kept only when a Darwin / NT role is published."),
        ("Apply path", "If the best email is blank, use the careers or job link."),
    ]
    for row in how_rows:
        how.append(row)
    _style(how, {"Darwin IT companies, jobs and resume emails": 36, "": 88})

    company_sheet = workbook.create_sheet("Companies")
    company_headers = (
        "company",
        "jobs_available",
        "hiring_now",
        "best_resume_email",
        "email_type",
        "gmail_email",
        "other_published_emails",
        "website",
        "suburb",
        "employer_type",
        "focus",
        "phone",
        "source",
        "research_status",
        "ictnt_profile",
        "pages_checked",
    )
    company_sheet.append(company_headers)
    for row in results:
        company_sheet.append(
            (
                row.get("name"),
                row.get("jobs_available") or 0,
                "Yes" if row.get("jobs_available") else "No",
                row.get("best_resume_email") or "",
                row.get("email_type") or "",
                row.get("gmail_email") or "",
                row.get("other_emails") or "",
                row.get("website") or "",
                row.get("suburb") or row.get("location") or "Darwin",
                row.get("employer_type") or "Private IT company",
                row.get("focus") or "",
                row.get("phone") or "",
                row.get("source") or "",
                row.get("research_status") or "",
                row.get("profile_url") or "",
                "; ".join(row.get("pages_checked") or []),
            )
        )
    _style(
        company_sheet,
        {
            "company": 36,
            "best_resume_email": 36,
            "other_published_emails": 40,
            "website": 36,
            "focus": 40,
            "research_status": 44,
            "pages_checked": 50,
            "ictnt_profile": 36,
        },
    )
    _link_cells(company_sheet, "website")
    _link_cells(company_sheet, "ictnt_profile")

    hiring_sheet = workbook.create_sheet("Hiring now")
    hiring_headers = (
        "company",
        "jobs_available",
        "job_titles",
        "best_resume_email",
        "gmail_email",
        "website",
        "job_links",
    )
    hiring_sheet.append(hiring_headers)
    for row in hiring:
        titles = [item["position_title"] for item in row.get("openings") or []]
        links = [item["job_url"] for item in row.get("openings") or []]
        hiring_sheet.append(
            (
                row.get("name"),
                row.get("jobs_available") or 0,
                " | ".join(titles),
                row.get("best_resume_email") or "",
                row.get("gmail_email") or "",
                row.get("website") or "",
                " | ".join(links),
            )
        )
    _style(
        hiring_sheet,
        {
            "company": 36,
            "job_titles": 60,
            "best_resume_email": 36,
            "website": 36,
            "job_links": 60,
        },
    )
    _link_cells(hiring_sheet, "website")

    job_sheet = workbook.create_sheet("Job listings")
    job_headers = (
        "company",
        "position_title",
        "role_category",
        "jobs_at_this_company",
        "job_url",
        "location",
        "employment_type",
        "date_posted",
        "valid_through",
        "status",
        "best_resume_email",
        "gmail_email",
        "source_page",
    )
    job_sheet.append(job_headers)
    counts = {row.get("name"): row.get("jobs_available") or 0 for row in results}
    emails = {row.get("name"): row for row in results}
    for opening in sorted(openings, key=lambda item: (str(item.get("company") or "").lower(), item.get("position_title") or "")):
        parent = emails.get(opening.get("company")) or {}
        job_sheet.append(
            (
                opening.get("company"),
                opening.get("position_title"),
                opening.get("role_category"),
                counts.get(opening.get("company"), 0),
                opening.get("job_url"),
                opening.get("location") or "Darwin / NT unless noted",
                opening.get("employment_type") or "",
                opening.get("date_posted") or "",
                opening.get("valid_through") or "",
                opening.get("status") or "",
                parent.get("best_resume_email") or "",
                parent.get("gmail_email") or "",
                opening.get("source_page") or "",
            )
        )
    _style(
        job_sheet,
        {
            "company": 36,
            "position_title": 44,
            "job_url": 50,
            "best_resume_email": 36,
            "source_page": 50,
            "status": 40,
        },
    )
    _link_cells(job_sheet, "job_url")
    _link_cells(job_sheet, "source_page")

    email_sheet = workbook.create_sheet("Resume emails")
    email_sheet.append(
        (
            "company",
            "best_resume_email",
            "email_type",
            "gmail_email",
            "other_published_emails",
            "hiring_now",
            "jobs_available",
            "website",
        )
    )
    for row in sorted(results, key=lambda item: str(item.get("name") or "").lower()):
        email_sheet.append(
            (
                row.get("name"),
                row.get("best_resume_email") or "",
                row.get("email_type") or "",
                row.get("gmail_email") or "",
                row.get("other_emails") or "",
                "Yes" if row.get("jobs_available") else "No",
                row.get("jobs_available") or 0,
                row.get("website") or "",
            )
        )
    _style(
        email_sheet,
        {
            "company": 36,
            "best_resume_email": 36,
            "other_published_emails": 44,
            "website": 36,
        },
    )
    _link_cells(email_sheet, "website")

    path.parent.mkdir(parents=True, exist_ok=True)
    workbook.save(path)
    return {
        "companies": len(results),
        "hiring": len(hiring),
        "jobs": len(openings),
        "emails": sum(1 for row in results if row.get("best_resume_email")),
        "gmails": sum(1 for row in results if row.get("gmail_email")),
        "xlsx": str(path),
        "captured_at": captured_at,
    }


def build_workbook(
    destination: Path,
    extras_path: Path,
    *,
    workers: int = 8,
    timeout: int = 12,
    ntg_job_urls: list[str] | None = None,
    include_directory: bool = True,
) -> dict:
    directory = scrape_ictnt_directory(timeout=timeout) if include_directory else []
    extras = load_extra_companies(extras_path)
    companies = merge_companies(directory, extras)
    results = discover_many(companies, workers=workers, timeout=timeout)
    if ntg_job_urls:
        results = attach_ntg_jobs(results, ntg_job_urls, timeout=timeout)
    captured = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    summary = write_workbook(destination, results, captured)
    summary["directory_companies"] = len(directory)
    summary["extra_companies"] = len(extras)
    return {"summary": summary, "results": results}
