import json
import re
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET


SOURCE = Path(r"C:\Users\KOKO98\Downloads\template-import-satker-eksternal.xlsx")
OUTPUT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\outputs\019fe01d-d395-7bd1-91da-86a66500c3bd\template-import-satker-eksternal_V2_ojk_dan_organisasi_penyidik.xlsx")
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def col_index(ref):
    letters = re.match(r"[A-Z]+", ref).group(0)
    value = 0
    for letter in letters:
        value = value * 26 + ord(letter) - 64
    return value - 1


def decode(cell, shared_strings):
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
        sheets = {}
        for sheet in workbook.findall("m:sheets/m:sheet", NS):
            name = sheet.attrib["name"]
            target = targets[sheet.attrib[f"{{{NS['r']}}}id"]].lstrip("/")
            entry = target if target.startswith("xl/") else f"xl/{target}"
            sheet_xml = ET.fromstring(zf.read(entry))
            rows = []
            max_col = 0
            for row in sheet_xml.findall("m:sheetData/m:row", NS):
                values = [""] * 4
                for cell in row.findall("m:c", NS):
                    index = col_index(cell.attrib["r"])
                    max_col = max(max_col, index)
                    if index < 4:
                        values[index] = decode(cell, shared_strings)
                rows.append(tuple(values))
            sheets[name] = {"rows": rows, "columns": max_col + 1}
        table_ranges = []
        for entry in zf.namelist():
            if entry.startswith("xl/tables/table") and entry.endswith(".xml"):
                table = ET.fromstring(zf.read(entry))
                table_ranges.append(table.attrib["ref"])
        formula_errors = []
        for entry in zf.namelist():
            if entry.endswith(".xml"):
                payload = zf.read(entry)
                for marker in (b"#REF!", b"#DIV/0!", b"#VALUE!", b"#NAME?", b"#N/A"):
                    if marker in payload:
                        formula_errors.append((entry, marker.decode("ascii")))
    return sheets, sorted(table_ranges), formula_errors


source, source_tables, source_errors = read_xlsx(SOURCE)
output, output_tables, output_errors = read_xlsx(OUTPUT)
assert list(output) == ["Data Satker Eksternal", "Petunjuk"]
assert not source_errors and not output_errors
assert output["Data Satker Eksternal"]["columns"] == 4
assert output["Petunjuk"]["rows"][:5] == source["Petunjuk"]["rows"][:5]
assert output["Petunjuk"]["rows"][6] == source["Petunjuk"]["rows"][6]
assert len(output["Data Satker Eksternal"]["rows"]) == 6514
assert output_tables == ["A1:B7", "A1:D6514"]

rows = output["Data Satker Eksternal"]["rows"]
assert rows[0] == ("ID (kosongkan utk baru)", "Nama", "Alamat", "Keterangan")
data = rows[1:]
assert all(not row[0] for row in data)
assert all(row[1] for row in data)
assert all((not row[2]) or row[1].startswith("Kantor OJK") for row in data)
assert all(row[3] for row in data)
names = [row[1] for row in data]
assert len(names) == len(set(names)) == 6513

counts = Counter()
for row, name in zip(data, names):
    if "Kelompok: Instansi pusat" in row[3]:
        counts["pusat"] += 1
    elif "Kelompok: Organisasi pusat dengan fungsi penyidikan sektoral" in row[3]:
        counts["organisasi_penyidikan_pusat_tambahan"] += 1
    elif "Kelompok: Kantor OJK" in row[3]:
        counts["kantor_ojk"] += 1
    elif "Kelompok: Kantor Wilayah DJP" in row[3]:
        counts["kanwil_djp"] += 1
    elif name.startswith("Badan Narkotika Nasional Provinsi (BNNP) - "):
        counts["bnnp"] += 1
    elif name.startswith("Kejaksaan Tinggi (Kejati) - "):
        counts["kejati"] += 1
    elif name.startswith("Pengadilan Tinggi - "):
        counts["pengadilan_tinggi"] += 1
    elif name.startswith("Badan Intelijen Negara Daerah (BINDA) - "):
        counts["binda"] += 1
    elif name.startswith("BPKP Perwakilan - "):
        counts["bpkp"] += 1
    elif name.startswith("Ombudsman Republik Indonesia Perwakilan - "):
        counts["ombudsman"] += 1
    elif name.startswith("Dinas Lingkungan Hidup dan Kebersihan (DLHK) - "):
        counts["dlhk"] += 1
    elif name.startswith("Kejaksaan Negeri (Kejari) - "):
        counts["kejaksaan_negeri"] += 1
    elif name.startswith("Badan Narkotika Nasional Kabupaten/Kota (BNNK) - "):
        counts["bnnk"] += 1
    elif name.startswith("Pengadilan Negeri - "):
        counts["pengadilan_negeri"] += 1
    elif name.startswith("Kantor Pengawasan dan Pelayanan Bea dan Cukai (KPPBC) - "):
        counts["bea_cukai"] += 1
    elif name.startswith("Kantor Imigrasi - "):
        counts["imigrasi"] += 1
    elif name.startswith("Satuan Polisi Pamong Praja (Satpol PP) - "):
        counts["satpol_pp"] += 1
    elif name.startswith("Dinas Perhubungan (Dishub) - "):
        counts["dishub"] += 1
    elif name.startswith("Badan Penanggulangan Bencana Daerah (BPBD) - "):
        counts["bpbd"] += 1
    elif name.startswith("Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) - "):
        counts["disdukcapil"] += 1
    elif name.startswith("Badan Kesatuan Bangsa dan Politik (Bakesbangpol) - "):
        counts["bakesbangpol"] += 1
    elif name.startswith("Kantor Pertanahan (BPN) - "):
        counts["bpn"] += 1
    else:
        raise AssertionError(name)
assert counts == {
    "pusat": 17,
    "organisasi_penyidikan_pusat_tambahan": 28,
    "kantor_ojk": 39,
    "kanwil_djp": 34,
    "bnnp": 38,
    "kejati": 38,
    "pengadilan_tinggi": 38,
    "binda": 38,
    "bpkp": 38,
    "ombudsman": 38,
    "dlhk": 513,
    "kejaksaan_negeri": 514,
    "bnnk": 514,
    "pengadilan_negeri": 514,
    "bea_cukai": 514,
    "imigrasi": 514,
    "satpol_pp": 514,
    "dishub": 514,
    "bpbd": 514,
    "disdukcapil": 514,
    "bakesbangpol": 514,
    "bpn": 514,
}
assert not any("Kajati" in name for name in names)
assert sum(name.startswith("Kejaksaan Tinggi (Kejati) - ") for name in names) == 38
assert sum(name.startswith("Kejaksaan Negeri (Kejari) - ") for name in names) == 514
assert "Otoritas Jasa Keuangan (OJK)" in names
assert sum(name.startswith("Kantor OJK") for name in names) == 39
assert sum(name.startswith("Kanwil DJP") for name in names) == 34
assert "Badan Pengawas Tenaga Nuklir (BAPETEN)" not in names

excluded = "Dinas Lingkungan Hidup dan Kebersihan (DLHK) - Kabupaten Sidoarjo"
assert excluded not in names
assert "Kejaksaan Negeri (Kejari) - Kabupaten Sidoarjo" in names
assert "Badan Narkotika Nasional Kabupaten/Kota (BNNK) - Kabupaten Sidoarjo" in names
assert "Kantor Pengawasan dan Pelayanan Bea dan Cukai (KPPBC) - Kabupaten Sidoarjo" in names
assert "Badan Narkotika Nasional Provinsi (BNNP) - Papua Barat Daya" in names

print(json.dumps({
    "file": str(OUTPUT),
    "sheets": list(output),
    "import_rows": len(data),
    "columns": 4,
    "counts": dict(counts),
    "id_all_blank": True,
    "addresses_filled_for_ojk_offices": sum(bool(row[2]) for row in data) == 39,
    "names_unique": True,
    "excluded_existing_dlhk_sidoarjo": True,
    "petunjuk_preserved": True,
    "table_ranges": output_tables,
    "formula_errors": 0,
}, ensure_ascii=False, indent=2))
