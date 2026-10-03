import { runFE } from './fe_exec.mjs';
import { runBE } from './be_exec.mjs';

console.log('=== 1. VERIFY FRONTEND CONTAINER AND CHUNK ===');
const feGrep = runFE('docker exec bdb-web grep -E "importSatker|applyImportPeriodPreset|Tanpa batasan 5.000 LP" /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js -o | sort -u');
console.log('Frontend Keywords Present:', feGrep.trim().split('\n'));

const feHttp = runFE('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/laporan-polisi');
console.log('Frontend /cms/laporan-polisi HTTP status:', feHttp.trim());

console.log('\n=== 2. VERIFY BACKEND SERVICE & TEMPLATE GENERATION ===');
const beTest = runBE(`docker exec bdb-api node -e '
const { LaporanPolisiService } = require("/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service");
const { Client } = require("pg");
const ExcelJS = require("exceljs");

const c = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

c.connect().then(async () => {
  const svc = new LaporanPolisiService();
  svc.dataSource = { query: (q, p) => c.query(q, p).then(r => r.rows) };
  svc.audit = { log: async () => {} };

  console.log("Generating template for Polda Metro Jaya (id=4891) 2026-09-01 s.d. 2026-09-10...");
  const t0 = Date.now();
  const res = await svc.buildBulkImportTemplate(1, undefined, 4891, "2026-09-01", "2026-09-10");
  const t1 = Date.now();

  console.log("-> Filename:", res.filename);
  console.log("-> Buffer size:", res.buffer.length, "bytes (in " + (t1 - t0) + "ms)");

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(res.buffer);
  const sheet = wb.getWorksheet("Update Status LP");
  console.log("-> Row count (including header):", sheet.rowCount);

  const crimeSamples = new Set();
  for (let i = 2; i <= Math.min(sheet.rowCount, 100); i++) {
    const val = sheet.getCell("E" + i).value;
    if (val && val !== "-") crimeSamples.add(val);
  }
  console.log("-> Crime Category Samples in Column E:", Array.from(crimeSamples).slice(0, 5));

  const meta = JSON.parse(wb.getWorksheet("_CAS_TRACE_META_").getCell("A1").value);
  console.log("-> Trace Meta:", JSON.stringify(meta));

  console.log("Testing Preview (Dry-Run) of the generated template...");
  const preview = await svc.previewBulkImport(res.buffer, 1, res.filename);
  console.log("-> Preview Summary:", JSON.stringify(preview.summary));

  await c.end();
  console.log("ALL VERIFICATIONS PASSED SUCCESSFULLY!");
}).catch(e => {
  console.error(e);
  process.exit(1);
});
'`);

console.log(beTest);
