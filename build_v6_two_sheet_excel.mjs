import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const previewDir = path.join(outputDir, "preview_v6");
const v4Path = path.join(outputDir, "master_satker_puskarda_V4_subdomain_pbd.xlsx");
const v5CsvPath = path.join(outputDir, "master_satker_puskarda_V5_final_utf8.csv");
const v6Path = path.join(outputDir, "master_satker_puskarda_V6_V4_dan_CSV.xlsx");
const rowCount = 13866;
const lastRow = rowCount + 1;
const usedRange = `A1:AH${lastRow}`;
const navy = "#12355B";

await fs.mkdir(previewDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(v4Path)));
const v4Sheet = workbook.worksheets.getItem("Master Satker");

// Baseline render dilakukan sebelum workbook diubah.
const baseline = await workbook.render({ sheetName: "Master Satker", range: "A1:J20", scale: 1.25, format: "png" });
await fs.writeFile(path.join(previewDir, "baseline_v4.png"), new Uint8Array(await baseline.arrayBuffer()));

v4Sheet.name = "V4";

const csvText = (await fs.readFile(v5CsvPath, "utf8")).replace(/^\uFEFF/, "");
const csvWorkbook = await Workbook.fromCSV(csvText, { sheetName: "CSV Source" });
const csvSource = csvWorkbook.worksheets.getItem("CSV Source");
const csvValues = csvSource.getRange(usedRange).values;
if (csvValues.length !== lastRow || csvValues[0].length !== 34) {
  throw new Error(`CSV tidak sesuai: ${csvValues.length} baris x ${csvValues[0]?.length ?? 0} kolom`);
}

const csvSheet = workbook.worksheets.add("CSV");
csvSheet.getRange(usedRange).values = csvValues;
csvSheet.showGridLines = false;
csvSheet.freezePanes.freezeRows(1);
csvSheet.freezePanes.freezeColumns(3);
csvSheet.getRange(usedRange).format.font = { name: "Aptos", size: 10, color: "#17212B" };
csvSheet.getRange("A1:AH1").format = {
  fill: navy,
  font: { name: "Aptos", size: 10, bold: true, color: "#FFFFFF" },
  rowHeight: 32,
  wrapText: true,
  verticalAlignment: "center",
};

// Kolom identifier dipaksa sebagai teks agar nol depan tetap utuh di Excel.
for (const col of ["B", "C", "G", "T", "AA", "AB"]) {
  csvSheet.getRange(`${col}2:${col}${lastRow}`).format.numberFormat = "@";
}
csvSheet.getRange(`A1:A${lastRow}`).format.columnWidth = 10;
csvSheet.getRange(`B1:C${lastRow}`).format.columnWidth = 24;
csvSheet.getRange(`D1:D${lastRow}`).format.columnWidth = 34;
csvSheet.getRange(`E1:K${lastRow}`).format.columnWidth = 14;
csvSheet.getRange(`L1:N${lastRow}`).format.columnWidth = 22;
csvSheet.getRange(`O1:O${lastRow}`).format.columnWidth = 40;
csvSheet.getRange(`P1:T${lastRow}`).format.columnWidth = 20;
csvSheet.getRange(`U1:W${lastRow}`).format.columnWidth = 16;
csvSheet.getRange(`X1:Y${lastRow}`).format.columnWidth = 22;
csvSheet.getRange(`Z1:AH${lastRow}`).format.columnWidth = 20;
const csvTable = csvSheet.tables.add(usedRange, true, "MasterSatkerCSVTable");
csvTable.style = "TableStyleMedium2";

const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 6000,
  tableMaxRows: 4,
  tableMaxCols: 12,
});
await fs.writeFile(path.join(outputDir, "v6_inspect.ndjson"), inspect.ndjson ?? String(inspect), "utf8");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "V6 formula error scan",
});
await fs.writeFile(path.join(outputDir, "v6_error_scan.ndjson"), errors.ndjson ?? String(errors), "utf8");

for (const [sheetName, name, range] of [
  ["V4", "v4_awal", "A1:J20"],
  ["V4", "v4_klasifikasi", "X1:AE30"],
  ["CSV", "csv_awal", "A1:J20"],
  ["CSV", "csv_klasifikasi", "X1:AE30"],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(v6Path);
console.log(JSON.stringify({
  v6Path,
  sheets: ["V4", "CSV"],
  rowsPerSheet: rowCount,
  columnsPerSheet: 34,
  csvRootCode: String(csvValues[1][1]),
  csvRootCanonicalCode: String(csvValues[1][2]),
}, null, 2));
