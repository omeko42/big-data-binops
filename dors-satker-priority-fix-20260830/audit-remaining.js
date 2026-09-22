const { Client } = require('/usr/src/app/node_modules/pg');
const { SatkerLegacyReconciliationService } = require('/usr/src/app/dist/bdb/satker/satker-legacy-reconciliation.service.js');
(async () => {
  const svc = new SatkerLegacyReconciliationService(null, null, null, null);
  const client = new Client({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT), user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE });
  await client.connect();
  try {
    const g = svc.groupsCte();
    const rows = await client.query(`with g as (${g}) select level,nama,kode_pusiknas,kode_dors,parent_nama,lp_terdampak,exact_id,exact_kode,exact_deskripsi,nama_id,nama_kode,nama_deskripsi,round(nama_sim::numeric,3) nama_sim from g order by level,nama,kode_pusiknas`);
    console.log(JSON.stringify(rows.rows, null, 2));
  } finally { await client.end(); }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });