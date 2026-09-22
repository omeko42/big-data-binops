import csv
import json
from collections import Counter
from pathlib import Path


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL")
SOURCE = ROOT / "bdb_satker_raw.csv"
V2_MAP = ROOT / "bdb_satker_injection_map.json"
OUTPUT_MAP = ROOT / "bdb_satker_v4_map.json"
REPORT = ROOT / "bdb_satker_v4_report.json"

PBD_CODE_RULES = [
    ("POLRESTA SORONG KOTA", "060.01.36.101", ["060.01.36.101", "060.01.33.06"]),
    ("POLRES SORONG", "060.01.36.102", ["060.01.33.07"]),
    ("POLRES SORONG SELATAN", "060.01.36.103", ["060.01.33.08"]),
    ("POLRES RAJA AMPAT", "060.01.36.104", ["060.01.33.09"]),
    ("POLRES MAYBRAT", "060.01.36.105", ["060.01.36.27", "060.01.36.01"]),
    ("POLRES TAMBRAUW", "060.01.36.106", ["060.01.36.28", "060.01.36.06"]),
]


def clean(value):
    return (value or "").strip()


def remap_canonical(code):
    for unit, new_prefix, old_prefixes in PBD_CODE_RULES:
        for old_prefix in old_prefixes:
            if code == old_prefix:
                return new_prefix, unit, old_prefix
            if code.startswith(old_prefix + "."):
                return new_prefix + code[len(old_prefix):], unit, old_prefix
    return code, "", ""


with SOURCE.open("r", encoding="utf-8-sig", newline="") as handle:
    rows = list(csv.DictReader(handle))
v2_map = json.loads(V2_MAP.read_text(encoding="utf-8"))

result = {}
subdomain_counts = Counter()
subdomain_injected_counts = Counter()
canonical_target_counts = Counter()
canonical_changed_counts = Counter()
conflicts = []

for row in rows:
    item = v2_map[clean(row["id"])]
    effective_function = clean(item["fungsi_saat_ini"]) or clean(item["fungsi_usulan"])
    current_subdomain = clean(row["sub_domain"]).upper()
    proposed_subdomain = {
        "INTERNAL_RESERSE": "INTERNAL RESERSE",
        "EKSTERNAL_RESERSE": "EKSTERNAL RESERSE",
    }.get(effective_function, "")
    if current_subdomain and proposed_subdomain and current_subdomain != proposed_subdomain:
        conflicts.append({
            "id": clean(row["id"]), "deskripsi": clean(row["deskripsi"]),
            "current": current_subdomain, "proposed": proposed_subdomain,
        })
    final_subdomain = current_subdomain or proposed_subdomain
    subdomain_counts[final_subdomain or "(KOSONG)"] += 1
    if not current_subdomain and final_subdomain:
        subdomain_injected_counts[final_subdomain] += 1

    current_canonical = clean(row["kode_canonical"])
    final_canonical, pbd_unit, matched_prefix = remap_canonical(current_canonical)
    if pbd_unit:
        canonical_target_counts[pbd_unit] += 1
    if final_canonical != current_canonical:
        canonical_changed_counts[pbd_unit] += 1

    result[clean(row["id"])] = {
        "sub_domain_saat_ini": current_subdomain,
        "sub_domain_v4": final_subdomain,
        "fungsi_v2": effective_function,
        "kode_canonical_saat_ini": current_canonical,
        "kode_canonical_v4": final_canonical,
        "unit_pbd": pbd_unit,
        "prefix_asal": matched_prefix,
    }

all_canonical = [item["kode_canonical_v4"] for item in result.values() if item["kode_canonical_v4"]]
duplicates = [code for code, count in Counter(all_canonical).items() if count > 1]
report = {
    "rows": len(rows),
    "subdomain_counts_v4": dict(subdomain_counts),
    "subdomain_injected_counts": dict(subdomain_injected_counts),
    "subdomain_injected_total": sum(subdomain_injected_counts.values()),
    "subdomain_conflicts_with_existing": len(conflicts),
    "subdomain_conflict_examples": conflicts[:30],
    "pbd_canonical_target_counts": dict(canonical_target_counts),
    "pbd_canonical_changed_counts": dict(canonical_changed_counts),
    "pbd_canonical_changed_total": sum(canonical_changed_counts.values()),
    "canonical_duplicate_count": len(duplicates),
    "canonical_duplicate_examples": duplicates[:30],
    "pbd_code_rules": [
        {"unit": unit, "new_prefix": new_prefix, "old_prefixes": old_prefixes}
        for unit, new_prefix, old_prefixes in PBD_CODE_RULES
    ],
}
OUTPUT_MAP.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
