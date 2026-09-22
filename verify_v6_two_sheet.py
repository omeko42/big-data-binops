import csv
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\outputs\019fe01d-d395-7bd1-91da-86a66500c3bd")
V4 = ROOT / "master_satker_puskarda_V4_subdomain_pbd.xlsx"
V5CSV = ROOT / "master_satker_puskarda_V5_final_utf8.csv"
V6 = ROOT / "master_satker_puskarda_V6_V4_dan_CSV.xlsx"
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


def read_xlsx(path):
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
        result = {}
        for sheet in workbook.findall("m:sheets/m:sheet", NS):
            name = sheet.attrib["name"]
            target = targets[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
            entry = target if target.startswith("xl/") else f"xl/{target}"
            sheet_xml = ET.fromstring(zf.read(entry))
            rows = []
            max_column = 0
            for row in sheet_xml.findall("m:sheetData/m:row", NS):
                values = [""] * 34
                for cell in row.findall("m:c", NS):
                    index = column_index(cell.attrib["r"])
                    max_column = max(max_column, index)
                    if index < 34:
                        values[index] = decode_cell(cell, shared_strings)
                rows.append(tuple(values))
            result[name] = {"rows": rows, "columns": max_column + 1}
        formula_errors = []
        for entry in zf.namelist():
            if entry.endswith(".xml"):
                payload = zf.read(entry)
                for marker in (b"#REF!", b"#DIV/0!", b"#VALUE!", b"#NAME?", b"#N/A"):
                    if marker in payload:
                        formula_errors.append((entry, marker.decode("ascii")))
    return result, formula_errors


v4, v4_errors = read_xlsx(V4)
v6, v6_errors = read_xlsx(V6)
assert list(v4) == ["Master Satker"]
assert list(v6) == ["V4", "CSV"]
assert not v4_errors and not v6_errors
assert v6["V4"]["columns"] == v6["CSV"]["columns"] == 34
assert len(v6["V4"]["rows"]) == len(v6["CSV"]["rows"]) == 13867
assert v6["V4"]["rows"] == v4["Master Satker"]["rows"]

with V5CSV.open("r", encoding="utf-8-sig", newline="") as handle:
    csv_rows = [tuple(row) for row in csv.reader(handle)]
assert len(csv_rows) == 13867
assert v6["CSV"]["rows"] == csv_rows

headers = v6["CSV"]["rows"][0]
index = {name: position for position, name in enumerate(headers)}
root = next(row for row in v6["CSV"]["rows"][1:] if row[index["id"]] == "1")
assert root[index["kode"]] == "060"
assert root[index["kode_canonical"]] == "060"
assert all(row[index["kode"]].startswith("0") for row in v6["CSV"]["rows"][1:])
assert all(row[index["kode_canonical"]].startswith("0") for row in v6["CSV"]["rows"][1:])
assert all(not row[index["dors_kode"]] or row[index["dors_kode"]].startswith("0") for row in v6["CSV"]["rows"][1:])

print(json.dumps({
    "file": str(V6),
    "sheets": list(v6),
    "rows_per_sheet": 13866,
    "columns_per_sheet": 34,
    "v4_sheet_identical_to_v4_source": True,
    "csv_sheet_identical_to_v5_csv": True,
    "root_kode": root[index["kode"]],
    "root_kode_canonical": root[index["kode_canonical"]],
    "leading_zero_preserved": True,
    "formula_errors": 0,
}, ensure_ascii=False, indent=2))
