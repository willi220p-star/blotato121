#!/usr/bin/env python3
"""Local Scrapling console: scrape any http(s) URL from this Cloud Agent."""

from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from lib.scrape import ALLOWED_FETCHERS, scrape

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public"
FEEDS = ROOT / "feeds"
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "4173"))
SIGNAL_FEED = FEEDS / "dgk-signal-source.json"
ENRICH_FEED = FEEDS / "dgk-list-enrichment.json"
ENRICH_SOURCES = FEEDS / "enrichment-sources.json"
WATCHLIST = FEEDS / "watchlist.json"
SNAPSHOTS = ROOT / "research" / "signal-snapshots"

MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".csv": "text/csv; charset=utf-8",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        sys_stderr = __import__("sys").stderr
        sys_stderr.write("%s - %s\n" % (self.address_string(), format % args))

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, file_path: Path, download: bool = False) -> None:
        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", MIME.get(file_path.suffix, "application/octet-stream"))
        self.send_header("Content-Length", str(len(data)))
        if download or file_path.suffix in {".xlsx", ".csv"}:
            self.send_header("Content-Disposition", f'attachment; filename="{file_path.name}"')
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path == "/api/health":
            import scrapling

            return self._json(
                200,
                {
                    "ok": True,
                    "service": "scrapling-console",
                    "scrapling": scrapling.__version__,
                    "clone": str(ROOT / "cloned" / "scrapling"),
                    "fetchers": list(ALLOWED_FETCHERS),
                    "signal_feed": str(SIGNAL_FEED),
                    "enrich_feed": str(ENRICH_FEED),
                },
            )
        if path == "/api/signals":
            if not SIGNAL_FEED.is_file():
                return self._json(404, {"error": "Feed not generated yet. POST /api/signals or run scripts/detect_signals.py"})
            return self._json(200, json.loads(SIGNAL_FEED.read_text(encoding="utf-8")))
        if path == "/api/enrich":
            if not ENRICH_FEED.is_file():
                return self._json(404, {"error": "Enrichment feed not generated yet. POST /api/enrich or run scripts/enrich_list.py"})
            return self._json(200, json.loads(ENRICH_FEED.read_text(encoding="utf-8")))
        downloads = {
            "/download/apa-physio-leads.xlsx": "dgk-apa-physio-leads.xlsx",
            "/download/apa-physio-leads.csv": "dgk-apa-physio-leads.clay.csv",
            "/download/arrcs-darwin-teams.xlsx": "ARRCS_Darwin_teams_roles.xlsx",
            "/download/arrcs-darwin-teams.csv": "arrcs-darwin-teams.csv",
            "/download/ndis-disability-nonprofit.xlsx": "NDIS_disability_nonprofit.xlsx",
            "/download/ndis-disability-nonprofit.csv": "ndis-disability-nonprofit.nt.csv",
            "/download/ndis-disability-positions.xlsx": "NDIS_disability_nonprofit_positions.xlsx",
            "/download/nasdaq-upcoming-earnings.xlsx": "NASDAQ_US_upcoming_earnings_signals.xlsx",
            "/download/nasdaq-upcoming-earnings.csv": "NASDAQ_US_upcoming_earnings_signals.csv",
        }
        if path in downloads:
            file_path = (FEEDS / downloads[path]).resolve()
            if not file_path.is_file():
                self.send_error(404)
                return
            return self._send_file(file_path, download=True)
        if path.startswith("/feeds/"):
            file_path = (FEEDS / path[len("/feeds/") :]).resolve()
            if not str(file_path).startswith(str(FEEDS.resolve())) or not file_path.is_file():
                self.send_error(404)
                return
            return self._send_file(file_path)
        relative = "index.html" if path == "/" else path.lstrip("/")
        file_path = (PUBLIC / relative).resolve()
        if not str(file_path).startswith(str(PUBLIC.resolve())) or not file_path.is_file():
            self.send_error(404)
            return
        self._send_file(file_path)

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return self._json(400, {"error": "Invalid JSON body"})
        if path == "/api/enrich":
            try:
                from lib.enrich import build_enrichment, clay_csv, enrichment_markdown, load_enrichment_config, write_physio_export

                config = load_enrichment_config(ENRICH_SOURCES)
                feed = build_enrichment(config)
                ENRICH_FEED.write_text(json.dumps(feed, indent=2, ensure_ascii=False), encoding="utf-8")
                (FEEDS / "dgk-list-enrichment.md").write_text(enrichment_markdown(feed), encoding="utf-8")
                (FEEDS / "dgk-list-enrichment.clay.csv").write_text(clay_csv(feed), encoding="utf-8")
                write_physio_export(feed, FEEDS)
                return self._json(200, feed)
            except Exception as exc:  # noqa: BLE001
                return self._json(500, {"error": str(exc)})
        if path == "/api/signals":
            try:
                from lib.signals import build_feed, feed_markdown, load_watchlist

                watchlist = load_watchlist(WATCHLIST)
                feed = build_feed(watchlist, SNAPSHOTS)
                SIGNAL_FEED.write_text(json.dumps(feed, indent=2, ensure_ascii=False), encoding="utf-8")
                (FEEDS / "dgk-signal-source.md").write_text(feed_markdown(feed), encoding="utf-8")
                return self._json(200, feed)
            except Exception as exc:  # noqa: BLE001
                return self._json(500, {"error": str(exc)})
        if path != "/api/scrape":
            return self._json(404, {"error": "Not found"})
        try:
            result = scrape(
                body.get("url", ""),
                fetcher=body.get("fetcher") or "http",
                css=body.get("css") or None,
                xpath=body.get("xpath") or None,
                timeout=int(body.get("timeout") or 30),
            )
            return self._json(200, result)
        except ValueError as exc:
            return self._json(400, {"error": str(exc)})
        except Exception as exc:  # noqa: BLE001
            return self._json(500, {"error": str(exc)})


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Scrapling console on http://{HOST}:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
