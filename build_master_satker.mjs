import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = process.cwd();
const outputDir = path.join(root, "outputs", "cas_master_satker_20260808");
const dataPath = path.join(outputDir, "master_satker_data.json");
const outputPath = path.join(outputDir, "master_satker_cas.xlsx");
const verificationDir = path.join(outputDir, "_verification");

const payload = JSON.parse(await fs.readFile(dataPath, "utf8"));
const { org, levels, enriched, stats } = payload;

function parseDbDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/.exec(value);
  if (!match) return value;
  const [, year, month, day, hour, minute, second, fraction = ""] = match;
  const millisecond = Number((fraction + "000").slice(0, 3));
  return new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    millisecond,
  ));
}

function styleTitle(sheet, range, text) {
  range.merge();
  range.values = [[text]];
  range.format = {
    fill: "#0B1F33",
    font: { bold: true, color: "#FFFFFF", size: 17 },
    verticalAlignment: "center",
    horizontalAlignment: "left",
  };
  range.format.rowHeight = 30;
  sheet.showGridLines = false;
}

function styleSubtitle(range, text) {
  range.merge();
  range.values = [[text]];
  range.format = {
    fill: "#E8F0F7",
    font: { color: "#334155", italic: true, size: 10 },
    verticalAlignment: "center",
    horizontalAlignment: "left",
  };
  range.format.rowHeight = 24;
}

function styleHeader(range) {
  range.format = {
    fill: "#0F766E",
    font: { bold: true, color: "#FFFFFF", size: 10 },
    verticalAlignment: "center",
    horizontalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: "#0B5D57" },
  };
  range.format.rowHeight = 32;
}

function addMetricCard(sheet, labelRange, valueRange, label, formula, color) {
  const labelCell = sheet.getRange(labelRange);
  const valueCell = sheet.getRange(valueRange);
  labelCell.merge();
  valueCell.merge();
  labelCell.values = [[label]];
  valueCell.formulas = [[formula]];
  labelCell.format = {
    fill: color,
    font: { bold: true, color: "#FFFFFF", size: 10 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color },
  };
  valueCell.format = {
    fill: "#FFFFFF",
    font: { bold: true, color: "#0B1F33", size: 18 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: "#CBD5E1" },
    numberFormat: "#,##0",
  };
}

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Ringkasan");
const master = workbook.worksheets.add("Master Satker");
const orgLevel = workbook.worksheets.add("Org Level");

const masterStartRow = 6;
const masterEndRow = masterStartRow + org.length - 1;
const levelStartRow = 6;
const levelEndRow = levelStartRow + levels.length - 1;

// Ringkasan
styleTitle(summary, summary.getRange("A1:H1"), "Ekspor Master Satker CAS");
styleSubtitle(
  summary.getRange("A2:H2"),
  "Sumber read-only: dump database aktif bareskrim pada storage (snapshot 24 November 2025)",
);

addMetricCard(summary, "A3:B3", "A4:B5", "TOTAL SATKER", `=COUNTA('Master Satker'!A${masterStartRow}:A${masterEndRow})`, "#0F766E");
addMetricCard(summary, "C3:D3", "C4:D5", "SATKER AKTIF", `=COUNTIF('Master Satker'!J${masterStartRow}:J${masterEndRow},"AKTIF")`, "#2563EB");
addMetricCard(summary, "E3:F3", "E4:F5", "LEVEL ORGANISASI", `=COUNTA('Org Level'!A${levelStartRow}:A${levelEndRow})`, "#7C3AED");
addMetricCard(summary, "G3:H3", "G4:H5", "ROOT", `=COUNTBLANK('Master Satker'!C${masterStartRow}:C${masterEndRow})`, "#D97706");
addMetricCard(summary, "A7:B7", "A8:B9", "PARENT YATIM", `=COUNTIF('Master Satker'!D${masterStartRow}:D${masterEndRow},"TIDAK DITEMUKAN")`, "#DC2626");
addMetricCard(summary, "C7:D7", "C8:D9", "LEVEL HILANG", `=COUNTIF('Master Satker'!F${masterStartRow}:F${masterEndRow},"TIDAK DITEMUKAN")`, "#DC2626");
addMetricCard(summary, "E7:F7", "E8:F9", "KEDALAMAN MAKS.", `=MAX('Master Satker'!H${masterStartRow}:H${masterEndRow})`, "#0891B2");
addMetricCard(summary, "G7:H7", "G8:H9", "SOFT DELETED", `=COUNTIF('Master Satker'!J${masterStartRow}:J${masterEndRow},"DIHAPUS")`, "#475569");

