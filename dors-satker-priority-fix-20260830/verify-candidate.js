const { Client } = require('/usr/src/app/node_modules/pg');
const { SatkerLegacyReconciliationService } = require('/usr/src/app/dist/bdb/satker/satker-legacy-reconciliation.service.js');
(async () => {
  const svc = new SatkerLegacyReconciliationService(null, null, null, null);
  const client = new Client({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT), user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE });
  await client.connect();
  const norm = (x) => `upper(regexp_replace(coalesce(${x},''),'[^A-Za-z0-9]','','g'))`;
  try {
    const g = svc.groupsCte();
    const summary = await client.query(`with g as (${g}) select count(*)::int groups, coalesce(sum(lp_terdampak),0)::int lp, count(*) filter (where exact_id is not null)::int exact_groups, coalesce(sum(lp_terdampak) filter (where exact_id is not null),0)::int exact_lp, count(*) filter (where exact_id is not null and ${norm('nama')}=${norm('exact_deskripsi')})::int same_name_groups, coalesce(sum(lp_terdampak) filter (where exact_id is not null and ${norm('nama')}=${norm('exact_deskripsi')}),0)::int same_name_lp, count(*) filter (where exact_id is not null and ${norm('nama')}<>${norm('exact_deskripsi')})::int different_name_groups, coalesce(sum(lp_terdampak) filter (where exact_id is not null and ${norm('nama')}<>${norm('exact_deskripsi')}),0)::int different_name_lp from g`);
    const mismatches = await client.query(`with g as (${g}) select level,nama,kode_pusiknas,kode_dors,lp_terdampak,exact_id,exact_deskripsi from g where exact_id is not null and ${norm('nama')}<>${norm('exact_deskripsi')} order by level,nama`);
    console.log(JSON.stringify({ summary: summary.rows[0], mismatches: mismatches.rows }, null, 2));
  } finally { await client.end(); }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });