import json
import re
from typing import Any


def _norm(text: str) -> str:
    return re.sub(r"[ \t]+", " ", text.replace("\r", "")).strip()


def _find_num(text: str) -> float | None:
    m = re.search(r"(-?\d+(?:\.\d+)?)", text)
    return float(m.group(1)) if m else None


def _metric_record(
    source_id: int,
    municipality: str,
    zone_code: str,
    metric_name: str,
    value_text: str | None,
    unit: str | None,
    raw_text: str | None,
    confidence: float = 0.9,
    zone_name: str | None = None,
    value_num: float | None = None,
    condition: dict[str, Any] | None = None,
    source_page: int | None = None,
) -> dict[str, Any]:
    return {
        "source_id": source_id,
        "municipality": municipality,
        "zone_code": zone_code,
        "zone_name": zone_name,
        "metric_name": metric_name,
        "value_text": value_text,
        "value_num": value_num if value_num is not None else _find_num(value_text or ""),
        "unit": unit,
        "condition_json": json.dumps(condition) if condition else None,
        "raw_text": raw_text,
        "source_page": source_page,
        "confidence": confidence,
    }


def _extract_table_heading(text: str) -> tuple[str | None, str | None]:
    m = re.search(
        r"Table\s+[A-Z0-9]+[:\-]\s*Regulations\s*[–-]\s*(.+?)\s+ZONE\s*\(([^)]+)\)",
        text,
        flags=re.IGNORECASE,
    )
    if not m:
        return None, None
    return _norm(m.group(1)), _norm(m.group(2))


