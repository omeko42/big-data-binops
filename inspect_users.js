const { Client } = require('pg');
const client = new Client({ host: '10.0.0.x', port: 5432, user: 'bdb_app', password: 'Bareskrim2026', database: 'big_data_binops' });
(async () => {
  await client.connect();
  const res = await client.query('SELECT id, name, role_bdb, role_name, scope_satker_id FROM auth_users WHERE id IN (122, 124, 320)');
  console.table(res.rows);
  await client.end();
})();
