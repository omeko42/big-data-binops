const { Client } = require('pg');

const KEEP_CODES = ['PENETAPAN_TSK', 'PENETAPAN_DPO', 'CABUT_DPO'];
const apply = process.argv.includes('--apply');

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
    await client.query('begin');
    const before = await client.query(`
      select id, code, nama, aktif
      from bdb_document_type_master
      order by urutan_tahap, code
      for update
    `);
    const found = new Set(before.rows.map((row) => row.code));
    const missing = KEEP_CODES.filter((code) => !found.has(code));
    if (missing.length) throw new Error(`Kode wajib tidak ditemukan: ${missing.join(', ')}`);

    let changed = [];
    if (apply) {
      const updated = await client.query(`
        update bdb_document_type_master
        set aktif = (code = any($1::text[])), updated_at = now()
        where aktif is distinct from (code = any($1::text[]))
        returning id, code, nama, aktif
      `, [KEEP_CODES]);
      changed = updated.rows;
    }

    const after = apply
      ? await client.query(`select id, code, nama, aktif from bdb_document_type_master order by urutan_tahap, code`)
      : before;
    const activeCodes = after.rows.filter((row) => row.aktif).map((row) => row.code).sort();
    const expected = [...KEEP_CODES].sort();
    if (apply && JSON.stringify(activeCodes) !== JSON.stringify(expected)) {
      throw new Error(`Verifikasi gagal. Aktif: ${activeCodes.join(', ')}`);
    }

    if (apply) await client.query('commit');
    else await client.query('rollback');

    console.log(JSON.stringify({
      mode: apply ? 'apply' : 'dry-run',
      keep_codes: KEEP_CODES,
      before: before.rows,
      changed,
      active_after: activeCodes,
      inactive_after: after.rows.filter((row) => !row.aktif).map((row) => row.code),
    }, null, 2));
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