def _extract_lot_area(text: str) -> list[dict[str, Any]]:
    out = []
    m = re.search(
        r"LOT AREA\s*\(minimum\)(.*?)(?:LOT FRONTAGE|FRONT YARD|BUILDING HEIGHT|LOT COVERAGE|PARKING SPACES|Number of)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not m:
        return out
    block = _norm(m.group(1))

    for lot_type, pattern in [
        ("interior_lot", r"INTERIOR LOT[: ]+(\d+(?:\.\d+)?)\s*(square metres|m²|m2)"),
        ("corner_lot", r"CORNER LOT[: ]+(\d+(?:\.\d+)?)\s*(square metres|m²|m2)"),
    ]:
        mm = re.search(pattern, block, flags=re.IGNORECASE)
        if mm:
            out.append({
                "metric_name": "lot_area_min",
                "value_text": mm.group(1),
                "value_num": float(mm.group(1)),
                "unit": "square_metres",
                "condition": {"lot_type": lot_type},
                "raw_text": block,
            })

    if not out:
        mm = re.search(r"(\d+(?:\.\d+)?)\s*(square metres|m²|m2)", block, flags=re.IGNORECASE)
        if mm:
            out.append({
                "metric_name": "lot_area_min",
                "value_text": mm.group(1),
                "value_num": float(mm.group(1)),
                "unit": "square_metres",
                "condition": None,
                "raw_text": block,
            })
    return out


def _extract_lot_frontage(text: str) -> list[dict[str, Any]]:
    out = []
    m = re.search(
        r"LOT FRONTAGE\s*\(minimum\)(.*?)(?:FRONT YARD|FLANKAGE YARD|SIDE YARD|REAR YARD|BUILDING HEIGHT|LOT COVERAGE|PARKING SPACES|Number of)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not m:
        return out
    block = _norm(m.group(1))

    for lot_type, pattern in [
        ("interior_lot", r"INTERIOR LOT[: ]+(\d+(?:\.\d+)?)\s*metres"),
        ("corner_lot", r"CORNER LOT[: ]+(\d+(?:\.\d+)?)\s*metres"),
    ]:
        mm = re.search(pattern, block, flags=re.IGNORECASE)
        if mm:
            out.append({
                "metric_name": "lot_frontage_min",
                "value_text": mm.group(1),
                "value_num": float(mm.group(1)),
                "unit": "metres",
                "condition": {"lot_type": lot_type},
                "raw_text": block,
            })
    return out


def _extract_setbacks(text: str) -> list[dict[str, Any]]:
    out = []
    mapping = [
        ("front_yard_setback_min", r"FRONT YARD setback\s*\(minimum\)\s*(\d+(?:\.\d+)?)\s*metres"),
        ("flankage_yard_setback_min", r"FLANKAGE YARD setback\s*\(minimum\)\s*(\d+(?:\.\d+)?)\s*metres"),
        ("side_yard_setback_min", r"SIDE YARD setback\s*\(minimum\)\s*(\d+(?:\.\d+)?)\s*metres"),
        ("rear_yard_setback_min", r"REAR YARD setback\s*\(minimum\)\s*(\d+(?:\.\d+)?)\s*metres"),
    ]
    clean = _norm(text)
    for metric_name, pattern in mapping:
        mm = re.search(pattern, clean, flags=re.IGNORECASE)
        if mm:
            out.append({
                "metric_name": metric_name,
                "value_text": mm.group(1),
                "value_num": float(mm.group(1)),
                "unit": "metres",
                "condition": None,
                "raw_text": mm.group(0),
            })
    return out


def _extract_height(text: str) -> list[dict[str, Any]]:
    out = []
    m = re.search(
        r"BUILDING HEIGHT\s*\(maximum\)(.*?)(?:LOT COVERAGE|PARKING SPACES|Number of|COACH HOUSES|DWELLING UNITS per LOT|$)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not m:
        return out
    block = _norm(m.group(1))

    # Special case by dwelling unit count
    special = re.search(
        r"(\d+(?:\.\d+)?)\s*metres\s*for a BUILDING containing\s*(\d+)\s*DWELLING UNITS?,?\s*and\s*(\d+(?:\.\d+)?)\s*metres\s*in all other instances",
        block,
        flags=re.IGNORECASE,
    )
    if special:
        out.append({
            "metric_name": "building_height_max",
            "value_text": special.group(3),
            "value_num": float(special.group(3)),
            "unit": "metres",
            "condition": {"case": "default"},
            "raw_text": block,
        })
        out.append({
            "metric_name": "building_height_max",
            "value_text": special.group(1),
            "value_num": float(special.group(1)),
            "unit": "metres",
            "condition": {"dwelling_units": int(special.group(2))},
            "raw_text": block,
        })
        return out

    vals = re.findall(r"(\d+(?:\.\d+)?)\s*metres", block, flags=re.IGNORECASE)
    if vals:
        out.append({
            "metric_name": "building_height_max",
            "value_text": vals[0],
            "value_num": float(vals[0]),
            "unit": "metres",
            "condition": {"case": "default"},
            "raw_text": block,
        })
    return out


def _extract_lot_coverage(text: str) -> list[dict[str, Any]]:
    out = []
    mm = re.search(
        r"LOT COVERAGE.*?\(maximum\)\s*(\d+(?:\.\d+)?)\s*%",
        _norm(text),
        flags=re.IGNORECASE,
    )
    if mm:
        out.append({
            "metric_name": "lot_coverage_max",
            "value_text": mm.group(1),
            "value_num": float(mm.group(1)),
            "unit": "percent",
            "condition": None,
            "raw_text": mm.group(0),
        })
    return out


def _extract_parking(text: str) -> list[dict[str, Any]]:
    out = []
    m = re.search(
        r"PARKING SPACES\s*\(minimum\)(.*?)(?:Number of main BUILDINGS per LOT|Number of COACH HOUSES per LOT|Number of DWELLING UNITS per LOT|$)",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not m:
        return out
    block = _norm(m.group(1))

    matches = re.findall(
        r"(One|Two|Three|Four|\d+)\s*\((\d+)\)\s*DWELLING UNITS?[: ]+(?:One|Two|Three|Four|\d+)\s*\((\d+)\)\s*PARKING SPACES?",
        block,
        flags=re.IGNORECASE,
    )
    for _, dwelling_units, spaces in matches:
        out.append({
            "metric_name": "parking_spaces_min",
            "value_text": spaces,
            "value_num": float(spaces),
            "unit": "spaces",
            "condition": {"dwelling_units": int(dwelling_units)},
            "raw_text": block,
        })

    if not out:
        mm = re.search(r"(\d+(?:\.\d+)?)\s*PARKING SPACES?", block, flags=re.IGNORECASE)
        if mm:
            out.append({
                "metric_name": "parking_spaces_min",
                "value_text": mm.group(1),
                "value_num": float(mm.group(1)),
                "unit": "spaces",
                "condition": None,
                "raw_text": block,
            })
    return out


def _extract_misc_counts(text: str) -> list[dict[str, Any]]:
    out = []
    clean = _norm(text)
    patterns = [
        ("main_buildings_per_lot_max", r"Number of main BUILDINGS per LOT\s*\(maximum\)\s*(\d+)"),
        ("coach_houses_per_lot_max", r"Number of COACH HOUSES per LOT\s*\(maximum\)\s*(\d+)"),
        ("dwelling_units_per_lot_max", r"Number of DWELLING UNITS per LOT\s*\(maximum\)\s*(\d+)"),
    ]
    for metric_name, pattern in patterns:
        mm = re.search(pattern, clean, flags=re.IGNORECASE)
        if mm:
            out.append({
                "metric_name": metric_name,
                "value_text": mm.group(1),
                "value_num": float(mm.group(1)),
                "unit": "count",
                "condition": None,
                "raw_text": mm.group(0),
            })
    return out


def _extract_permitted_uses(text: str) -> list[str]:
    m = re.search(
        r"PERMITTED USES?(.*?)(?:Performance Standards|Regulations|Table\s+[A-Z0-9]+[:\-])",
        text,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not m:
        return []
    block = m.group(1)
    items = re.findall(r"[•\-]\s*([A-Za-z0-9 ,/&()-]+)", block)
    return [_norm(x) for x in items if _norm(x)]


def extract_zone_payload(zone: dict[str, Any], source_id: int, municipality: str) -> dict[str, Any]:
    zone_code = zone["zone_code"]
    text = zone["text"]
    zone_name_from_table, zone_code_from_table = _extract_table_heading(text)
    if zone_code_from_table:
        zone_code = zone_code_from_table

    regulations: list[dict[str, Any]] = []
    extracted_blocks = []
    for extractor in (
        _extract_lot_area,
        _extract_lot_frontage,
        _extract_setbacks,
        _extract_height,
        _extract_lot_coverage,
        _extract_parking,
        _extract_misc_counts,
    ):
        extracted_blocks.extend(extractor(text))

    for item in extracted_blocks:
        regulations.append(
            _metric_record(
                source_id=source_id,
                municipality=municipality,
                zone_code=zone_code,
                zone_name=zone_name_from_table,
                metric_name=item["metric_name"],
                value_text=item.get("value_text"),
                value_num=item.get("value_num"),
                unit=item.get("unit"),
                condition=item.get("condition"),
                raw_text=item.get("raw_text"),
                confidence=0.92,
            )
        )

    standards = _build_standards_from_regulations(regulations)
    permitted_uses = _extract_permitted_uses(text)

    zoning_record = {
        "source_id": source_id,
        "municipality": municipality,
        "zone_code": zone_code,
        "zone_name": zone_name_from_table or f"{municipality} Zone {zone_code}",
        "permitted_uses": ", ".join(permitted_uses) if permitted_uses else None,
        "minimum_lot_size": _summary_min_lot_size(standards),
        "maximum_height": _summary_max_height(standards),
        "dwelling_unit_restrictions": _summary_dwelling_units(standards),
        "parking_requirements": _summary_parking(standards),
        "setback_rules": _summary_setbacks_text(standards),
        "housing_types": None,
        "standards_json": json.dumps(standards) if standards else None,
        "source_excerpt": _norm(text[:600]),
        "confidence": 0.92 if regulations else 0.5,
        "category": "zone_standard",
    }

    return {
        "zoning_record": zoning_record,
        "regulations": regulations,
    }


def _build_standards_from_regulations(regs: list[dict[str, Any]]) -> dict[str, Any]:
    out: dict[str, Any] = {}

    for r in regs:
        metric = r["metric_name"]
        cond = json.loads(r["condition_json"]) if r.get("condition_json") else {}
        val_num = r.get("value_num")
        unit = r.get("unit")

        if metric == "lot_area_min":
            out.setdefault("lot_area_min", {"unit": unit})
            if cond.get("lot_type") == "interior_lot":
                out["lot_area_min"]["interior_lot"] = val_num
            elif cond.get("lot_type") == "corner_lot":
                out["lot_area_min"]["corner_lot"] = val_num
            else:
                out["lot_area_min"]["value"] = val_num

        elif metric == "lot_frontage_min":
            out.setdefault("lot_frontage_min", {"unit": unit})
            if cond.get("lot_type") == "interior_lot":
                out["lot_frontage_min"]["interior_lot"] = val_num
            elif cond.get("lot_type") == "corner_lot":
                out["lot_frontage_min"]["corner_lot"] = val_num
            else:
                out["lot_frontage_min"]["value"] = val_num

        elif metric in {
            "front_yard_setback_min",
            "flankage_yard_setback_min",
            "side_yard_setback_min",
            "rear_yard_setback_min",
        }:
            out.setdefault("setbacks_min", {"unit": unit})
            key_map = {
                "front_yard_setback_min": "front_yard",
                "flankage_yard_setback_min": "flankage_yard",
                "side_yard_setback_min": "side_yard",
                "rear_yard_setback_min": "rear_yard",
            }
            out["setbacks_min"][key_map[metric]] = val_num

        elif metric == "building_height_max":
            out.setdefault("building_height_max", {"unit": unit})
            if "dwelling_units" in cond:
                out["building_height_max"][f'for_{cond["dwelling_units"]}_dwelling_units'] = val_num
            elif cond.get("case") == "default":
                out["building_height_max"]["default"] = val_num
            else:
                out["building_height_max"]["value"] = val_num

        elif metric == "lot_coverage_max":
            out["lot_coverage_max"] = {"value": val_num, "unit": unit}

        elif metric == "parking_spaces_min":
            out.setdefault("parking_spaces_min", {"unit": unit})
            if "dwelling_units" in cond:
                out["parking_spaces_min"][f'{cond["dwelling_units"]}_dwelling_unit'] = val_num
            else:
                out["parking_spaces_min"]["value"] = val_num

        elif metric in {
            "main_buildings_per_lot_max",
            "coach_houses_per_lot_max",
            "dwelling_units_per_lot_max",
        }:
            out[metric] = val_num

    return out


def _summary_min_lot_size(standards: dict[str, Any]) -> str | None:
    s = standards.get("lot_area_min")
    if not s:
        return None
    if "interior_lot" in s:
        return str(s["interior_lot"])
    if "value" in s:
        return str(s["value"])
    vals = [v for k, v in s.items() if k != "unit" and isinstance(v, (int, float))]
    return str(min(vals)) if vals else None


def _summary_max_height(standards: dict[str, Any]) -> str | None:
    s = standards.get("building_height_max")
    if not s:
        return None
    if "default" in s:
        return str(s["default"])
    if "value" in s:
        return str(s["value"])
    vals = [v for k, v in s.items() if k != "unit" and isinstance(v, (int, float))]
    return str(min(vals)) if vals else None


def _summary_dwelling_units(standards: dict[str, Any]) -> str | None:
    v = standards.get("dwelling_units_per_lot_max")
    return str(int(v)) if isinstance(v, (int, float)) else None


def _summary_parking(standards: dict[str, Any]) -> str | None:
    s = standards.get("parking_spaces_min")
    if not s:
        return None
    if "1_dwelling_unit" in s:
        return str(s["1_dwelling_unit"])
    if "value" in s:
        return str(s["value"])
    vals = [v for k, v in s.items() if k != "unit" and isinstance(v, (int, float))]
    return str(min(vals)) if vals else None


def _summary_setbacks_text(standards: dict[str, Any]) -> str | None:
    s = standards.get("setbacks_min")
    if not s:
        return None
    parts = []
    for key in ("front_yard", "flankage_yard", "side_yard", "rear_yard"):
        if key in s:
            parts.append(f"{key}:{s[key]}")
    return ", ".join(parts) if parts else None