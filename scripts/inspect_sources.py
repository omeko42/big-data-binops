from __future__ import annotations

import json
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from pypdf import PdfReader


PML = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"


def inspect_pdf(path: Path) -> dict:
    reader = PdfReader(str(path))
    pages = []
    for index, page in enumerate(reader.pages, start=1):
        pages.append({"page": index, "text": page.extract_text() or ""})
    return {"page_count": len(reader.pages), "pages": pages}


def inspect_pptx(path: Path) -> dict:
    slides = []
    with zipfile.ZipFile(path) as archive:
        slide_names = sorted(
            (name for name in archive.namelist() if name.startswith("ppt/slides/slide") and name.endswith(".xml")),
            key=lambda name: int(Path(name).stem.replace("slide", "")),
        )
        for name in slide_names:
            root = ET.fromstring(archive.read(name))
            texts = [node.text or "" for node in root.findall(f".//{{{A}}}t")]
            tables = []
            for table in root.findall(f".//{{{A}}}tbl"):
                rows = []
                for row in table.findall(f"{{{A}}}tr"):
                    cells = []
                    for cell in row.findall(f"{{{A}}}tc"):
                        cells.append(" ".join(node.text or "" for node in cell.findall(f".//{{{A}}}t")))
                    rows.append(cells)
                tables.append(rows)
            slides.append({
                "slide": int(Path(name).stem.replace("slide", "")),
                "texts": texts,
                "tables": tables,
            })
    return {"slide_count": len(slides), "slides": slides}


def main() -> None:
    pdf_path = Path(sys.argv[1])
    pptx_path = Path(sys.argv[2])
    output_path = Path(sys.argv[3])
    result = {"pdf": inspect_pdf(pdf_path), "pptx": inspect_pptx(pptx_path)}
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
