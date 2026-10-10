import { runBE } from './be_exec.mjs';

const nodeScript = `
const { Client } = require("pg");
const c = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

function satkerChainFromNoLaporan(no) {
  const parts = String(no || '')
    .split('/')
    .map(s => s.trim())
    .filter(Boolean);
  const idx = parts.findIndex(p => /^SPKT/i.test(p));
  return idx >= 0 ? parts.slice(idx + 1) : [];
}

async function main() {
  await c.connect();
  console.log("Connected to PostgreSQL");
  
  await c.query('create extension if not exists pg_trgm');

  // Ensure table & index on bdb_dors_satker_map
  await c.query(\`
    create table if not exists bdb_dors_satker_map (
        id bigserial primary key,
        dors_kode_pusiknas text,
        dors_nama text not null,
        dors_parent_nama text,
        satker_id bigint not null references bdb_satker(id) on delete cascade,
        satker_nama text, catatan text,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now()
    );
    alter table bdb_dors_satker_map add column if not exists unit_nama text;
    drop index if exists bdb_dors_satker_map_key;
    create unique index if not exists bdb_dors_satker_map_key
        on bdb_dors_satker_map (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')));
  \`);

  const LEVEL_SQL = \`
    case
        when jsonb_typeof(r.payload_json->'polsek')='object' then 'Polsek'
        when jsonb_typeof(r.payload_json->'polres')='object' then 'Polres'
        when jsonb_typeof(r.payload_json->'polda')='object' and r.payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
        when jsonb_typeof(r.payload_json->'polda')='object' then 'Polda'
        else 'Mabes'
    end\`;
  const KP_SQL = \`
    case
        when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode_pusiknas'
        when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode_pusiknas'
        when jsonb_typeof(r.payload_json->'polda')='object' and (r.payload_json->'polda'->>'kode' = '060.09' or r.payload_json->'polda'->>'nama' ilike '%lampung%') then '060.01.11'
        when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode_pusiknas'
    end\`;

  const rowsRes = await c.query(\`
    select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.data_scope, r.payload_json,
           \${LEVEL_SQL} as lvl, \${KP_SQL} as kp
    from bdb_dors_raw_lp r
    where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
    order by r.id
  \`);
  const rows = rowsRes.rows;
  console.log("Unmapped count to process:", rows.length);

  let mapped = 0;
  for (const r of rows) {
    const p = r.payload_json || {};
    const isObj = (k) => p[k] && typeof p[k] === 'object' && !Array.isArray(p[k]);
    const deepest = isObj('polsek') ? p.polsek?.nama : isObj('polres') ? p.polres?.nama : isObj('polda') ? p.polda?.nama : null;
    const parentPay = isObj('polsek') ? p.polres?.nama : isObj('polres') ? p.polda?.nama : null;
    const chain = satkerChainFromNoLaporan(r.no_laporan);
    const target = (deepest || chain[0] || '').trim();
    if (!target) continue;
    const parentChain = (chain[1] || '').trim();

    const bestRes = await c.query(
      \`select c.id, c.deskripsi
       from bdb_satker c left join bdb_satker par on par.id = c.parent_id
       where c.is_synthetic = false and similarity(upper(c.deskripsi), upper(\$1)) >= 0.3
       order by similarity(upper(c.deskripsi), upper(\$1))
              + greatest(coalesce(similarity(upper(par.deskripsi), upper(\$2)), 0), coalesce(similarity(upper(par.deskripsi), upper(\$3)), 0)) desc,
              c.id
       limit 1\`,
      [target, parentChain || target, parentPay || target]
    );

    let satkerId = null;
    let satkerNama = null;
    if (bestRes.rows.length) {
      satkerId = bestRes.rows[0].id;
      satkerNama = bestRes.rows[0].deskripsi;
    } else {
      // Fallback: look for parent
      const parTarget = (parentPay || parentChain || '').trim();
      if (parTarget) {
        const parRes = await c.query(
          \`select c.id, c.deskripsi
           from bdb_satker c
           where c.is_synthetic = false and similarity(upper(c.deskripsi), upper(\$1)) >= 0.4
           order by similarity(upper(c.deskripsi), upper(\$1)) desc, c.id limit 1\`,
          [parTarget]
        );
        if (parRes.rows.length) {
          satkerId = parRes.rows[0].id;
          satkerNama = parRes.rows[0].deskripsi;
        }
      }
    }

    if (!satkerId) {
      console.log("Could not find match for:", target, "parent:", parentPay || parentChain);
      continue;
    }

    const parentAlias = parentPay || parentChain || null;
    try {
      await c.query(
        \`insert into bdb_dors_satker_map (dors_kode_pusiknas, dors_nama, dors_parent_nama, satker_id, satker_nama, catatan)
         values (\$1,\$2,\$3,\$4,\$5,'paksa mapping backfill')
         on conflict (coalesce(dors_kode_pusiknas,''), lower(dors_nama), lower(coalesce(dors_parent_nama,'')), lower(coalesce(unit_nama,'')))
         do update set satker_id=excluded.satker_id, satker_nama=excluded.satker_nama, updated_at=now()\`,
        [r.kp || null, target, parentAlias, satkerId, satkerNama]
      );
    } catch (e) {
      // ignore alias upsert error
    }

    await c.query(
      \`insert into bdb_laporan_polisi
          (dors_lp_id, model_lp, raw_lp_id, no_laporan, tgl_laporan, kategori, tempat_kejadian, uraian_singkat,
           penanganan_level, kode_pusiknas, satker_id, satker_nama, unit_nama, unit_level, data_scope, payload_json, synced_at)
       values (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10,\$11,\$12,\$13,\$14,\$15,\$16::jsonb, now())
       on conflict (dors_lp_id, model_lp) do nothing\`,
      [
        r.dors_lp_id, r.model_lp, r.raw_id, r.no_laporan,
        p.tgl_laporan ?? null, p.kategori ?? null, p.tempat_kejadian ?? null,
        p.uraian_singkat_kejadian ?? p.uraian_kejadian ?? null,
        r.lvl, r.kp, satkerId, satkerNama,
        p.unit?.unit ?? null, p.unit?.level ?? null, r.data_scope, JSON.stringify(p)
      ]
    );

    mapped++;
    if (mapped % 20 === 0) {
      console.log(\`Mapped \${mapped}/\${rows.length}...\`);
    }
  }

  console.log(\`Finished mapping: \${mapped}/\${rows.length} mapped.\`);

  const unmappedRem = await c.query(\`
    select count(*)::int as c
    from bdb_dors_raw_lp r
    where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id=r.dors_lp_id and lp.model_lp=r.model_lp)
  \`);
  console.log("Remaining unmapped in DB:", unmappedRem.rows[0].c);

  await c.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
`;

const b64 = Buffer.from(nodeScript).toString('base64');
const cmd = `echo "${b64}" | base64 -d | docker exec -i bdb-api node`;
console.log(runBE(cmd));
