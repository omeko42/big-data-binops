const { Client } = require('pg');

function sourcePlacement(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return {
    polda: payload.polda ? { id: payload.polda.id, nama: payload.polda.nama, kode_pusiknas: payload.polda.kode_pusiknas } : null,
    polres: payload.polres ? { id: payload.polres.id, nama: payload.polres.nama, kode_pusiknas: payload.polres.kode_pusiknas } : null,
    polsek: payload.polsek ? { id: payload.polsek.id, nama: payload.polsek.nama, kode_pusiknas: payload.polsek.kode_pusiknas } : null,
    unit: payload.unit ? { id: payload.unit.id, unit: payload.unit.unit, level: payload.unit.level } : null,
  };
}

async function hierarchy(client, satkerId) {
  if (!satkerId) return [];
  const result = await client.query(`
    with recursive chain as (
      select id, kode, deskripsi, parent_id, 0 as depth from bdb_satker where id=$1
      union all
      select p.id, p.kode, p.deskripsi, p.parent_id, c.depth+1
      from bdb_satker p join chain c on p.id=c.parent_id
    ) select * from chain order by depth
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
    await client.query(`set statement_timeout='30s'`);
    const conditions = `
      upper(no_laporan) like 'LP/A/6/II/2026/%'
      and upper(no_laporan) like '%KUTAI%BARAT%'
      and upper(no_laporan) like '%NARKOBA%'
    `;
    const lp = await client.query(`
      select id, dors_lp_id, model_lp, raw_lp_id, no_laporan,
             satker_id, satker_nama, unit_nama, unit_level,
             unit_satker_id, unit_satker_nama, unit_satker_kode,
             penanganan_level, kode_pusiknas, sudah_dilimpahkan,
             dilimpahkan_eksternal, created_at, updated_at, payload_json
      from bdb_laporan_polisi where ${conditions} order by id
    `);
    const raw = await client.query(`
      select id, dors_lp_id, model_lp, no_laporan, data_scope,
             import_batch, synced_at, payload_json
      from bdb_dors_raw_lp where ${conditions} order by id
    `);
    const mapped = [];
    for (const r of lp.rows) {
      const pelimpahan = await client.query(`select * from bdb_lp_pelimpahan where lp_id=$1 order by created_at,id`, [r.id]);
      const audit = await client.query(`
        select id,user_id,user_nama,action,meta,created_at from bdb_audit_log
        where entity='laporan_polisi' and entity_id=$1::text order by created_at,id
      `, [r.id]);
      mapped.push({
        id:r.id,dors_lp_id:r.dors_lp_id,model_lp:r.model_lp,raw_lp_id:r.raw_lp_id,
        no_laporan:r.no_laporan,satker_id:r.satker_id,satker_nama:r.satker_nama,
        unit_nama:r.unit_nama,unit_level:r.unit_level,unit_satker_id:r.unit_satker_id,
        unit_satker_nama:r.unit_satker_nama,unit_satker_kode:r.unit_satker_kode,
        effective_owner_id:r.unit_satker_id||r.satker_id,
        effective_owner_nama:r.unit_satker_nama||r.satker_nama,
        penanganan_level:r.penanganan_level,kode_pusiknas:r.kode_pusiknas,
        sudah_dilimpahkan:r.sudah_dilimpahkan,dilimpahkan_eksternal:r.dilimpahkan_eksternal,
        created_at:r.created_at,updated_at:r.updated_at,source_placement:sourcePlacement(r.payload_json),
        effective_owner_hierarchy:await hierarchy(client,r.unit_satker_id||r.satker_id),
        pelimpahan:pelimpahan.rows,audit:audit.rows,
      });
    }
    console.log(JSON.stringify({
      mapped_count:lp.rowCount,raw_count:raw.rowCount,mapped,
      raw:raw.rows.map((r)=>({id:r.id,dors_lp_id:r.dors_lp_id,model_lp:r.model_lp,
        no_laporan:r.no_laporan,data_scope:r.data_scope,import_batch:r.import_batch,
        synced_at:r.synced_at,source_placement:sourcePlacement(r.payload_json)})),
    },null,2));
  } finally { await client.end(); }
}

main().catch((error)=>{console.error(error?.stack||String(error));process.exitCode=1;});
