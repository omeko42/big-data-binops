import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const sourcePath = path.join(outputDir, "master_satker_puskarda_V1_asli.xlsx");
const outputPath = path.join(outputDir, "master_satker_puskarda_V2_injeksi.xlsx");
const previewDir = path.join(outputDir, "preview_v2");
const injectionMap = JSON.parse(await fs.readFile(path.join(root, "bdb_satker_injection_map.json"), "utf8"));
const report = JSON.parse(await fs.readFile(path.join(root, "bdb_satker_inference_report.json"), "utf8"));

await fs.mkdir(previewDir, { recursive: true });

const input = await FileBlob.load(sourcePath);
const wb = await SpreadsheetFile.importXlsx(input);
const before = await wb.inspect({
  kind: "sheet,table",
  maxChars: 6000,
  tableMaxRows: 3,
  tableMaxCols: 8,
});
await fs.writeFile(path.join(outputDir, "before_injection_inspect.ndjson"), before.ndjson ?? String(before), "utf8");

const raw = wb.worksheets.getItem("Master Raw");
const queue = wb.worksheets.getItem("Repair Queue");
const summary = wb.worksheets.getItem("Ringkasan");
const queueLastRow = 13855;
const rawLastRow = 13867;

const ids = queue.getRange(`A2:A${queueLastRow}`).values;
const membershipNew = [];
const functionNew = [];
const statuses = [];
const membershipConfidence = [];
const functionConfidence = [];
const inferenceBasis = [];

for (const row of ids) {
  const id = String(row[0] ?? "").trim();
  const item = injectionMap[id];
  if (!item) throw new Error(`Tidak ada hasil inferensi untuk id=${id}`);

  const proposedMembership = item.keanggotaan_saat_ini ? "" : item.keanggotaan_usulan;
  const proposedFunction = item.fungsi_saat_ini ? "" : item.fungsi_usulan;
  const effectiveMembership = item.keanggotaan_saat_ini || proposedMembership;
  const effectiveFunction = item.fungsi_saat_ini || proposedFunction;

  membershipNew.push([proposedMembership]);
  functionNew.push([proposedFunction]);
  const functionApplicable = item.keyakinan_fungsi !== "TIDAK_BERLAKU";
  statuses.push([effectiveMembership && (effectiveFunction || !functionApplicable) ? "SIAP" : "PERLU KONFIRMASI"]);
  membershipConfidence.push([item.keyakinan_keanggotaan]);
  functionConfidence.push([item.keyakinan_fungsi]);
  inferenceBasis.push([item.dasar_inferensi]);
}

queue.getRange(`P2:P${queueLastRow}`).values = membershipNew;
queue.getRange(`Q2:Q${queueLastRow}`).values = functionNew;
queue.getRange(`T2:T${queueLastRow}`).values = statuses;
queue.getRange("V1:X1").values = [["keyakinan_polri", "keyakinan_reserse", "dasar_inferensi"]];
queue.getRange(`V2:V${queueLastRow}`).values = membershipConfidence;
queue.getRange(`W2:W${queueLastRow}`).values = functionConfidence;
queue.getRange(`X2:X${queueLastRow}`).values = inferenceBasis;

// Injeksi nilai efektif langsung ke salinan V2. File V1 tetap tidak berubah.
const rawIds = raw.getRange(`A2:A${rawLastRow}`).values;
const effectiveValues = [];
for (const row of rawIds) {
  const id = String(row[0] ?? "").trim();
  const item = injectionMap[id];
  if (!item) throw new Error(`Tidak ada hasil inferensi V2 untuk id=${id}`);
  effectiveValues.push([
    item.keanggotaan_saat_ini || item.keanggotaan_usulan,
    item.fungsi_saat_ini || item.fungsi_usulan,
  ]);
}
raw.getRange(`X2:Y${rawLastRow}`).values = effectiveValues;
raw.getRange(`X2:Y${rawLastRow}`).format.fill = "#E8F5EE";

// Perluas tabel agar kolom audit ikut terfilter bersama antrean.
for (const table of queue.tables.items) table.delete();
const queueTable = queue.tables.add(`A1:X${queueLastRow}`, true, "RepairQueueTable");
queueTable.style = "TableStyleMedium2";

