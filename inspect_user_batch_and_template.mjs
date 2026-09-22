import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd", "inspect_user_import");
await fs.mkdir(outputDir, { recursive: true });

const files = [
  ["batch", "C:/Users/KOKO98/Downloads/batch 2 pengguna cas.xlsx"],
  ["template", "C:/Users/KOKO98/Downloads/template-import-pengguna (1).xlsx"],
];

const summary = {};
for (const [label, filePath] of files) {
  const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(filePath)));
  const inspect = await workbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 10000,
    tableMaxRows: 12,
    tableMaxCols: 20,
    tableMaxCellChars: 120,
  });
  await fs.writeFile(path.join(outputDir, `${label}_inspect.ndjson`), inspect.ndjson ?? String(inspect), "utf8");

  summary[label] = { filePath, sheets: [] };
  for (const sheet of workbook.worksheets.items) {
    const used = sheet.getUsedRange(true);
    const values = used?.values ?? [];
    summary[label].sheets.push({
      name: sheet.name,
      rows: values.length,
      columns: values.reduce((max, row) => Math.max(max, row?.length ?? 0), 0),
      sample: values.slice(0, 15),
      tables: sheet.tables.items.map((table) => ({ name: table.name, range: table.range?.address ?? null, style: table.style })),
    });
    const columnCount = Math.max(1, values.reduce((max, row) => Math.max(max, row?.length ?? 0), 0));
    const previewRows = Math.min(Math.max(values.length, 1), 30);
    const toColumn = (number) => {
      let result = "";
      for (let value = number; value > 0; value = Math.floor((value - 1) / 26)) {
        result = String.fromCharCode(65 + ((value - 1) % 26)) + result;
      }
      return result;
    };
    const preview = await workbook.render({
      sheetName: sheet.name,
      range: `A1:${toColumn(columnCount)}${previewRows}`,
      scale: 1.25,
      format: "png",
    });
    const safeName = sheet.name.replace(/[\\/:*?"<>|]/g, "_");
    await fs.writeFile(path.join(outputDir, `${label}_${safeName}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
}

await fs.writeFile(path.join(outputDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
console.log(JSON.stringify(summary, null, 2));
