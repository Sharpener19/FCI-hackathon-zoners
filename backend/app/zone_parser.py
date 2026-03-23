# app/zone_parser.py

import re
from typing import List, Dict


ZONE_HEADER_PATTERNS = [
    r"\bR\d+\b",           # R1, R2, R7
    r"\bC\d+\b",           # C1, C2
    r"\bE\d+\b",           # E1, E2
    r"\bU\d+\b",           # U1
    r"\bRN-\d+\b",         # RN-6
    r"\bRMU-\d+\b",
    r"\bOS\d+\b",
    r"\b[A-Z]{1,3}-\d+\b", # general fallback
]


def is_zone_header(line: str) -> bool:
    line = line.strip()

    # must be short-ish (avoid paragraphs)
    if len(line) > 60:
        return False

    # must contain "zone" OR match pattern strongly
    if "zone" in line.lower():
        return True

    for pattern in ZONE_HEADER_PATTERNS:
        if re.search(pattern, line):
            return True

    return False


def extract_zone_code(line: str) -> str | None:
    for pattern in ZONE_HEADER_PATTERNS:
        match = re.search(pattern, line)
        if match:
            return match.group(0)
    return None


def split_into_zones(text: str) -> List[Dict]:
    lines = text.split("\n")

    zones = []
    current_zone = None

    for line in lines:
        if is_zone_header(line):
            zone_code = extract_zone_code(line)

            # start new zone
            if zone_code:
                if current_zone:
                    zones.append(current_zone)

                current_zone = {
                    "zone_code": zone_code,
                    "text": line + "\n"
                }
                continue

        # append text to current zone
        if current_zone:
            current_zone["text"] += line + "\n"

    if current_zone:
        zones.append(current_zone)

    return zones