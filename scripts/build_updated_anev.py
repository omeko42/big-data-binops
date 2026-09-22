from __future__ import annotations

import json
import sys
from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


PAGE_W = 960.009
PAGE_H = 540.0
NAVY = HexColor("#062434")
NAVY_DARK = HexColor("#031B29")
GOLD = HexColor("#DDB84A")
GOLD_TEXT = HexColor("#F7CA3E")
RED = HexColor("#EF4444")
GREEN = HexColor("#22A447")
GRAY = HexColor("#D8D8D8")


def register_fonts() -> None:
    fonts = {
        "Arial": Path(r"C:\Windows\Fonts\arial.ttf"),
        "ArialBold": Path(r"C:\Windows\Fonts\arialbd.ttf"),
    }
    for name, path in fonts.items():
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, str(path)))


def fit_text(c: canvas.Canvas, text: str, max_width: float, font: str, size: float, min_size: float = 4.5) -> float:
    while size > min_size and pdfmetrics.stringWidth(text, font, size) > max_width:
        size -= 0.2
    return size


def draw_centered(c: canvas.Canvas, text: str, x: float, y: float, width: float, font: str, size: float, color=white) -> None:
    size = fit_text(c, text, width - 4, font, size)
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawCentredString(x + width / 2, y, text)


