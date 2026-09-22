import csv
import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL")
SOURCE = ROOT / "bdb_satker_raw.csv"
OUTPUT = ROOT / "bdb_satker_inference.csv"
REPORT = ROOT / "bdb_satker_inference_report.json"
INJECTION_MAP = ROOT / "bdb_satker_injection_map.json"


def clean(value):
    return (value or "").strip()


def normalize_name(value):
    return re.sub(r"\s+", " ", clean(value).upper())


def infer_function(row):
    current = clean(row["fungsi"])
    if current:
        return current, "EXISTING", "Nilai fungsi sudah ada pada master"

    tipe = clean(row["tipe_satker"]).upper()
    name = normalize_name(row["deskripsi"])
    if clean(row["is_root"]).lower() == "t" or clean(row["kode"]) == "060":
        return "", "TIDAK_BERLAKU", "Root POLRI hanya memuat keanggotaan; klasifikasi fungsi Reserse tidak berlaku"
    if tipe in {"POLDA", "POLRES", "POLSEK"} or re.search(r"^(?:POLDA|POLRES|POLRESTA|POLRESTABES|POLSEK)\b", name):
        return "", "TIDAK_BERLAKU", "Node induk POLDA/POLRES/POLSEK memuat fungsi Reserse dan non-Reserse; fungsi tidak ditempelkan pada node induk"

    subdomain = clean(row["sub_domain"]).upper().replace(" ", "_")
    if subdomain in {"INTERNAL_RESERSE", "EKSTERNAL_RESERSE"}:
        return subdomain, "SANGAT_TINGGI", f"Pemetaan langsung sub_domain={clean(row['sub_domain'])}"

    role = clean(row["operational_role"]).upper()
    if role in {"SATRES", "DITRES"}:
        return "INTERNAL_RESERSE", "SANGAT_TINGGI", f"operational_role={role}"
    if role in {"SATLANTAS", "SATSAMAPTA", "DITPOLAIR", "SATPOLAIR", "DENSUS88"}:
        return "EKSTERNAL_RESERSE", "SANGAT_TINGGI", f"operational_role={role}"

    code = clean(row["kode"])
    if code.startswith("060.00.20."):
        return "EKSTERNAL_RESERSE", "TINGGI", "Turunan DENSUS 88; contoh existing DENSUS88 berlabel EKSTERNAL RESERSE"

    internal_patterns = [
        r"^SAT RESKRIM\b", r"^SATRESKRIM\b",
        r"^SAT NARKOBA\b", r"^SAT RES NARKOBA\b", r"^SATRESNARKOBA\b",
        r"^UNIT RESKRIM\b",
        r"^DIT KRIMUM\b", r"^DIT KRIMSUS\b", r"^DIT NARKOBA\b", r"^DIT RES\b",
        r"^DITRESKRIM", r"^DITRESNARKOBA\b", r"^DIT TIPID", r"^DIT PPA\b",
        r"^SATRESPPADANPPO\b", r"^DITPPADANPPO\b",
        r"^SAT RES PPA\b", r"^KORTAS TIPIDKOR\b",
        r"\bBARESKRIM\b",
    ]
    external_patterns = [
        r"^SAT LANTAS\b", r"^SATLANTAS\b",
        r"^SATSAMAPTA\b", r"^SAT SAMAPTA\b", r"^SAT SABHARA\b",
        r"^DIT POLAIRUD\b", r"^DITPOLAIR\b", r"^SAT POL AIR\b", r"^SAT POLAIR\b",
        r"^DIT POLAIR\b", r"^KORPOLAIR\b",
        r"^DIT LANTAS\b", r"^DIT SABHARA\b", r"^DIT TAHTI\b",
        r"^SAT TAHTI\b", r"^DENSUS ?88\b",
    ]
    for pattern in internal_patterns:
        if re.search(pattern, name):
            return "INTERNAL_RESERSE", "TINGGI", f"Pola nama: {pattern}"
    for pattern in external_patterns:
        if re.search(pattern, name):
            return "EKSTERNAL_RESERSE", "TINGGI", f"Pola nama: {pattern}"

    return "", "BELUM_DAPAT_DIPASTIKAN", "Belum ada pola yang cukup kuat"


