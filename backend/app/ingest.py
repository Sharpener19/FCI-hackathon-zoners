from app.db import init_db, insert_source, insert_zoning_record, insert_regulation
from app.pdf_parser import extract_text_from_pdf
from app.zone_parser import split_into_zones
from app.extractor import extract_zone_payload


def ingest_pdf(url: str, municipality: str, title: str) -> int:
    print(f"Ingesting PDF: {title}")

    text = extract_text_from_pdf(url)

    source_id = insert_source(
        municipality=municipality,
        title=title,
        url=url,
        source_type="pdf",
        raw_text=text,
        is_relevant=True,
        relevance_reason="zoning bylaw",
    )

    zones = split_into_zones(text)
    print(f"Detected {len(zones)} zones")

    inserted_zone_records = 0
    inserted_regulations = 0

    for zone in zones:
        payload = extract_zone_payload(zone, source_id, municipality)
        zoning_record = payload["zoning_record"]
        regulations = payload["regulations"]

        meaningful = (
            zoning_record.get("minimum_lot_size")
            or zoning_record.get("maximum_height")
            or zoning_record.get("dwelling_unit_restrictions")
            or zoning_record.get("parking_requirements")
            or zoning_record.get("setback_rules")
            or zoning_record.get("permitted_uses")
            or regulations
        )

        if not meaningful:
            continue

        insert_zoning_record(zoning_record)
        inserted_zone_records += 1

        for reg in regulations:
            insert_regulation(reg)
            inserted_regulations += 1

    print(f"Inserted {inserted_zone_records} zoning records and {inserted_regulations} regulations.")
    return source_id


if __name__ == "__main__":
    init_db()

    test_url = "https://www.waterloo.ca/media/ybpnbhdm/zoning-by-law-2018-050.pdf"

    ingest_pdf(
        url=test_url,
        municipality="Waterloo",
        title="Waterloo Zoning Bylaw"
    )

    # ingest_pdf(
    #     url="PASTE_GUELPH_PDF_URL_HERE",
    #     municipality="Guelph",
    #     title="Guelph Zoning Bylaw"
    # )