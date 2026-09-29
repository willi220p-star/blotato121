"""SQLite persistence for NT NDIS intelligence."""

from __future__ import annotations

import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS companies (
    company_id TEXT PRIMARY KEY,
    company_name TEXT,
    trading_name TEXT,
    legal_name TEXT,
    abn TEXT,
    org_type TEXT,
    description TEXT,
    services TEXT,
    locations TEXT,
    address TEXT,
    phone TEXT,
    website TEXT,
    email TEXT,
    linkedin TEXT,
    employee_count TEXT,
    employee_count_min TEXT,
    employee_count_max TEXT,
    employee_count_source TEXT,
    employee_count_source_url TEXT,
    ndis_provider TEXT,
    ndis_evidence TEXT,
    nt_operation_verified TEXT,
    scrape_status TEXT,
    research_confidence TEXT,
    source_urls TEXT,
    created_at TEXT,
    updated_at TEXT
);
CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    job_title TEXT,
    department TEXT,
    location TEXT,
    linkedin_url TEXT,
    work_email TEXT,
    email_type TEXT,
    email_verified INTEGER,
    source_url TEXT,
    source_type TEXT,
    created_at TEXT,
    updated_at TEXT
);
CREATE TABLE IF NOT EXISTS vacancies (
    vacancy_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT,
    job_title TEXT,
    location TEXT,
    employment_type TEXT,
    description TEXT,
    date_posted TEXT,
    job_url TEXT,
    source TEXT,
    active TEXT,
    last_checked TEXT
);
CREATE TABLE IF NOT EXISTS sources (
    source_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT,
    employee_id TEXT,
    vacancy_id TEXT,
    source_type TEXT,
    source_url TEXT,
    source_title TEXT,
    retrieved_at TEXT
);
"""


def write_sqlite(path: Path, companies: list[dict], employees: list[dict], vacancies: list[dict], sources: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()
    conn = sqlite3.connect(path)
    try:
        conn.executescript(SCHEMA)
        conn.executemany(
            """INSERT INTO companies VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    row.get("company_id"),
                    row.get("company_name"),
                    row.get("trading_name"),
                    row.get("legal_name"),
                    row.get("abn"),
                    row.get("org_type"),
                    row.get("description"),
                    row.get("services"),
                    row.get("locations"),
                    row.get("address"),
                    row.get("phone"),
                    row.get("website"),
                    row.get("email"),
                    row.get("linkedin"),
                    row.get("employee_count"),
                    row.get("employee_count_min"),
                    row.get("employee_count_max"),
                    row.get("employee_count_source"),
                    row.get("employee_count_source_url"),
                    row.get("ndis_provider"),
                    row.get("ndis_evidence"),
                    row.get("nt_operation_verified"),
                    row.get("scrape_status"),
                    row.get("research_confidence"),
                    row.get("source_urls"),
                    row.get("last_verified"),
                    row.get("last_verified"),
                )
                for row in companies
            ],
        )
        conn.executemany(
            """INSERT INTO employees (
                company_id, first_name, last_name, full_name, job_title, department, location,
                linkedin_url, work_email, email_type, email_verified, source_url, source_type, created_at, updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    row.get("company_id"),
                    row.get("first_name"),
                    row.get("last_name"),
                    row.get("full_name"),
                    row.get("job_title"),
                    row.get("department"),
                    row.get("location"),
                    row.get("linkedin_url"),
                    row.get("work_email"),
                    row.get("email_type"),
                    1 if row.get("email_verified") else 0,
                    row.get("source_url"),
                    row.get("source_type"),
                    row.get("created_at"),
                    row.get("updated_at"),
                )
                for row in employees
            ],
        )
        conn.executemany(
            """INSERT INTO vacancies (
                company_id, job_title, location, employment_type, description, date_posted, job_url, source, active, last_checked
            ) VALUES (?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    row.get("company_id"),
                    row.get("job_title"),
                    row.get("location"),
                    row.get("employment_type"),
                    row.get("description"),
                    row.get("date_posted"),
                    row.get("job_url"),
                    row.get("source"),
                    row.get("active"),
                    row.get("last_checked"),
                )
                for row in vacancies
            ],
        )
        conn.executemany(
            """INSERT INTO sources (company_id, employee_id, vacancy_id, source_type, source_url, source_title, retrieved_at)
            VALUES (?,?,?,?,?,?,?)""",
            [
                (
                    row.get("company_id"),
                    row.get("employee_id"),
                    row.get("vacancy_id"),
                    row.get("source_type"),
                    row.get("source_url"),
                    row.get("source_title"),
                    row.get("retrieved_at"),
                )
                for row in sources
            ],
        )
        conn.commit()
    finally:
        conn.close()
