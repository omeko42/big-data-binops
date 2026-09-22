import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const previewDir = path.join(outputDir, "preview_v4");
const v3Path = path.join(outputDir, "master_satker_puskarda_V3_kinerja_role.xlsx");
const v4Path = path.join(outputDir, "master_satker_puskarda_V4_subdomain_pbd.xlsx");
const mapPath = path.join(root, "bdb_satker_v4_map.json");
const rowCount = 13866;
const lastRow = rowCount + 1;
const blue = "#1D4ED8";

await fs.mkdir(previewDir, { recursive: true });
const v4Map = JSON.parse(await fs.readFile(mapPath, "utf8"));
const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(v3Path)));
const sheet = workbook.worksheets.getItem("Master Satker");

// Baseline render sebelum perubahan untuk memastikan format V3 tetap menjadi acuan.
for (const [name, range] of [
  ["before_subdomain", "X1:AE25"],
  ["before_polres_sorong", "A4168:E4182"],
]) {
  const preview = await workbook.render({ sheetName: "Master Satker", range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const ids = sheet.getRange(`A2:A${lastRow}`).values;
const canonicalValues = [];
const subdomainValues = [];
const changedCanonicalRows = [];
const injectedSubdomainRows = [];

for (let index = 0; index < ids.length; index += 1) {
  const id = String(ids[index][0] ?? "").trim();
  const item = v4Map[id];
  if (!item) throw new Error(`Hasil V4 tidak ditemukan untuk id=${id}`);
  const excelRow = index + 2;
  canonicalValues.push([item.kode_canonical_v4]);
  subdomainValues.push([item.sub_domain_v4]);
  if (item.kode_canonical_saat_ini !== item.kode_canonical_v4) changedCanonicalRows.push(excelRow);
  if (!item.sub_domain_saat_ini && item.sub_domain_v4) injectedSubdomainRows.push(excelRow);
}

sheet.getRange(`C2:C${lastRow}`).values = canonicalValues;
sheet.getRange(`AD2:AD${lastRow}`).values = subdomainValues;

function contiguousRuns(rows) {
  if (!rows.length) return [];
  const result = [];
  let start = rows[0];
  let end = rows[0];
  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (row === end + 1) end = row;
    else {
      result.push([start, end]);
      start = row;
      end = row;
    }
  }
  result.push([start, end]);
  return result;
}

// Biru hanya untuk data yang ditambahkan/diubah pada V4.
for (const [start, end] of contiguousRuns(changedCanonicalRows)) {
  sheet.getRange(`C${start}:C${end}`).format.font = { color: blue };
}
for (const [start, end] of contiguousRuns(injectedSubdomainRows)) {
  sheet.getRange(`AD${start}:AD${end}`).format.font = { color: blue };
}

const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 5000,
  tableMaxRows: 4,
  tableMaxCols: 34,
});
await fs.writeFile(path.join(outputDir, "v4_inspect.ndjson"), inspect.ndjson ?? String(inspect), "utf8");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "V4 formula error scan",
});
await fs.writeFile(path.join(outputDir, "v4_error_scan.ndjson"), errors.ndjson ?? String(errors), "utf8");

for (const [name, range] of [
  ["after_subdomain", "X1:AE30"],
  ["after_polres_sorong", "A4168:E4182"],
  ["after_polresta_sorong_kota", "A4369:E4383"],
  ["after_polda_pbd", "A11406:E11418"],
]) {
  const preview = await workbook.render({ sheetName: "Master Satker", range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(v4Path);

console.log(JSON.stringify({
  v4Path,
  rows: rowCount,
  columns: 34,
  changedCanonical: changedCanonicalRows.length,
  injectedSubdomain: injectedSubdomainRows.length,
}, null, 2));
