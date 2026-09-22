import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/Prototype CAS/EDIT MASTER MASAL/outputs/019fe01d-d395-7bd1-91da-86a66500c3bd/master_satker_puskarda_V2_injeksi.xlsx";
const outputPath = "D:/Prototype CAS/EDIT MASTER MASAL/outputs/019fe01d-d395-7bd1-91da-86a66500c3bd/preview_clean/v2_existing_vs_injected.png";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const preview = await wb.render({ sheetName: "Master Satker", range: "W395:Y400", scale: 1.75, format: "png" });
await fs.writeFile(outputPath, new Uint8Array(await preview.arrayBuffer()));
console.log(outputPath);
