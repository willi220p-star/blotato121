"""Collect public social URLs published on official pages. LinkedIn is never fetched."""

from __future__ import annotations

import re

LINKEDIN_RE = re.compile(r"https?://(?:[\w-]+\.)?linkedin\.com/(?:company|showcase|in)/[A-Za-z0-9\-_%/]+", re.I)
FACEBOOK_RE = re.compile(r"https?://(?:www\.)?(?:facebook|fb)\.com/[A-Za-z0-9.\-_/]+", re.I)
INSTAGRAM_RE = re.compile(r"https?://(?:www\.)?instagram\.com/[A-Za-z0-9._/]+", re.I)


def _clean(url: str) -> str:
    return url.rstrip(").,;\"'")


def extract_socials(text: str) -> dict:
    linkedin = [_clean(url) for url in LINKEDIN_RE.findall(text or "") if "/share" not in url.lower()]
    facebook = [_clean(url) for url in FACEBOOK_RE.findall(text or "") if "sharer" not in url.lower()]
    instagram = [_clean(url) for url in INSTAGRAM_RE.findall(text or "")]
    company_linkedin = next((url for url in linkedin if "/company/" in url or "/showcase/" in url), None)
    person_linkedin = next((url for url in linkedin if "/in/" in url), None)
    return {
        "linkedin_company_url": company_linkedin,
        "linkedin_person_url": person_linkedin,
        "facebook_company_url": facebook[0] if facebook else None,
        "instagram_company_url": instagram[0] if instagram else None,
        "other_public_social_urls": None,
    }
