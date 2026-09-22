import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const sourcePath = path.join(outputDir, "import-pengguna_batch2_siap_upload.xlsx");
const outputPath = path.join(outputDir, "import-pengguna_batch2_siap_upload_tanpa_satreskrim_serang.xlsx");
const previewDir = path.join(outputDir, "preview_batch2_tanpa_satreskrim_serang");
const excludedCode = "060.01.14.02.00.10";

await fs.mkdir(previewDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(sourcePath)));
const sheet = workbook.worksheets.getItem("Data Pengguna");

const before = await workbook.render({ sheetName: "Data Pengguna", range: "A1:H18", scale: 1.25, format: "png" });
await fs.writeFile(path.join(previewDir, "before.png"), new Uint8Array(await before.arrayBuffer()));

const sourceRows = sheet.getRange("A2:H105").values
  .map((row) => row.map((value) => value == null ? "" : String(value)))
  .filter((row) => row.some((value) => value !== ""));
const removedRows = sourceRows.filter((row) => row[6] === excludedCode);
const keptRows = sourceRows
  .filter((row) => row[6] !== excludedCode)
  .map((row) => {
    const updated = [...row];
    const nrpNip = updated[1].startsWith("'") ? updated[1].slice(1) : updated[1];
    if (/^\d{16,}$/.test(nrpNip)) updated[1] = `'${nrpNip}`;
    return updated;
  });
if (sourceRows.length !== 104) throw new Error(`Baris sumber tidak sesuai: ${sourceRows.length}`);
if (removedRows.length !== 45) throw new Error(`Baris SAT RESKRIM RES SERANG tidak sesuai: ${removedRows.length}`);
if (keptRows.length !== 59) throw new Error(`Baris tersisa tidak sesuai: ${keptRows.length}`);

const previousTable = sheet.tables.items[0];
const tableStyle = previousTable?.style || "TableStyleMedium2";
if (previousTable) previousTable.delete();
sheet.getRange("A2:H105").clear({ applyTo: "contents" });
sheet.getRange("A2").write(keptRows);
const lastRow = keptRows.length + 1;
const table = sheet.tables.add(`A1:H${lastRow}`, true, "DataPenggunaBatch2TanpaSatreskrimSerangTable");
table.style = tableStyle;

for (const column of ["B", "C", "D", "E", "G"]) {
  sheet.getRange(`${column}2:${column}${lastRow}`).format.numberFormat = "@";
}
sheet.getRange(`A1:A${lastRow}`).format.columnWidth = 48;
sheet.getRange(`B1:B${lastRow}`).format.columnWidth = 23;
sheet.getRange(`F2:F${lastRow}`).dataValidation = {
  rule: { type: "list", values: ["superadmin", "admin_binops", "operator", "viewer"] },
};
sheet.getRange(`H2:H${lastRow}`).dataValidation = {
  rule: { type: "list", values: ["AKTIF", "NONAKTIF"] },
};

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "Data Pengguna",
  range: `A1:H${lastRow}`,
  maxChars: 5000,
  tableMaxRows: 10,
  tableMaxCols: 8,
});
await fs.writeFile(path.join(outputDir, "batch2_tanpa_satreskrim_serang_inspect.ndjson"), inspect.ndjson ?? String(inspect), "utf8");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "Batch 2 tanpa Satreskrim Serang formula error scan",
});
await fs.writeFile(path.join(outputDir, "batch2_tanpa_satreskrim_serang_errors.ndjson"), errors.ndjson ?? String(errors), "utf8");

for (const [name, range] of [
  ["after_awal", "A1:H18"],
  ["after_akhir", `A${Math.max(2, lastRow - 15)}:H${lastRow}`],
]) {
  const image = await workbook.render({ sheetName: "Data Pengguna", range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({
  sourcePath,
  outputPath,
  sourceUsers: sourceRows.length,
  removedUsers: removedRows.length,
  remainingUsers: keptRows.length,
  excludedCode,
  removedNames: removedRows.map((row) => row[0]),
}, null, 2));
