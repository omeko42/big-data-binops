import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const previewDir = path.join(outputDir, "preview_v3");
const v2Path = path.join(outputDir, "master_satker_puskarda_V2_injeksi.xlsx");
const v3Path = path.join(outputDir, "master_satker_puskarda_V3_kinerja_role.xlsx");
const mapPath = path.join(root, "bdb_satker_v3_map.json");
const rowCount = 13866;
const lastRow = rowCount + 1;
const blue = "#1D4ED8";

await fs.mkdir(previewDir, { recursive: true });
const v3Map = JSON.parse(await fs.readFile(mapPath, "utf8"));
const v2Bytes = new Uint8Array(await fs.readFile(v2Path));
const workbook = await SpreadsheetFile.importXlsx(v2Bytes);
const sheet = workbook.worksheets.getItem("Master Satker");

const ids = sheet.getRange(`A2:A${lastRow}`).values;
const kinerjaValues = [];
const roleValues = [];
const changedKinerjaRows = [];
const injectedRoleRows = [];

for (let index = 0; index < ids.length; index += 1) {
  const id = String(ids[index][0] ?? "").trim();
  const item = v3Map[id];
  if (!item) throw new Error(`Hasil V3 tidak ditemukan untuk id=${id}`);
  const excelRow = index + 2;
  kinerjaValues.push([item.kinerja_aktif_v3]);
  roleValues.push([item.operational_role_v3]);
  if (item.kinerja_saat_ini !== item.kinerja_aktif_v3) changedKinerjaRows.push(excelRow);
  if (!item.operational_role_saat_ini && item.operational_role_v3) injectedRoleRows.push(excelRow);
}

sheet.getRange(`Z2:Z${lastRow}`).values = kinerjaValues;
sheet.getRange(`AE2:AE${lastRow}`).values = roleValues;

function contiguousRuns(rows) {
  if (!rows.length) return [];
  const result = [];
  let start = rows[0];
  let end = rows[0];
  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (row === end + 1) {
      end = row;
    } else {
      result.push([start, end]);
      start = row;
      end = row;
    }
  }
  result.push([start, end]);
  return result;
}

// Biru hanya menandai isi yang berubah/ditambahkan pada V3.
for (const [start, end] of contiguousRuns(changedKinerjaRows)) {
  sheet.getRange(`Z${start}:Z${end}`).format.font = { color: blue };
}
for (const [start, end] of contiguousRuns(injectedRoleRows)) {
  sheet.getRange(`AE${start}:AE${end}`).format.font = { color: blue };
}

const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 5000,
  tableMaxRows: 4,
  tableMaxCols: 34,
});
await fs.writeFile(path.join(outputDir, "v3_inspect.ndjson"), inspect.ndjson ?? String(inspect), "utf8");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "V3 formula error scan",
});
await fs.writeFile(path.join(outputDir, "v3_error_scan.ndjson"), errors.ndjson ?? String(errors), "utf8");

for (const [name, range] of [
  ["v3_kinerja_role_awal", "X1:AE30"],
  ["v3_kinerja_role_tengah", "X6500:AE6530"],
]) {
  const preview = await workbook.render({ sheetName: "Master Satker", range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(v3Path);

console.log(JSON.stringify({
  v3Path,
  rows: rowCount,
  columns: 34,
  changedKinerja: changedKinerjaRows.length,
  injectedOperationalRole: injectedRoleRows.length,
  kinerjaBlueRuns: contiguousRuns(changedKinerjaRows).length,
  roleBlueRuns: contiguousRuns(injectedRoleRows).length,
}, null, 2));
