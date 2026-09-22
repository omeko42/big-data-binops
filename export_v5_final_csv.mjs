import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const previewDir = path.join(outputDir, "preview_v5_csv");
const v4Path = path.join(outputDir, "master_satker_puskarda_V4_subdomain_pbd.xlsx");
const csvPath = path.join(outputDir, "master_satker_puskarda_V5_final_utf8.csv");
const reportPath = path.join(outputDir, "v5_csv_audit.json");
const rowCount = 13866;
const lastRow = rowCount + 1;

await fs.mkdir(previewDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(v4Path)));
const sheet = workbook.worksheets.getItem("Master Satker");

// Verifikasi visual baseline sebelum membuat representasi CSV tanpa styling.
const before = await workbook.render({
  sheetName: "Master Satker",
  range: "X1:AE30",
  scale: 1.25,
  format: "png",
});
await fs.writeFile(path.join(previewDir, "before_csv_export.png"), new Uint8Array(await before.arrayBuffer()));

const values = sheet.getRange(`A1:AH${lastRow}`).values;
if (values.length !== lastRow || values[0].length !== 34) {
  throw new Error(`Struktur tidak sesuai: ${values.length} baris x ${values[0]?.length ?? 0} kolom`);
}

const headers = values[0].map((value) => String(value ?? ""));
const expectedHeaders = [
  "id", "kode", "kode_canonical", "deskripsi", "parent_id", "root_id", "parent_kode", "depth",
  "is_root", "is_synthetic", "source", "synced_at", "created_at", "updated_at", "alamat", "provinsi",
  "kabupaten_kota", "kecamatan", "desa", "kode_pos", "longitude", "latitude", "jumlah_penduduk",
  "keanggotaan", "fungsi", "kinerja_aktif", "dors_kode", "dors_satker_id", "nama_satker_dors",
  "sub_domain", "operational_role", "dors_status", "tipe_satker", "urutan",
];
if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
  throw new Error("Header V4 tidak identik dengan 34 kolom master database");
}

let injectedContainerSubdomain = 0;
let rootBlankSubdomain = 0;
for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
  const row = values[rowIndex];
  const name = String(row[3] ?? "").trim().toUpperCase();
  const isRoot = String(row[8] ?? "").trim().toLowerCase() === "t";
  const tipe = String(row[32] ?? "").trim().toUpperCase();
  const currentSubdomain = String(row[29] ?? "").trim();
  const isContainer = ["POLDA", "POLRES", "POLSEK"].includes(tipe)
    || /^(?:POLDA|POLRES|POLRESTA|POLRESTABES|POLSEK)\b/.test(name);
  if (!currentSubdomain && !isRoot && isContainer) {
    row[29] = "INTERNAL RESERSE";
    injectedContainerSubdomain += 1;
  }
  if (!String(row[29] ?? "").trim() && isRoot) rootBlankSubdomain += 1;
}

if (injectedContainerSubdomain !== 1895 || rootBlankSubdomain !== 1) {
  throw new Error(`Audit sub_domain tidak sesuai: injected=${injectedContainerSubdomain}, rootBlank=${rootBlankSubdomain}`);
}

const encode = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = "\uFEFF" + values.map((row) => row.map(encode).join(",")).join("\r\n") + "\r\n";
await fs.writeFile(csvPath, csv, "utf8");

const subdomainCounts = {};
const blankCounts = {};
for (const header of expectedHeaders) blankCounts[header] = 0;
for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
  const row = values[rowIndex];
  const subdomain = String(row[29] ?? "").trim() || "(KOSONG)";
  subdomainCounts[subdomain] = (subdomainCounts[subdomain] ?? 0) + 1;
  for (let column = 0; column < expectedHeaders.length; column += 1) {
    if (!String(row[column] ?? "").trim()) blankCounts[expectedHeaders[column]] += 1;
  }
}

const rootRow = values.find((row, index) => index > 0 && String(row[0] ?? "") === "1");
const report = {
  csvPath,
  encoding: "UTF-8 with BOM",
  delimiter: ",",
  quoting: "all fields",
  rows: rowCount,
  columns: 34,
  injectedContainerSubdomain,
  subdomainCounts,
  rootCode: rootRow?.[1],
  rootCanonicalCode: rootRow?.[2],
  rootSubdomain: rootRow?.[29] ?? "",
  blankCounts,
};
await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report, null, 2));
