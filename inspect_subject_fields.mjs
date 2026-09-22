import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = process.argv[2] ?? "D:/Prototype CAS/EDIT MASTER MASAL/outputs/cas_master_satker_20260808/master_satker_cas.xlsx";
const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 20,
  tableMaxCellChars: 100,
});

const targetMatches = await workbook.inspect({
  kind: "match",
  searchTerm: "internal.?policy|external.?policy|internal.?researcher|external.?researcher|policy|researcher|subject",
  options: { useRegex: true, maxResults: 300 },
  summary: "target subject fields",
  maxChars: 12000,
});

console.log("=== OVERVIEW ===");
console.log(overview.ndjson);
console.log("=== TARGET MATCHES ===");
console.log(targetMatches.ndjson);
