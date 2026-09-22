import json
import re
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\outputs\019fe01d-d395-7bd1-91da-86a66500c3bd")
V1 = ROOT / "master_satker_puskarda_V1_asli.xlsx"
V2 = ROOT / "master_satker_puskarda_V2_injeksi.xlsx"
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def column_index(ref):
    letters = re.match(r"[A-Z]+", ref).group(0)
    result = 0
    for letter in letters:
        result = result * 26 + ord(letter) - 64
    return result - 1


def decode_cell(cell, shared_strings):
    cell_type = cell.attrib.get("t")
    value = cell.find("m:v", NS)
    if value is not None and value.text is not None:
        text = value.text
        if cell_type == "s":
            return shared_strings[int(text)]
        return text
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.iterfind(".//m:t", NS))
    return ""


def read_workbook(path):
    with zipfile.ZipFile(path) as zf:
        workbook = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        targets = {
            rel.attrib["Id"]: rel.attrib["Target"]
            for rel in rels.findall("p:Relationship", NS)
        }
        shared_strings = []
        if "xl/sharedStrings.xml" in zf.namelist():
            shared = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for item in shared.findall("m:si", NS):
                shared_strings.append("".join(node.text or "" for node in item.iterfind(".//m:t", NS)))

        sheets = {}
        sheet_stats = []
        for sheet in workbook.findall("m:sheets/m:sheet", NS):
            name = sheet.attrib["name"]
            target = targets[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
            entry = target if target.startswith("xl/") else f"xl/{target}"
            root = ET.fromstring(zf.read(entry))
            sheets[name] = root
            rows = root.findall("m:sheetData/m:row", NS)
            first = root.find("m:sheetData/m:row/m:c", NS)
            sheet_stats.append({
                "name": name,
                "rows": len(rows),
                "formulas": len(root.findall(".//m:f", NS)),
                "validations": len(root.findall(".//m:dataValidation", NS)),
                "first_cell": decode_cell(first, shared_strings) if first is not None else None,
            })

        master_sheet_name = "Master Satker" if "Master Satker" in sheets else "Master Raw"
        master_rows = []
        max_column_index = 0
        for row in sheets[master_sheet_name].findall("m:sheetData/m:row", NS)[1:]:
            values = [""] * 34
            for cell in row.findall("m:c", NS):
                index = column_index(cell.attrib["r"])
                max_column_index = max(max_column_index, index)
                if index < 34:
                    values[index] = decode_cell(cell, shared_strings)
            master_rows.append(tuple(values))

        formula_errors = []
        for entry in zf.namelist():
            if not entry.endswith(".xml"):
                continue
            payload = zf.read(entry)
            for marker in (b"#REF!", b"#DIV/0!", b"#VALUE!", b"#NAME?", b"#N/A"):
                if marker in payload:
                    formula_errors.append({"entry": entry, "marker": marker.decode("ascii")})

    membership = Counter(row[23] or "(KOSONG)" for row in master_rows)
    function = Counter(row[24] or "(KOSONG)" for row in master_rows)
    dors_blank = [row for row in master_rows if not row[26]]
    blank_function = [row for row in master_rows if not row[24]]
    allowed_blank_function = [
        row for row in blank_function
        if row[0] == "1"
        or row[32] in {"POLDA", "POLRES", "POLSEK"}
        or re.match(r"^(POLDA|POLRES|POLRESTA|POLRESTABES|POLSEK)\b", row[3].upper())
    ]
    root = next(row for row in master_rows if row[0] == "1")

    return {
        "path": str(path),
        "size_bytes": path.stat().st_size,
        "sheet_stats": sheet_stats,
        "master_rows": master_rows,
        "row_count": len(master_rows),
        "max_column_count": max_column_index + 1,
        "membership": dict(membership),
        "function": dict(function),
        "dors_blank_count": len(dors_blank),
        "dors_blank_internal_polri": sum(row[23] == "INTERNAL_POLRI" for row in dors_blank),
        "dors_blank_function_classified": sum(bool(row[24]) for row in dors_blank),
        "blank_function_count": len(blank_function),
        "allowed_blank_function_count": len(allowed_blank_function),
        "root": {"id": root[0], "kode": root[1], "nama": root[3], "keanggotaan": root[23], "fungsi": root[24]},
        "formula_errors": formula_errors,
    }


v1 = read_workbook(V1)
v2 = read_workbook(V2)

assert v1["row_count"] == 13866
assert v2["row_count"] == 13866
assert [item["name"] for item in v1["sheet_stats"]] == ["Master Satker"]
assert [item["name"] for item in v2["sheet_stats"]] == ["Master Satker"]
assert v1["max_column_count"] == 34
assert v2["max_column_count"] == 34
assert not v1["formula_errors"]
assert not v2["formula_errors"]
assert v1["membership"] == {"(KOSONG)": 13852, "INTERNAL_POLRI": 14}
assert v1["function"] == {"(KOSONG)": 13854, "INTERNAL_RESERSE": 8, "EKSTERNAL_RESERSE": 4}
assert v2["membership"] == {"INTERNAL_POLRI": 13866}
assert v2["function"] == {"(KOSONG)": 5692, "INTERNAL_RESERSE": 6037, "EKSTERNAL_RESERSE": 2137}
assert v2["dors_blank_count"] == 9429
assert v2["dors_blank_internal_polri"] == 9429
assert v2["blank_function_count"] == v2["allowed_blank_function_count"] == 5692
assert v2["root"]["keanggotaan"] == "INTERNAL_POLRI"
assert v2["root"]["fungsi"] == ""

changed_membership = 0
changed_function = 0
for original, injected in zip(v1["master_rows"], v2["master_rows"]):
    assert original[0] == injected[0]
    assert original[:23] == injected[:23]
    assert original[25:] == injected[25:]
    changed_membership += original[23] != injected[23]
    changed_function += original[24] != injected[24]
assert changed_membership == 13852
assert changed_function == 8162

report = {
    "V1": {key: value for key, value in v1.items() if key != "master_rows"},
    "V2": {key: value for key, value in v2.items() if key != "master_rows"},
    "comparison": {
        "changed_membership_cells": changed_membership,
        "changed_function_cells": changed_function,
        "all_non_classification_columns_identical": True,
    },
}
print(json.dumps(report, ensure_ascii=False, indent=2))
