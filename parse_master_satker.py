import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "master_satker_source.sql"
OUT = ROOT / "outputs" / "cas_master_satker_20260808"

ORG_COLUMNS = [
    "id",
    "name",
    "path",
    "parent_id",
    "jumlah_penduduk",
    "organisasi_level_id",
    "created_by",
    "updated_by",
    "deleted_by",
    "created_at",
    "updated_at",
    "deleted_at",
]

LEVEL_COLUMNS = [
    "id",
    "level_name",
    "parent_id",
    "path",
    "created_by",
    "updated_by",
    "deleted_by",
    "created_at",
    "updated_at",
    "deleted_at",
]

NUMERIC_COLUMNS = {
    "id",
    "parent_id",
    "jumlah_penduduk",
    "organisasi_level_id",
    "created_by",
    "updated_by",
    "deleted_by",
}


def decode_mysql_escape(char: str) -> str:
    return {
        "0": "\0",
        "b": "\b",
        "n": "\n",
        "r": "\r",
        "t": "\t",
        "Z": "\x1a",
        "\\": "\\",
        "'": "'",
        '"': '"',
    }.get(char, char)


def parse_tuple_line(line: str) -> list:
    text = line.rstrip("\r\n").strip()
    if text[-1:] in {",", ";"}:
        text = text[:-1]
    if not (text.startswith("(") and text.endswith(")")):
        raise ValueError(f"Unexpected tuple syntax: {text[:80]!r}")
    text = text[1:-1]

    fields = []
    token = []
    in_quote = False
    was_quoted = False
    i = 0
    while i < len(text):
        char = text[i]
        if in_quote:
            if char == "\\" and i + 1 < len(text):
                token.append(decode_mysql_escape(text[i + 1]))
                i += 2
                continue
            if char == "'":
                if i + 1 < len(text) and text[i + 1] == "'":
                    token.append("'")
                    i += 2
                    continue
                in_quote = False
                i += 1
                continue
            token.append(char)
            i += 1
            continue

        if char == "'":
            in_quote = True
            was_quoted = True
        elif char == ",":
            raw = "".join(token).strip()
            fields.append(raw if was_quoted or raw.upper() != "NULL" else None)
            token = []
            was_quoted = False
        else:
            token.append(char)
        i += 1

    if in_quote:
        raise ValueError("Unterminated quoted value")
    raw = "".join(token).strip()
    fields.append(raw if was_quoted or raw.upper() != "NULL" else None)
    return fields


def normalize_row(columns: list[str], values: list) -> dict:
    if len(columns) != len(values):
        raise ValueError(f"Expected {len(columns)} fields, got {len(values)}")
    row = dict(zip(columns, values))
    for column in NUMERIC_COLUMNS.intersection(row):
        value = row[column]
        row[column] = int(value) if value not in (None, "") else None
    return row


def parse_source() -> tuple[list[dict], list[dict]]:
    rows = {"tm_org": [], "tm_org_level": []}
    current = None
    with SOURCE.open("r", encoding="utf-8-sig", newline="") as source:
        for line_number, line in enumerate(source, start=1):
            if line.startswith("INSERT INTO `tm_org` "):
                current = "tm_org"
                continue
            if line.startswith("INSERT INTO `tm_org_level` "):
                current = "tm_org_level"
                continue
            if not line.lstrip().startswith("("):
                continue
            columns = ORG_COLUMNS if current == "tm_org" else LEVEL_COLUMNS
            try:
                parsed = normalize_row(columns, parse_tuple_line(line))
            except Exception as exc:
                raise ValueError(f"Parse failure at source line {line_number}: {exc}") from exc
            rows[current].append(parsed)
            if line.rstrip().endswith(";"):
                current = None
    return rows["tm_org"], rows["tm_org_level"]


def enrich(org_rows: list[dict], level_rows: list[dict]) -> tuple[list[dict], dict]:
    by_id = {row["id"]: row for row in org_rows}
    level_by_id = {row["id"]: row for row in level_rows}
    enriched = []
    for row in org_rows:
        parent = by_id.get(row["parent_id"])
        level = level_by_id.get(row["organisasi_level_id"])
        path = row["path"] or ""
        enriched.append(
            {
                "id": row["id"],
                "nama_satker": row["name"],
                "parent_id": row["parent_id"],
                "nama_parent": parent["name"] if parent else None,
                "level_id": row["organisasi_level_id"],
                "nama_level": level["level_name"] if level else None,
                "path": row["path"],
                "kedalaman": path.count("/"),
                "jumlah_penduduk": row["jumlah_penduduk"],
                "status": "DIHAPUS" if row["deleted_at"] else "AKTIF",
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "deleted_at": row["deleted_at"],
            }
        )

    ids = [row["id"] for row in org_rows]
    roots = [row for row in org_rows if row["parent_id"] is None]
    orphans = [
        row
        for row in org_rows
        if row["parent_id"] is not None and row["parent_id"] not in by_id
    ]
    missing_levels = [
        row
        for row in org_rows
        if row["organisasi_level_id"] is not None
        and row["organisasi_level_id"] not in level_by_id
    ]
    stats = {
        "org_rows": len(org_rows),
        "level_rows": len(level_rows),
        "duplicate_org_ids": len(ids) - len(set(ids)),
        "root_rows": len(roots),
        "orphan_rows": len(orphans),
        "missing_level_rows": len(missing_levels),
        "soft_deleted_rows": sum(1 for row in org_rows if row["deleted_at"]),
        "max_depth": max((row["kedalaman"] for row in enriched), default=0),
    }
    return enriched, stats


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    org_rows, level_rows = parse_source()
    enriched, stats = enrich(org_rows, level_rows)

    write_csv(OUT / "master_satker_cas.csv", list(enriched[0]), enriched)
    write_csv(OUT / "org_level_cas.csv", LEVEL_COLUMNS, level_rows)
    (OUT / "master_satker_data.json").write_text(
        json.dumps(
            {"org": org_rows, "levels": level_rows, "enriched": enriched, "stats": stats},
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
