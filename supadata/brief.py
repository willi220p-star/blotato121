#!/usr/bin/env python3
"""Flatten a Supadata transcript JSON into a content brief."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


def chunks_to_text(content: Any) -> str:
    """Turn a transcript `content` field into a single readable string."""
    if content is None:
        return ""
    if isinstance(content, str):
        return _squash_whitespace(content)
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                parts.append(str(item.get("text") or ""))
        return _squash_whitespace(" ".join(parts))
    if isinstance(content, dict):
        if "text" in content:
            return _squash_whitespace(str(content.get("text") or ""))
        if "content" in content:
            return chunks_to_text(content["content"])
    return _squash_whitespace(str(content))


def _squash_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def youtube_id_from_url(url: str) -> str:
    """Return the 11-character id from a YouTube URL or bare id."""
    value = (url or "").strip()
    match = re.search(r"(?:v=|/shorts/|youtu\.be/)([A-Za-z0-9_-]{11})", value)
    if match:
        return match.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", value):
        return value
    raise ValueError(f"Could not parse a YouTube video id from: {url!r}")


def format_brief(transcript: dict[str, Any], video: dict[str, Any] | None = None) -> str:
    """Build a short brief an agent can hand to Blotato or a writer."""
    video = video or {}
    channel = video.get("channel") or {}
    title = video.get("title") or "Untitled video"
    channel_name = channel.get("name") or "Unknown channel"
    video_id = video.get("id")
    url = f"https://www.youtube.com/watch?v={video_id}" if video_id else ""
    duration = video.get("duration")
    duration_label = f"{duration}s" if isinstance(duration, int) else "unknown"
    body = chunks_to_text(transcript.get("content"))
    lang = transcript.get("lang") or "unknown"
    lines = [
        f"# {title}",
        "",
        f"- Channel: {channel_name}",
        f"- Duration: {duration_label}",
        f"- Transcript language: {lang}",
    ]
    if url:
        lines.append(f"- URL: {url}")
    lines.extend(["", "## Transcript", "", body or "(empty transcript)", ""])
    return "\n".join(lines)


def _load_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--transcript", required=True, type=Path)
    parser.add_argument("--video", type=Path)
    args = parser.parse_args(argv)
    transcript = _load_json(args.transcript)
    video = _load_json(args.video) if args.video else None
    sys.stdout.write(format_brief(transcript, video))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
