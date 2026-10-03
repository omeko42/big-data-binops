import { runBE } from './be_exec.mjs';

const script = `docker exec bdb-api node -e '
const { Client } = require("pg");
const c = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
c.connect().then(async () => {
  const t0 = Date.now();
  const res = await c.query(\`
    with recursive satker_tree as (
      select id from bdb_satker where id = 4891
      union all
      select s.id from bdb_satker s join satker_tree st on s.parent_id = st.id
    )
    select lp.id, lp.no_laporan, lp.tgl_laporan, lp.satker_nama,
           coalesce(
             (select string_agg(distinct coalesce(nullif(tp->>\\x27nama_kategori_kejahatan\\x27,\\x27\\x27), nullif(tp->>\\x27kategori_kejahatan\\x27,\\x27\\x27)), \\x27, \\x27)
              from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->\\x27tindak_pidana\\x27)=\\x27array\\x27 then lp.payload_json->\\x27tindak_pidana\\x27 else \\x27[]\\x27::jsonb end) tp
              where nullif(tp->>\\x27nama_kategori_kejahatan\\x27,\\x27\\x27) is not null or nullif(tp->>\\x27kategori_kejahatan\\x27,\\x27\\x27) is not null),
             (select jk.keterangan from cm_jenis_kejahatan jk where jk.id = lp.jenis_kejahatan_id),
             nullif(lp.kategori, \\x27\\x27),
             \\x27-\\x27
           ) as tindak_pidana,
           sm.code as status_code, sm.nama as status_nama, sm.kategori as status_kategori,
           (select d.tanggal_dokumen from bdb_dokumen d join bdb_document_type_master dt on dt.id = d.document_type_id
            where d.lp_id = lp.id and dt.status_target_id = lp.status_id
            order by d.tanggal_dokumen desc, d.id desc limit 1) as tgl_status,
           (select d.nomor_dokumen from bdb_dokumen d join bdb_document_type_master dt on dt.id = d.document_type_id
            where d.lp_id = lp.id and dt.status_target_id = lp.status_id
            order by d.tanggal_dokumen desc, d.id desc limit 1) as no_dokumen
    from bdb_laporan_polisi lp
    join satker_tree st on st.id = coalesce(lp.unit_satker_id, lp.satker_id)
    left join bdb_status_master sm on sm.id = lp.status_id
    where lp.deleted_at is null
      and coalesce(lp.dilimpahkan_eksternal, false) = false
      and parse_tgl_laporan(lp.tgl_laporan) >= \\x272026-09-01\\x27::date
      and parse_tgl_laporan(lp.tgl_laporan) <= \\x272026-09-10\\x27::date
    order by parse_tgl_laporan(lp.tgl_laporan) desc nulls last, lp.id desc
    limit 10;
  \`);
  const t1 = Date.now();
  console.log("Total rows fetched:", res.rows.length, "Time (ms):", t1 - t0);
  console.log("Sample row:", JSON.stringify(res.rows[0], null, 2));
  await c.end();
}).catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