summary.getRange("A11:H11").merge();
summary.getRange("A11:H11").values = [["Catatan Sumber dan Validasi"]];
summary.getRange("A11:H11").format = {
  fill: "#DDE7F0",
  font: { bold: true, color: "#0B1F33", size: 11 },
  verticalAlignment: "center",
};
summary.getRange("A12:H17").values = [
  ["Server", "clouduser@10.0.0.x (host: storage)", null, null, "Database aktif", "bareskrim", null, null],
  ["Metode akses", "Read-only dari /home/clouduser/full_dump.sql", null, null, "Tanggal snapshot", "2025-11-24", null, null],
  ["Tanggal ekspor", "2026-08-08", null, null, "Versi lama dikecualikan", "bareskrim_old dan bareskrim_v1", null, null],
  ["ID duplikat", stats.duplicate_org_ids, null, null, "Parent yatim", stats.orphan_rows, null, null],
  ["Level hilang", stats.missing_level_rows, null, null, "Soft deleted", stats.soft_deleted_rows, null, null],
  ["Catatan", "Snapshot bukan data real-time; gunakan tanggal sumber saat rekonsiliasi.", null, null, null, null, null, null],
];
for (const row of [12, 13, 14, 15, 16]) {
  summary.getRange(`B${row}:D${row}`).merge();
  summary.getRange(`F${row}:H${row}`).merge();
}
summary.getRange("B17:H17").merge();
summary.getRange("A12:A17").format = {
  fill: "#F1F5F9",
  font: { bold: true, color: "#334155" },
  verticalAlignment: "top",
};
summary.getRange("E12:E16").format = {
  fill: "#F1F5F9",
  font: { bold: true, color: "#334155" },
  verticalAlignment: "top",
};
summary.getRange("B12:D17").format = {
  fill: "#FFFFFF",
  font: { color: "#1E293B" },
  wrapText: true,
  verticalAlignment: "top",
};
summary.getRange("F12:H16").format = {
  fill: "#FFFFFF",
  font: { color: "#1E293B" },
  wrapText: true,
  verticalAlignment: "top",
};
summary.getRange("A12:H17").format.borders = {
  preset: "inside",
  style: "thin",
  color: "#D7E0E8",
};
summary.getRange("A1:H17").format.font.name = "Aptos";
summary.getRange("A1:A17").format.columnWidth = 15;
summary.getRange("B1:B17").format.columnWidth = 15;
summary.getRange("C1:C17").format.columnWidth = 21;
summary.getRange("D1:D17").format.columnWidth = 15;
summary.getRange("E1:E17").format.columnWidth = 17;
summary.getRange("F1:F17").format.columnWidth = 15;
summary.getRange("G1:H17").format.columnWidth = 18;
summary.freezePanes.freezeRows(2);

