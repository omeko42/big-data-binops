import csv
import json
from pathlib import Path


ROOT = Path(r"C:\Users\KOKO98\Downloads")
MAX_SIZE = 200 * 1024 * 1024
MAX_HITS = 200


hits = []
files_scanned = 0
files_failed = []

for path in ROOT.rglob("*.csv"):
    if path.stat().st_size > MAX_SIZE:
        continue
    try:
        with path.open("r", encoding="utf-8-sig", errors="replace", newline="") as handle:
            reader = csv.DictReader(handle)
            if not reader.fieldnames:
                continue
            files_scanned += 1
            for row_number, row in enumerate(reader, start=2):
                for column, value in row.items():
                    text = (value or "").strip().lstrip("'")
                    if text.startswith("06-0"):
                        context = {
                            key: row.get(key)
                            for key in (
                                "satker_id",
                                "source_satker_id",
                                "mapped_satker_id",
                                "raw_satker_name",
                                "target_satker_nama",
                                "polda_teks",
                                "polres_teks",
                                "polsek_teks",
                            )
                            if key in row
                        }
                        hits.append(
                            {
                                "file": str(path),
                                "row": row_number,
                                "column": column,
                                "value": text,
                                "context": context,
                            }
                        )
                        if len(hits) >= MAX_HITS:
                            break
                if len(hits) >= MAX_HITS:
                    break
    except Exception as exc:
        files_failed.append({"file": str(path), "error": str(exc)})
    if len(hits) >= MAX_HITS:
        break

print(json.dumps({"files_scanned": files_scanned, "hits": hits, "failed": files_failed}, ensure_ascii=False, indent=2))
