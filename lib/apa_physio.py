"""Australian Physiotherapy Association Find a Physio (choose.physio) directory."""

from __future__ import annotations

import base64
import json
import re
import urllib.error
import urllib.request
from urllib.parse import urlencode, urlparse

from lib.enrich import is_usable_website

# Public SPA credentials shipped in https://choose.physio/static/js/main.*.chunk.js
APA_CONTENT_ORIGIN = "https://content.choose.physio"
APA_SEARCH_PATH = "/fapsearch_rest_api"
APA_DETAIL_PATH = "/fapdetail_rest_api"
APA_AUTH_USER = "api"
APA_AUTH_PASS = "apaapi"
APA_FIND_URL = "https://choose.physio/find-a-physio"

DEFAULT_HUBS = (
    {"name": "Darwin", "SuburbPost": "Darwin NT 0800", "lat": -12.4634, "lng": 130.8456, "distance": 80},
    {"name": "Katherine", "SuburbPost": "Katherine NT 0850", "lat": -14.4650, "lng": 132.2630, "distance": 80},
    {"name": "Alice Springs", "SuburbPost": "Alice Springs NT 0870", "lat": -23.6980, "lng": 133.8807, "distance": 80},
    {"name": "Tennant Creek", "SuburbPost": "Tennant Creek NT 0860", "lat": -19.6490, "lng": 134.1910, "distance": 80},
    {"name": "Nhulunbuy", "SuburbPost": "Nhulunbuy NT 0880", "lat": -12.1820, "lng": 136.7820, "distance": 80},
)

PHONE_WINDOW_RE = re.compile(r"(04\d{8}|0[2378]\d{8})")


def apa_detail_url(practice_id: int | str) -> str:
    query = urlencode({"PracticeID": practice_id, "language": "", "Clinical": "", "searchSpecialist": "", "page": 1})
    return f"https://choose.physio/find-detail?{query}"


def clean_apa_phone(raw: str | None) -> str | None:
    digits = re.sub(r"\D", "", raw or "")
    if digits.startswith("61") and len(digits) >= 11:
        digits = "0" + digits[2:]
    windows = [digits[i : i + 10] for i in range(0, max(0, len(digits) - 9)) if PHONE_WINDOW_RE.fullmatch(digits[i : i + 10])]
    if not windows:
        return None

    def rank(num: str) -> tuple:
        return (not num.startswith("0889"), not num.startswith("04"), not num.startswith("08"), num)

    num = sorted(set(windows), key=rank)[0]
    if num.startswith("04"):
        return f"{num[:4]} {num[4:7]} {num[7:]}"
    return f"{num[:2]} {num[2:6]} {num[6:]}"


def normalize_apa_website(raw: str | None) -> str | None:
    url = (raw or "").strip()
    if not url:
        return None
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    host = urlparse(url).netloc.lower()
    if "choose.physio" in host or "australian.physio" in host:
        return None
    if not is_usable_website(url):
        return None
    return url


def practice_key(item: dict) -> tuple[str, str]:
    name = re.sub(r"[^a-z0-9]+", "", (item.get("PracticeName") or "").lower())
    postcode = str(item.get("Postcode") or "").strip()
    return name, postcode


def richness(item: dict) -> tuple:
    email = (item.get("Email") or "").strip()
    website = (item.get("Website") or "").strip()
    phone = clean_apa_phone(item.get("Phone"))
    address = " ".join(part for part in [item.get("Address1"), item.get("Address2"), item.get("Address3")] if part)
    return (1 if email else 0, 1 if website else 0, 1 if phone else 0, len(address), -(item.get("PracticeID") or 0))


def merge_listings(items: list[dict]) -> list[dict]:
    groups: dict[tuple[str, str], list[dict]] = {}
    for item in items:
        if not item.get("PracticeName"):
            continue
        groups.setdefault(practice_key(item), []).append(item)
    merged = []
    for group in groups.values():
        best = dict(max(group, key=richness))
        ids = []
        for item in sorted(group, key=richness, reverse=True):
            pid = item.get("PracticeID")
            if pid not in ids:
                ids.append(pid)
            for field in ("Email", "Website", "Phone"):
                if not (best.get(field) or "").strip() and (item.get(field) or "").strip():
                    best[field] = item[field]
        best["_ids"] = ids
        merged.append(best)
    merged.sort(key=lambda row: ((row.get("City") or ""), (row.get("PracticeName") or "").lower()))
    return merged


