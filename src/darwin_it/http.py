"""Polite public HTTP: robots, retries, and rate limiting. No auth bypass."""

from __future__ import annotations

import logging
import threading
import time
import urllib.robotparser
from urllib.parse import urljoin, urlparse

import requests

USER_AGENT = "Mozilla/5.0 (compatible; Darwin-IT-research/1.0; +https://github.com/willi220p-star/blotato121)"
DEFAULT_TIMEOUT = 20
logger = logging.getLogger("darwin_it.http")

_robots_lock = threading.Lock()
_robots: dict[str, urllib.robotparser.RobotFileParser | None] = {}
_last_host: dict[str, float] = {}


def session() -> requests.Session:
    client = requests.Session()
    client.headers.update({"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"})
    return client


def origin_of(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


def robots_allows(url: str, timeout: int = DEFAULT_TIMEOUT) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False
    origin = origin_of(url)
    with _robots_lock:
        parser = _robots.get(origin)
        if parser is None and origin not in _robots:
            robots_url = urljoin(origin, "/robots.txt")
            parser = urllib.robotparser.RobotFileParser()
            try:
                response = session().get(robots_url, timeout=timeout)
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
    now = time.monotonic()
    wait = _last_host.get(host, 0) + delay - now
    if wait > 0:
        time.sleep(wait)
    _last_host[host] = time.monotonic()


def fetch(
    url: str,
    *,
    timeout: int = DEFAULT_TIMEOUT,
    retries: int = 2,
    delay: float = 0.6,
    honor_robots: bool = True,
) -> dict:
    """Return {ok, status, url, text, error, source_status}."""
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return {"ok": False, "status": None, "url": url, "text": "", "error": "invalid URL", "source_status": "Invalid"}
    if honor_robots and not robots_allows(url, timeout=timeout):
        return {"ok": False, "status": None, "url": url, "text": "", "error": "robots.txt disallows", "source_status": "Blocked"}
    last_error = ""
    for attempt in range(retries + 1):
        try:
            _pace(parsed.netloc, delay)
            response = session().get(url, timeout=timeout, allow_redirects=True)
            status = response.status_code
            if status in {401, 403, 429} or status >= 500 and attempt < retries:
                last_error = f"HTTP {status}"
                time.sleep(1.5 * (attempt + 1))
                if status in {401, 403}:
                    return {
                        "ok": False,
                        "status": status,
                        "url": str(response.url),
                        "text": "",
                        "error": last_error,
                        "source_status": "Blocked",
                    }
                continue
            if status >= 400:
                return {
                    "ok": False,
                    "status": status,
                    "url": str(response.url),
                    "text": "",
                    "error": f"HTTP {status}",
                    "source_status": "Blocked" if status in {401, 403, 429} else "Error",
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
    return {"ok": False, "status": None, "url": url, "text": "", "error": last_error or "request failed", "source_status": "Error"}