// Master Satker
styleTitle(master, master.getRange("A1:M1"), "Master Satker CAS — bareskrim");
styleSubtitle(master.getRange("A2:M2"), "23.588 baris organisasi; relasi parent/level telah direkonsiliasi saat ekstraksi dan metrik ringkasan tetap formula-driven.");
master.getRange("A3:M3").merge();
master.getRange("A3:M3").values = [["Filter tersedia pada header tabel. ID dan kode dipertahankan sebagai identitas; tanggal ditampilkan dalam format ISO."]];
master.getRange("A3:M3").format = { fill: "#F8FAFC", font: { color: "#475569", size: 10 }, verticalAlignment: "center" };
master.getRange("A5:M5").values = [[
  "ID",
  "Nama Satker",
  "Parent ID",
  "Nama Parent",
  "Level ID",
  "Nama Level",
  "Path",
  "Kedalaman",
  "Jumlah Penduduk",
  "Status",
  "Created At",
  "Updated At",
  "Deleted At",
]];
styleHeader(master.getRange("A5:M5"));

const masterRows = enriched.map((row) => [
  row.id,
  row.nama_satker,
  row.parent_id,
  row.nama_parent,
  row.level_id,
  row.nama_level,
  row.path,
  row.kedalaman,
  row.jumlah_penduduk,
  row.status,
  parseDbDate(row.created_at),
  parseDbDate(row.updated_at),
  parseDbDate(row.deleted_at),
]);
master.getRange(`A${masterStartRow}:M${masterEndRow}`).values = masterRows;

master.getRange(`A${masterStartRow}:A${masterEndRow}`).format.numberFormat = "0";
master.getRange(`C${masterStartRow}:C${masterEndRow}`).format.numberFormat = "0";
master.getRange(`E${masterStartRow}:E${masterEndRow}`).format.numberFormat = "0";
master.getRange(`H${masterStartRow}:I${masterEndRow}`).format.numberFormat = "#,##0";
master.getRange(`K${masterStartRow}:M${masterEndRow}`).format.numberFormat = "yyyy-mm-dd hh:mm:ss";
master.getRange(`A${masterStartRow}:M${masterEndRow}`).format.font = { name: "Aptos", size: 9 };
master.getRange(`A${masterStartRow}:M${masterEndRow}`).format.verticalAlignment = "center";
master.getRange(`B${masterStartRow}:B${masterEndRow}`).format.wrapText = false;
master.getRange(`A${masterStartRow}:A${masterEndRow}`).format.horizontalAlignment = "right";
master.getRange(`C${masterStartRow}:C${masterEndRow}`).format.horizontalAlignment = "right";
master.getRange(`E${masterStartRow}:E${masterEndRow}`).format.horizontalAlignment = "right";
master.getRange(`H${masterStartRow}:I${masterEndRow}`).format.horizontalAlignment = "right";

master.getRange(`A1:A${masterEndRow}`).format.columnWidth = 11;
master.getRange(`B1:B${masterEndRow}`).format.columnWidth = 28;
master.getRange(`C1:C${masterEndRow}`).format.columnWidth = 11;
master.getRange(`D1:D${masterEndRow}`).format.columnWidth = 28;
master.getRange(`E1:E${masterEndRow}`).format.columnWidth = 10;
master.getRange(`F1:F${masterEndRow}`).format.columnWidth = 20;
master.getRange(`G1:G${masterEndRow}`).format.columnWidth = 25;
master.getRange(`H1:H${masterEndRow}`).format.columnWidth = 11;
master.getRange(`I1:I${masterEndRow}`).format.columnWidth = 15;
master.getRange(`J1:J${masterEndRow}`).format.columnWidth = 12;
master.getRange(`K1:M${masterEndRow}`).format.columnWidth = 20;
master.freezePanes.freezeRows(5);
master.freezePanes.freezeColumns(2);
const masterTable = master.tables.add(`A5:M${masterEndRow}`, true, "MasterSatkerTable");
masterTable.style = "TableStyleMedium2";
masterTable.showFilterButton = true;