def format_address(item: dict, detail: dict | None = None) -> str | None:
    if detail:
        parts = [detail.get("Address"), detail.get("Address2")]
        text = " ".join(str(p).strip() for p in parts if p)
        if text.strip():
            return re.sub(r"\s+", " ", text).strip()
    parts = [
        item.get("Address1"),
        item.get("Address2"),
        item.get("Address3"),
        item.get("City"),
        item.get("State"),
        item.get("Postcode"),
    ]
    text = ", ".join(str(p).strip() for p in parts if p and str(p).strip())
    return text or None


def services_list(detail: dict | None) -> list[str]:
    services = (detail or {}).get("Services") or {}
    out = []
    for value in services.values():
        if value and str(value).strip() and str(value).strip().upper() != "NULL":
            out.append(str(value).strip())
    return out


def people_from_detail(detail: dict | None) -> list[str]:
    names = []
    for user in (detail or {}).get("Users") or []:
        name = (user.get("UserName") or "").strip()
        if name and name not in names:
            names.append(name)
    return names


def apa_post(path: str, payload: dict, timeout: int = 60) -> dict | list:
    body = json.dumps(payload).encode("utf-8")
    token = base64.b64encode(f"{APA_AUTH_USER}:{APA_AUTH_PASS}".encode("utf-8")).decode("ascii")
    req = urllib.request.Request(
        APA_CONTENT_ORIGIN + path,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Basic {token}",
            "User-Agent": "Mozilla/5.0 (compatible; DGK-list-enrichment/1.0)",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", "replace")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"APA {path} HTTP {exc.code}") from exc


def search_hub(hub: dict, num_item: int = 200) -> list[dict]:
    payload = {
        "practiceName": "",
        "userName": "",
        "state": "",
        "SuburbPost": hub.get("SuburbPost") or "",
        "language": "",
        "Clinical": "",
        "distance": hub.get("distance") or 80,
        "stateComp": "",
        "suburbComp": "",
        "postcodeComp": "",
        "UserLocationHere": "",
        "lat": "",
        "lng": "",
        "latCurrent": hub.get("lat") or "",
        "lngCurrent": hub.get("lng") or "",
        "NumItem": num_item,
        "page": 1,
        "CurrentLocation": False,
        "ASCDESC": "distance",
        "NDIS": "",
        "Telehealth": "",
        "searchSpecialist": "",
    }
    data = apa_post(APA_SEARCH_PATH, payload)
    if isinstance(data, list):
        return data
    rows = data.get("result") or data.get("resultAll") or []
    return rows if isinstance(rows, list) else []


def fetch_detail(practice_id: int | str) -> dict:
    data = apa_post(
        APA_DETAIL_PATH,
        {"id": practice_id, "userName": None, "language": "", "Clinical": "", "searchSpecialist": ""},
        timeout=30,
    )
    return data if isinstance(data, dict) else {}


def listing_to_record(item: dict, source: dict, detail: dict | None = None) -> dict:
    from lib.enrich import make_record

    website = normalize_apa_website((detail or {}).get("Website") or item.get("Website"))
    email = ((detail or {}).get("Email") or item.get("Email") or "").strip() or None
    phone = clean_apa_phone((detail or {}).get("Phone") or item.get("Phone"))
    people = people_from_detail(detail)
    services = services_list(detail)
    ndis_flag = bool(item.get("NDIS") or (detail and (detail.get("Services") or {}).get("NDIS")))
    tele_flag = bool(item.get("Telehealth") or (detail and (detail.get("Services") or {}).get("Telehealth")))
    city = (item.get("City") or source.get("city") or "").replace(" City", "").strip()
    notes_bits = []
    if people:
        notes_bits.append("Physios: " + "; ".join(people))
    if services:
        notes_bits.append("Services: " + "; ".join(services))
    if ndis_flag:
        notes_bits.append("NDIS listed")
    if tele_flag:
        notes_bits.append("Telehealth")
    return make_record(
        company_name=item["PracticeName"].strip(),
        source=source,
        source_url=apa_detail_url(item.get("PracticeID") or ""),
        website=website,
        email=email,
        phone=phone,
        address=format_address(item, detail),
        notes=" | ".join(notes_bits) or "APA Find a Physio listing.",
        extra={
            "city": city or source.get("city"),
            "state": item.get("State") or source.get("state"),
            "contact_name": people[0] if people else None,
            "people": "; ".join(people),
            "ndis": "yes" if ndis_flag else "",
            "telehealth": "yes" if tele_flag else "",
            "services": "; ".join(services),
            "practice_id": item.get("PracticeID"),
        },
    )
