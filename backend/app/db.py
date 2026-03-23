# This file creates SQLite tables and inserts/selects rows
import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path("zoning.db")


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_conn()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            municipality TEXT NOT NULL,
            title TEXT,
            url TEXT NOT NULL,
            source_type TEXT NOT NULL,
            raw_text TEXT,
            is_relevant INTEGER DEFAULT 0,
            relevance_reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS zoning_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_id INTEGER NOT NULL,
            municipality TEXT NOT NULL,
            zone_code TEXT,
            zone_name TEXT,
            permitted_uses TEXT,
            minimum_lot_size TEXT,
            maximum_height TEXT,
            dwelling_unit_restrictions TEXT,
            parking_requirements TEXT,
            setback_rules TEXT,
            housing_types TEXT,
            standards_json TEXT,
            source_excerpt TEXT,
            confidence REAL,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(source_id) REFERENCES sources(id)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS regulations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_id INTEGER NOT NULL,
            municipality TEXT NOT NULL,
            zone_code TEXT,
            zone_name TEXT,
            metric_name TEXT NOT NULL,
            value_text TEXT,
            value_num REAL,
            unit TEXT,
            condition_json TEXT,
            raw_text TEXT,
            source_page INTEGER,
            confidence REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(source_id) REFERENCES sources(id)
        )
    """)

    conn.commit()
    conn.close()


def insert_source(
    municipality: str,
    title: str,
    url: str,
    source_type: str,
    raw_text: str,
    is_relevant: bool,
    relevance_reason: str,
) -> int:
    conn = get_conn()
    cur = conn.execute("""
        INSERT INTO sources (
            municipality, title, url, source_type, raw_text, is_relevant, relevance_reason
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        municipality,
        title,
        url,
        source_type,
        raw_text,
        1 if is_relevant else 0,
        relevance_reason,
    ))
    conn.commit()
    source_id = cur.lastrowid
    conn.close()
    return int(source_id)


def insert_zoning_record(record: dict[str, Any]) -> int:
    conn = get_conn()
    cur = conn.execute("""
        INSERT INTO zoning_records (
            source_id,
            municipality,
            zone_code,
            zone_name,
            permitted_uses,
            minimum_lot_size,
            maximum_height,
            dwelling_unit_restrictions,
            parking_requirements,
            setback_rules,
            housing_types,
            standards_json,
            source_excerpt,
            confidence,
            category
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        record["source_id"],
        record["municipality"],
        record.get("zone_code"),
        record.get("zone_name"),
        record.get("permitted_uses"),
        record.get("minimum_lot_size"),
        record.get("maximum_height"),
        record.get("dwelling_unit_restrictions"),
        record.get("parking_requirements"),
        record.get("setback_rules"),
        record.get("housing_types"),
        record.get("standards_json"),
        record.get("source_excerpt"),
        record.get("confidence"),
        record.get("category"),
    ))
    conn.commit()
    record_id = cur.lastrowid
    conn.close()
    return int(record_id)


def insert_regulation(regulation: dict[str, Any]) -> int:
    conn = get_conn()
    cur = conn.execute("""
        INSERT INTO regulations (
            source_id,
            municipality,
            zone_code,
            zone_name,
            metric_name,
            value_text,
            value_num,
            unit,
            condition_json,
            raw_text,
            source_page,
            confidence
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        regulation["source_id"],
        regulation["municipality"],
        regulation.get("zone_code"),
        regulation.get("zone_name"),
        regulation["metric_name"],
        regulation.get("value_text"),
        regulation.get("value_num"),
        regulation.get("unit"),
        regulation.get("condition_json"),
        regulation.get("raw_text"),
        regulation.get("source_page"),
        regulation.get("confidence"),
    ))
    conn.commit()
    regulation_id = cur.lastrowid
    conn.close()
    return int(regulation_id)


def get_all_sources() -> list[dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("SELECT * FROM sources ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_records() -> list[dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("SELECT * FROM zoning_records ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_records_by_municipality(municipality: str) -> list[dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("""
        SELECT * FROM zoning_records
        WHERE municipality = ?
        ORDER BY id DESC
    """, (municipality,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_all_regulations() -> list[dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("SELECT * FROM regulations ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_regulations_by_municipality(municipality: str) -> list[dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("""
        SELECT * FROM regulations
        WHERE municipality = ?
        ORDER BY zone_code, metric_name, id
    """, (municipality,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_regulations_by_zone(municipality: str, zone_code: str) -> list[dict[str, Any]]:
    conn = get_conn()
    rows = conn.execute("""
        SELECT * FROM regulations
        WHERE municipality = ? AND zone_code = ?
        ORDER BY metric_name, id
    """, (municipality, zone_code)).fetchall()
    conn.close()
    return [dict(r) for r in rows]