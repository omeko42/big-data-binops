const { Client } = require('pg');

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
    const mapped = await client.query(`
      select id, dors_lp_id, model_lp, raw_lp_id, no_laporan,
             satker_id, satker_nama, unit_nama, unit_level,
             unit_satker_id, unit_satker_nama, unit_satker_kode,
             penanganan_level, kode_pusiknas, sudah_dilimpahkan,
             dilimpahkan_eksternal, created_at, updated_at, payload_json
      from bdb_laporan_polisi
      where (
        regexp_replace(upper(coalesce(no_laporan,'')), '[^A-Z0-9]', '', 'g') like '%LPA6II2026%'
        or regexp_replace(upper(coalesce(no_laporan,'')), '[^A-Z0-9]', '', 'g') like '%LPA06II2026%'
        or upper(payload_json::text) like '%KUTAI BARAT%'
      )
      and (
        upper(coalesce(no_laporan,'')) like '%KUTAI%BARAT%'
        or upper(payload_json::text) like '%KUTAI BARAT%'
      )
      and (
        upper(coalesce(no_laporan,'')) like '%NARKOBA%'
        or upper(payload_json::text) like '%NARKOBA%'
      )
      order by updated_at desc nulls last, id desc
      limit 100
    `);

    const raw = await client.query(`
      select id, dors_lp_id, model_lp, no_laporan, data_scope,
             import_batch, synced_at, payload_json
      from bdb_dors_raw_lp
      where (
        regexp_replace(upper(coalesce(no_laporan,'')), '[^A-Z0-9]', '', 'g') like '%LPA6II2026%'
        or regexp_replace(upper(coalesce(no_laporan,'')), '[^A-Z0-9]', '', 'g') like '%LPA06II2026%'
        or upper(payload_json::text) like '%KUTAI BARAT%'
      )
      and (
        upper(coalesce(no_laporan,'')) like '%KUTAI%BARAT%'
        or upper(payload_json::text) like '%KUTAI BARAT%'
      )
      and (
        upper(coalesce(no_laporan,'')) like '%NARKOBA%'
        or upper(payload_json::text) like '%NARKOBA%'
      )
      order by synced_at desc nulls last, id desc
      limit 100
    `);

    console.log(JSON.stringify({
      mapped_count: mapped.rowCount,
      raw_count: raw.rowCount,
      mapped: mapped.rows.map((r) => ({
        id: r.id,
        dors_lp_id: r.dors_lp_id,
        model_lp: r.model_lp,
        raw_lp_id: r.raw_lp_id,
        no_laporan: r.no_laporan,
        satker_id: r.satker_id,
        satker_nama: r.satker_nama,
        unit_nama: r.unit_nama,
        unit_level: r.unit_level,
        unit_satker_id: r.unit_satker_id,
        unit_satker_nama: r.unit_satker_nama,
        unit_satker_kode: r.unit_satker_kode,
        effective_owner_id: r.unit_satker_id || r.satker_id,
        effective_owner_nama: r.unit_satker_nama || r.satker_nama,
        penanganan_level: r.penanganan_level,
        kode_pusiknas: r.kode_pusiknas,
        sudah_dilimpahkan: r.sudah_dilimpahkan,
        dilimpahkan_eksternal: r.dilimpahkan_eksternal,
        created_at: r.created_at,
        updated_at: r.updated_at,
        source_placement: sourcePlacement(r.payload_json),
      })),
      raw: raw.rows.map((r) => ({
        id: r.id,
        dors_lp_id: r.dors_lp_id,
        model_lp: r.model_lp,
        no_laporan: r.no_laporan,
        data_scope: r.data_scope,
        import_batch: r.import_batch,
        synced_at: r.synced_at,
        source_placement: sourcePlacement(r.payload_json),
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
