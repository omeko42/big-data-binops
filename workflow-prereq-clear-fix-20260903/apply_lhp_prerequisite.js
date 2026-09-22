const { Client } = require('pg');

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout='30s'");
    const before = await client.query("select id, dokumen_prasyarat_id from bdb_document_type_master where code='LHP' for update");
    if (before.rowCount !== 1) throw new Error(`LHP harus tepat satu baris, ditemukan ${before.rowCount}`);
    const updated = await client.query("update bdb_document_type_master set dokumen_prasyarat_id=null, updated_at=now() where code='LHP' returning id, dokumen_prasyarat_id");
    if (updated.rowCount !== 1 || updated.rows[0].dokumen_prasyarat_id !== null) throw new Error('Prasyarat LHP gagal dikosongkan');
    await client.query('COMMIT');
    console.log(JSON.stringify({LHP_UPDATED: true, previous_prerequisite_id: before.rows[0].dokumen_prasyarat_id, current_prerequisite_id: null}));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
})().catch(error => {
  console.error(error.message);
  process.exit(1);
});

