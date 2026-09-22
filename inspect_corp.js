const { Client } = require('pg');
const client = new Client({
  host: '10.0.0.x',
  port: 5432,
  user: 'bdb_app',
  password: 'Bareskrim2026',
  database: 'big_data_binops'
});

async function main() {
  await client.connect();

  const res = await client.query(`
    SELECT count(distinct nik) as person_count
    FROM bdb_dors_lp_terlibat
    WHERE nik IS NOT NULL AND trim(nik) ~ '^[1-9][0-9]{15}$'
    GROUP BY nik
    HAVING count(distinct lp_id) > 1;
  `);
  console.log('Total person with >1 LP all-time:', res.rows.length);

  await client.end();
}

main().catch(console.error);
