import csv
import json
from collections import Counter
from pathlib import Path


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL")
SOURCE = ROOT / "bdb_satker_raw.csv"
ANALYSIS = ROOT / "bdb_satker_analysis.json"
COMPLETENESS = ROOT / "bdb_satker_completeness.csv"
REPAIR_QUEUE = ROOT / "bdb_satker_repair_queue.csv"

EXPECTED = {
    "keanggotaan": {"INTERNAL_POLRI", "EKSTERNAL_POLRI"},
    "fungsi": {"INTERNAL_RESERSE", "EKSTERNAL_RESERSE"},
}


def clean(value):
    return (value or "").strip()


with SOURCE.open("r", encoding="utf-8-sig", newline="") as handle:
    reader = csv.DictReader(handle)
    fields = reader.fieldnames or []
    rows = list(reader)

total = len(rows)
ids = {clean(row["id"]) for row in rows if clean(row["id"])}

missing = {field: sum(not clean(row[field]) for row in rows) for field in fields}
distinct_nonblank = {
    field: len({clean(row[field]) for row in rows if clean(row[field])})
    for field in fields
}

duplicate_counts = {}
for field in ("id", "kode", "kode_canonical"):
    counts = Counter(clean(row[field]) for row in rows if clean(row[field]))
    duplicate_counts[field] = {
        "duplicate_values": sum(count > 1 for count in counts.values()),
        "affected_rows": sum(count for count in counts.values() if count > 1),
        "examples": [
            {"value": value, "count": count}
            for value, count in counts.most_common()
            if count > 1
        ][:20],
    }

orphan_rows = [
    row for row in rows
    if clean(row["parent_id"]) and clean(row["parent_id"]) not in ids
]

classification_counts = {}
invalid_counts = {}
for field, allowed in EXPECTED.items():
    counts = Counter(clean(row[field]) or "(KOSONG)" for row in rows)
    classification_counts[field] = dict(counts.most_common())
    invalid_counts[field] = {
        key: value
        for key, value in counts.items()
        if key != "(KOSONG)" and key not in allowed
    }

queue_fields = [
    "id", "kode", "kode_canonical", "deskripsi", "parent_id", "parent_kode",
    "depth", "is_root", "source", "tipe_satker", "dors_kode", "dors_status", "urutan",
    "keanggotaan_saat_ini", "fungsi_saat_ini",
    "keanggotaan_baru", "fungsi_baru",
    "isu_keanggotaan", "isu_fungsi", "status_perbaikan", "catatan_editor",
]
queue = []
for row in rows:
    membership = clean(row["keanggotaan"])
    function = clean(row["fungsi"])
    membership_issue = (
        "KOSONG" if not membership
        else "NILAI_TIDAK_VALID" if membership not in EXPECTED["keanggotaan"]
        else ""
    )
    function_issue = (
        "KOSONG" if not function
        else "NILAI_TIDAK_VALID" if function not in EXPECTED["fungsi"]
        else ""
    )
    if membership_issue or function_issue:
        item = {field: row.get(field, "") for field in queue_fields}
        item["keanggotaan_saat_ini"] = membership
        item["fungsi_saat_ini"] = function
        item["keanggotaan_baru"] = ""
        item["fungsi_baru"] = ""
        item["isu_keanggotaan"] = membership_issue
        item["isu_fungsi"] = function_issue
        item["status_perbaikan"] = "BELUM DITINJAU"
        item["catatan_editor"] = ""
        queue.append(item)

with COMPLETENESS.open("w", encoding="utf-8-sig", newline="") as handle:
    writer = csv.writer(handle)
    writer.writerow(["elemen_data", "terisi", "kosong", "persen_terisi", "nilai_unik_non_kosong"])
    for field in fields:
        empty = missing[field]
        writer.writerow([
            field,
            total - empty,
            empty,
            round((total - empty) / total, 6) if total else 0,
            distinct_nonblank[field],
        ])

with REPAIR_QUEUE.open("w", encoding="utf-8-sig", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=queue_fields)
    writer.writeheader()
    writer.writerows(queue)

analysis = {
    "source_file": str(SOURCE),
    "row_count": total,
    "column_count": len(fields),
    "columns": fields,
    "missing": missing,
    "distinct_nonblank": distinct_nonblank,
    "classification_counts": classification_counts,
    "invalid_classification_counts": invalid_counts,
    "duplicate_counts": duplicate_counts,
    "orphan_parent_count": len(orphan_rows),
    "orphan_parent_examples": [
        {key: row.get(key, "") for key in ("id", "kode", "deskripsi", "parent_id")}
        for row in orphan_rows[:20]
    ],
    "root_count": sum(clean(row["is_root"]).lower() == "t" for row in rows),
    "synthetic_count": sum(clean(row["is_synthetic"]).lower() == "t" for row in rows),
    "code_060_count": sum(clean(row["kode"]).startswith("060") for row in rows),
    "blank_code_count": missing.get("kode", 0),
    "depth_counts": dict(Counter(clean(row["depth"]) or "(KOSONG)" for row in rows).most_common()),
    "source_counts": dict(Counter(clean(row["source"]) or "(KOSONG)" for row in rows).most_common()),
    "tipe_satker_counts": dict(Counter(clean(row["tipe_satker"]) or "(KOSONG)" for row in rows).most_common()),
    "repair_queue_count": len(queue),
}

ANALYSIS.write_text(json.dumps(analysis, ensure_ascii=False, indent=2), encoding="utf-8")

print(json.dumps({
    "rows": total,
    "columns": len(fields),
    "classifications": classification_counts,
    "repair_queue": len(queue),
    "orphan_parents": len(orphan_rows),
    "duplicates": duplicate_counts,
    "code_060": analysis["code_060_count"],
}, ensure_ascii=False, indent=2))
