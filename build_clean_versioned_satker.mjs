import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const previewDir = path.join(outputDir, "preview_clean");
const v1Path = path.join(outputDir, "master_satker_puskarda_V1_asli.xlsx");
const v2Path = path.join(outputDir, "master_satker_puskarda_V2_injeksi.xlsx");
const stripBom = (text) => text.replace(/^\uFEFF/, "").replace(/^ï»¿/, "");
const csvText = stripBom(await fs.readFile(path.join(root, "bdb_satker_raw.csv"), "utf8"));
const injectionMap = JSON.parse(await fs.readFile(path.join(root, "bdb_satker_injection_map.json"), "utf8"));

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const rowCount = 13866;
const lastRow = rowCount + 1;
const usedRange = `A1:AH${lastRow}`;
const navy = "#12355B";

function styleSingleSheet(sheet, tableName, highlightClassification = false) {
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  sheet.freezePanes.freezeColumns(3);
  sheet.getRange(usedRange).format.font = { name: "Aptos", size: 10, color: "#17212B" };
  sheet.getRange("A1:AH1").format = {
    fill: navy,
    font: { name: "Aptos", size: 10, bold: true, color: "#FFFFFF" },
    rowHeight: 32,
    wrapText: true,
    verticalAlignment: "center",
  };
  for (const col of ["B", "C", "G", "T", "AA"]) {
    sheet.getRange(`${col}2:${col}${lastRow}`).format.numberFormat = "@";
  }
  sheet.getRange(`A1:A${lastRow}`).format.columnWidth = 10;
  sheet.getRange(`B1:C${lastRow}`).format.columnWidth = 24;
  sheet.getRange(`D1:D${lastRow}`).format.columnWidth = 34;
  sheet.getRange(`E1:K${lastRow}`).format.columnWidth = 14;
  sheet.getRange(`L1:N${lastRow}`).format.columnWidth = 22;
  sheet.getRange(`O1:O${lastRow}`).format.columnWidth = 40;
  sheet.getRange(`P1:T${lastRow}`).format.columnWidth = 20;
  sheet.getRange(`U1:W${lastRow}`).format.columnWidth = 16;
  sheet.getRange(`X1:Y${lastRow}`).format.columnWidth = 22;
  sheet.getRange(`Z1:AH${lastRow}`).format.columnWidth = 20;
  const table = sheet.tables.add(usedRange, true, tableName);
  table.style = "TableStyleMedium2";
  if (highlightClassification) {
    sheet.getRange(`X2:Y${lastRow}`).format.fill = "#E8F5EE";
  }
}

// V1: satu sheet, tepat 34 kolom dari DB, tanpa tambahan apa pun.
const v1 = await Workbook.fromCSV(csvText, { sheetName: "Master Satker" });
const v1Sheet = v1.worksheets.getItem("Master Satker");
styleSingleSheet(v1Sheet, "MasterSatkerV1Table", false);

// V2: struktur identik, hanya nilai kolom existing keanggotaan/fungsi yang diisi.
const v2 = await Workbook.fromCSV(csvText, { sheetName: "Master Satker" });
const v2Sheet = v2.worksheets.getItem("Master Satker");
const ids = v2Sheet.getRange(`A2:A${lastRow}`).values;
const classifications = [];
const membershipExistingRows = [];
const functionExistingRows = [];
for (let index = 0; index < ids.length; index += 1) {
  const row = ids[index];
  const id = String(row[0] ?? "").trim();
  const item = injectionMap[id];
  if (!item) throw new Error(`Tidak ada hasil inferensi untuk id=${id}`);
  const excelRow = index + 2;
  if (item.keanggotaan_saat_ini) membershipExistingRows.push(excelRow);
  if (item.fungsi_saat_ini) functionExistingRows.push(excelRow);
  classifications.push([
    item.keanggotaan_saat_ini || item.keanggotaan_usulan,
    item.fungsi_saat_ini || item.fungsi_usulan,
  ]);
}
v2Sheet.getRange(`X2:Y${lastRow}`).values = classifications;
styleSingleSheet(v2Sheet, "MasterSatkerV2Table", false);
// Biru = hasil injeksi; hitam = nilai yang memang sudah ada pada V1.
v2Sheet.getRange(`X2:X${lastRow}`).format.font = { color: "#1D4ED8" };
v2Sheet.getRange(`Y2:Y${lastRow}`).format.font = { color: "#1D4ED8" };
for (const excelRow of membershipExistingRows) {
  v2Sheet.getRange(`X${excelRow}`).format.font = { color: "#17212B" };
}
for (const excelRow of functionExistingRows) {
  v2Sheet.getRange(`Y${excelRow}`).format.font = { color: "#17212B" };
}

for (const [label, wb, sheetName] of [
  ["v1", v1, "Master Satker"],
  ["v2", v2, "Master Satker"],
]) {
  const inspect = await wb.inspect({
    kind: "sheet,table",
    maxChars: 5000,
    tableMaxRows: 4,
    tableMaxCols: 10,
  });
  await fs.writeFile(path.join(outputDir, `${label}_clean_inspect.ndjson`), inspect.ndjson ?? String(inspect), "utf8");
  const errors = await wb.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 100 },
    summary: `${label} formula error scan`,
  });
  await fs.writeFile(path.join(outputDir, `${label}_clean_error_scan.ndjson`), errors.ndjson ?? String(errors), "utf8");
  for (const [suffix, range] of [["struktur", "A1:J20"], ["klasifikasi", "W1:Y25"]]) {
    const preview = await wb.render({ sheetName, range, scale: 1.25, format: "png" });
    await fs.writeFile(path.join(previewDir, `${label}_${suffix}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
}

const v1Output = await SpreadsheetFile.exportXlsx(v1);
await v1Output.save(v1Path);
const v2Output = await SpreadsheetFile.exportXlsx(v2);
await v2Output.save(v2Path);

console.log(JSON.stringify({ v1Path, v2Path, rows: rowCount, columns: 34 }, null, 2));
