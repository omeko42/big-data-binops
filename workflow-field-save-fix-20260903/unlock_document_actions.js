const { Client } = require('pg');

const KEEP_CODES = ['PENETAPAN_TSK', 'PENETAPAN_DPO', 'CABUT_DPO'];

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
      select id, code, aktif, status_prasyarat_id, dokumen_prasyarat_id, status_target_id
      from bdb_document_type_master
      order by urutan_tahap, code
      for update
    `);
    const beforeByCode = new Map(before.rows.map((row) => [row.code, row]));
    const missing = KEEP_CODES.filter((code) => !beforeByCode.has(code));
    if (missing.length) throw new Error(`Kode pengecualian tidak ditemukan: ${missing.join(', ')}`);

    const updated = await client.query(`
      update bdb_document_type_master
      set status_prasyarat_id=null,
          dokumen_prasyarat_id=null,
          updated_at=now()
      where not (code = any($1::text[]))
        and (status_prasyarat_id is not null or dokumen_prasyarat_id is not null)
      returning id, code
    `, [KEEP_CODES]);

    const after = await client.query(`
      select d.id, d.code, d.aktif, d.status_prasyarat_id, d.dokumen_prasyarat_id,
             d.status_target_id, sp.code as status_prasyarat_code,
             dp.code as dokumen_prasyarat_code, st.code as status_target_code
      from bdb_document_type_master d
      left join bdb_status_master sp on sp.id=d.status_prasyarat_id
      left join bdb_document_type_master dp on dp.id=d.dokumen_prasyarat_id
      left join bdb_status_master st on st.id=d.status_target_id
      order by d.urutan_tahap, d.code
    `);
    const afterByCode = new Map(after.rows.map((row) => [row.code, row]));
    const unlockedMismatch = after.rows.filter((row) =>
      !KEEP_CODES.includes(row.code)
      && (row.status_prasyarat_id !== null || row.dokumen_prasyarat_id !== null)
    );
    const preservedMismatch = before.rows.filter((oldRow) => {
      const newRow = afterByCode.get(oldRow.code);
      if (!newRow || newRow.aktif !== oldRow.aktif || String(newRow.status_target_id) !== String(oldRow.status_target_id)) return true;
      if (!KEEP_CODES.includes(oldRow.code)) return false;
      return String(newRow.status_prasyarat_id) !== String(oldRow.status_prasyarat_id)
        || String(newRow.dokumen_prasyarat_id) !== String(oldRow.dokumen_prasyarat_id);
    });
    if (unlockedMismatch.length || preservedMismatch.length) {
      throw new Error(`Verifikasi gagal: unlocked=${unlockedMismatch.length}, preserved=${preservedMismatch.length}`);
    }

    await client.query('commit');
    console.log(JSON.stringify({
      status: 'ok',
      updated_count: updated.rowCount,
      unlocked_codes: after.rows
        .filter((row) => !KEEP_CODES.includes(row.code))
        .map((row) => row.code),
      kept_flow: after.rows
        .filter((row) => KEEP_CODES.includes(row.code))
        .map((row) => ({
          code: row.code,
          status_prasyarat: row.status_prasyarat_code,
          dokumen_prasyarat: row.dokumen_prasyarat_code,
          status_target: row.status_target_code,
        })),
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
