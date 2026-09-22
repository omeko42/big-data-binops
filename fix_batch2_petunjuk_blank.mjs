import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const filePath = path.join(outputDir, "template-import-pengguna_batch2_siap_upload.xlsx");
const previewPath = path.join(outputDir, "preview_batch2_user_import", "after_petunjuk_fixed.png");

const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(filePath)));
const petunjuk = workbook.worksheets.getItem("Petunjuk");
petunjuk.getRange("A10:B10").clear({ applyTo: "contents" });

const image = await workbook.render({ sheetName: "Petunjuk", range: "A1:B12", scale: 1.25, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await image.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(filePath);
console.log(JSON.stringify({ filePath, cleared: "Petunjuk!A10:B10", previewPath }, null, 2));