queue.getRange(`P2:Q${queueLastRow}`).format.fill = "#E8F5EE";
queue.getRange(`T2:T${queueLastRow}`).format.fill = "#E8F5EE";
queue.getRange(`U2:U${queueLastRow}`).format.fill = "#FFF6D6";
queue.getRange(`V2:W${queueLastRow}`).format.fill = "#EAF2FF";
queue.getRange(`X2:X${queueLastRow}`).format.fill = "#F3F5F7";
queue.getRange(`V1:W${queueLastRow}`).format.columnWidth = 22;
queue.getRange(`X1:X${queueLastRow}`).format.columnWidth = 72;
queue.getRange(`X2:X${queueLastRow}`).format.wrapText = true;
queue.getRange(`T2:T${queueLastRow}`).conditionalFormats.add("containsText", {
  text: "SIAP",
  format: { fill: "#D7F0E0", font: { color: "#176B3A", bold: true } },
});
queue.getRange(`T2:T${queueLastRow}`).conditionalFormats.add("containsText", {
  text: "PERLU KONFIRMASI",
  format: { fill: "#FDECEC", font: { color: "#A12622", bold: true } },
});

// Buat ulang analisis injeksi jika script dijalankan ulang.
let injectionSheet;
try {
  injectionSheet = wb.worksheets.getItem("Analisis Injeksi");
  injectionSheet.getRange("A1:H60").clear({ applyTo: "all" });
} catch {
  injectionSheet = wb.worksheets.add("Analisis Injeksi");
}

const navy = "#12355B";
const blue = "#2563EB";
const paleBlue = "#EAF2FF";
const paleYellow = "#FFF6D6";
const border = "#D8E1EA";
const muted = "#5F6B7A";

injectionSheet.showGridLines = false;
injectionSheet.getRange("A1:H1").merge();
injectionSheet.getRange("A1").values = [["HASIL INJEKSI KLASIFIKASI LOKAL"]];
injectionSheet.getRange("A1:H1").format = {
  fill: navy,
  font: { name: "Aptos Display", size: 18, bold: true, color: "#FFFFFF" },
  rowHeight: 38,
  verticalAlignment: "center",
};
injectionSheet.getRange("A2:H2").merge();
injectionSheet.getRange("A2").values = [["Usulan diisi pada Repair Queue; Master Raw tidak diubah dan tidak ada penulisan ke server"]];
injectionSheet.getRange("A2:H2").format = {
  fill: paleBlue,
  font: { name: "Aptos", size: 10, italic: true, color: muted },
  rowHeight: 26,
};

injectionSheet.getRange("A4:H4").values = [[
  "Usulan Polri", "", "Usulan Reserse", "", "Status SIAP", "", "Perlu konfirmasi", ""
]];
injectionSheet.getRange("A5:H5").formulas = [[
  `=COUNTIF('Repair Queue'!P2:P${queueLastRow},"INTERNAL_POLRI")+COUNTIF('Repair Queue'!P2:P${queueLastRow},"EKSTERNAL_POLRI")`, "",
  `=COUNTIF('Repair Queue'!Q2:Q${queueLastRow},"INTERNAL_RESERSE")+COUNTIF('Repair Queue'!Q2:Q${queueLastRow},"EKSTERNAL_RESERSE")`, "",
  `=COUNTIF('Repair Queue'!T2:T${queueLastRow},"SIAP")`, "",
  `=COUNTIF('Repair Queue'!T2:T${queueLastRow},"PERLU KONFIRMASI")`, "",
]];
for (const block of ["A4:B5", "C4:D5", "E4:F5", "G4:H5"]) {
  injectionSheet.getRange(block).format = {
    fill: "#FFFFFF",
    borders: { preset: "outside", style: "thin", color: border },
  };
}
injectionSheet.getRange("A4:H4").format.font = { name: "Aptos", size: 10, bold: true, color: muted };
injectionSheet.getRange("A5:H5").format.font = { name: "Aptos Display", size: 18, bold: true, color: blue };
injectionSheet.getRange("A5:H5").format.numberFormat = "#,##0";

