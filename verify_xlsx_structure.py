import json
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


XLSX = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\outputs\019fe01d-d395-7bd1-91da-86a66500c3bd\master_satker_puskarda_mirror.xlsx")
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}


with zipfile.ZipFile(XLSX) as zf:
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

    results = []
    injection_checks = {}
    for sheet in workbook.findall("m:sheets/m:sheet", NS):
        name = sheet.attrib["name"]
        target = targets[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
        entry = target if target.startswith("xl/") else f"xl/{target}"
        xml = zf.read(entry)
        root = ET.fromstring(xml)
        dimension = root.find("m:dimension", NS)
        rows = root.findall("m:sheetData/m:row", NS)
        formulas = root.findall(".//m:f", NS)
        validations = root.findall(".//m:dataValidation", NS)
        first_cell = root.find("m:sheetData/m:row/m:c", NS)
        first_value = None
        if first_cell is not None:
            cell_type = first_cell.attrib.get("t")
            value = first_cell.find("m:v", NS)
            if value is not None:
                first_value = value.text
                if cell_type == "s" and first_value is not None:
                    first_value = shared_strings[int(first_value)]
            elif cell_type == "inlineStr":
                first_value = "".join(node.text or "" for node in first_cell.iterfind(".//m:t", NS))

        if name == "Repair Queue":
            for row_number, label in ((2, "polsek_container"), (3, "functional_unit"), (4, "polri_root")):
                target_row = root.find(f"m:sheetData/m:row[@r='{row_number}']", NS)
                decoded = {}
                for cell in target_row.findall("m:c", NS):
                    ref = cell.attrib["r"]
                    cell_type = cell.attrib.get("t")
                    value = cell.find("m:v", NS)
                    text_value = ""
                    if value is not None and value.text is not None:
                        text_value = value.text
                        if cell_type == "s":
                            text_value = shared_strings[int(text_value)]
                    elif cell_type == "inlineStr":
                        text_value = "".join(node.text or "" for node in cell.iterfind(".//m:t", NS))
                    decoded[ref] = text_value
                injection_checks[label] = decoded
        results.append({
            "sheet": name,
            "dimension": dimension.attrib.get("ref") if dimension is not None else None,
            "physical_rows": len(rows),
            "formula_count": len(formulas),
            "data_validation_count": len(validations),
            "first_cell": first_value,
        })

    errors = []
    for entry in zf.namelist():
        if not entry.endswith(".xml"):
            continue
        payload = zf.read(entry)
        for marker in (b"#REF!", b"#DIV/0!", b"#VALUE!", b"#NAME?", b"#N/A"):
            if marker in payload:
                errors.append({"entry": entry, "marker": marker.decode("ascii")})

report = {
    "path": str(XLSX),
    "size_bytes": XLSX.stat().st_size,
    "sheets": results,
    "formula_errors": errors,
    "injection_checks": injection_checks,
}
print(json.dumps(report, ensure_ascii=False, indent=2))

expected = {
    "Master Raw": (13867, "id"),
    "Repair Queue": (13855, "id"),
    "Ringkasan": (20, "MASTER SATKER PUSKARDA — MIRROR & ANALISIS LOKAL"),
    "Analisis Kelengkapan": (35, "Elemen data"),
    "Referensi": (11, "REFERENSI ELEMEN KLASIFIKASI"),
    "Analisis Injeksi": (17, "HASIL INJEKSI KLASIFIKASI LOKAL"),
}
assert not errors, errors
assert len(results) == 6, results
for item in results:
    exp_rows, exp_first = expected[item["sheet"]]
    assert item["physical_rows"] == exp_rows, item
    assert item["first_cell"] == exp_first, item
assert next(item for item in results if item["sheet"] == "Repair Queue")["data_validation_count"] == 3
assert injection_checks["polsek_container"]["P2"] == "INTERNAL_POLRI"
assert injection_checks["polsek_container"].get("Q2", "") == ""
assert injection_checks["polsek_container"]["T2"] == "SIAP"
assert injection_checks["polsek_container"]["W2"] == "TIDAK_BERLAKU"
assert injection_checks["functional_unit"]["P3"] == "INTERNAL_POLRI"
assert injection_checks["functional_unit"]["Q3"] == "INTERNAL_RESERSE"
assert injection_checks["functional_unit"]["T3"] == "SIAP"
assert injection_checks["polri_root"]["P4"] == "INTERNAL_POLRI"
assert injection_checks["polri_root"].get("Q4", "") == ""
assert injection_checks["polri_root"]["T4"] == "SIAP"
assert injection_checks["polri_root"]["W4"] == "TIDAK_BERLAKU"
