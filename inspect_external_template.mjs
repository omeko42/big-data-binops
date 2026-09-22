import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const source = "C:/Users/KOKO98/Downloads/template-import-satker-eksternal.xlsx";
const outputDir = "D:/Prototype CAS/EDIT MASTER MASAL/outputs/019fe01d-d395-7bd1-91da-86a66500c3bd/template_external_inspect";
await fs.mkdir(outputDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(source)));
const sheetInfo = await workbook.inspect({
  kind: "workbook,sheet,table,definedName",
  maxChars: 10000,
  tableMaxRows: 20,
  tableMaxCols: 20,
});
await fs.writeFile(path.join(outputDir, "inspect.ndjson"), sheetInfo.ndjson ?? String(sheetInfo), "utf8");

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  const values = used?.values ?? [];
  const formulas = used?.formulas ?? [];
  await fs.writeFile(path.join(outputDir, `${sheet.name}_values.json`), JSON.stringify({ values, formulas }, null, 2), "utf8");
  if (values.length && values[0].length) {
    const maxRows = Math.min(values.length, 40);
    const maxCols = Math.min(values[0].length, 20);
    const endCol = String.fromCharCode(64 + maxCols);
    const preview = await workbook.render({ sheetName: sheet.name, range: `A1:${endCol}${maxRows}`, scale: 1.5, format: "png" });
    await fs.writeFile(path.join(outputDir, `${sheet.name}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
}

console.log(JSON.stringify({
  sheets: workbook.worksheets.items.map((sheet) => ({
    name: sheet.name,
    usedRange: sheet.getUsedRange()?.address,
    rows: sheet.getUsedRange()?.values?.length ?? 0,
    columns: sheet.getUsedRange()?.values?.[0]?.length ?? 0,
  })),
}, null, 2));
