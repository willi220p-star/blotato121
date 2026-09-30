"""Category, service type, and short factual descriptions."""

from __future__ import annotations

import re

from src.darwin_it.models import UNKNOWN

CATEGORY_RULES = [
    ("Managed Service Provider", r"\b(?:managed (?:it|ict|service)|msp)\b"),
    ("Cybersecurity", r"\b(?:cyber\s*security|information security|essential eight|soc\b|edrs?)\b"),
    ("Software / SaaS", r"\b(?:software development|saas|application development|custom software)\b"),
    ("Web / Digital", r"\b(?:web design|web development|digital marketing|digital agency)\b"),
    ("Cloud", r"\b(?:cloud services|microsoft 365|azure|aws|cloud computing)\b"),
    ("Data / GIS", r"\b(?:data centre|data center|gis|geospatial|data systems)\b"),
    ("Telecommunications", r"\b(?:telecommunications?|fibre|fiber|nbn|voice|voip)\b"),
    ("IT Consulting", r"\b(?:ict consulting|it consulting|technology consulting|digital transformation)\b"),
    ("IT Support", r"\b(?:it support|helpdesk|help desk|computer repair|desktop support)\b"),
    ("Networking", r"\b(?:network(?:ing)?|infrastructure|systems administration)\b"),
    ("ICT Training", r"\b(?:ict training|registered training|rto|certification training)\b"),
    ("Government ICT", r"\b(?:government ict|digital development|public sector)\b"),
]

SERVICE_RULES = [
    ("MSP", r"\b(?:managed (?:it|ict|service)|msp)\b"),
    ("Cybersecurity", r"\bcyber"),
    ("Software", r"\b(?:software development|application development|custom software)\b"),
    ("SaaS", r"\bsaas\b"),
    ("Cloud", r"\b(?:cloud|microsoft 365|azure)\b"),
    ("Networking", r"\bnetwork"),
    ("Consulting", r"\bconsult"),
    ("Telecommunications", r"\b(?:telecom|fibre|nbn|voip)\b"),
    ("Data", r"\b(?:data centre|data center|gis|data systems)\b"),
    ("Digital", r"\b(?:web design|web development|digital)\b"),
    ("IT Support", r"\b(?:it support|helpdesk|computer repair)\b"),
]


def classify_category(text: str, fallback: str = "") -> str:
    blob = f"{fallback} {text}".lower()
    for label, pattern in CATEGORY_RULES:
        if re.search(pattern, blob, re.I):
            return label
    return fallback or "Other"


def service_type(text: str, fallback: str = "") -> str:
    blob = f"{fallback} {text}".lower()
    for label, pattern in SERVICE_RULES:
        if re.search(pattern, blob, re.I):
            return label
    return fallback or "Other"


def summarise_description(text: str, company_name: str, suburb: str, category: str) -> str:
    clean = re.sub(r"\s+", " ", (text or "")).strip()
    if not clean:
        location = f"{suburb} " if suburb and suburb != UNKNOWN else "Darwin "
        return f"{company_name} is a {location}IT/technology organisation. Official public description was not available."
    sentences = re.split(r"(?<=[.!?])\s+", clean)
    kept = []
    for sentence in sentences:
        if len(sentence) < 40:
            continue
        if re.search(r"cookie|subscribe|all rights reserved|add to cart", sentence, re.I):
            continue
        kept.append(sentence)
        if len(kept) == 2:
            break
    if kept:
        return " ".join(kept)[:420]
    location = suburb if suburb and suburb != UNKNOWN else "Darwin"
    return f"{company_name} is a {location}-based {category or 'IT/technology'} organisation."
