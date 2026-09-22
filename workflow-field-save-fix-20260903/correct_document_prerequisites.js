const fs = require('fs');
const { Client } = require('pg');

const KEEP_CODES = ['PENETAPAN_TSK', 'PENETAPAN_DPO', 'CABUT_DPO'];
const snapshotPath = process.argv[2];
if (!snapshotPath) throw new Error('Path snapshot status aktif wajib diberikan');

async function main() {
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  if (!Array.isArray(snapshot.before) || !snapshot.before.length) throw new Error('Snapshot status aktif tidak valid');

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
      select id, code, nama, aktif, dokumen_prasyarat_id
      from bdb_document_type_master
      order by urutan_tahap, code
      for update
    `);

    const byCode = new Map(before.rows.map((row) => [row.code, row]));
    for (const saved of snapshot.before) {
      const current = byCode.get(saved.code);
      if (!current || String(current.id) !== String(saved.id)) {
        throw new Error(`Jenis surat berubah/tidak ditemukan: ${saved.code}`);
      }
      await client.query(`
        update bdb_document_type_master
        set aktif=$3, updated_at=case when aktif is distinct from $3 then now() else updated_at end
        where id=$1 and code=$2
      `, [saved.id, saved.code, !!saved.aktif]);
    }

    const cleared = await client.query(`
      update bdb_document_type_master
      set dokumen_prasyarat_id=null, updated_at=now()
      where not (code = any($1::text[]))
        and dokumen_prasyarat_id is not null
      returning id, code, nama
    `, [KEEP_CODES]);

    const after = await client.query(`
      select d.id, d.code, d.nama, d.aktif, d.dokumen_prasyarat_id,
             dp.code as dokumen_prasyarat_code
      from bdb_document_type_master d
      left join bdb_document_type_master dp on dp.id=d.dokumen_prasyarat_id
      order by d.urutan_tahap, d.code
    `);
    const expectedActive = new Map(snapshot.before.map((row) => [row.code, !!row.aktif]));
    const activeMismatch = after.rows.filter((row) => expectedActive.get(row.code) !== row.aktif);
    const prerequisiteMismatch = after.rows.filter((row) => !KEEP_CODES.includes(row.code) && row.dokumen_prasyarat_id !== null);
    if (activeMismatch.length || prerequisiteMismatch.length) {
      throw new Error(`Verifikasi gagal: active=${activeMismatch.length}, prerequisite=${prerequisiteMismatch.length}`);
    }

    await client.query('commit');
    console.log(JSON.stringify({
      restored_active_flags: true,
      kept_prerequisite_codes: KEEP_CODES,
      cleared_prerequisite_count: cleared.rowCount,
      cleared_codes: cleared.rows.map((row) => row.code).sort(),
      active_codes: after.rows.filter((row) => row.aktif).map((row) => row.code),
      kept_prerequisites: after.rows
        .filter((row) => KEEP_CODES.includes(row.code))
        .map((row) => ({ code: row.code, prerequisite: row.dokumen_prasyarat_code })),
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
