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
  let before;
  try {
    await client.query('begin');
    const selected = await client.query(`
      select id, form_schema, updated_at, md5(form_schema::text) as schema_hash
      from bdb_document_type_master
      where code='SP2_LIDIK'
      for update
    `);
    if (selected.rowCount !== 1) throw new Error('SP2_LIDIK tidak ditemukan');
    before = selected.rows[0];
    const probe = { ...before.form_schema, __codex_save_probe: true };
    const updated = await client.query(`
      update bdb_document_type_master
      set form_schema=$2::jsonb, updated_at=now()
      where id=$1
      returning form_schema
    `, [before.id, JSON.stringify(probe)]);
    const equal = await client.query('select $1::jsonb = $2::jsonb as ok', [JSON.stringify(updated.rows[0].form_schema), JSON.stringify(probe)]);
    if (!equal.rows[0]?.ok) throw new Error('JSONB hasil tulis tidak sama');
    await client.query('rollback');
    const after = await client.query(`
      select updated_at, md5(form_schema::text) as schema_hash
      from bdb_document_type_master where id=$1
    `, [before.id]);
    const restored = after.rows[0]?.schema_hash === before.schema_hash
      && new Date(after.rows[0]?.updated_at).getTime() === new Date(before.updated_at).getTime();
    if (!restored) throw new Error('Rollback verifikasi tidak memulihkan kondisi awal');
    console.log(JSON.stringify({ write_verified: true, rollback_verified: true, code: 'SP2_LIDIK' }));
  } catch (error) {
    try { await client.query('rollback'); } catch {}
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exitCode = 1;
});