injectionSheet.getRange("A8:D8").values = [["Klasifikasi efektif", "Existing V1", "Diinjeksi", "Total V2"]];
injectionSheet.getRange("A9:A12").values = [
  ["INTERNAL_POLRI"], ["EKSTERNAL_POLRI"], ["INTERNAL_RESERSE"], ["EKSTERNAL_RESERSE"],
];
injectionSheet.getRange("B9:B12").values = [[14], [0], [8], [4]];
injectionSheet.getRange("C9:D12").formulas = [
  [`=COUNTIF('Repair Queue'!P2:P${queueLastRow},"INTERNAL_POLRI")`, `=COUNTIF('Master Raw'!X2:X${rawLastRow},"INTERNAL_POLRI")`],
  [`=COUNTIF('Repair Queue'!P2:P${queueLastRow},"EKSTERNAL_POLRI")`, `=COUNTIF('Master Raw'!X2:X${rawLastRow},"EKSTERNAL_POLRI")`],
  [`=COUNTIF('Repair Queue'!Q2:Q${queueLastRow},"INTERNAL_RESERSE")`, `=COUNTIF('Master Raw'!Y2:Y${rawLastRow},"INTERNAL_RESERSE")`],
  [`=COUNTIF('Repair Queue'!Q2:Q${queueLastRow},"EKSTERNAL_RESERSE")`, `=COUNTIF('Master Raw'!Y2:Y${rawLastRow},"EKSTERNAL_RESERSE")`],
];
injectionSheet.getRange("A8:D12").format.borders = { preset: "inside", style: "thin", color: border };
injectionSheet.getRange("A8:D8").format = { fill: navy, font: { bold: true, color: "#FFFFFF" } };
injectionSheet.getRange("B9:D12").format.numberFormat = "#,##0";

injectionSheet.getRange("F8:H8").values = [["Keyakinan Reserse", "Jumlah", "Sifat"]];
injectionSheet.getRange("F9:F13").values = [["SANGAT_TINGGI"], ["TINGGI"], ["EXISTING"], ["TIDAK_BERLAKU"], ["BELUM_DAPAT_DIPASTIKAN"]];
injectionSheet.getRange("G9:G10").formulas = [
  [`=COUNTIF('Repair Queue'!W2:W${queueLastRow},"SANGAT_TINGGI")`],
  [`=COUNTIF('Repair Queue'!W2:W${queueLastRow},"TINGGI")`],
];
injectionSheet.getRange("G11").values = [[12]];
injectionSheet.getRange("G12:G13").formulas = [
  [`=COUNTIF('Repair Queue'!W2:W${queueLastRow},"TIDAK_BERLAKU")`],
  [`=COUNTIF('Repair Queue'!W2:W${queueLastRow},"BELUM_DAPAT_DIPASTIKAN")`],
];
injectionSheet.getRange("H9:H13").values = [["Data langsung"], ["Pola konsisten"], ["Nilai master"], ["Node induk hanya Internal Polri"], ["Tahan untuk review"]];
injectionSheet.getRange("F8:H13").format.borders = { preset: "inside", style: "thin", color: border };
injectionSheet.getRange("F8:H8").format = { fill: navy, font: { bold: true, color: "#FFFFFF" } };
injectionSheet.getRange("G9:G13").format.numberFormat = "#,##0";

const reasonCounts = report.function_reason_counts;
const groupedRules = {
  "Sub-domain DORS langsung": 0,
  "Pola nama unit": 0,
  "Turunan DENSUS 88": 0,
  "Nilai existing": 0,
  "Tidak berlaku (root/node induk)": 0,
  "Belum pasti": 0,
};
for (const [reason, count] of Object.entries(reasonCounts)) {
  if (reason.startsWith("Pemetaan langsung")) groupedRules["Sub-domain DORS langsung"] += count;
  else if (reason.startsWith("Pola nama")) groupedRules["Pola nama unit"] += count;
  else if (reason.startsWith("Turunan DENSUS")) groupedRules["Turunan DENSUS 88"] += count;
  else if (reason.startsWith("Nilai fungsi")) groupedRules["Nilai existing"] += count;
  else if (reason.startsWith("Root POLRI") || reason.startsWith("Node induk")) groupedRules["Tidak berlaku (root/node induk)"] += count;
  else groupedRules["Belum pasti"] += count;
}
injectionSheet.getRange("A15:C15").values = [["Kelompok aturan", "Jumlah record", "Catatan"]];
const ruleRows = Object.entries(groupedRules).map(([rule, count]) => [rule, count,
  rule === "Belum pasti" ? "Tidak diisi otomatis" : "Dapat ditelusuri per baris di Repair Queue kolom X"
]);
injectionSheet.getRange(`A16:C${15 + ruleRows.length}`).values = ruleRows;
injectionSheet.getRange(`A15:C${15 + ruleRows.length}`).format.borders = { preset: "inside", style: "thin", color: border };
injectionSheet.getRange("A15:C15").format = { fill: navy, font: { bold: true, color: "#FFFFFF" } };
injectionSheet.getRange(`B16:B${15 + ruleRows.length}`).format.numberFormat = "#,##0";

