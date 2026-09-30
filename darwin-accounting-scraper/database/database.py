"""SQLite persistence for Darwin accounting research."""

from __future__ import annotations

import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,
    trading_name TEXT,
    legal_name TEXT,
    abn TEXT,
    acn TEXT,
    description TEXT,
    website TEXT,
    industry TEXT,
    services TEXT,
    address TEXT,
    suburb TEXT,
    state TEXT,
    postcode TEXT,
    phone TEXT,
    phone_normalized TEXT,
    email TEXT,
    linkedin_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    source_url TEXT,
    source_type TEXT,
    date_found TEXT,
    confidence_score INTEGER,
    verification_status TEXT,
    scrape_status TEXT
);
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT,
    company_name TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    job_title TEXT,
    seniority TEXT,
    qualification TEXT,
    location TEXT,
    public_work_email TEXT,
    business_phone TEXT,
    linkedin_url TEXT,
    social_url TEXT,
    source_url TEXT,
    source_type TEXT,
    date_found TEXT
);
CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT,
    employee_id TEXT,
    source_url TEXT,
    source_type TEXT,
    date_accessed TEXT,
    information_found TEXT
);
"""


def write_sqlite(path: Path, companies: list[dict], employees: list[dict], sources: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()
    conn = sqlite3.connect(path)
    try:
        conn.executescript(SCHEMA)
        conn.executemany(
            """INSERT INTO companies (
                company_name, trading_name, legal_name, abn, acn, description, website, industry, services,
                address, suburb, state, postcode, phone, phone_normalized, email, linkedin_url, facebook_url,
                instagram_url, source_url, source_type, date_found, confidence_score, verification_status, scrape_status
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    row.get("company_name"),
                    row.get("trading_name"),
                    row.get("legal_name"),
                    row.get("abn"),
                    row.get("acn"),
                    row.get("description"),
                    row.get("website"),
                    row.get("industry"),
                    row.get("services"),
                    row.get("address"),
                    row.get("suburb"),
                    row.get("state"),
                    row.get("postcode"),
                    row.get("phone"),
                    row.get("phone_normalized"),
                    row.get("email"),
                    row.get("linkedin_url"),
                    row.get("facebook_url"),
                    row.get("instagram_url"),
                    row.get("source_url"),
                    row.get("source_type"),
                    row.get("date_found"),
                    row.get("confidence_score"),
                    row.get("verification_status"),
                    row.get("scrape_status"),
                )
                for row in companies
            ],
        )
        conn.executemany(
            """INSERT INTO employees (
                company_id, company_name, first_name, last_name, full_name, job_title, seniority, qualification,
                location, public_work_email, business_phone, linkedin_url, social_url, source_url, source_type, date_found
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    row.get("company_id"),
                    row.get("company_name"),
                    row.get("first_name"),
                    row.get("last_name"),
                    row.get("full_name"),
                    row.get("job_title"),
                    row.get("seniority"),
                    row.get("qualification"),
                    row.get("location"),
                    row.get("public_work_email"),
                    row.get("business_phone"),
                    row.get("linkedin_url"),
                    row.get("social_url"),
                    row.get("source_url"),
                    row.get("source_type"),
                    row.get("date_found"),
                )
                for row in employees
            ],
        )
        conn.executemany(
            """INSERT INTO sources (company_id, employee_id, source_url, source_type, date_accessed, information_found)
            VALUES (?,?,?,?,?,?)""",
            [
                (
                    row.get("company_id"),
                    row.get("employee_id"),
                    row.get("source_url"),
                    row.get("source_type"),
                    row.get("date_accessed"),
                    row.get("information_found"),
                )
                for row in sources
            ],
        )
        conn.commit()
    finally:
        conn.close()
