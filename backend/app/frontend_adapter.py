import json
from typing import Any
from app.db import get_all_sources, get_all_regulations


def _infer_restrictiveness(score: int) -> str:
    if score >= 75:
        return "Very High"
    if score >= 60:
        return "High"
    if score >= 45:
        return "Medium"
    return "Low"


def _score_zone(standards: dict[str, Any]) -> int:
    score = 50

    height = None
    bh = standards.get("building_height_max", {})
    if isinstance(bh, dict):
        height = bh.get("default") or bh.get("value")

    lot_area = None
    la = standards.get("lot_area_min", {})
    if isinstance(la, dict):
        lot_area = la.get("interior_lot") or la.get("value")

    parking = None
    ps = standards.get("parking_spaces_min", {})
    if isinstance(ps, dict):
        parking = ps.get("1_dwelling_unit") or ps.get("value")

    if isinstance(height, (int, float)):
        if height <= 10:
            score += 18
        elif height <= 14:
            score += 8
        elif height >= 25:
            score -= 10

    if isinstance(lot_area, (int, float)):
        if lot_area >= 800:
            score += 18
        elif lot_area >= 400:
            score += 10
        elif lot_area <= 300:
            score -= 5

    if isinstance(parking, (int, float)):
        if parking >= 2:
            score += 14
        elif parking >= 1.5:
            score += 8
        elif parking <= 1:
            score -= 6

    return max(0, min(100, score))


def _safe_zone_name(municipality: str, zone_code: str) -> str:
    return f"{municipality} Zone {zone_code}"


