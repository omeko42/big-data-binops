import json
import re
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\outputs\019fe01d-d395-7bd1-91da-86a66500c3bd")
V2 = ROOT / "master_satker_puskarda_V2_injeksi.xlsx"
V3 = ROOT / "master_satker_puskarda_V3_kinerja_role.xlsx"
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
        return shared_strings[int(value.text)] if cell_type == "s" else value.text
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.iterfind(".//m:t", NS))
    return ""


def read_workbook(path):
    with zipfile.ZipFile(path) as zf:
        workbook = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        targets = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("p:Relationship", NS)}
        shared_strings = []
        if "xl/sharedStrings.xml" in zf.namelist():
            shared = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for item in shared.findall("m:si", NS):
                shared_strings.append("".join(node.text or "" for node in item.iterfind(".//m:t", NS)))

        sheets = workbook.findall("m:sheets/m:sheet", NS)
        sheet_names = [sheet.attrib["name"] for sheet in sheets]
        sheet = sheets[0]
        target = targets[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
        entry = target if target.startswith("xl/") else f"xl/{target}"
        root = ET.fromstring(zf.read(entry))
        parsed_rows = []
        style_rows = []
        max_column = 0
        for row in root.findall("m:sheetData/m:row", NS)[1:]:
            values = [""] * 34
            styles = [0] * 34
            for cell in row.findall("m:c", NS):
                index = column_index(cell.attrib["r"])
                max_column = max(max_column, index)
                if index < 34:
                    values[index] = decode_cell(cell, shared_strings)
                    styles[index] = int(cell.attrib.get("s", "0"))
            parsed_rows.append(tuple(values))
            style_rows.append(tuple(styles))

        style_root = ET.fromstring(zf.read("xl/styles.xml"))
        font_colors = []
        for font in style_root.findall("m:fonts/m:font", NS):
            color = font.find("m:color", NS)
            font_colors.append(dict(color.attrib) if color is not None else {})
        style_font_ids = [int(xf.attrib.get("fontId", "0")) for xf in style_root.findall("m:cellXfs/m:xf", NS)]

        formula_errors = []
        for xml_entry in zf.namelist():
            if not xml_entry.endswith(".xml"):
                continue
            payload = zf.read(xml_entry)
            for marker in (b"#REF!", b"#DIV/0!", b"#VALUE!", b"#NAME?", b"#N/A"):
                if marker in payload:
                    formula_errors.append((xml_entry, marker.decode("ascii")))

    return {
        "rows": parsed_rows,
        "styles": style_rows,
        "sheet_names": sheet_names,
        "max_columns": max_column + 1,
        "font_colors": font_colors,
        "style_font_ids": style_font_ids,
        "formula_errors": formula_errors,
    }


def color_of(book, row_index, column_index_value):
    style_id = book["styles"][row_index][column_index_value]
    font_id = book["style_font_ids"][style_id]
    return book["font_colors"][font_id]


v2 = read_workbook(V2)
v3 = read_workbook(V3)
assert v2["sheet_names"] == v3["sheet_names"] == ["Master Satker"]
assert len(v2["rows"]) == len(v3["rows"]) == 13866
assert v2["max_columns"] == v3["max_columns"] == 34
assert not v3["formula_errors"]

changed_z = []
changed_ae = []
for index, (before, after) in enumerate(zip(v2["rows"], v3["rows"])):
    assert before[0] == after[0]
    for column in range(34):
        if column not in {25, 30}:
            assert before[column] == after[column], (index + 2, column + 1)
    if before[25] != after[25]:
        changed_z.append(index)
    if before[30] != after[30]:
        changed_ae.append(index)

kinerja = Counter(row[25] or "(KOSONG)" for row in v3["rows"])
fungsi = Counter(row[24] or "(KOSONG)" for row in v3["rows"])
roles = Counter(row[30] or "(KOSONG)" for row in v3["rows"])
assert kinerja == {"f": 7829, "t": 6037}
assert fungsi == {"(KOSONG)": 5692, "INTERNAL_RESERSE": 6037, "EKSTERNAL_RESERSE": 2137}
assert roles == {
    "(KOSONG)": 5692, "DITRES": 161, "SATRES": 5876, "SATLANTAS": 540,
    "SATPOLAIR": 486, "SATSAMAPTA": 1063, "DITPOLAIR": 39, "DENSUS88": 9,
}
for row in v3["rows"]:
    assert row[25] == ("t" if row[24] == "INTERNAL_RESERSE" else "f")
    assert bool(row[30]) == bool(row[24])
for before, after in zip(v2["rows"], v3["rows"]):
    if before[30]:
        assert before[30] == after[30]

assert len(changed_z) == 6756
assert len(changed_ae) == 7537
assert all(color_of(v3, i, 25).get("rgb", "").endswith("1D4ED8") for i in changed_z)
assert all(color_of(v3, i, 30).get("rgb", "").endswith("1D4ED8") for i in changed_ae)

print(json.dumps({
    "file": str(V3),
    "rows": len(v3["rows"]),
    "columns": v3["max_columns"],
    "sheets": v3["sheet_names"],
    "kinerja_aktif": dict(kinerja),
    "operational_role": dict(roles),
    "changed_kinerja_cells": len(changed_z),
    "injected_operational_role_cells": len(changed_ae),
    "existing_roles_preserved": True,
    "only_columns_changed": ["kinerja_aktif", "operational_role"],
    "changed_cells_blue": True,
    "formula_errors": 0,
}, ensure_ascii=False, indent=2))
