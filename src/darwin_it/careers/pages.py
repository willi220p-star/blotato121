"""Official career-page discovery and vacancy extraction. No invented jobs."""

from __future__ import annotations

import json
import re
from urllib.parse import parse_qs, unquote, urljoin, urlparse, urlunparse

from lxml import html

from src.darwin_it.models import NOT_FOUND

CAREER_HINTS = (
    "career",
    "careers",
    "jobs",
    "job",
    "vacancies",
    "vacancy",
    "current-vacancies",
    "current-opportunities",
    "work-with-us",
    "workwithus",
    "join-us",
    "join-our-team",
    "joinourteam",
    "employment",
    "opportunities",
    "we-are-hiring",
)
FALSE_CAREER_RE = re.compile(
    r"diploma|short-course|training-course|career-expo|digital-career-with|launch-your-digital-career",
    re.I,
)
ATS_HOSTS = (
    "seek.com.au",
    "livehire.com",
    "employmenthero.com",
    "workdayjobs.com",
    "bamboohr.com",
    "greenhouse.io",
    "lever.co",
    "smartrecruiters.com",
    "jobs.nt.gov.au",
)
JOB_CONTEXT_RE = re.compile(
    r"\b(?:apply|career|careers|employment|job|jobs|join our team|opening|openings|"
    r"opportunit(?:y|ies)|position|positions|recruit|recruitment|role|roles|"
    r"vacancy|vacancies|work with us|we're hiring|we are hiring)\b",
    re.I,
)
JOB_NOUN_RE = re.compile(
    r"\b(?:administrators?|analysts?|architects?|consultants?|developers?|devops|"
    r"engineers?|graduates?|help ?desk|officers?|programmers?|recruiters?|"
    r"specialists?|technicians?|technologists?|coordinators?|managers?|team leads?)\b",
    re.I,
)
PERSON_HEADING_RE = re.compile(
    r"^[A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)?\s+(?:General Manager|Director|CEO|Manager|Officer)\b"
)
NON_JOB_RE = re.compile(
    r"^(?:about|careers?|jobs?|vacancies|current (?:vacancies|openings|opportunities)|"
    r"job opening|our services|contact|home|learn more|read more|view all|see all|"
    r"privacy|terms|login|sign in|apply now|join (?:us|the|our)|start your|"
    r"our teams?|life at|help and support|get product support|support (?:tools|links)|"
    r"phone systems|cloud computing|hybrid cloud|data and applications|industry leading)|"
    r"\b(?:our services|what we do|why (?:choose|us)|case stud|view current|"
    r"landscape is changing)\b",
    re.I,
)
IT_CATEGORY_RULES = [
    ("Cybersecurity", r"\b(?:cyber|information security|soc |security analyst|penetration)\b"),
    ("Software", r"\b(?:developer|software|programmer|\.net|java|python|react)\b"),
    ("Cloud", r"\b(?:cloud|azure|aws|microsoft 365|m365)\b"),
    ("Networking", r"\b(?:network|cisco|firewall|wireless)\b"),
    ("Infrastructure", r"\b(?:systems? (?:admin|engineer)|infrastructure|server|sysadmin)\b"),
    ("IT Support", r"\b(?:help ?desk|service desk|desktop|it support|technician)\b"),
    ("Data", r"\b(?:data|sql|bi |business intelligence|gis)\b"),
    ("Consulting", r"\b(?:consultant|consulting|ba\b|business analyst)\b"),
    ("Project", r"\b(?:project manager|delivery manager|scrum)\b"),
]


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def _same_host(url: str, host: str) -> bool:
    return urlparse(url).netloc.lower().replace("www.", "") == host.lower().replace("www.", "")


def career_candidates(home_url: str, content: str, limit: int = 8) -> tuple[list[str], list[str]]:
    host = urlparse(home_url).netloc
    if not (content or "").strip():
        return [home_url], []
    try:
        document = html.fromstring(content)
    except Exception:  # noqa: BLE001
        return [home_url], []
    ranked: list[tuple[int, str]] = []
    external: list[str] = []
    for anchor in document.xpath("//a[@href]"):
        href = anchor.get("href") or ""
        target = urljoin(home_url, href)
        parsed = urlparse(target)
        text = _clean(" ".join(anchor.itertext()))
        hay = f"{parsed.path} {text}".lower()
        if FALSE_CAREER_RE.search(hay):
            continue
        bonus = 0
        if any(token in hay for token in ("current-vacanc", "current-opportunit", "vacancies", "/jobs")):
            bonus = 4
        score = sum(hint in hay for hint in CAREER_HINTS) + bonus
        if not score:
            continue
        if _same_host(target, host):
            clean = urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))
            ranked.append((score, clean))
        elif any(parsed.netloc.lower().endswith(item) for item in ATS_HOSTS):
            external.append(target.split("#")[0])
    ordered = []
    for _, url in sorted(ranked, key=lambda item: (-item[0], len(item[1]))):
        if url not in ordered:
            ordered.append(url)
        if len(ordered) >= limit:
            break
    if not ordered:
        for guess in ("/careers", "/careers/", "/jobs", "/jobs/", "/work-with-us", "/join-us"):
            ordered.append(urljoin(home_url, guess))
    return ordered, external


