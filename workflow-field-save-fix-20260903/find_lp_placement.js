const { Client } = require('pg');

const REPORT_NUMBER = 'LP/A/6/II/2026/SPKT.SATRESNARKOBA/POLRES KUTAI BARAT/POLDA KALIMANTAN TIMUR';

function sourcePlacement(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return {
    polda: payload.polda ? { id: payload.polda.id, nama: payload.polda.nama, kode_pusiknas: payload.polda.kode_pusiknas } : null,
    polres: payload.polres ? { id: payload.polres.id, nama: payload.polres.nama, kode_pusiknas: payload.polres.kode_pusiknas } : null,
    polsek: payload.polsek ? { id: payload.polsek.id, nama: payload.polsek.nama, kode_pusiknas: payload.polsek.kode_pusiknas } : null,
    unit: payload.unit ? { id: payload.unit.id, unit: payload.unit.unit, level: payload.unit.level } : null,
    id_polda: payload.id_polda ?? null,
    id_polres: payload.id_polres ?? null,
    id_polsek: payload.id_polsek ?? null,
  };
}

async function hierarchy(client, satkerId) {
  if (!satkerId) return [];
  const result = await client.query(`
    with recursive chain as (
      select id, kode, deskripsi, parent_id, 0 as depth
      from bdb_satker where id=$1
      union all
      select p.id, p.kode, p.deskripsi, p.parent_id, c.depth + 1
      from bdb_satker p join chain c on p.id=c.parent_id
    )
    select id, kode, deskripsi, parent_id, depth from chain order by depth
  `, [satkerId]);
  return result.rows;
}

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
    const lp = await client.query(`
      select lp.id, lp.dors_lp_id, lp.model_lp, lp.raw_lp_id, lp.no_laporan,
             lp.penanganan_level, lp.kode_pusiknas, lp.satker_id, lp.satker_nama,
             lp.unit_nama, lp.unit_level, lp.unit_satker_id, lp.unit_satker_nama,
             lp.unit_satker_kode, lp.sudah_dilimpahkan, lp.dilimpahkan_eksternal,
             lp.status_id, sm.code as status_code, sm.nama as status_nama,
             lp.data_scope, lp.synced_at, lp.created_at, lp.updated_at, lp.payload_json
      from bdb_laporan_polisi lp
      left join bdb_status_master sm on sm.id=lp.status_id
      where upper(trim(lp.no_laporan))=upper(trim($1))
      order by lp.id
    `, [REPORT_NUMBER]);

    const raw = await client.query(`
      select id, dors_lp_id, model_lp, no_laporan, data_scope, import_batch, synced_at, payload_json
      from bdb_dors_raw_lp
      where upper(trim(no_laporan))=upper(trim($1))
      order by id
    `, [REPORT_NUMBER]);

    const results = [];
    for (const row of lp.rows) {
      const pelimpahan = await client.query(`
        select id, satker_asal_id, satker_asal_nama, satker_tujuan_id,
               satker_tujuan_nama, satker_eksternal_id, satker_eksternal_nama,
               keterangan, dilimpahkan_oleh, dilimpahkan_oleh_nama,
               nomor_dokumen, tanggal_dokumen, created_at
        from bdb_lp_pelimpahan where lp_id=$1 order by created_at, id
      `, [row.id]);
      const audit = await client.query(`
        select id, user_id, user_nama, action, meta, created_at
        from bdb_audit_log
        where entity='laporan_polisi' and entity_id=$1::text
        order by created_at, id
      `, [row.id]);
      results.push({
        lp: {
          id: row.id,
          dors_lp_id: row.dors_lp_id,
          model_lp: row.model_lp,
          raw_lp_id: row.raw_lp_id,
          no_laporan: row.no_laporan,
          penanganan_level: row.penanganan_level,
          kode_pusiknas: row.kode_pusiknas,
          satker_id: row.satker_id,
          satker_nama: row.satker_nama,
          unit_dors: row.unit_nama,
          unit_level_dors: row.unit_level,
          unit_satker_id: row.unit_satker_id,
          unit_satker_nama: row.unit_satker_nama,
          unit_satker_kode: row.unit_satker_kode,
          effective_owner_id: row.unit_satker_id || row.satker_id,
          effective_owner_nama: row.unit_satker_nama || row.satker_nama,
          sudah_dilimpahkan: row.sudah_dilimpahkan,
          dilimpahkan_eksternal: row.dilimpahkan_eksternal,
          status_code: row.status_code,
          status_nama: row.status_nama,
          data_scope: row.data_scope,
          synced_at: row.synced_at,
          created_at: row.created_at,
          updated_at: row.updated_at,
        },
        source_placement: sourcePlacement(row.payload_json),
        effective_owner_hierarchy: await hierarchy(client, row.unit_satker_id || row.satker_id),
        pelimpahan: pelimpahan.rows,
        audit: audit.rows,
      });
    }

    console.log(JSON.stringify({
      searched: REPORT_NUMBER,
      mapped_count: lp.rowCount,
      raw_count: raw.rowCount,
      mapped: results,
      raw: raw.rows.map((row) => ({
        id: row.id,
        dors_lp_id: row.dors_lp_id,
        model_lp: row.model_lp,
        no_laporan: row.no_laporan,
        data_scope: row.data_scope,
        import_batch: row.import_batch,
        synced_at: row.synced_at,
        source_placement: sourcePlacement(row.payload_json),
      })),
    }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error?.stack || String(error));
  process.exitCode = 1;
});
