import { runBE } from './be_exec.mjs';

const script = `docker exec bdb-api node -e '
const ExcelJS = require("exceljs");
const { Client } = require("pg");

const c = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

async function runTest() {
  await c.connect();
  const lpSample = await c.query("SELECT id, no_laporan, tgl_laporan, satker_id, unit_satker_id FROM bdb_laporan_polisi WHERE deleted_at IS NULL AND no_laporan IS NOT NULL ORDER BY id DESC LIMIT 1;");
  const sample = lpSample.rows[0];
  console.log("Sample LP:", sample.id, sample.no_laporan, "Date:", sample.tgl_laporan);

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet("Update Status LP");
  sheet.columns = [
    { header: "NO", key: "no" },
    { header: "ID LP", key: "id" },
    { header: "NO LP", key: "no_lp" },
    { header: "TGL LP", key: "tgl_lp" },
    { header: "TINDAK PIDANA", key: "tp" },
    { header: "STATUS LAMA", key: "stat_lama" },
    { header: "STATUS BARU", key: "stat_baru" },
    { header: "NO DOKUMEN", key: "no_dok" },
    { header: "TGL DOKUMEN", key: "tgl_dok" },
    { header: "ALASAN HENTI (KHUSUS SP3/SP2LID)", key: "alasan" },
    { header: "KATEGORI PERMA (KHUSUS PERMA)", key: "perma" }
  ];
  sheet.getColumn(2).hidden = true;

  // Case 1: SP3 with Alasan -> Expect READY
  sheet.addRow({
    no: 1, id: sample.id, no_lp: sample.no_laporan, tgl_lp: sample.tgl_laporan,
    tp: "Penipuan", stat_lama: "Lidik", stat_baru: "SP3",
    no_dok: "SP3/01/X/2026", tgl_dok: "03-Okt-2026",
    alasan: "Tidak terdapat cukup alat bukti", perma: ""
  });

  // Case 2: Tahap II with Alasan -> Expect ERROR (Alasan must be empty)
  sheet.addRow({
    no: 2, id: sample.id, no_lp: sample.no_laporan, tgl_lp: sample.tgl_laporan,
    tp: "Penipuan", stat_lama: "Lidik", stat_baru: "TAHAP_II",
    no_dok: "B/100/X/2026", tgl_dok: "03-Okt-2026",
    alasan: "Tidak terdapat cukup alat bukti", perma: ""
  });

  // Case 3: PERMA with Kategori -> Expect READY
  sheet.addRow({
    no: 3, id: sample.id, no_lp: sample.no_laporan, tgl_lp: sample.tgl_laporan,
    tp: "Penipuan", stat_lama: "Lidik", stat_baru: "PERMA",
    no_dok: "PN/01/2026", tgl_dok: "03-Okt-2026",
    alasan: "", perma: "Tipiring"
  });

  // Case 4: PERMA without Kategori -> Expect ERROR
  sheet.addRow({
    no: 4, id: sample.id, no_lp: sample.no_laporan, tgl_lp: sample.tgl_laporan,
    tp: "Penipuan", stat_lama: "Lidik", stat_baru: "PERMA",
    no_dok: "PN/01/2026", tgl_dok: "03-Okt-2026",
    alasan: "", perma: ""
  });

  // Case 5: Future date -> Expect ERROR
  sheet.addRow({
    no: 5, id: sample.id, no_lp: sample.no_laporan, tgl_lp: sample.tgl_laporan,
    tp: "Penipuan", stat_lama: "Lidik", stat_baru: "SIDIK",
    no_dok: "SPRINDIK/01/2030", tgl_dok: "15-Des-2030",
    alasan: "", perma: ""
  });

  // Case 6: Date before LP date -> Expect ERROR
  sheet.addRow({
    no: 6, id: sample.id, no_lp: sample.no_laporan, tgl_lp: sample.tgl_laporan,
    tp: "Penipuan", stat_lama: "Lidik", stat_baru: "SIDIK",
    no_dok: "SPRINDIK/01/2010", tgl_dok: "01-Jan-2010",
    alasan: "", perma: ""
  });

  const buffer = await wb.xlsx.writeBuffer();
  console.log("Mock Workbook buffer created:", buffer.length, "bytes");

  // Call previewBulkImport
  const { LaporanPolisiService } = require("/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service");
  
  // Create minimal mock instance with real dataSource query
  const fakeSvc = new LaporanPolisiService();
  fakeSvc.dataSource = {
    query: (q, p) => c.query(q, p).then(r => r.rows)
  };

  const previewResult = await fakeSvc.previewBulkImport(buffer, 1);
  console.log("=== PREVIEW SUMMARY ===");
  console.log(JSON.stringify(previewResult.summary, null, 2));

  console.log("=== ROW VERIFICATION RESULTS ===");
  previewResult.rows.forEach(r => {
    console.log(\`Row \${r.row_num} [\${r.status_baru_raw || r.status_baru}]: \${r.status_verifikasi} -> \${r.pesan}\`);
  });

  await c.end();
}

runTest().catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