injectionSheet.getRange("E15:H15").merge();
injectionSheet.getRange("E15").values = [["Analisis berikutnya"]];
injectionSheet.getRange("E15:H15").format = { fill: paleYellow, font: { bold: true, color: "#4A3A00" } };
injectionSheet.getRange("E16:H21").merge();
injectionSheet.getRange("E16").values = [[
  "1. Root POLRI serta node induk POLDA/POLRES/POLSEK ditetapkan INTERNAL_POLRI tanpa klasifikasi fungsi Reserse.\n" +
  "2. Alamat/lokasi baru terisi 8–10 record; membutuhkan sumber resmi, tidak aman ditebak.\n" +
  "3. Pemetaan DORS baru tersedia 4.437 record (32%); sisanya perlu rekonsiliasi referensi.\n" +
  "4. Jumlah penduduk terisi 3.782 record; perlu sumber kependudukan sebelum dilengkapi."
]];
injectionSheet.getRange("E16:H21").format = {
  fill: "#FFFFFF",
  borders: { preset: "outside", style: "thin", color: "#E4C55E" },
  wrapText: true,
  verticalAlignment: "top",
};

injectionSheet.getRange("A1:A25").format.columnWidth = 30;
injectionSheet.getRange("B1:D25").format.columnWidth = 18;
injectionSheet.getRange("E1:G25").format.columnWidth = 23;
injectionSheet.getRange("H1:H25").format.columnWidth = 30;
injectionSheet.freezePanes.freezeRows(2);

summary.getRange("F16:H19").clear({ applyTo: "contents" });
summary.getRange("A1").values = [["MASTER SATKER PUSKARDA — V2 HASIL INJEKSI LOKAL"]];
summary.getRange("A2").values = [["Sumber: duplikat master_satker_puskarda_V1_asli.xlsx • tidak ada penulisan ke server"]];
summary.getRange("F16").values = [[
  "Status V2\n• Kolom keanggotaan dan fungsi sudah diinjeksi langsung.\n• Satker tanpa DORS tetap diisi dari hierarki/nama.\n• Repair Queue menyimpan jejak keyakinan dan dasar inferensi.\n• File V1 asli tetap terpisah dan tidak diubah."
]];

const keyInspect = await wb.inspect({
  kind: "table,formula",
  range: "Analisis Injeksi!A1:H22",
  maxChars: 10000,
  tableMaxRows: 24,
  tableMaxCols: 10,
  options: { maxResults: 120 },
});
await fs.writeFile(path.join(outputDir, "injection_inspect.ndjson"), keyInspect.ndjson ?? String(keyInspect), "utf8");
const errorScan = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
await fs.writeFile(path.join(outputDir, "injection_error_scan.ndjson"), errorScan.ndjson ?? String(errorScan), "utf8");

for (const [sheetName, range] of [
  ["Master Raw", "A1:J20"],
  ["Repair Queue", "A1:X25"],
  ["Ringkasan", "A1:H20"],
  ["Analisis Kelengkapan", "A1:E35"],
  ["Referensi", "A1:E13"],
  ["Analisis Injeksi", "A1:H22"],
]) {
  const image = await wb.render({ sheetName, range, scale: 1, format: "png" });
  const fileName = sheetName.toLowerCase().replaceAll(" ", "_") + ".png";
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await image.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  membershipInjected: report.membership_injected,
  functionInjected: report.function_injected,
  functionStillBlank: report.function_still_blank,
}, null, 2));
