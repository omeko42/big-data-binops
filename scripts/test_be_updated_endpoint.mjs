import { runBE } from './be_exec.mjs';

const script = `docker exec bdb-api node -e '
const { LaporanPolisiService } = require("/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service");
const { Client } = require("pg");
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

  console.log("Testing buildBulkImportTemplate for Polda Metro (4891) from 2026-09-01 to 2026-09-03...");
  const t0 = Date.now();
  const res = await svc.buildBulkImportTemplate(1, undefined, 4891, "2026-09-01", "2026-09-03");
  const t1 = Date.now();
  console.log("Result filename:", res.filename);
  console.log("Buffer size:", res.buffer.length, "bytes, time:", t1 - t0, "ms");

  // Inspect the excel content
  const ExcelJS = require("exceljs");
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(res.buffer);
  const sheet = wb.getWorksheet("Update Status LP");
  console.log("Sheet rows count:", sheet.rowCount);
  console.log("Row 1 headers:", JSON.stringify(sheet.getRow(1).values));
  console.log("Row 2 data:", JSON.stringify(sheet.getRow(2).values));
  console.log("Row 3 data:", JSON.stringify(sheet.getRow(3).values));

  const metaSheet = wb.getWorksheet("_CAS_TRACE_META_");
  console.log("Meta Sheet A1:", metaSheet.getCell("A1").value);

  await c.end();
}).catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