def build_frontend_payload() -> dict[str, Any]:
    sources = get_all_sources()
    regulations = get_all_regulations()

    municipality_map: dict[str, dict[str, Any]] = {}
    for source in sources:
        muni_name = source["municipality"]
        muni_id = muni_name.lower().replace(" ", "-")
        if muni_id not in municipality_map:
            municipality_map[muni_id] = {
                "id": muni_id,
                "name": muni_name,
                "province": "Ontario",
                "population": None,
                "area": None,
                "zoningBylaw": source["title"] or "Unknown",
                "lastUpdated": source.get("created_at", "")[:10] if source.get("created_at") else None,
            }

    municipalities = list(municipality_map.values())

    grouped: dict[tuple[str, str], dict[str, Any]] = {}
    relevant_zones_by_source: dict[int, list[str]] = {}

    for reg in regulations:
        municipality = reg["municipality"]
        muni_id = municipality.lower().replace(" ", "-")
        zone_code = reg.get("zone_code")
        if not zone_code:
            continue

        key = (muni_id, zone_code)
        if key not in grouped:
            grouped[key] = {
                "municipalityId": muni_id,
                "zoneCode": zone_code,
                "zoneName": reg.get("zone_name") or _safe_zone_name(municipality, zone_code),
                "standards": {},
                "permittedUses": [],
            }

        standards = grouped[key]["standards"]
        metric = reg["metric_name"]
        cond = json.loads(reg["condition_json"]) if reg.get("condition_json") else {}
        value_num = reg.get("value_num")
        unit = reg.get("unit")

        if metric == "lot_area_min":
            standards.setdefault("lot_area_min", {"unit": unit})
            if cond.get("lot_type") == "interior_lot":
                standards["lot_area_min"]["interior_lot"] = value_num
            elif cond.get("lot_type") == "corner_lot":
                standards["lot_area_min"]["corner_lot"] = value_num
            else:
                standards["lot_area_min"]["value"] = value_num

        elif metric == "lot_frontage_min":
            standards.setdefault("lot_frontage_min", {"unit": unit})
            if cond.get("lot_type") == "interior_lot":
                standards["lot_frontage_min"]["interior_lot"] = value_num
            elif cond.get("lot_type") == "corner_lot":
                standards["lot_frontage_min"]["corner_lot"] = value_num
            else:
                standards["lot_frontage_min"]["value"] = value_num

        elif metric in {
            "front_yard_setback_min",
            "flankage_yard_setback_min",
            "side_yard_setback_min",
            "rear_yard_setback_min",
        }:
            standards.setdefault("setbacks_min", {"unit": unit})
            key_map = {
                "front_yard_setback_min": "front_yard",
                "flankage_yard_setback_min": "flankage_yard",
                "side_yard_setback_min": "side_yard",
                "rear_yard_setback_min": "rear_yard",
            }
            standards["setbacks_min"][key_map[metric]] = value_num

        elif metric == "building_height_max":
            standards.setdefault("building_height_max", {"unit": unit})
            if "dwelling_units" in cond:
                standards["building_height_max"][f'for_{cond["dwelling_units"]}_dwelling_units'] = value_num
            elif cond.get("case") == "default":
                standards["building_height_max"]["default"] = value_num
            else:
                standards["building_height_max"]["value"] = value_num

        elif metric == "lot_coverage_max":
            standards["lot_coverage_max"] = {"value": value_num, "unit": unit}

        elif metric == "parking_spaces_min":
            standards.setdefault("parking_spaces_min", {"unit": unit})
            if "dwelling_units" in cond:
                standards["parking_spaces_min"][f'{cond["dwelling_units"]}_dwelling_unit'] = value_num
            else:
                standards["parking_spaces_min"]["value"] = value_num

        elif metric in {
            "main_buildings_per_lot_max",
            "coach_houses_per_lot_max",
            "dwelling_units_per_lot_max",
        }:
            standards[metric] = value_num

        if reg["source_id"] not in relevant_zones_by_source:
            relevant_zones_by_source[reg["source_id"]] = []
        if zone_code not in relevant_zones_by_source[reg["source_id"]]:
            relevant_zones_by_source[reg["source_id"]].append(zone_code)

    zone_regulations = []
    for (muni_id, zone_code), zone in grouped.items():
        standards = zone["standards"]

        lot_area = standards.get("lot_area_min", {})
        height = standards.get("building_height_max", {})
        setbacks = standards.get("setbacks_min", {})
        parking = standards.get("parking_spaces_min", {})
        lot_coverage = standards.get("lot_coverage_max", {})

        min_lot_size = lot_area.get("interior_lot")
        if min_lot_size is None:
            min_lot_size = lot_area.get("value")
        if min_lot_size is None:
            candidates = [v for k, v in lot_area.items() if k != "unit" and isinstance(v, (int, float))]
            min_lot_size = min(candidates) if candidates else None

        max_height = height.get("default")
        if max_height is None:
            max_height = height.get("value")
        if max_height is None:
            candidates = [v for k, v in height.items() if k != "unit" and isinstance(v, (int, float))]
            max_height = min(candidates) if candidates else None

        min_parking = parking.get("1_dwelling_unit")
        if min_parking is None:
            min_parking = parking.get("value")

        score = _score_zone(standards)

        zone_regulations.append({
            "id": f"{muni_id}-{zone_code}".lower(),
            "municipalityId": muni_id,
            "zoneName": zone["zoneName"],
            "zoneCode": zone_code,
            "permittedUses": zone["permittedUses"],
            "maxDensity": None,
            "maxHeight": max_height,
            "minLotSize": min_lot_size,
            "minSetbackFront": setbacks.get("front_yard"),
            "minSetbackSide": setbacks.get("side_yard"),
            "minSetbackRear": setbacks.get("rear_yard"),
            "maxLotCoverage": lot_coverage.get("value"),
            "minParkingPerUnit": min_parking,
            "minGreenSpace": None,
            "restrictiveness": _infer_restrictiveness(score),
            "restrictionScore": score,
        })

    zoning_documents = []
    for source in sources:
        muni_id = source["municipality"].lower().replace(" ", "-")
        zoning_documents.append({
            "id": f"{muni_id}-doc-{source['id']}",
            "municipalityId": muni_id,
            "title": source.get("title") or f"{source['municipality']} zoning source",
            "type": "bylaw" if source.get("source_type") == "pdf" else "policy",
            "url": source["url"],
            "date": source.get("created_at", "")[:10] if source.get("created_at") else None,
            "relevantZones": relevant_zones_by_source.get(source["id"], []),
            "searchableText": (source.get("raw_text") or "")[:1000],
        })

    return {
        "municipalities": municipalities,
        "zoneRegulations": zone_regulations,
        "parcels": [],
        "zoningDocuments": zoning_documents,
    }