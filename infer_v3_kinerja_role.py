import csv
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL")
SOURCE = ROOT / "bdb_satker_raw.csv"
V2_MAP = ROOT / "bdb_satker_injection_map.json"
OUTPUT_MAP = ROOT / "bdb_satker_v3_map.json"
REPORT = ROOT / "bdb_satker_v3_report.json"
AUDIT_CSV = ROOT / "bdb_satker_v3_audit.csv"


def clean(value):
    return (value or "").strip()


def normalize_name(value):
    return re.sub(r"\s+", " ", clean(value).upper())


def infer_role(row, effective_function):
    """Infer one of the seven operational roles already present in the master."""
    name = normalize_name(row["deskripsi"])
    code = clean(row["kode"])

    if not effective_function:
        return "", "Node induk/root tidak memiliki fungsi Reserse"

    if effective_function == "INTERNAL_RESERSE":
        # Existing DITRES examples are directorates at Bareskrim/Polda level.
        if re.search(r"^(?:DIT\b|DITRES|DITPP|KORTAS\b)", name):
            return "DITRES", "Direktorat/Kortas Reserse"
        # Existing SATRES examples are operational units at Polres/Polsek level.
        return "SATRES", "Unit operasional Internal Reserse"

    if effective_function == "EKSTERNAL_RESERSE":
        if code.startswith("060.00.20.") or re.search(r"^DENSUS\s*88\b", name):
            return "DENSUS88", "Densus 88"
        if re.search(r"(?:POLAIR|POL AIR)", name):
            if re.search(r"^(?:DIT|KOR)", name):
                return "DITPOLAIR", "Direktorat/Korps Polair"
            return "SATPOLAIR", "Satuan Polair"
        if re.search(r"LANTAS", name):
            return "SATLANTAS", "Fungsi Lalu Lintas"
        if re.search(r"(?:SAMAPTA|SABHARA|TAHTI)", name):
            return "SATSAMAPTA", "Fungsi Samapta/Sabhara/Tahti"

    return "", "Belum ada pola operational_role yang cocok"


with SOURCE.open("r", encoding="utf-8-sig", newline="") as handle:
    rows = list(csv.DictReader(handle))
v2_map = json.loads(V2_MAP.read_text(encoding="utf-8"))

result = {}
audit_rows = []
effective_function_counts = Counter()
kinerja_counts = Counter()
role_counts = Counter()
existing_role_counts = Counter()
injected_role_counts = Counter()
unmatched = []
conflicts = []
role_injected = 0
kinerja_changed = 0

for row in rows:
    item = v2_map[clean(row["id"])]
    effective_function = clean(item["fungsi_saat_ini"]) or clean(item["fungsi_usulan"])
    effective_function_counts[effective_function or "(KOSONG)"] += 1

    kinerja = "t" if effective_function == "INTERNAL_RESERSE" else "f"
    kinerja_counts[kinerja] += 1
    if clean(row["kinerja_aktif"]).lower() != kinerja:
        kinerja_changed += 1

    suggested_role, reason = infer_role(row, effective_function)
    existing_role = clean(row["operational_role"]).upper()
    final_role = existing_role or suggested_role
    role_counts[final_role or "(KOSONG)"] += 1

    if existing_role:
        existing_role_counts[existing_role] += 1
        if suggested_role and suggested_role != existing_role:
            conflicts.append({
                "id": clean(row["id"]), "kode": clean(row["kode"]),
                "deskripsi": clean(row["deskripsi"]), "existing": existing_role,
                "suggested": suggested_role, "fungsi": effective_function,
            })
    elif final_role:
        role_injected += 1
        injected_role_counts[final_role] += 1

    if effective_function and not final_role:
        unmatched.append({
            "id": clean(row["id"]), "kode": clean(row["kode"]),
            "deskripsi": clean(row["deskripsi"]), "fungsi": effective_function,
            "reason": reason,
        })

    result[clean(row["id"])] = {
        "fungsi_v2": effective_function,
        "kinerja_saat_ini": clean(row["kinerja_aktif"]).lower(),
        "kinerja_aktif_v3": kinerja,
        "operational_role_saat_ini": existing_role,
        "operational_role_usulan": suggested_role,
        "operational_role_v3": final_role,
        "dasar_operational_role": reason,
    }
    audit_rows.append({
        "id": clean(row["id"]), "kode": clean(row["kode"]),
        "deskripsi": clean(row["deskripsi"]), "fungsi_v2": effective_function,
        "kinerja_aktif_v3": kinerja, "operational_role_saat_ini": existing_role,
        "operational_role_usulan": suggested_role, "operational_role_v3": final_role,
        "dasar_operational_role": reason,
    })

REPORT.write_text(json.dumps({
    "rows": len(rows),
    "effective_function_counts": dict(effective_function_counts),
    "kinerja_counts": dict(kinerja_counts),
    "kinerja_changed": kinerja_changed,
    "operational_role_counts": dict(role_counts),
    "existing_role_counts": dict(existing_role_counts),
    "injected_role_counts": dict(injected_role_counts),
    "operational_role_injected": role_injected,
    "unmatched_count": len(unmatched),
    "unmatched_examples": unmatched[:100],
    "existing_pattern_conflict_count": len(conflicts),
    "existing_pattern_conflict_examples": conflicts[:100],
}, ensure_ascii=False, indent=2), encoding="utf-8")
OUTPUT_MAP.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")

with AUDIT_CSV.open("w", encoding="utf-8-sig", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=list(audit_rows[0]))
    writer.writeheader()
    writer.writerows(audit_rows)

print(REPORT.read_text(encoding="utf-8"))
