"""Polite public HTTP. Honours robots.txt and never bypasses blocks."""

from __future__ import annotations

import logging
import threading
import time
import urllib.robotparser
from urllib.parse import urljoin, urlparse

import requests

from config import REQUEST_DELAY, REQUEST_TIMEOUT, USER_AGENT

logger = logging.getLogger("darwin_accounting.http")
_robots_lock = threading.Lock()
_robots: dict[str, urllib.robotparser.RobotFileParser | None] = {}
_last_host: dict[str, float] = {}


def session() -> requests.Session:
    client = requests.Session()
    client.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-AU,en;q=0.8",
        }
    )
    return client


def origin_of(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


def robots_allows(url: str, timeout: int = REQUEST_TIMEOUT) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False
    origin = origin_of(url)
    with _robots_lock:
        if origin not in _robots:
            parser = urllib.robotparser.RobotFileParser()
            try:
                response = session().get(urljoin(origin, "/robots.txt"), timeout=timeout)
                if response.status_code >= 400:
                    parser = None
                else:
                    parser.parse(response.text.splitlines())
            except requests.RequestException:
                parser = None
            _robots[origin] = parser
        parser = _robots.get(origin)
    if parser is None:
        return True
    return parser.can_fetch(USER_AGENT, url)


def _pace(host: str, delay: float) -> None:
    wait = _last_host.get(host, 0) + delay - time.monotonic()
    if wait > 0:
        time.sleep(wait)
    _last_host[host] = time.monotonic()


def fetch(url: str, *, timeout: int = REQUEST_TIMEOUT, retries: int = 2, delay: float = REQUEST_DELAY) -> dict:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return {"ok": False, "status": None, "url": url, "text": "", "error": "invalid URL", "source_status": "Invalid"}
    if not robots_allows(url, timeout=timeout):
        return {"ok": False, "status": None, "url": url, "text": "", "error": "robots.txt disallows", "source_status": "Blocked"}
    last_error = ""
    for attempt in range(retries + 1):
        try:
            _pace(parsed.netloc, delay)
            response = session().get(url, timeout=timeout, allow_redirects=True)
            status = response.status_code
            if status in {401, 403, 429}:
                return {
                    "ok": False,
                    "status": status,
                    "url": str(response.url),
                    "text": "",
                    "error": f"HTTP {status}",
                    "source_status": "Blocked",
                }
            if status >= 500 and attempt < retries:
                last_error = f"HTTP {status}"
                time.sleep(1.5 * (attempt + 1))
                continue
            if status >= 400:
                return {
                    "ok": False,
                    "status": status,
                    "url": str(response.url),
                    "text": "",
                    "error": f"HTTP {status}",
                    "source_status": "Error",
                }
            return {
                "ok": True,
                "status": status,
                "url": str(response.url),
                "text": response.text or "",
                "error": "",
                "source_status": "OK",
            }
        except requests.RequestException as exc:
            last_error = str(exc)
            time.sleep(1.2 * (attempt + 1))
    return {
        "ok": False,
        "status": None,
        "url": url,
        "text": "",
        "error": last_error or "request failed",
        "source_status": "Error",
    }
