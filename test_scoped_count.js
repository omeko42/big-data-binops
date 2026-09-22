const { Client } = require('pg');
const client = new Client({ host: '10.0.0.x', port: 5432, user: 'bdb_app', password: 'Bareskrim2026', database: 'big_data_binops' });
(async () => {
  await client.connect();
  const res = await client.query(`
    SELECT tahun, bulan, count(id) as count_rows
    FROM bdb_pihak_terlibat_ranking_snapshot
    WHERE tipe_subjek = 'KORPORASI'
    GROUP BY tahun, bulan
    ORDER BY tahun, bulan;
  `);
  console.table(res.rows);
  await client.end();
})();
