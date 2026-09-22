const { Client } = require('pg');
const client = new Client({ host: '10.0.0.x', port: 5432, user: 'bdb_app', password: 'Bareskrim2026', database: 'big_data_binops' });
(async () => {
  await client.connect();
  const res = await client.query("SELECT nama, daftar_satker FROM bdb_pihak_terlibat_ranking_snapshot WHERE nik = 'KORP:PT_DANA_SYARIAH_INDONESIA' LIMIT 1");
  console.log(res.rows[0]);
  await client.end();
})();
