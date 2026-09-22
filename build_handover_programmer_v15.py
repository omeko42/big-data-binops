from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE
from pathlib import Path


OUT = Path(r"D:\Prototype CAS\EDIT MASTER MASAL\Handover_Teknis_CAS_Programmer_v1.5_20260812.docx")

BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
INK = "0B2545"
GRAY = "5B6573"
LIGHT_GRAY = "F2F4F7"
BLUE_GRAY = "E8EEF5"
CALLOUT = "F4F6F9"
GREEN = "1F6F43"
GOLD = "7A5A00"
RED = "9B1C1C"
WHITE = "FFFFFF"
BLACK = "000000"


def set_run_font(run, name="Calibri", size=11, color=BLACK, bold=None, italic=None):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for tag, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{tag}"))
        if node is None:
            node = OxmlElement(f"w:{tag}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_cell_width(cell, width_dxa):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(width_dxa))
    tc_w.set(qn("w:type"), "dxa")


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_table_geometry(table, widths_dxa, indent_dxa=120):
    total = sum(widths_dxa)
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr
    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(total))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), str(indent_dxa))
    tbl_ind.set(qn("w:type"), "dxa")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths_dxa:
        col = OxmlElement("w:gridCol")
        col.set(qn("w:w"), str(width))
        grid.append(col)

    for row in table.rows:
        for idx, cell in enumerate(row.cells):
            set_cell_width(cell, widths_dxa[idx])
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def set_paragraph_shading(paragraph, fill, border_color=None):
    p_pr = paragraph._p.get_or_add_pPr()
    shd = p_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        p_pr.append(shd)
    shd.set(qn("w:fill"), fill)
    if border_color:
        p_bdr = p_pr.find(qn("w:pBdr"))
        if p_bdr is None:
            p_bdr = OxmlElement("w:pBdr")
            p_pr.append(p_bdr)
        left = OxmlElement("w:left")
        left.set(qn("w:val"), "single")
        left.set(qn("w:sz"), "18")
        left.set(qn("w:space"), "8")
        left.set(qn("w:color"), border_color)
        p_bdr.append(left)


def set_bottom_border(paragraph, color=BLUE, size=12):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = p_pr.find(qn("w:pBdr"))
    if p_bdr is None:
        p_bdr = OxmlElement("w:pBdr")
        p_pr.append(p_bdr)
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(size))
    bottom.set(qn("w:space"), "3")
    bottom.set(qn("w:color"), color)
    p_bdr.append(bottom)


def keep_with_next(paragraph):
    paragraph.paragraph_format.keep_with_next = True


def add_page_field(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("Halaman ")
    set_run_font(run, size=9, color=GRAY)
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr_text = OxmlElement("w:instrText")
    instr_text.set(qn("xml:space"), "preserve")
    instr_text.text = " PAGE "
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char1)
    run._r.append(instr_text)
    run._r.append(fld_char2)


def add_custom_numbering(doc, num_fmt, lvl_text, left=720, hanging=360):
    numbering = doc.part.numbering_part.element
    abstract_ids = [int(x.get(qn("w:abstractNumId"))) for x in numbering.findall(qn("w:abstractNum"))]
    num_ids = [int(x.get(qn("w:numId"))) for x in numbering.findall(qn("w:num"))]
    abstract_id = max(abstract_ids, default=0) + 1
    num_id = max(num_ids, default=0) + 1

    abstract = OxmlElement("w:abstractNum")
    abstract.set(qn("w:abstractNumId"), str(abstract_id))
    multi = OxmlElement("w:multiLevelType")
    multi.set(qn("w:val"), "singleLevel")
    abstract.append(multi)
    lvl = OxmlElement("w:lvl")
    lvl.set(qn("w:ilvl"), "0")
    start = OxmlElement("w:start")
    start.set(qn("w:val"), "1")
    lvl.append(start)
    fmt = OxmlElement("w:numFmt")
    fmt.set(qn("w:val"), num_fmt)
    lvl.append(fmt)
    text = OxmlElement("w:lvlText")
    text.set(qn("w:val"), lvl_text)
    lvl.append(text)
    jc = OxmlElement("w:lvlJc")
    jc.set(qn("w:val"), "left")
    lvl.append(jc)
    p_pr = OxmlElement("w:pPr")
    tabs = OxmlElement("w:tabs")
    tab = OxmlElement("w:tab")
    tab.set(qn("w:val"), "num")
    tab.set(qn("w:pos"), str(left))
    tabs.append(tab)
    p_pr.append(tabs)
    ind = OxmlElement("w:ind")
    ind.set(qn("w:left"), str(left))
    ind.set(qn("w:hanging"), str(hanging))
    p_pr.append(ind)
    lvl.append(p_pr)
    if num_fmt == "bullet":
        r_pr = OxmlElement("w:rPr")
        r_fonts = OxmlElement("w:rFonts")
        r_fonts.set(qn("w:ascii"), "Symbol")
        r_fonts.set(qn("w:hAnsi"), "Symbol")
        r_pr.append(r_fonts)
        lvl.append(r_pr)
    abstract.append(lvl)
    numbering.append(abstract)

    num = OxmlElement("w:num")
    num.set(qn("w:numId"), str(num_id))
    abs_id = OxmlElement("w:abstractNumId")
    abs_id.set(qn("w:val"), str(abstract_id))
    num.append(abs_id)
    numbering.append(num)
    return num_id


def apply_num(paragraph, num_id):
    p_pr = paragraph._p.get_or_add_pPr()
    num_pr = p_pr.find(qn("w:numPr"))
    if num_pr is None:
        num_pr = OxmlElement("w:numPr")
        p_pr.append(num_pr)
    ilvl = OxmlElement("w:ilvl")
    ilvl.set(qn("w:val"), "0")
    num_id_el = OxmlElement("w:numId")
    num_id_el.set(qn("w:val"), str(num_id))
    num_pr.append(ilvl)
    num_pr.append(num_id_el)


def add_list_item(doc, text, num_id, bold_prefix=None):
    p = doc.add_paragraph()
    if isinstance(num_id, dict):
        p.paragraph_format.left_indent = Inches(0.34)
        p.paragraph_format.first_line_indent = Inches(-0.22)
        if num_id["kind"] == "bullet":
            prefix = "\u2022\u00a0 "
        else:
            num_id["counter"] += 1
            prefix = f"{num_id['counter']}.\u00a0 "
        prefix_run = p.add_run(prefix)
        set_run_font(prefix_run, bold=num_id["kind"] == "number")
    else:
        apply_num(p, num_id)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.167
    if bold_prefix and text.startswith(bold_prefix):
        r1 = p.add_run(bold_prefix)
        set_run_font(r1, bold=True)
        r2 = p.add_run(text[len(bold_prefix):])
        set_run_font(r2)
    else:
        r = p.add_run(text)
        set_run_font(r)
    return p


