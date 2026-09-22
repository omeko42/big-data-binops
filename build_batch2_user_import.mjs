import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const templatePath = "C:/Users/KOKO98/Downloads/template-import-pengguna (1).xlsx";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const analysisDir = path.join(outputDir, "batch2_user_analysis");
const previewDir = path.join(outputDir, "preview_batch2_user_import");
const outputPath = path.join(outputDir, "template-import-pengguna_batch2_siap_upload.xlsx");

await fs.mkdir(previewDir, { recursive: true });

const prepared = JSON.parse(await fs.readFile(path.join(analysisDir, "prepared_user_import.json"), "utf8"));
const users = prepared.users;
const satkers = prepared.satkers;
if (users.length !== 104) throw new Error(`Jumlah pengguna tidak sesuai: ${users.length}`);
if (satkers.length !== 13865) throw new Error(`Jumlah daftar satker tidak sesuai: ${satkers.length}`);

const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(templatePath)));
const dataSheet = workbook.worksheets.getItem("Data Pengguna");
const satkerSheet = workbook.worksheets.getItem("Daftar Satker");

// Render baseline template sebelum perubahan.
for (const [sheetName, fileName, range] of [
  ["Data Pengguna", "before_data_pengguna", "A1:H2"],
  ["Daftar Satker", "before_daftar_satker", "A1:C18"],
  ["Petunjuk", "before_petunjuk", "A1:B12"],
]) {
  const image = await workbook.render({ sheetName, range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${fileName}.png`), new Uint8Array(await image.arrayBuffer()));
}

const userRows = users.map((item) => [
  item["Nama"],
  item["NRP/NIP"],
  item["Email"],
  item["Email Dinas Polri"],
  item["Username"],
  item["Role"],
  item["Kode atau Nama Satker"],
  item["Status"],
]);
const userLastRow = userRows.length + 1;

const oldUserTable = dataSheet.tables.items[0];
const userTableStyle = oldUserTable?.style || "TableStyleMedium2";
if (oldUserTable) oldUserTable.delete();
dataSheet.getRange("A2:H2").clear({ applyTo: "contents" });
dataSheet.getRange("A2").write(userRows);
const userTable = dataSheet.tables.add(`A1:H${userLastRow}`, true, "DataPenggunaBatch2Table");
userTable.style = userTableStyle;

dataSheet.showGridLines = false;
dataSheet.freezePanes.freezeRows(1);
dataSheet.getRange(`A1:H${userLastRow}`).format.verticalAlignment = "center";
dataSheet.getRange(`A2:H${userLastRow}`).format.font = {
  name: "Aptos",
  size: 10,
  color: "#17212B",
  italic: false,
};
for (const column of ["B", "C", "D", "E", "G"]) {
  dataSheet.getRange(`${column}2:${column}${userLastRow}`).format.numberFormat = "@";
}
dataSheet.getRange(`A1:A${userLastRow}`).format.columnWidth = 32;
dataSheet.getRange(`B1:B${userLastRow}`).format.columnWidth = 18;
dataSheet.getRange(`C1:D${userLastRow}`).format.columnWidth = 30;
dataSheet.getRange(`E1:E${userLastRow}`).format.columnWidth = 24;
dataSheet.getRange(`F1:F${userLastRow}`).format.columnWidth = 15;
dataSheet.getRange(`G1:G${userLastRow}`).format.columnWidth = 28;
dataSheet.getRange(`H1:H${userLastRow}`).format.columnWidth = 14;
dataSheet.getRange(`A2:H${userLastRow}`).format.rowHeight = 22;
dataSheet.getRange(`F2:F${userLastRow}`).dataValidation = {
  rule: { type: "list", values: ["superadmin", "admin_binops", "operator", "viewer"] },
};
dataSheet.getRange(`H2:H${userLastRow}`).dataValidation = {
  rule: { type: "list", values: ["AKTIF", "NONAKTIF"] },
};

const satkerRows = satkers.map((item) => [
  item["Kode"],
  item["Nama Satker"],
  item["Jalur (Polda > Polres > Polsek > Satuan)"],
]);
const satkerLastRow = satkerRows.length + 1;
satkerSheet.getRange(`A2:C${satkerLastRow}`).clear({ applyTo: "contents" });
satkerSheet.getRange("A2").write(satkerRows);
satkerSheet.showGridLines = false;
satkerSheet.freezePanes.freezeRows(1);
satkerSheet.getRange(`A2:C${satkerLastRow}`).format.font = {
  name: "Aptos",
  size: 10,
  color: "#17212B",
  italic: false,
};
satkerSheet.getRange(`A2:A${satkerLastRow}`).format.numberFormat = "@";
satkerSheet.getRange(`A1:A${satkerLastRow}`).format.columnWidth = 28;
satkerSheet.getRange(`B1:B${satkerLastRow}`).format.columnWidth = 46;
satkerSheet.getRange(`C1:C${satkerLastRow}`).format.columnWidth = 92;
satkerSheet.getRange(`A1:C${satkerLastRow}`).format.verticalAlignment = "center";

const changedUserRows = users
  .map((item, index) => ({ item, sheetRow: index + 2 }))
  .filter(({ item }) => item.kode_asli !== item["Kode atau Nama Satker"]);
const pbdIndex = satkers.findIndex((item) => item["Nama Satker"] === "POLRESTA SORONG KOTA");
if (pbdIndex < 0) throw new Error("POLRESTA SORONG KOTA tidak ditemukan pada Daftar Satker");
const pbdSheetRow = pbdIndex + 2;

const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 7000,
  tableMaxRows: 8,
  tableMaxCols: 8,
});
await fs.writeFile(path.join(outputDir, "batch2_user_final_inspect.ndjson"), inspect.ndjson ?? String(inspect), "utf8");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "Batch 2 user import formula error scan",
});
await fs.writeFile(path.join(outputDir, "batch2_user_final_error_scan.ndjson"), errors.ndjson ?? String(errors), "utf8");

for (const [sheetName, fileName, range] of [
  ["Data Pengguna", "after_data_awal", "A1:H22"],
  ["Data Pengguna", "after_data_akhir", `A${Math.max(2, userLastRow - 17)}:H${userLastRow}`],
  ["Data Pengguna", "after_data_kode_diubah", `A${Math.max(2, changedUserRows[0].sheetRow - 2)}:H${Math.min(userLastRow, changedUserRows[0].sheetRow + 9)}`],
  ["Daftar Satker", "after_satker_awal", "A1:C24"],
  ["Daftar Satker", "after_satker_papua_barat_daya", `A${Math.max(2, pbdSheetRow - 2)}:C${Math.min(satkerLastRow, pbdSheetRow + 24)}`],
  ["Petunjuk", "after_petunjuk", "A1:B12"],
]) {
  const image = await workbook.render({ sheetName, range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${fileName}.png`), new Uint8Array(await image.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  userRows: users.length,
  excludedDuplicates: prepared.excluded_duplicates.map((item) => item.excel_row),
  changedUserCodes: changedUserRows.length,
  satkerRows: satkers.length,
  changedSatkerCodes: prepared.summary.satker_directory_codes_changed,
  changedSatkerPaths: prepared.summary.satker_directory_paths_changed,
  pbdSheetRow,
  sheets: workbook.worksheets.items.map((sheet) => sheet.name),
}, null, 2));
