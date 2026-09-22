const { Client } = require('pg');
const client = new Client({ host: '10.0.0.x', port: 5432, user: 'bdb_app', password: 'Bareskrim2026', database: 'big_data_binops' });
(async () => {
  await client.connect();
  const res = await client.query('SELECT id, deskripsi, parent_id, tipe_satker, depth FROM bdb_satker WHERE id = 9453');
  console.log('Satker 9453:', res.rows[0]);
  await client.end();
})();
