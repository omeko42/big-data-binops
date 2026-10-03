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
  const res = await c.query(\`
    select lp.id, lp.no_laporan,
      coalesce(
        (select string_agg(distinct coalesce(nullif(tp->>\\x27nama_kategori_kejahatan\\x27,\\x27\\x27), nullif(tp->>\\x27kategori_kejahatan\\x27,\\x27\\x27)), \\x27, \\x27)
         from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->\\x27tindak_pidana\\x27)=\\x27array\\x27 then lp.payload_json->\\x27tindak_pidana\\x27 else \\x27[]\\x27::jsonb end) tp
         where nullif(tp->>\\x27nama_kategori_kejahatan\\x27,\\x27\\x27) is not null or nullif(tp->>\\x27kategori_kejahatan\\x27,\\x27\\x27) is not null),
        (select jk.keterangan from cm_jenis_kejahatan jk where jk.id = lp.jenis_kejahatan_id),
        nullif(lp.kategori, \\x27\\x27),
        \\x27(Belum Terkategori)\\x27
      ) as tindak_pidana_kategori,
      coalesce(
        (select string_agg(x.txt, \\x27; \\x27) from (
            select distinct coalesce(nullif(tp->>\\x27nama_kategori_kejahatan\\x27,\\x27\\x27),\\x27(tanpa kategori)\\x27)
                || case when coalesce(nullif(tp->>\\x27pasal_mapping\\x27,\\x27\\x27), nullif(tp->>\\x27pasal\\x27,\\x27\\x27)) is not null
                        then \\x27 — \\x27 || coalesce(nullif(tp->>\\x27pasal_mapping\\x27,\\x27\\x27), nullif(tp->>\\x27pasal\\x27,\\x27\\x27)) else \\x27\\x27 end as txt
            from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->\\x27tindak_pidana\\x27)=\\x27array\\x27 then lp.payload_json->\\x27tindak_pidana\\x27 else \\x27[]\\x27::jsonb end) tp
        ) x),
        nullif(lp.kategori, \\x27\\x27),
        \\x27(Belum Terkategori)\\x27
      ) as dugaan_tp_full
    from bdb_laporan_polisi lp
    where lp.deleted_at is null
    order by lp.id desc
    limit 5;
  \`);
  console.log("SQL TEST RESULTS:");
  console.log(JSON.stringify(res.rows, null, 2));
  await c.end();
}).catch(e => { console.error(e); process.exit(1); });
'`;

console.log(runBE(script));
