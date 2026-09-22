import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const workbookPath = path.join(outputDir, "template-import-pengguna_batch2_siap_upload.xlsx");
const preparedPath = path.join(outputDir, "batch2_user_analysis", "prepared_user_import.json");
const previewPath = path.join(outputDir, "preview_batch2_user_import", "after_nrp_apostrophe.png");

const prepared = JSON.parse(await fs.readFile(preparedPath, "utf8"));
const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(workbookPath)));
const sheet = workbook.worksheets.getItem("Data Pengguna");

const changedRows = [];
for (let index = 0; index < prepared.users.length; index += 1) {
  const nrp = String(prepared.users[index]["NRP/NIP"] ?? "");
  if (!nrp.startsWith("0")) continue;
  const sheetRow = index + 2;
  sheet.getRange(`B${sheetRow}`).values = [[`'${nrp}`]];
  sheet.getRange(`B${sheetRow}`).format.numberFormat = "@";
  changedRows.push(sheetRow);
}
if (changedRows.length !== 24) throw new Error(`Jumlah NRP berawalan nol tidak sesuai: ${changedRows.length}`);

const firstChanged = changedRows[0];
const image = await workbook.render({
  sheetName: "Data Pengguna",
  range: `A${Math.max(1, firstChanged - 2)}:H${Math.min(prepared.users.length + 1, firstChanged + 7)}`,
  scale: 1.25,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(workbookPath);
console.log(JSON.stringify({ workbookPath, prefixedNrpRows: changedRows.length, changedRows, previewPath }, null, 2));