// Org Level
styleTitle(orgLevel, orgLevel.getRange("A1:L1"), "Referensi Level Organisasi CAS");
styleSubtitle(orgLevel.getRange("A2:L2"), "Tabel pendamping untuk membaca struktur level organisasi pada master satker.");
orgLevel.getRange("A5:L5").values = [[
  "ID",
  "Nama Level",
  "Parent ID",
  "Nama Parent Level",
  "Path",
  "Kedalaman",
  "Status",
  "Created By",
  "Updated By",
  "Created At",
  "Updated At",
  "Deleted At",
]];
styleHeader(orgLevel.getRange("A5:L5"));
const levelById = new Map(levels.map((row) => [row.id, row]));
const levelRows = levels.map((row) => [
  row.id,
  row.level_name,
  row.parent_id,
  levelById.get(row.parent_id)?.level_name ?? null,
  row.path,
  (row.path ?? "").split("/").filter(Boolean).length,
  row.deleted_at ? "DIHAPUS" : "AKTIF",
  row.created_by,
  row.updated_by,
  parseDbDate(row.created_at),
  parseDbDate(row.updated_at),
  parseDbDate(row.deleted_at),
]);
orgLevel.getRange(`A${levelStartRow}:L${levelEndRow}`).values = levelRows;
orgLevel.getRange(`A${levelStartRow}:C${levelEndRow}`).format.numberFormat = "0";
orgLevel.getRange(`F${levelStartRow}:I${levelEndRow}`).format.numberFormat = "#,##0";
orgLevel.getRange(`J${levelStartRow}:L${levelEndRow}`).format.numberFormat = "yyyy-mm-dd hh:mm:ss";
orgLevel.getRange(`A${levelStartRow}:L${levelEndRow}`).format.font = { name: "Aptos", size: 9 };
orgLevel.getRange(`A1:A${levelEndRow}`).format.columnWidth = 10;
orgLevel.getRange(`B1:B${levelEndRow}`).format.columnWidth = 25;
orgLevel.getRange(`C1:C${levelEndRow}`).format.columnWidth = 11;
orgLevel.getRange(`D1:D${levelEndRow}`).format.columnWidth = 25;
orgLevel.getRange(`E1:E${levelEndRow}`).format.columnWidth = 20;
orgLevel.getRange(`F1:F${levelEndRow}`).format.columnWidth = 11;
orgLevel.getRange(`G1:G${levelEndRow}`).format.columnWidth = 12;
orgLevel.getRange(`H1:I${levelEndRow}`).format.columnWidth = 12;
orgLevel.getRange(`J1:L${levelEndRow}`).format.columnWidth = 20;
orgLevel.freezePanes.freezeRows(5);
orgLevel.freezePanes.freezeColumns(2);
const levelTable = orgLevel.tables.add(`A5:L${levelEndRow}`, true, "OrgLevelTable");
levelTable.style = "TableStyleMedium2";
levelTable.showFilterButton = true;

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(verificationDir, { recursive: true });

const summaryInspect = await workbook.inspect({
  kind: "table",
  range: "Ringkasan!A1:H17",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 10,
  maxChars: 8000,
});
await fs.writeFile(path.join(verificationDir, "summary_inspect.ndjson"), summaryInspect.ndjson, "utf8");

const masterInspect = await workbook.inspect({
  kind: "table",
  range: "'Master Satker'!A1:M12",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 13,
  maxChars: 8000,
});
await fs.writeFile(path.join(verificationDir, "master_inspect.ndjson"), masterInspect.ndjson, "utf8");

const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 5000,
});
await fs.writeFile(path.join(verificationDir, "formula_errors.ndjson"), formulaErrors.ndjson, "utf8");

for (const [sheetName, range, fileName] of [
  ["Ringkasan", "A1:H17", "ringkasan.png"],
  ["Master Satker", "A1:M18", "master_satker_top.png"],
  ["Org Level", "A1:L18", "org_level_top.png"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1.5, format: "png" });
  await fs.writeFile(path.join(verificationDir, fileName), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  masterRows: org.length,
  levelRows: levels.length,
  masterEndRow,
  levelEndRow,
}, null, 2));