def _walk_json(value):
    if isinstance(value, list):
        for item in value:
            yield from _walk_json(item)
    elif isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _walk_json(child)


def _location(value) -> str:
    if isinstance(value, list):
        return "; ".join(filter(None, (_location(item) for item in value)))
    if not isinstance(value, dict):
        return _clean(str(value or ""))
    address = value.get("address") or value
    if not isinstance(address, dict):
        return _clean(str(address or ""))
    return ", ".join(
        str(address.get(key) or "").strip()
        for key in ("addressLocality", "addressRegion", "addressCountry")
        if address.get(key)
    )


def _location_from_title(title: str) -> str:
    match = re.search(
        r"\b(Darwin|Palmerston|Winnellie|Casuarina|Brisbane|Sydney|Melbourne|Perth|"
        r"Adelaide|Canberra|Hyderabad|Remote|Work from Home)(?:\s*[&,/]\s*[A-Za-z ]+)?\b",
        title,
        re.I,
    )
    return match.group(0) if match else NOT_FOUND


def _job_category(title: str) -> str:
    for label, pattern in IT_CATEGORY_RULES:
        if re.search(pattern, title, re.I):
            return label
    return "Technology"


def plausible_it_job(title: str) -> bool:
    value = _clean(title)
    words = value.split()
    return bool(
        2 <= len(words) <= 16
        and "?" not in value
        and JOB_NOUN_RE.search(value)
        and not NON_JOB_RE.search(value)
        and not PERSON_HEADING_RE.search(value)
        and "|" not in value
    )


def extract_vacancies(content: str, source_url: str) -> list[dict]:
    if not (content or "").strip():
        return []
    try:
        document = html.fromstring(content)
    except Exception:  # noqa: BLE001
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
            title = _clean(str(item.get("title") or ""))
            if not title:
                continue
            found.append(
                {
                    "vacancy_title": title,
                    "vacancy_url": urljoin(source_url, str(item.get("url") or source_url)),
                    "vacancy_location": _location(item.get("jobLocation")) or NOT_FOUND,
                    "employment_type": _clean(str(item.get("employmentType") or "")) or UNKNOWN_FALLBACK(),
                    "job_category": _job_category(title),
                    "job_description_summary": _clean(str(item.get("description") or ""))[:280] or NOT_FOUND,
                    "vacancy_source": "Company Career Page",
                    "evidence": "JobPosting",
                }
            )
    page_is_career = any(hint in urlparse(source_url).path.lower() for hint in CAREER_HINTS)
    page_text = _clean(" ".join(document.xpath("//body//text()")[:120]))
    if page_is_career or JOB_CONTEXT_RE.search(page_text):
        for anchor in document.xpath("//a[@href]"):
            title = _clean(" ".join(anchor.itertext()))
            target = urljoin(source_url, anchor.get("href") or "")
            parsed = urlparse(target)
            query_title = ""
            params = parse_qs(parsed.query)
            if params.get("title"):
                query_title = _clean(unquote(params["title"][0]))
            chosen = title if plausible_it_job(title) else query_title
            hay = f"{parsed.path} {parsed.query} {chosen}"
            if not chosen or not plausible_it_job(chosen):
                continue
            if not JOB_CONTEXT_RE.search(hay) and "graduate" not in hay.lower():
                continue
            found.append(
                {
                    "vacancy_title": chosen,
                    "vacancy_url": target,
                    "vacancy_location": NOT_FOUND,
                    "employment_type": "Unknown",
                    "job_category": _job_category(chosen),
                    "job_description_summary": NOT_FOUND,
                    "vacancy_source": "Company Career Page",
                    "evidence": "careers link",
                }
            )
        for heading in document.xpath("//h1|//h2|//h3|//h4"):
            title = _clean(" ".join(heading.itertext()))
            if not plausible_it_job(title):
                continue
            found.append(
                {
                    "vacancy_title": title,
                    "vacancy_url": source_url,
                    "vacancy_location": _location_from_title(title),
                    "employment_type": "Unknown",
                    "job_category": _job_category(title),
                    "job_description_summary": NOT_FOUND,
                    "vacancy_source": "Company Career Page",
                    "evidence": "careers heading",
                }
            )
    unique: dict[str, dict] = {}
    rank = {"JobPosting": 0, "careers link": 1, "careers heading": 2}
    for row in found:
        key = row["vacancy_title"].lower()
        current = unique.get(key)
        if current is None:
            unique[key] = row
            continue
        if rank.get(row["evidence"], 9) < rank.get(current["evidence"], 9):
            if row.get("vacancy_location") == NOT_FOUND:
                row["vacancy_location"] = current.get("vacancy_location") or NOT_FOUND
            unique[key] = row
        elif current.get("vacancy_location") == NOT_FOUND and row.get("vacancy_location") not in {None, "", NOT_FOUND}:
            current["vacancy_location"] = row["vacancy_location"]
    return list(unique.values())


def UNKNOWN_FALLBACK() -> str:
    return "Unknown"
