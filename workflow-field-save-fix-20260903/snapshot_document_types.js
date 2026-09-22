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
    const rows = await client.query(`
      select id, code, nama, aktif, status_prasyarat_id, dokumen_prasyarat_id,
             status_target_id, urutan_tahap, form_schema, updated_at
      from bdb_document_type_master
      order by urutan_tahap, code
    `);
    console.log(JSON.stringify({ captured_at: new Date().toISOString(), rows: rows.rows }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exitCode = 1;
});