def draw_wrapped_bullet(c: canvas.Canvas, text: str, x: float, y: float, width: float, font_size: float, leading: float, bullet_color=GOLD_TEXT) -> float:
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if pdfmetrics.stringWidth(candidate, "Arial", font_size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    c.setFillColor(bullet_color)
    c.circle(x, y + 2.2, 3, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Arial", font_size)
    for index, line in enumerate(lines):
        c.drawString(x + 13, y - index * leading, line)
    return y - len(lines) * leading - 7


def draw_check(c: canvas.Canvas, cx: float, cy: float) -> None:
    size = 9.0
    c.setFillColor(GREEN)
    c.roundRect(cx - size / 2, cy - size / 2, size, size, 1.6, fill=1, stroke=0)
    c.setStrokeColor(white)
    c.setLineWidth(1.3)
    c.line(cx - 2.8, cy - 0.1, cx - 0.7, cy - 2.4)
    c.line(cx - 0.7, cy - 2.4, cx + 3.1, cy + 2.9)


def draw_cross(c: canvas.Canvas, cx: float, cy: float) -> None:
    c.setStrokeColor(RED)
    c.setLineWidth(1.7)
    c.line(cx - 3.0, cy - 3.0, cx + 3.0, cy + 3.0)
    c.line(cx - 3.0, cy + 3.0, cx + 3.0, cy - 3.0)


def overlay_date_band(c: canvas.Canvas, x: float, y: float, w: float, h: float, font_size: float) -> None:
    c.setFillColor(NAVY)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.roundRect(x, y, w, h, 4, fill=1, stroke=1)
    draw_centered(c, "2 SEPTEMBER - 8 SEPTEMBER 2026", x, y + h / 2 - font_size * 0.34, w, "ArialBold", font_size, GOLD_TEXT)


def draw_table_page(c: canvas.Canvas, background: Path, rows: list[list[str]]) -> None:
    c.drawImage(str(background), 0, 0, width=PAGE_W, height=PAGE_H)
    c.setFillColor(NAVY)
    c.rect(243, 472.5, 484, 33, fill=1, stroke=0)
    draw_centered(c, "PERIODE 2 SEPTEMBER - 8 SEPTEMBER 2026", 243, 484.8, 484, "ArialBold", 12.5, white)

    x0, top = 23.0, 471.0
    widths = [37.5, 167.25] + [84.75] * 7 + [130.5]
    table_w = sum(widths)
    header_h, data_h, total_h = 28.5, 10.79, 20.25
    bottom = top - header_h - 36 * data_h - 2 * total_h
    c.setFillColor(NAVY_DARK)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.55)
    c.rect(x0, bottom, table_w, top - bottom, fill=1, stroke=1)

    xs = [x0]
    for width in widths:
        xs.append(xs[-1] + width)
    for x in xs:
        c.line(x, bottom, x, top)
    y_header_bottom = top - header_h
    c.line(x0, y_header_bottom, x0 + table_w, y_header_bottom)
    for index in range(1, 37):
        y = y_header_bottom - index * data_h
        c.line(x0, y, x0 + table_w, y)
    y_data_bottom = y_header_bottom - 36 * data_h
    c.line(x0, y_data_bottom, x0 + table_w, y_data_bottom)
    c.line(x0, y_data_bottom - total_h, x0 + table_w, y_data_bottom - total_h)
    c.line(x0, bottom, x0 + table_w, bottom)

    header = rows[0]
    for col, label in enumerate(header):
        label = "HASIL UNGKAP\nKASUS TIM URC" if col == 9 else label
        cell_x = xs[col]
        cell_w = widths[col]
        if "\n" in label:
            parts = label.split("\n")
            draw_centered(c, parts[0], cell_x, top - 11.2, cell_w, "ArialBold", 7.3, GOLD_TEXT)
            draw_centered(c, parts[1], cell_x, top - 20.0, cell_w, "ArialBold", 7.3, GOLD_TEXT)
        else:
            draw_centered(c, label, cell_x, top - 18.0, cell_w, "ArialBold", 7.1, GOLD_TEXT)

    for row_index, row in enumerate(rows[1:37]):
        cy = y_header_bottom - (row_index + 0.5) * data_h
        draw_centered(c, row[0], xs[0], cy - 2.0, widths[0], "Arial", 6.0, white)
        c.setFillColor(white)
        name_size = fit_text(c, row[1], widths[1] - 8, "ArialBold", 5.9)
        c.setFont("ArialBold", name_size)
        c.drawString(xs[1] + 5, cy - 2.1, row[1])
        for col in range(2, 9):
            cx = xs[col] + widths[col] / 2
            if row[col] == "✅":
                draw_check(c, cx, cy)
            else:
                draw_cross(c, cx, cy)
        draw_centered(c, row[9], xs[9], cy - 2.0, widths[9], "ArialBold", 6.1, white)

    sent = [34, 34, 29, 34, 32, 31, 34]
    missing = [2, 2, 7, 2, 4, 5, 2]
    sent_y = y_data_bottom - total_h / 2 - 2.6
    missing_y = y_data_bottom - total_h - total_h / 2 - 2.6
    c.setFillColor(NAVY)
    c.rect(x0, y_data_bottom - 2 * total_h, widths[0] + widths[1], 2 * total_h, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.line(xs[2], y_data_bottom - 2 * total_h, xs[2], y_data_bottom)
    c.line(x0, y_data_bottom - total_h, x0 + table_w, y_data_bottom - total_h)
    draw_centered(c, "TOTAL SUDAH", x0, sent_y, widths[0] + widths[1], "ArialBold", 9.0, GOLD_TEXT)
    draw_centered(c, "TOTAL BELUM", x0, missing_y, widths[0] + widths[1], "ArialBold", 9.0, GOLD_TEXT)
    for i, value in enumerate(sent):
        draw_centered(c, str(value), xs[i + 2], sent_y, widths[i + 2], "ArialBold", 8.2, white)
    for i, value in enumerate(missing):
        draw_centered(c, str(value), xs[i + 2], missing_y, widths[i + 2], "ArialBold", 8.2, white)
    draw_centered(c, "TOTAL", xs[9], sent_y, widths[9], "ArialBold", 8.6, GOLD_TEXT)
    draw_centered(c, "49", xs[9], missing_y, widths[9], "ArialBold", 10.0, white)


def draw_analysis_page(c: canvas.Canvas, background: Path) -> None:
    c.drawImage(str(background), 0, 0, width=PAGE_W, height=PAGE_H)
    c.setFillColor(NAVY)
    c.rect(247, 442.8, 465, 34.5, fill=1, stroke=0)
    draw_centered(c, "REKAP PENGIRIMAN LAPORAN URC", 247, 460.0, 465, "ArialBold", 11.0, white)
    draw_centered(c, "PERIODE 2 SEPTEMBER - 8 SEPTEMBER 2026", 247, 447.8, 465, "ArialBold", 10.5, white)

    left = (104, 202, 361, 239)
    right = (481, 202, 359, 239)
    for x, y, w, h in (left, right):
        c.setFillColor(NAVY_DARK)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.1)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=1)

    c.setFillColor(GOLD_TEXT)
    c.setFont("ArialBold", 15)
    c.drawString(left[0] + 18, 418, "ANALISA")
    c.drawString(right[0] + 28, 418, "EVALUASI")

    y = 392
    y = draw_wrapped_bullet(c, "Kepatuhan pelaporan berada pada 29-34 Polda per hari. Tertinggi 34 Polda pada 2, 3, 5, dan 8 September; terendah 29 Polda pada 4 September.", left[0] + 18, y, left[2] - 48, 8.7, 10.5)
    y = draw_wrapped_bullet(c, "Total 228 dari 252 kewajiban laporan terpenuhi (90,5%). Sebanyak 24 laporan belum dikirim, dengan puncak 7 Polda pada 4 September.", left[0] + 18, y, left[2] - 48, 8.7, 10.5)
    y = draw_wrapped_bullet(c, "Akumulasi hasil ungkap mencapai 49 kasus. Kontributor tertinggi: Sulawesi Tenggara 15 kasus, Jawa Tengah dan Sulawesi Utara masing-masing 7 kasus.", left[0] + 18, y, left[2] - 48, 8.7, 10.5)
    draw_wrapped_bullet(c, "Hasil ungkap berasal dari 8 Polda; 28 Polda nihil. Distribusi hasil ungkap masih belum merata.", left[0] + 18, y, left[2] - 48, 8.7, 10.5)

    y = 392
    y = draw_wrapped_bullet(c, "Perkuat disiplin pelaporan harian dan tindak lanjuti Polda yang belum mengirim, terutama Kalimantan Timur yang tidak mengirim pada 5 hari.", right[0] + 18, y, right[2] - 48, 8.7, 10.5)
    y = draw_wrapped_bullet(c, "Lakukan monitoring khusus terhadap Polda dengan ketidakpatuhan berulang, terutama Kalimantan Tengah dan Papua Tengah.", right[0] + 18, y, right[2] - 48, 8.7, 10.5)
    y = draw_wrapped_bullet(c, "Setiap laporan wajib mencantumkan hasil ungkap secara kuantitatif. Jika nihil, tuliskan 0/NIHIL secara konsisten dan sertakan keterangan singkat.", right[0] + 18, y, right[2] - 48, 8.7, 10.5)
    draw_wrapped_bullet(c, "Optimalkan kegiatan URC bersama fungsi lain dan Polres jajaran pada lokasi rawan C3 serta kejahatan jalanan.", right[0] + 18, y, right[2] - 48, 8.7, 10.5)

    c.setFillColor(NAVY_DARK)
    c.setStrokeColor(GOLD)
    c.roundRect(104, 83.5, 361, 111.5, 8, fill=1, stroke=1)
    c.setFillColor(GOLD_TEXT)
    c.setFont("ArialBold", 14.5)
    c.drawString(115, 174, "CATATAN / TINDAK LANJUT")
    y = 151
    y = draw_wrapped_bullet(c, "24 laporan belum dikirim selama periode 2-8 September 2026.", 119, y, 325, 8.6, 10.4, RED)
    y = draw_wrapped_bullet(c, "28 Polda nihil hasil ungkap; evaluasi sasaran patroli, kring serse, dan tindak lanjut hasil patroli perlu ditingkatkan.", 119, y, 325, 8.6, 10.4, RED)
    draw_wrapped_bullet(c, "Pastikan dokumentasi, publikasi, dan tautan pelaporan dilengkapi.", 119, y, 325, 8.6, 10.4, RED)

    c.setFillColor(NAVY_DARK)
    c.rect(51, 20, 860, 56, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(327, 26, 327, 70)
    c.line(618, 26, 618, 70)
    labels = [
        (51, 276, "TOTAL SUDAH TERTINGGI:", "34"),
        (327, 291, "TOTAL BELUM TERENDAH:", "2"),
        (618, 293, "TOTAL HASIL UNGKAP:", "49"),
    ]
    for x, width, label, value in labels:
        draw_centered(c, label, x, 55, width, "ArialBold", 9.0, white)
        draw_centered(c, value, x, 27, width, "ArialBold", 22.0, RED if value == "2" else GOLD_TEXT)


def build(output_pdf: Path, backgrounds: list[Path], pptx_inventory: Path) -> None:
    data = json.loads(pptx_inventory.read_text(encoding="utf-8"))
    rows = data["pptx"]["slides"][0]["tables"][0]
    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_pdf), pagesize=(PAGE_W, PAGE_H), pageCompression=1)

    c.drawImage(str(backgrounds[0]), 0, 0, width=PAGE_W, height=PAGE_H)
    overlay_date_band(c, 244, 210.8, 473, 31.5, 13.5)
    c.showPage()

    draw_table_page(c, backgrounds[1], rows)
    c.showPage()

    draw_analysis_page(c, backgrounds[2])
    c.showPage()

    c.drawImage(str(backgrounds[3]), 0, 0, width=PAGE_W, height=PAGE_H)
    overlay_date_band(c, 210, 150, 548, 49, 17.0)
    c.showPage()
    c.save()


def main() -> None:
    register_fonts()
    output_pdf = Path(sys.argv[1])
    background_dir = Path(sys.argv[2])
    pptx_inventory = Path(sys.argv[3])
    backgrounds = [background_dir / f"page-{index}.png" for index in range(1, 5)]
    build(output_pdf, backgrounds, pptx_inventory)


if __name__ == "__main__":
    main()
