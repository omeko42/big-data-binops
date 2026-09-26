import { runBE } from '../scripts/be_exec.mjs';

const script = `
const { Client } = require('pg');
const client = new Client({
    host: '10.0.0.x',
    port: 5432,
    user: 'bdb_app',
    password: 'Bareskrim2026',
    database: 'big_data_binops',
});

async function run() {
    await client.connect();

    console.log('========================================================');
    console.log('       INTERCONNECTIVITY & HEALTH AUDIT VERIFICATION    ');
    console.log('========================================================');

    // 1. Menu: Integrasi DORS
    const rawTotal = await client.query('select count(*)::int as c from bdb_dors_raw_lp');
    const lpActive = await client.query('select count(*)::int as c from bdb_laporan_polisi where deleted_at is null');
    const unmapped = await client.query(\`
        select count(*)::int as c from bdb_dors_raw_lp r
        where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)
    \`);
    console.log('[1] MENU INTEGRASI DORS (/cms/integrasi/dors):');
    console.log('    - Total Raw LP DORS     :', rawTotal.rows[0].c.toLocaleString('id-ID'));
    console.log('    - LP Aktif di CAS       :', lpActive.rows[0].c.toLocaleString('id-ID'));
    console.log('    - LP Belum Termapping   :', unmapped.rows[0].c.toLocaleString('id-ID'));

    // 2. Menu: Satker Legacy
    await client.query('create extension if not exists pg_trgm');
    const legacyStats = await client.query(\`
        with unmapped as (
            select r.id as raw_id, r.dors_lp_id, r.model_lp, r.no_laporan, r.payload_json,
                   case
                       when jsonb_typeof(r.payload_json->'polsek')='object' then 'Polsek'
                       when jsonb_typeof(r.payload_json->'polres')='object' then 'Polres'
                       when jsonb_typeof(r.payload_json->'polda')='object' and r.payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
                       when jsonb_typeof(r.payload_json->'polda')='object' then 'Polda'
                       else 'Mabes'
                   end as level,
                   nullif(case
                       when jsonb_typeof(r.payload_json->'polsek')='object' then r.payload_json->'polsek'->>'kode_pusiknas'
                       when jsonb_typeof(r.payload_json->'polres')='object' then r.payload_json->'polres'->>'kode_pusiknas'
                       when jsonb_typeof(r.payload_json->'polda')='object' and (r.payload_json->'polda'->>'kode' = '060.09' or r.payload_json->'polda'->>'nama' ilike '%lampung%') then '060.01.11'
                       when jsonb_typeof(r.payload_json->'polda')='object' then r.payload_json->'polda'->>'kode_pusiknas'
                   end, '') as kode_pusiknas,
                   coalesce(r.payload_json->'polsek'->>'nama', r.payload_json->'polres'->>'nama', r.payload_json->'polda'->>'nama') as nama
            from bdb_dors_raw_lp r
            where not exists (select 1 from bdb_laporan_polisi lp where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp)
        ),
        grouped as (
            select level, kode_pusiknas, nama, count(*)::int as lp_terdampak
            from unmapped
            group by level, coalesce(kode_pusiknas, 'NOKODE:' || coalesce(nama, '')), nama, kode_pusiknas
        )
        select level, count(*)::int as grup, sum(lp_terdampak)::int as lp_terdampak
        from grouped
        group by level
    \`);
    console.log('[2] MENU REKONSILIASI SATKER LEGACY (/cms/integrasi/satker-legacy):');
    console.log('    - Breakdown per level:', legacyStats.rows.length ? legacyStats.rows : 'Semua grup sudah bersih!');

    // 3. Menu: Data Laporan Polisi
    const lpSummary = await client.query(\`
        select penanganan_level, count(*)::int as count
        from bdb_laporan_polisi
        where deleted_at is null
        group by penanganan_level
        order by count desc
    \`);
    console.log('[3] MENU DATA LAPORAN POLISI (/cms/laporan-polisi):');
    for (const row of lpSummary.rows) {
        console.log(\`    - Level \${row.penanganan_level || 'Lainnya'}: \${row.count.toLocaleString('id-ID')} LP\`);
    }

    // 4. Menu: Kinerja Perkara
    const kps = await client.query(\`
        select count(*)::int as snapshot_rows, max(refreshed_at) as last_refreshed
        from bdb_kinerja_perkara_snapshot
    \`);
    console.log('[4] MENU KINERJA PERKARA (/cms/report/kinerja-perkara):');
    console.log('    - Snapshot Records      :', kps.rows[0].snapshot_rows.toLocaleString('id-ID'));
    console.log('    - Terakhir Disegarkan   :', kps.rows[0].last_refreshed);

    console.log('========================================================');
    console.log('                STATUS: SEMUA MENU TERHUBUNG            ');
    console.log('========================================================');

    await client.end();
}

run().catch(e => { console.error(e); process.exit(1); });
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
