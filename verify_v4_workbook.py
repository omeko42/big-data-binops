import json
import re
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\outputs\019fe01d-d395-7bd1-91da-86a66500c3bd")
V3 = ROOT / "master_satker_puskarda_V3_kinerja_role.xlsx"
V4 = ROOT / "master_satker_puskarda_V4_subdomain_pbd.xlsx"
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def column_index(ref):
    letters = re.match(r"[A-Z]+", ref).group(0)
    value = 0
    for letter in letters:
        value = value * 26 + ord(letter) - 64
    return value - 1


def decode_cell(cell, shared_strings):
    cell_type = cell.attrib.get("t")
    value = cell.find("m:v", NS)
    if value is not None and value.text is not None:
        return shared_strings[int(value.text)] if cell_type == "s" else value.text
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.iterfind(".//m:t", NS))
    return ""


def read_book(path):
    with zipfile.ZipFile(path) as zf:
        workbook = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        targets = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("p:Relationship", NS)}
        shared_strings = []
        if "xl/sharedStrings.xml" in zf.namelist():
            shared = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            shared_strings = [
                "".join(node.text or "" for node in item.iterfind(".//m:t", NS))
                for item in shared.findall("m:si", NS)
            ]
        sheets = workbook.findall("m:sheets/m:sheet", NS)
        sheet_names = [sheet.attrib["name"] for sheet in sheets]
        target = targets[sheets[0].attrib[f"{{{NS['r']}}}id"]].lstrip("/")
        entry = target if target.startswith("xl/") else f"xl/{target}"
        sheet_xml = ET.fromstring(zf.read(entry))
        rows, styles = [], []
        max_column = 0
        for row in sheet_xml.findall("m:sheetData/m:row", NS)[1:]:
            values = [""] * 34
            row_styles = [0] * 34
            for cell in row.findall("m:c", NS):
                index = column_index(cell.attrib["r"])
                max_column = max(max_column, index)
                if index < 34:
                    values[index] = decode_cell(cell, shared_strings)
                    row_styles[index] = int(cell.attrib.get("s", "0"))
            rows.append(tuple(values))
            styles.append(tuple(row_styles))
        style_root = ET.fromstring(zf.read("xl/styles.xml"))
        font_colors = []
        for font in style_root.findall("m:fonts/m:font", NS):
            color = font.find("m:color", NS)
            font_colors.append(dict(color.attrib) if color is not None else {})
        style_font_ids = [int(xf.attrib.get("fontId", "0")) for xf in style_root.findall("m:cellXfs/m:xf", NS)]
        errors = []
        for xml_entry in zf.namelist():
            if xml_entry.endswith(".xml"):
                payload = zf.read(xml_entry)
                for marker in (b"#REF!", b"#DIV/0!", b"#VALUE!", b"#NAME?", b"#N/A"):
                    if marker in payload:
                        errors.append((xml_entry, marker.decode("ascii")))
    return {
        "rows": rows, "styles": styles, "sheet_names": sheet_names,
        "max_columns": max_column + 1, "font_colors": font_colors,
        "style_font_ids": style_font_ids, "errors": errors,
    }


def color_of(book, row_index, column_index_value):
    style_id = book["styles"][row_index][column_index_value]
    font_id = book["style_font_ids"][style_id]
    return book["font_colors"][font_id]


v3 = read_book(V3)
v4 = read_book(V4)
assert v3["sheet_names"] == v4["sheet_names"] == ["Master Satker"]
assert len(v3["rows"]) == len(v4["rows"]) == 13866
assert v3["max_columns"] == v4["max_columns"] == 34
assert not v4["errors"]

changed_c, changed_ad = [], []
for index, (before, after) in enumerate(zip(v3["rows"], v4["rows"])):
    assert before[0] == after[0]
    for column in range(34):
        if column not in {2, 29}:
            assert before[column] == after[column], (index + 2, column + 1)
    if before[2] != after[2]:
        changed_c.append(index)
    if before[29] != after[29]:
        changed_ad.append(index)

assert len(changed_c) == 61
assert len(changed_ad) == 7533
assert all(color_of(v4, i, 2).get("rgb", "").endswith("1D4ED8") for i in changed_c)
assert all(color_of(v4, i, 29).get("rgb", "").endswith("1D4ED8") for i in changed_ad)
for before, after in zip(v3["rows"], v4["rows"]):
    if before[29]:
        assert before[29] == after[29]

subdomains = Counter(row[29] or "(KOSONG)" for row in v4["rows"])
assert subdomains == {"INTERNAL RESERSE": 9833, "EKSTERNAL RESERSE": 2137, "(KOSONG)": 1896}
canonical = [row[2] for row in v4["rows"] if row[2]]
assert len(canonical) == len(set(canonical))

pbd_prefix_counts = Counter()
for row in v4["rows"]:
    for prefix in [f"060.01.36.{value}" for value in range(101, 107)]:
        if row[2] == prefix or row[2].startswith(prefix + "."):
            pbd_prefix_counts[prefix] += 1
assert pbd_prefix_counts == {
    "060.01.36.101": 21,
    "060.01.36.102": 15,
    "060.01.36.103": 14,
    "060.01.36.104": 14,
    "060.01.36.105": 3,
    "060.01.36.106": 3,
}
for old_prefix in ["060.01.33.06", "060.01.33.07", "060.01.33.08", "060.01.33.09", "060.01.36.01", "060.01.36.06", "060.01.36.27", "060.01.36.28"]:
    assert not any(code == old_prefix or code.startswith(old_prefix + ".") for code in canonical)

print(json.dumps({
    "file": str(V4),
    "rows": len(v4["rows"]),
    "columns": v4["max_columns"],
    "sheets": v4["sheet_names"],
    "sub_domain": dict(subdomains),
    "sub_domain_injected": len(changed_ad),
    "kode_canonical_changed": len(changed_c),
    "pbd_prefix_counts": dict(pbd_prefix_counts),
    "canonical_duplicates": 0,
    "only_columns_changed": ["kode_canonical", "sub_domain"],
    "changed_cells_blue": True,
    "formula_errors": 0,
}, ensure_ascii=False, indent=2))