def add_callout(doc, label, text, tone="info"):
    color = BLUE if tone == "info" else (GOLD if tone == "warn" else RED)
    fill = CALLOUT if tone == "info" else ("FFF8E8" if tone == "warn" else "FDECEC")
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.15)
    p.paragraph_format.right_indent = Inches(0.1)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(10)
    p.paragraph_format.line_spacing = 1.10
    set_paragraph_shading(p, fill, color)
    r1 = p.add_run(f"{label}: ")
    set_run_font(r1, bold=True, color=color)
    r2 = p.add_run(text)
    set_run_font(r2, color=INK)
    return p


def add_code_block(doc, lines):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.18)
    p.paragraph_format.right_indent = Inches(0.08)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.0
    set_paragraph_shading(p, "F7F8FA", "B7C2CF")
    for i, line in enumerate(lines):
        if i:
            p.add_run().add_break()
        r = p.add_run(line)
        set_run_font(r, name="Consolas", size=8.5, color=INK)
    return p


def add_table(doc, headers, rows, widths_dxa, font_size=9.2):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    for idx, header in enumerate(headers):
        cell = hdr.cells[idx]
        set_cell_shading(cell, LIGHT_GRAY)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(header)
        set_run_font(r, size=9.2, color=INK, bold=True)
    for row_data in rows:
        row = table.add_row()
        for idx, value in enumerate(row_data):
            cell = row.cells[idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(str(value))
            set_run_font(r, size=font_size, color=BLACK)
    set_table_geometry(table, widths_dxa)
    after = doc.add_paragraph()
    after.paragraph_format.space_before = Pt(0)
    after.paragraph_format.space_after = Pt(2)
    return table


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(1.0)
section.bottom_margin = Inches(1.0)
section.left_margin = Inches(1.0)
section.right_margin = Inches(1.0)
section.header_distance = Inches(0.492)
section.footer_distance = Inches(0.492)

# Preset: standard_business_brief. Header pattern: memo_masthead.
styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Calibri"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
normal.font.size = Pt(11)
normal.paragraph_format.space_before = Pt(0)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.10

for style_name, size, color, before, after in (
    ("Heading 1", 16, BLUE, 16, 8),
    ("Heading 2", 13, BLUE, 12, 6),
    ("Heading 3", 12, DARK_BLUE, 8, 4),
):
    st = styles[style_name]
    st.font.name = "Calibri"
    st._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    st._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    st.font.size = Pt(size)
    st.font.color.rgb = RGBColor.from_string(color)
    st.font.bold = True
    st.paragraph_format.space_before = Pt(before)
    st.paragraph_format.space_after = Pt(after)
    st.paragraph_format.keep_with_next = True

def new_bullet_list():
    return {"kind": "bullet", "counter": 0}


def new_numbered_list():
    return {"kind": "number", "counter": 0}

header = section.header
hp = header.paragraphs[0]
hp.paragraph_format.space_after = Pt(0)
hp.paragraph_format.tab_stops.add_tab_stop(Inches(6.5))
hr1 = hp.add_run("BIG DATA BINOPS - HANDOVER TEKNIS")
set_run_font(hr1, size=9, color=GRAY, bold=True)
hr2 = hp.add_run("\t12 Agustus 2026")
set_run_font(hr2, size=9, color=GRAY)

footer = section.footer
fp = footer.paragraphs[0]
add_page_field(fp)

# First-page memo masthead.
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(10)
p.paragraph_format.space_after = Pt(4)
r = p.add_run("HANDOVER TEKNIS DAN INSTRUKSI SINKRONISASI")
set_run_font(r, size=23, color=BLACK, bold=True)

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(14)
r = p.add_run("Koreksi Mapping dan Penempatan LP, Patch Aplikasi CAS, serta Requirement Kinerja Perkara")
set_run_font(r, size=14, color=GRAY, bold=False)

for label, value in (
    ("Ditujukan kepada", "Programmer / Tim Pengembang CAS - Big Data Binops"),
    ("Tanggal kondisi produksi", "12 Agustus 2026"),
    ("Lingkungan", "Database 10.0.0.x | Backend 10.0.0.x | Frontend 10.0.0.x"),
    ("Versi handover", "v1.5 - dokumen lokal berversi; versi v1.4 tetap dipertahankan sebagai snapshot"),
    ("Status", "Guard penempatan LP V4.1 aktif; koreksi dua LP DIT PPA Jawa Tengah sudah commit; backlog nasional lama masih perlu migrasi terkendali"),
):
    mp = doc.add_paragraph()
    mp.paragraph_format.space_after = Pt(2)
    lr = mp.add_run(f"{label}: ")
    set_run_font(lr, bold=True, color=INK)
    vr = mp.add_run(value)
    set_run_font(vr, color=BLACK)

rule = doc.add_paragraph()
rule.paragraph_format.space_before = Pt(8)
rule.paragraph_format.space_after = Pt(10)
set_bottom_border(rule, BLUE, 12)

add_callout(
    doc,
    "Pesan utama",
    "Jangan melakukan deployment dari source lama sebelum seluruh perubahan aktif pada dokumen ini dipindahkan ke repository resmi. Runtime produksi saat ini memuat hotfix yang belum seluruhnya berada pada repository resmi. Migrasi backlog LP lama juga tidak boleh dijalankan massal sebelum kandidat dibagi per kelompok, diverifikasi bebas pelimpahan, di-backup per baris, dan lolos dry-run.",
    "warn",
)

doc.add_heading("1. Ringkasan Eksekutif", level=1)
doc.add_paragraph(
    "Insiden awal terjadi karena kode DORS Papua Tengah (060.37) belum memiliki mapping lengkap sehingga LP masuk ke Papua Barat Daya. Setelah mapping dan data terdampak dikoreksi, audit diperluas ke penempatan LP nasional. Backend ditemukan dapat menahan LP pada parent Polda/Polres/Polsek walaupun unit DORS terbaca. Guard penempatan V4.1 kini aktif untuk LP baru: target harus merupakan satu anak langsung yang unik, kamar existing tidak ditimpa, LP berpelimpahan dikecualikan, dan jalur RESKRIM Polsek dijaga dengan cutoff ID 404912. Audit read-only memisahkan 96.709 backlog Polsek lama berkamar kosong, tiga salah-kamar anak unik, serta dua LP DIT PPA Jawa Tengah yang telah dikoreksi dan di-backup. Frontend label LP dan hydration Edit Pengguna juga sudah diperbaiki pada runtime aktif."
)

add_table(
    doc,
    ["Area", "Status produksi", "Hasil utama"],
    [
        ("Database mapping", "Selesai", "Master dan alias DORS Papua Tengah aktif"),
        ("Koreksi LP", "Selesai", "69 LP massal + 1 LP outlier dikoreksi dengan backup baris"),
        ("Backend", "Selesai", "Penempatan satker utama dan unit fungsi dipisahkan dengan benar"),
        ("Frontend daftar LP", "Selesai", "Label memakai unit_satker_nama sebagai sumber utama"),
        ("Frontend Edit Pengguna", "Selesai", "Satker awal tidak lagi terhapus saat modal dibuka"),
        ("Backend penempatan LP", "Aktif", "Guard V4.1 mencegah LP baru berhenti pada parent ketika kamar anak tunggal dapat dibuktikan"),
        ("Audit backlog nasional", "Read-only selesai", "96.709 backlog Polsek lama terklasifikasi; migrasi massal belum dijalankan"),
        ("Koreksi DIT PPA Jateng", "Selesai", "LP 123529 dan 123539 ke master 19603; backup persisten berisi 2 baris"),
        ("Backend konkurensi DDL", "Terbawa runtime", "Guard DDL/error handler ada pada rangkaian patch; programmer wajib port ke source resmi dan regression test"),
        ("Kinerja Perkara", "Requirement lanjutan", "Tambahkan total, sudah diupdate, dan belum diupdate untuk CP/CC aktual dan tunggakan"),
    ],
    [2100, 1800, 5460],
)

doc.add_heading("2. Ruang Lingkup dan Prinsip Penanganan", level=1)
list_id = new_bullet_list()
add_list_item(doc, "Menghentikan kran: memperbaiki master mapping terlebih dahulu agar sinkronisasi baru tidak kembali salah arah.", list_id)
add_list_item(doc, "Memindahkan air: mengoreksi LP yang sudah telanjur masuk ke satker yang salah setelah mapping dinyatakan valid.", list_id)
add_list_item(doc, "Menjaga rollback: setiap perubahan material memiliki dump, backup tabel, tag image lama, atau salinan build sebelum patch.", list_id)
add_list_item(doc, "Memisahkan data dan tampilan: memastikan nilai satker utama, unit fungsi, dan label UI menggunakan sumber yang sesuai.", list_id)
add_list_item(doc, "Mencegah regresi: programmer wajib memindahkan hotfix terkompilasi ke source bersih dan menambahkan pengujian otomatis.", list_id)

doc.add_heading("3. Perubahan Database yang Telah Dilakukan", level=1)
doc.add_heading("3.1 Backup penuh sebelum koreksi", level=2)
doc.add_paragraph(
    "Sebelum perubahan, database PostgreSQL big_data_binops telah diekspor dalam format custom dump. File ini merupakan titik pemulihan penuh sebelum koreksi Papua Tengah."
)
add_table(
    doc,
    ["Atribut", "Nilai"],
    [
        ("File lokal", r"D:\Prototype CAS\EDIT MASTER MASAL\big_data_binops_before_papua_tengah_20260811.dump"),
        ("Ukuran", "1.646.497.529 byte (sekitar 1,6 GB)"),
        ("SHA256", "B9CAB967F8D50B7C152A768749ACF14A48AAA44A7EA3FF8F4D62221487A546D1"),
        ("Database", "big_data_binops - PostgreSQL 16"),
    ],
    [1900, 7460],
    8.8,
)

doc.add_heading("3.2 Master dan alias Papua Tengah", level=2)
doc.add_paragraph(
    "Lima node master di bdb_satker diaktifkan untuk kode DORS Papua Tengah dan lima alias dibuat pada bdb_dors_satker_map. Mapping ini menjadi sumber pencegah agar LP baru dengan id_polda 060.37 tidak kembali masuk ke Papua Barat Daya."
)
add_table(
    doc,
    ["ID", "Satker", "Kode DORS", "Peran"],
    [
        ("18733", "POLDA PAPUA TENGAH", "060.37", "Satker utama"),
        ("18707", "DIT KRIMUM PAPUA TENGAH", "060.37-17", "Unit fungsi"),
        ("18708", "DIT KRIMSUS PAPUA TENGAH", "060.37-18", "Unit fungsi"),
        ("18709", "DIT NARKOBA PAPUA TENGAH", "060.37-19", "Unit fungsi"),
        ("18710", "DIT POLAIRUD PAPUA TENGAH", "060.37-21", "Unit fungsi"),
    ],
    [1000, 4200, 1900, 2260],
)

doc.add_heading("3.3 Koreksi LP yang salah arah", level=2)
doc.add_paragraph(
    "Sebanyak 69 LP yang sebelumnya masuk ke Polda Papua Barat Daya dikoreksi berdasarkan id_unit_terusan DORS. Distribusi hasil koreksi adalah 60 LP Krimum, 6 LP Krimsus, 2 LP Narkoba, dan 1 LP Polairud. Backup baris persisten dibuat sebelum update."
)
add_table(
    doc,
    ["Backup", "Isi", "Fungsi"],
    [
        ("public.bdb_fix_lp_papua_tengah_20260811_backup", "69 baris LP", "Rollback koreksi massal"),
        ("public.bdb_fix_lp_papua_tengah_outlier_20260811_backup", "1 baris LP", "Rollback koreksi outlier manual"),
    ],
    [4200, 1500, 3660],
    8.8,
)

doc.add_paragraph(
    "Satu LP outlier yang sebelumnya pernah dipetakan manual juga diperbaiki: LP id 392520, dors_lp_id 4526422, nomor LP/B/67/VIII/2026/SPKT/POLDA PAPUA TENGAH. Nilai akhirnya adalah satker utama 18733 (POLDA PAPUA TENGAH) dan unit 18707 (DIT KRIMUM PAPUA TENGAH)."
)

doc.add_heading("3.4 Paket SQL", level=2)
doc.add_paragraph("Seluruh preflight, dry-run, apply, validasi, dan rollback disimpan pada:")
add_code_block(doc, [r"D:\Prototype CAS\EDIT MASTER MASAL\sql", r"/home/clouduser/cas_papua_tengah_patch/"])
doc.add_paragraph("Daftar berkas: 01_mapping_preflight_papua_tengah.sql sampai dengan 10_lp_outlier_rollback_papua_tengah.sql.")
add_callout(
    doc,
    "Peringatan",
    "Programmer tidak boleh menjalankan ulang file apply secara buta. Gunakan preflight terlebih dahulu, periksa backup table yang sudah ada, dan perlakukan skrip ini sebagai histori migrasi serta referensi rollback.",
    "warn",
)

doc.add_heading("4. Patch Backend Penempatan Satker", level=1)
doc.add_heading("4.1 Akar masalah", level=2)
doc.add_paragraph(
    "Pada alur correctSatker(), mapOne(), serta jalur alias, satker fungsi yang dipilih pengguna disimpan langsung ke kolom satker utama. Kolom unit_satker_* justru dikosongkan. Dampaknya, LP fungsi seperti Ditreskrimum dapat terlihat sebagai satker utama, bukan sebagai unit di bawah Polda atau Polres."
)

doc.add_heading("4.2 Perilaku setelah patch", level=2)
list_id = new_bullet_list()
add_list_item(doc, "Jika pilihan adalah POLDA, POLRES, atau POLSEK: node tersebut menjadi satker utama dan unit dikosongkan.", list_id)
add_list_item(doc, "Jika pilihan adalah FUNGSI dan memiliki induk teritorial: induk teritorial terdekat menjadi satker utama, sedangkan node fungsi menjadi unit_satker_*.", list_id)
add_list_item(doc, "Jika node fungsi tidak memiliki induk teritorial, termasuk beberapa struktur Mabes: perilaku lama dipertahankan agar tidak merusak cakupan yang belum memiliki pasangan teritorial.", list_id)

doc.add_heading("4.3 Source dan pengujian", level=2)
add_table(
    doc,
    ["Berkas", "Perubahan"],
    [
        ("src/bdb/laporan-polisi/laporan-polisi.service.ts", "Integrasi resolver penempatan pada semua jalur mapping"),
        ("src/bdb/laporan-polisi/satker-placement.util.ts", "Resolver satker utama dan unit fungsi"),
        ("src/bdb/laporan-polisi/satker-placement.util.spec.ts", "Empat regression test"),
    ],
    [4300, 5060],
    8.8,
)
doc.add_paragraph("Patch diterapkan pada correctSatker, mapOne, insertMappedLp, name matching, serta jalur alias unit/group.")

doc.add_heading("4.4 Baseline image backend", level=2)
add_table(
    doc,
    ["Tag", "Image ID", "Keterangan"],
    [
        ("bdb-api:20260805-193904", "9aa9923248e3", "Tag operasional saat ini"),
        ("bdb-api:20260811-satker-placement-fix", "9aa9923248e3", "Kandidat berisi source + dist patch"),
        ("bdb-api:20260805-193904-before-satker-fix", "c7a75bde6f98", "Rollback sebelum patch"),
    ],
    [4100, 1800, 3460],
    8.7,
)
doc.add_paragraph("Validasi health endpoint /api/network/ping menghasilkan HTTP 200.")

doc.add_heading("5. Hotfix Frontend Daftar Laporan Polisi", level=1)
doc.add_heading("5.1 Akar masalah label", level=2)
doc.add_paragraph(
    "Kolom Satker Penanganan pada tabel daftar LP membentuk label dari unit_nama dan satker_nama. unit_nama merupakan nama mentah DORS, sehingga label yang tampil dapat berbeda dari unit_satker_nama yang sudah dipetakan pada master CAS."
)
add_code_block(
    doc,
    [
        "Sumber label sebelum patch:",
        "[row.unit_nama, row.satker_nama].filter(Boolean).join(' ')",
        "",
        "Sumber label setelah patch:",
        "row.unit_satker_nama || fallback lama",
    ],
)
doc.add_paragraph(
    "Hotfix produksi dilakukan pada chunk client dan SSR karena source Next.js aktif tidak tersedia di host. Cache busting diterapkan agar browser tidak memakai chunk lama. Programmer wajib menerapkan logika tersebut pada source bersih app/cms/laporan-polisi/page.tsx."
)

doc.add_page_break()
doc.add_heading("5.2 Baseline image frontend setelah seluruh hotfix", level=2)
add_table(
    doc,
    ["Tag", "Image ID", "Keterangan"],
    [
        ("bdb-web:20260805-132056", "9dc428d25cbd", "Tag operasional setelah seluruh hotfix FE"),
        ("bdb-web:20260812-user-satker-hydration-fix", "9dc428d25cbd", "Kandidat patch Edit Pengguna"),
        ("bdb-web:20260805-132056-before-user-satker-fix", "0cee672a719c", "Rollback sebelum patch Edit Pengguna"),
        ("bdb-web:20260812-satker-label-fix", "0cee672a719c", "Kandidat patch label"),
        ("bdb-web:20260805-132056-before-satker-label-fix", "f3d2ee329509", "Rollback sebelum patch label"),
    ],
    [4200, 1800, 3360],
    8.7,
)

doc.add_heading("6. Hotfix Frontend Modal Edit Pengguna", level=1)
doc.add_heading("6.1 Kasus validasi", level=2)
doc.add_paragraph(
    "Kasus direproduksi pada user ID 122, HENDRIK DWI HARIADI, role operator. Data database valid: scope_satker_id 9453, scope_satker_key 060.01.17.00.00.28, dan master DIT RES SIBER JAWA TIMUR ditemukan baik berdasarkan ID maupun kode. Namun modal Edit Pengguna hanya menampilkan Satker: POLRI."
)

doc.add_heading("6.2 Akar masalah race condition", level=2)
list_id = new_numbered_list()
add_list_item(doc, "Modal mengirim initialId 9453 ke komponen pemilih satker.", list_id)
add_list_item(doc, "State internal komponen pada render pertama masih berupa daftar kosong.", list_id)
add_list_item(doc, "useEffect yang memantau state tersebut langsung memanggil onSelect(null).", list_id)
add_list_item(doc, "Form induk menghapus scope_satker_id, scope_satker_key, dan scope_satker_name.", list_id)
add_list_item(doc, "Perubahan initialId menjadi null membatalkan pemuatan jalur 9453; UI berhenti di root POLRI.", list_id)

doc.add_heading("6.3 Perbaikan source yang wajib dibuat permanen", level=2)
doc.add_paragraph(
    "Hilangkan efek yang mengirim onSelect setiap kali selected berubah. Panggil onSelect hanya dari handler perubahan dropdown yang benar-benar dipicu pengguna. Inisialisasi dari initialId hanya mengisi state internal dan tidak boleh mengosongkan form induk."
)
add_code_block(
    doc,
    [
        "// Prinsip implementasi pada komponen pemilih satker",
        "async function handleLevelChange(level, node) {",
        "  const nextSelected = selected.slice(0, level);",
        "  // isi node dan daftar anak sesuai pilihan",
        "  setSelected(nextSelected);",
        "  onSelectRef.current(nextSelected.at(-1) ?? null);",
        "}",
        "",
        "// Hapus efek otomatis yang memanggil onSelect saat hydration awal.",
    ],
)
doc.add_paragraph(
    "Patch terkompilasi diterapkan pada chunk client halaman user dan chunk SSR terkait. Chunk client memakai nama cache-busted 00l7wgk9jmf2_-user-satker-fix-20260812.js. Validasi menghasilkan handler baru = 1 dan efek lama = 0. Setelah deploy, modal user ID 122 berhasil menampilkan POLRI -> POLDA JAWA TIMUR -> DIT RES SIBER JAWA TIMUR."
)

doc.add_heading("7. Catatan Penting tentang Source Frontend", level=1)
add_callout(
    doc,
    "Jangan salah repository",
    "Dua folder /var/www/www/cas_v1.2.0/cas-cms dan /var/www/cas_v1.2.0/cas-cms adalah source Vue lama. Aplikasi produksi aktif adalah Next.js 16.2.10 dengan package cas-web-master di container bdb-web. Jangan membangun pengganti produksi dari source Vue tersebut.",
    "warn",
)
doc.add_paragraph(
    "Karena source Next.js bersih tidak tersedia pada host FE, dua perbaikan frontend saat ini berupa hotfix build terkompilasi. Programmer harus mengambil repository Next.js resmi yang sesuai dengan build produksi, lalu memindahkan logika patch label LP dan patch hydration pemilih satker ke source TypeScript/TSX."
)

doc.add_heading("8. Backend LP: Stabilitas DDL dan Guard Penempatan", level=1)
doc.add_heading("8.1 Temuan dan dampak", level=2)
doc.add_paragraph(
    "Endpoint daftar LP, statistik LP, dan job sinkronisasi dapat memanggil ensureTable() pada waktu yang berdekatan. Implementasi existing menjalankan CREATE OR REPLACE FUNCTION dan DDL pendukung tanpa koordinasi lintas request/proses. Pada PostgreSQL tercatat error tuple concurrently updated. Error asli kemudian tersamarkan karena error handler mengasumsikan exception.parameters selalu tersedia dan langsung memanggil join()."
)
add_table(
    doc,
    ["Lapisan", "Kondisi sebelum kandidat V2", "Perbaikan kandidat V2"],
    [
        ("Dalam satu proses", "Beberapa request dapat menjalankan ensureTable bersamaan", "Single-flight Promise membuat satu eksekusi dibagi oleh request lain"),
        ("Lintas proses/instance", "Tidak ada koordinasi DDL", "pg_advisory_xact_lock mencegah DDL yang sama berjalan paralel"),
        ("Transaksi DDL", "Query tidak dijamin memakai koneksi/transaksi yang sama", "Satu QueryRunner menjalankan lock dan seluruh DDL dalam satu transaksi"),
        ("Error handler", "parameters.join() dapat melempar error kedua", "Parameter kosong ditangani aman sehingga error PostgreSQL asli tetap terbaca"),
    ],
    [1700, 3500, 4160],
    8.5,
)

doc.add_heading("8.2 Hasil build dan status produksi", level=2)
add_table(
    doc,
    ["Atribut", "Nilai"],
    [
        ("Archive", "bdb-api-lp-ddl-concurrency-hotfix-v2-20260812.tar.gz"),
        ("SHA256", "111D41B196A682DA492F8FF892DDF8CB9EE3681EF57276D456CEBF230BD4EA61"),
        ("Base image", "bdb-api:20260805-193904"),
        ("Candidate image", "bdb-api:20260812-lp-ddl-concurrency-hotfix-v2"),
        ("Candidate image SHA256", "73419872EEDA04CE9CECD0C68417BF71620B7A07A8765B36A8367F57C82EA79F"),
        ("Validasi", "Unit test satker-placement lulus; npm run build lulus; image berhasil dibuat"),
        ("Status artifact", "Kandidat V2 menjadi bagian dari rangkaian runtime berikutnya; programmer tetap wajib port dan menguji source resmi"),
    ],
    [2500, 6860],
    8.5,
)
add_callout(
    doc,
    "Batas aman",
    "Archive tanpa akhiran -v2 adalah kandidat gagal kompilasi dan tidak boleh digunakan. Runtime aktif sudah bergerak ke rangkaian guard placement V4.1; gunakan source resmi sebagai tujuan integrasi, bukan menjadikan archive dist lama sebagai baseline baru.",
    "warn",
)

doc.add_heading("8.3 Urutan integrasi dan deployment yang diwajibkan", level=2)
list_id = new_numbered_list()
for item in (
    "Port perubahan single-flight, advisory transaction lock, QueryRunner, dan error handler ke repository resmi; jangan menjadikan file dist sebagai source permanen.",
    "Ambil inspect container aktif, tag rollback, serta salinan dist aktif sebelum mengganti file atau image.",
    "Bandingkan source/dist kandidat dengan baseline dan verifikasi kembali checksum archive.",
    "Jalankan kandidat pada container/port terisolasi; uji ping, daftar LP, statistik LP, serta beberapa request paralel.",
    "Pantau log backend dan PostgreSQL. Kriteria lulus: tidak ada tuple concurrently updated dan error asli tidak lagi tertutup oleh parameters.join().",
    "Setelah acceptance test lulus, deploy dengan tag baru. Jangan retag sebagai tag operasional sebelum validasi produksi selesai.",
    "Jika regresi muncul, kembalikan dist/image aktif dari backup dan pastikan endpoint LP kembali normal sebelum menutup rollback.",
):
    add_list_item(doc, item, list_id)

doc.add_heading("8.4 Status Guard Penempatan LP V4.1 di Produksi", level=2)
doc.add_paragraph(
    "Guard penempatan LP V4.1 telah dibangun, diterapkan pada backend 10.0.0.x, dan tervalidasi melalui ping serta endpoint daftar/statistik HTTP 200. Runtime aktif menggunakan service hasil kandidat V4.1 dan konfigurasi dors-unit-mapping.json dengan polsek_min_lp_id 404912. Tag operasional bdb-api:20260805-193904 mengarah ke image kandidat V4.1 (image ID 069d2c3e7938)."
)
add_table(
    doc,
    ["Pengaman", "Perilaku aktif"],
    [
        ("Target unik", "Auto-placement hanya jika tepat satu anak langsung cocok dari parent"),
        ("Kamar existing", "unit_satker_id yang sudah terisi tidak ditimpa"),
        ("Pelimpahan", "sudah_dilimpahkan, dilimpahkan_eksternal, dan histori bdb_lp_pelimpahan dikecualikan"),
        ("Polsek RESKRIM", "RESKRIM dipetakan ke UNIT RESKRIM POLSEK hanya untuk LP baru mulai ID 404912"),
        ("Backlog", "Tidak dipindahkan otomatis oleh deployment kode"),
    ],
    [2500, 6860],
    8.5,
)

doc.add_heading("8.5 Audit Nasional dan Batas Migrasi Backlog", level=2)
doc.add_paragraph(
    "Audit nasional dijalankan dalam transaksi read-only dan ditutup ROLLBACK. Hasil klasifikasi menunjukkan 96.709 LP backlog berkamar kosong pada parent Polsek dengan satu anak UNIT RESKRIM yang unik. Angka ini bukan perintah update otomatis; setiap batch harus kembali melewati verifikasi identitas sumber, target anak langsung, exclusion pelimpahan, backup persisten, dry-run, dan batas jumlah perubahan."
)
add_table(
    doc,
    ["Kelompok audit", "Jumlah", "Status"],
    [
        ("BACKLOG_KOSONG_ANAK_UNIK", "96.709 LP", "Belum dimigrasikan; kandidat untuk batch terkendali"),
        ("SALAH_KAMAR_ANAK_UNIK", "3 LP", "Diaudit satu per satu; dua DIT PPA Jateng selesai"),
        ("Verifikasi pelimpahan SAFE_MOVE", "0 LP berpelimpahan", "Syarat wajib dipertahankan pada setiap batch"),
        ("Identitas DORS duplikat", "13 master", "Tidak boleh diremap otomatis tanpa resolusi master"),
    ],
    [3300, 1800, 4260],
    8.5,
)
add_callout(
    doc,
    "Kasus yang masih terbuka",
    "LP 386717 (LP/B/112/VIII/2026/SPKT/POLDA PAPUA) masih perlu dikoreksi dari kamar DIT RES SIBER PAPUA ke DIT KRIMUM PAPUA berdasarkan audit target anak unik. Jangan memasukkannya ke batch lain tanpa preflight khusus dan backup per baris.",
    "warn",
)

doc.add_heading("8.6 Koreksi Targeted DIT PPA dan PPO Jawa Tengah", level=2)
doc.add_paragraph(
    "Dua LP dengan unit DORS DITPPADANPPO sebelumnya menempel pada kamar SAT RES PPA DAN PPO POLRESTABES SEMARANG (ID 7226). Keduanya telah dipindahkan ke master DIT PPA DAN PPO JAWA TENGAH (ID 19603, kode 060.01.15.00.00.39) melalui paket V2 yang mengunci ID, dors_lp_id, nomor LP, kamar lama, target master, serta seluruh flag/riwayat pelimpahan."
)
add_table(
    doc,
    ["LP", "Identitas", "Hasil"],
    [
        ("123529", "dors_lp_id 2155911; LP/B/208/XI/2023/SPKT/POLDA JAWA TENGAH", "unit_satker_id 19603"),
        ("123539", "dors_lp_id 3345420; LP/B/49/III/2025/SPKT/POLDA JAWA TENGAH", "unit_satker_id 19603"),
    ],
    [1200, 5960, 2200],
    8.3,
)
add_callout(
    doc,
    "Jejak pemulihan",
    "Apply telah COMMIT dan backup persisten public.bdb_lp_backup_ppa_jateng_v2_20260812 berisi tepat 2 baris. File 22_v2_ppa_jateng_rollback.sql hanya digunakan bila hasil produksi perlu dibatalkan. ID 123339 (LP Polsek Lengkiti) dikunci sebagai exclusion dan tidak disentuh.",
    "info",
)

doc.add_heading("9. Langkah Wajib Programmer Sebelum Update Berikutnya", level=1)
steps = [
    "Bekukan baseline. Catat tag dan image ID aktif untuk database, backend, dan frontend. Jangan langsung menjalankan pipeline deployment.",
    "Buat branch khusus integrasi hotfix dari commit source resmi yang benar-benar menjadi dasar image produksi.",
    "Verifikasi seluruh artifact dan checksum pada Lampiran A. Jangan memakai file bernama sama jika hash berbeda.",
    "Backend: port perubahan laporan-polisi.service.ts, satker-placement.util.ts, dan test resolver ke repository resmi. Jalankan unit test dan build penuh.",
    "Frontend daftar LP: ubah sumber label menjadi unit_satker_nama dengan fallback yang aman. Tambahkan regression test untuk unit master yang berbeda dari unit_nama DORS.",
    "Frontend Edit Pengguna: pindahkan callback onSelect ke handler interaksi pengguna dan hapus emission otomatis saat hydration. Tambahkan test membuka modal dengan initialId, mengganti satker, menghapus satker, serta membuka dua pengguna secara bergantian.",
    "Backend stabilitas dan penempatan LP: port rangkaian effective-owner V3, guard placement V4.1, guard ensureTable, serta error handler aman ke source resmi. Pertahankan config mapping dan cutoff Polsek 404912; uji list/stats/sync secara paralel.",
    "Database: masukkan SQL Papua Tengah dan koreksi DIT PPA Jateng sebagai histori migrasi terdokumentasi. Jangan mengulang apply jika backup table sudah ada.",
    "Backlog LP: jangan menjalankan update nasional tunggal. Susun batch per parent/target unik, kecualikan seluruh pelimpahan, buat backup persisten per batch, tetapkan expected row count, lalu wajibkan preflight dan dry-run.",
    "Bangun kandidat backend dan frontend dengan tag baru. Jalankan di port atau environment terisolasi sebelum menyentuh container aktif.",
    "Lakukan smoke test terpadu sesuai Bagian 11, kemudian deploy dengan backup filesystem/image serta prosedur rollback yang telah diverifikasi.",
    "Setelah lolos produksi, pastikan tag operasional mengarah ke image baru agar container yang direcreate tidak kembali ke build lama.",
]
for item in steps:
    if item == steps[0]:
        list_id = new_numbered_list()
    add_list_item(doc, item, list_id)

doc.add_heading("10. Requirement Lanjutan: Kinerja Perkara CP dan CC", level=1)
doc.add_paragraph(
    "Pada tabel Kinerja Perkara perlu ditambahkan indikator jumlah LP yang belum diupdate agar total data dan data yang sudah diupdate selalu dapat direkonsiliasi. Perubahan berlaku pada empat lokasi: CP Aktual, CP Tunggakan, CC Aktual, dan CC Tunggakan."
)

add_table(
    doc,
    ["Indikator", "Definisi implementasi"],
    [
        ("Total LP", "Populasi LP unik yang masuk ke filter, periode, satker, model, dan scope baris terkait"),
        ("Sudah Diupdate", "LP unik dari populasi yang sama dan memenuhi definisi update/status Kinerja Perkara"),
        ("Belum Diupdate", "LP unik dari populasi yang sama yang belum memenuhi definisi update/status"),
    ],
    [2400, 6960],
    9.0,
)

add_callout(
    doc,
    "Invariant wajib",
    "Total LP = Sudah Diupdate + Belum Diupdate untuk setiap baris, satker, periode, model, scope, dan kategori aktual/tunggakan.",
    "info",
)

list_id = new_bullet_list()
add_list_item(doc, "Perhitungan harus berasal dari backend sebagai source of truth, bukan hanya pengurangan visual di frontend.", list_id)
add_list_item(doc, "Gunakan COUNT(DISTINCT lp.id) atau identitas LP kanonik agar join status/riwayat tidak menggandakan jumlah.", list_id)
add_list_item(doc, "Ketiga indikator wajib menggunakan filter dan exclusion yang sama: deleted, limpah eksternal, scope akses, satker, periode, dan model.", list_id)
add_list_item(doc, "Definisi Aktual dan Tunggakan harus mengikuti logika bisnis yang saat ini sudah dipakai modul; jangan mengubah batas periodenya tanpa persetujuan pemilik produk.", list_id)
add_list_item(doc, "Respons API yang disarankan per baris: total_lp, sudah_diupdate, dan belum_diupdate.", list_id)
add_list_item(doc, "Perubahan status satu LP harus membuat sudah_diupdate bertambah satu dan belum_diupdate berkurang satu tanpa mengubah total_lp.", list_id)

doc.add_heading("10.1 Pengujian minimum Kinerja Perkara", level=2)
list_id = new_bullet_list()
for test in (
    "CP Aktual: invariant jumlah dan filter periode.",
    "CP Tunggakan: invariant jumlah dan pembawaan perkara periode sebelumnya.",
    "CC Aktual: invariant jumlah dan scope satker.",
    "CC Tunggakan: invariant jumlah dan exclusion data.",
    "Perubahan satu LP dari belum diupdate menjadi sudah diupdate.",
    "Join status berganda tidak menyebabkan double count.",
    "Hasil superadmin dan user berscope konsisten terhadap data yang boleh dilihat.",
):
    add_list_item(doc, test, list_id)

doc.add_heading("11. Acceptance Test Sebelum Deployment", level=1)
doc.add_heading("11.1 Database dan mapping", level=2)
list_id = new_bullet_list()
for item in (
    "Kode 060.37 dan 060.37-17/-18/-19/-21 mengarah ke Papua Tengah.",
    "LP baru Papua Tengah tidak kembali masuk ke Papua Barat Daya.",
    "Jumlah LP salah arah setelah cutoff tetap nol.",
    "Backup table koreksi tetap tersedia dan tidak berubah.",
):
    add_list_item(doc, item, list_id)

doc.add_heading("11.2 Backend", level=2)
list_id = new_bullet_list()
for item in (
    "Pilihan Polda/Polres/Polsek disimpan sebagai satker utama.",
    "Pilihan fungsi disimpan sebagai unit dan induk teritorial sebagai satker utama.",
    "Mapping otomatis, mapping manual, alias unit, dan alias group memakai resolver yang sama.",
    "Unit test resolver lulus dan /api/network/ping menghasilkan HTTP 200.",
    "Request paralel ke daftar dan statistik LP tidak memunculkan tuple concurrently updated.",
    "Error handler tetap menampilkan akar error ketika parameters tidak tersedia.",
    "LP baru Polsek mulai ID 404912 dengan unit RESKRIM masuk ke satu UNIT RESKRIM POLSEK yang merupakan anak langsung parent.",
    "LP baru Polda/Polres hanya ditempatkan otomatis bila target anak langsung tepat satu; kandidat ambigu tetap kosong dan tercatat untuk audit.",
    "LP yang sudah memiliki kamar atau riwayat pelimpahan tidak ditimpa guard penempatan.",
):
    add_list_item(doc, item, list_id)

doc.add_heading("11.3 Frontend", level=2)
list_id = new_bullet_list()
for item in (
    "Kolom Satker Penanganan menampilkan unit_satker_nama saat tersedia.",
    "Fallback label tetap bekerja untuk data lama yang belum memiliki unit_satker_nama.",
    "Modal Edit Pengguna user ID 122 memuat Polda Jawa Timur dan Dit Res Siber Jawa Timur.",
    "Membuka modal tidak mengubah data form sebelum pengguna berinteraksi.",
    "Mengganti dan menghapus pilihan satker tetap memutakhirkan form dengan benar.",
    "Hard refresh atau browser baru mengambil chunk cache-busted.",
):
    add_list_item(doc, item, list_id)

doc.add_heading("12. Rollback dan Pemulihan", level=1)
doc.add_heading("12.1 Database", level=2)
list_id = new_bullet_list()
add_list_item(doc, "Gunakan backup baris persisten untuk rollback terbatas pada LP yang dikoreksi.", list_id)
add_list_item(doc, "Gunakan full dump hanya jika dibutuhkan pemulihan menyeluruh dan setelah melakukan dry-run restore pada database terpisah.", list_id)
add_list_item(doc, "Jangan restore penuh langsung ke produksi tanpa validasi version PostgreSQL, ruang disk, koneksi aktif, dan window downtime.", list_id)
add_list_item(doc, "Koreksi DIT PPA Jateng dapat dipulihkan dari public.bdb_lp_backup_ppa_jateng_v2_20260812 memakai 22_v2_ppa_jateng_rollback.sql; verifikasi jumlah backup wajib 2.", list_id)

doc.add_heading("12.2 Backend", level=2)
doc.add_paragraph("Rollback sebelum guard placement V4.1 tersedia pada tag bdb-api:before-lp-placement-v4-20260812 (image c7a75bde6f98) serta backup runtime /home/clouduser/bdb-api-deploy-lp-placement-v4-20260812/before-dist dan before-config. Rollback harus mengembalikan dist dan dors-unit-mapping.json, merestart container, lalu memverifikasi ping/list/stats. Tag operasional aktif bdb-api:20260805-193904 saat ini menunjuk image V4.1 069d2c3e7938.")

doc.add_heading("12.3 Frontend", level=2)
doc.add_paragraph(
    "Rollback terbatas sebelum patch Edit Pengguna tersedia pada tag bdb-web:20260805-132056-before-user-satker-fix (image 0cee672a719c). Rollback lebih lama sebelum patch label tersedia pada bdb-web:20260805-132056-before-satker-label-fix (image f3d2ee329509). Salinan .next sebelum deploy terakhir juga tersedia pada /home/clouduser/bdb-web-deploy-user-satker-20260812/before-next."
)

add_callout(
    doc,
    "Aturan rollback",
    "Rollback harus mengembalikan filesystem container dan tag image operasional. Mengubah tag saja tidak mengubah filesystem container yang sedang berjalan; sebaliknya, menyalin file ke container tanpa memperbarui tag dapat hilang saat container dibuat ulang.",
    "warn",
)

doc.add_heading("13. Hal yang Tidak Boleh Terlewat", level=1)
list_id = new_bullet_list()
for item in (
    "Jangan menggunakan source Vue lama sebagai dasar frontend produksi.",
    "Jangan menghapus backup dump, backup table, source archive, atau tag rollback sebelum build resmi baru stabil.",
    "Jangan mengganti .env.development atau konfigurasi runtime saat menyalin source/hotfix.",
    "Jangan menganggap hotfix chunk sebagai source permanen; implementasikan ulang pada source TypeScript/TSX resmi.",
    "Jangan menjalankan koreksi SQL berdasarkan pencarian nama saja. Gunakan ID dan kode DORS yang sudah diverifikasi.",
    "Jangan deploy image lama setelah koreksi karena akan menghidupkan kembali bug penempatan dan tampilan.",
    "Simpan dokumen ini bersama release note dan commit yang mengintegrasikan patch agar jejak audit tidak terputus.",
    "Jangan memakai archive hotfix konkurensi DDL tanpa akhiran -v2; archive tersebut gagal build.",
    "Jangan memakai artifact DDL V2 secara terpisah sebagai baseline produksi; rangkaian runtime aktif sudah dilanjutkan oleh guard placement V4.1 dan harus dipindahkan utuh ke source resmi.",
    "Jangan memindahkan 96.709 backlog Polsek melalui satu transaksi nasional; pecah batch, kunci target anak unik, dan batasi jumlah update.",
    "Jangan menyentuh master dengan identitas DORS duplikat sebelum kode/master tujuan diselesaikan secara eksplisit.",
    "Jangan memasukkan LP 386717 ke koreksi lain; gunakan preflight dan backup targeted tersendiri.",
):
    add_list_item(doc, item, list_id)

doc.add_heading("Lampiran A. Inventaris Artifact dan Checksum", level=1)
add_table(
    doc,
    ["Artifact", "SHA256 / lokasi"],
    [
        ("Full database dump", "B9CAB967F8D50B7C152A768749ACF14A48AAA44A7EA3FF8F4D62221487A546D1"),
        ("Backend source asli", "0FFF0B51772B4737B4940A2A35B1B3BD2CA024F2DCE8DA953A46C9874D1DD020"),
        ("Backend patch archive", "08F9E38B8193EE57904AFD58086C1068AD895AE4AF916EC8C2A44BC3870FC0C2"),
        ("Frontend label patch", "4EA91B52A7151ADF28FAED8D843B112192E83B94D9CBE1A4DB84FBDF069AD441"),
        ("Frontend audit bundle", "E1410D90ADB474D5BE9EDA1C1AEA9A1AD4FF6754CA9BE6E8FDAFC1969C3B6723C"),
        ("Frontend Edit Pengguna patch", "F88213F21C5D8C9FB1C920C967CC9BE27FA07C4D1762A47084B91AAC77CC6DB5"),
        ("Backend DDL concurrency hotfix V2", "111D41B196A682DA492F8FF892DDF8CB9EE3681EF57276D456CEBF230BD4EA61"),
        ("Backend candidate image V2", "73419872EEDA04CE9CECD0C68417BF71620B7A07A8765B36A8367F57C82EA79F"),
        ("Backend LP placement guard V4.1", "B848FC1489A849AD359ACE90ED7F5775CE7DA10C495B4250BBE0BFF098B91865"),
        ("LP safe-origin classification", "0BD5382EEBC1AB065CC32E74B84C862D3CCE0EBD85382793EE270D8BB3676A2B"),
        ("Audit three existing rooms", "6356FEB39275675DFB599B98AE60D946AA2AB921392574BEFB3165655E817E5C"),
        ("Targeted DIT PPA Jateng V2", "9D511D1308787B7DB1B55D72CCF9180A47F629B4C8CC7F4368991333ABE2A247"),
    ],
    [3600, 5760],
    8.0,
)

doc.add_heading("Lampiran B. Lokasi Artifact Lokal", level=1)
locations = [
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-api-source-20260811",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-api-satker-placement-fix-20260811.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-satker-label-patch-20260811",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-satker-label-fix-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-audit-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-web-user-satker-fix-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-api-lp-ddl-concurrency-hotfix-v2-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\bdb-api-lp-placement-guard-v4.1-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\lp-safe-origin-classification-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\lp-three-existing-room-audit-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\lp-ppa-jateng-targeted-fix-v2-20260812.tar.gz",
    r"D:\Prototype CAS\EDIT MASTER MASAL\sql",
]
for loc in locations:
    if loc == locations[0]:
        list_id = new_bullet_list()
    add_list_item(doc, loc, list_id)

doc.add_heading("Lampiran C. Definition of Done Programmer", level=1)
list_id = new_bullet_list()
for item in (
    "Semua perubahan DB, BE, dan FE sudah tercatat pada commit/PR resmi.",
    "Source Next.js yang dibangun telah dibuktikan sebagai source aplikasi produksi aktif.",
    "Unit test dan regression test baru lulus.",
    "Kandidat image diuji terisolasi dan smoke test terpadu lulus.",
    "Backup, rollback, tag image, dan checksum terdokumentasi.",
    "Kinerja Perkara CP/CC aktual dan tunggakan memenuhi invariant jumlah.",
    "Deployment produksi tervalidasi dari akun superadmin dan akun berscope.",
    "Release note menyebutkan mapping Papua Tengah, penempatan LP, label LP, dan hydration Edit Pengguna.",
    "Guard konkurensi DDL dan error handler aman telah masuk source resmi serta lolos test paralel list/stats.",
    "Guard placement V4.1, mapping config, cutoff Polsek, exclusion pelimpahan, dan test target ambigu telah masuk source resmi.",
    "Dua LP DIT PPA Jateng tetap berada di master 19603 dan backup V2 tetap berisi dua baris.",
    "Migrasi backlog nasional mempunyai runbook batch, batas row count, backup, dry-run, audit pelimpahan, dan rollback sebelum eksekusi.",
):
    add_list_item(doc, item, list_id)

doc.add_heading("Lampiran D. Riwayat Versi Dokumen", level=1)
add_table(
    doc,
    ["Versi", "Tanggal", "Perubahan"],
    [
        ("v1.3", "12 Agustus 2026", "Snapshot handover sebelum penambahan kandidat hotfix stabilitas DDL LP"),
        ("v1.4", "12 Agustus 2026", "Menambahkan temuan konkurensi DDL, hasil build V2, urutan deploy aman, checksum, acceptance test, dan rollback"),
        ("v1.5", "12 Agustus 2026", "Mencatat guard LP V4.1 aktif, audit backlog nasional, koreksi dua LP DIT PPA Jateng, backup V2, dan pekerjaan terbuka"),
    ],
    [1200, 1800, 6360],
    8.8,
)

doc.add_paragraph()
closing = doc.add_paragraph()
closing.alignment = WD_ALIGN_PARAGRAPH.CENTER
closing.paragraph_format.space_before = Pt(12)
closing.paragraph_format.space_after = Pt(0)
r = closing.add_run("AKHIR DOKUMEN HANDOVER")
set_run_font(r, size=9, color=GRAY, bold=True)

doc.core_properties.title = "Handover Teknis CAS v1.5 - Big Data Binops"
doc.core_properties.subject = "Sinkronisasi koreksi mapping, guard penempatan LP, patch aplikasi, backlog nasional, dan requirement Kinerja Perkara"
doc.core_properties.author = "Tim Operasional CAS"
doc.core_properties.keywords = "CAS, Big Data Binops, Papua Tengah, PostgreSQL, backend, frontend, handover"

doc.save(OUT)
print(OUT)
