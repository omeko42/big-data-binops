import { runQuery } from '../query_helper.mjs';

async function main() {
  const r = await runQuery("select id, kode, deskripsi, parent_id from bdb_satker where deskripsi like '%JAWA TIMUR%' limit 5");
  console.log(r.rows);
}
main();