with SOURCE.open("r", encoding="utf-8-sig", newline="") as handle:
    rows = list(csv.DictReader(handle))

fields = [
    "id", "kode", "deskripsi", "tipe_satker", "source", "sub_domain", "operational_role",
    "keanggotaan_saat_ini", "fungsi_saat_ini",
    "keanggotaan_usulan", "fungsi_usulan",
    "keyakinan_keanggotaan", "keyakinan_fungsi", "dasar_inferensi",
]
proposals = []
function_counts = Counter()
confidence_counts = Counter()
function_reason_counts = Counter()
membership_injected = 0
function_injected = 0

for row in rows:
    membership_current = clean(row["keanggotaan"])
    if membership_current:
        membership_proposed = membership_current
        membership_confidence = "EXISTING"
        membership_reason = "Nilai keanggotaan sudah ada pada master"
    elif clean(row["kode"]).startswith("060"):
        membership_proposed = "INTERNAL_POLRI"
        membership_confidence = "TINGGI"
        membership_reason = "Bagian dari hierarki Satker Puskarda berkode 060; semua contoh existing adalah INTERNAL_POLRI"
        membership_injected += 1
    else:
        membership_proposed = ""
        membership_confidence = "BELUM_DAPAT_DIPASTIKAN"
        membership_reason = "Kode tidak mengikuti pola 060"

    function_proposed, function_confidence, function_reason = infer_function(row)
    function_counts[function_proposed or "(KOSONG)"] += 1
    confidence_counts[function_confidence] += 1
    function_reason_counts[function_reason] += 1
    if not clean(row["fungsi"]) and function_proposed:
        function_injected += 1

    proposals.append({
        "id": clean(row["id"]),
        "kode": clean(row["kode"]),
        "deskripsi": clean(row["deskripsi"]),
        "tipe_satker": clean(row["tipe_satker"]),
        "source": clean(row["source"]),
        "sub_domain": clean(row["sub_domain"]),
        "operational_role": clean(row["operational_role"]),
        "keanggotaan_saat_ini": membership_current,
        "fungsi_saat_ini": clean(row["fungsi"]),
        "keanggotaan_usulan": membership_proposed,
        "fungsi_usulan": function_proposed,
        "keyakinan_keanggotaan": membership_confidence,
        "keyakinan_fungsi": function_confidence,
        "dasar_inferensi": f"Polri: {membership_reason}; Reserse: {function_reason}",
    })

with OUTPUT.open("w", encoding="utf-8-sig", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    writer.writerows(proposals)

report = {
    "rows": len(rows),
    "membership_injected": membership_injected,
    "function_injected": function_injected,
    "function_effective_counts": dict(function_counts),
    "function_confidence_counts": dict(confidence_counts),
    "function_reason_counts": dict(function_reason_counts.most_common()),
    "function_still_blank": function_counts["(KOSONG)"],
    "function_not_applicable": confidence_counts["TIDAK_BERLAKU"],
    "function_requires_confirmation": confidence_counts["BELUM_DAPAT_DIPASTIKAN"],
}
REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
injection_map = {
    row["id"]: {
        "keanggotaan_saat_ini": row["keanggotaan_saat_ini"],
        "fungsi_saat_ini": row["fungsi_saat_ini"],
        "keanggotaan_usulan": row["keanggotaan_usulan"],
        "fungsi_usulan": row["fungsi_usulan"],
        "keyakinan_keanggotaan": row["keyakinan_keanggotaan"],
        "keyakinan_fungsi": row["keyakinan_fungsi"],
        "dasar_inferensi": row["dasar_inferensi"],
    }
    for row in proposals
}
INJECTION_MAP.write_text(json.dumps(injection_map, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
