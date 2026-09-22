const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  await client.connect();
  try {
    const result = await client.query(`
      select id, status, trigger, from_date, to_date, started_at, finished_at,
             current_chunk_from, current_chunk_to, current_page, current_last_page
      from bdb_dors_sync_log
      order by started_at desc
      limit 1
    `);
    console.log(JSON.stringify(result.rows[0] || null));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exitCode = 1;
});
