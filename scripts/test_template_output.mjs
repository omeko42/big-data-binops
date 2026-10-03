import { runBE } from './be_exec.mjs';

const script = `docker exec bdb-api node -e '
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

async function testDownload() {
  await c.connect();
  const fakeSvc = new LaporanPolisiService();
  fakeSvc.dataSource = {
    query: (q, p) => c.query(q, p).then(r => r.rows)
  };
  fakeSvc.audit = { log: async () => {} };

  const { buffer, filename } = await fakeSvc.buildBulkImportTemplate(1, "2026");
  console.log("Generated filename:", filename, "Size:", buffer.length);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const sheet = wb.getWorksheet("Update Status LP");
  console.log("Sheet name:", sheet.name);
  console.log("Row count:", sheet.rowCount);
  console.log("Col 2 hidden?", sheet.getColumn(2).hidden);
  
  const headers = [];
  for (let c = 1; c <= 11; c++) {
    headers.push(sheet.getCell(1, c).text);
  }
  console.log("Headers:", headers);

  console.log("Sample Row 2:");
  const row2 = [];
  for (let c = 1; c <= 11; c++) {
    row2.push(sheet.getCell(2, c).value);
  }
  console.log("Row 2 values:", row2);
  console.log("Cell I2 numFmt:", sheet.getCell(2, 9).numFmt);

  await c.end();
}

testDownload().catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
