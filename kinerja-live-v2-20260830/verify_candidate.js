const { Client } = require('/usr/src/app/node_modules/pg');
const {
  KinerjaPerkaraService,
  buildKinerjaRegionalScopePlan
} = require('/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const closeTo = (actual, expected, tolerance = 0.00005) =>
  Math.abs(Number(actual) - Number(expected)) <= tolerance;

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  await client.connect();
  const ds = { query: (sql, params) => client.query(sql, params).then((result) => result.rows) };
  const service = new KinerjaPerkaraService(ds, null);

  try {
    const synthetic = [
      { id: 1, parent_id: null, deskripsi: 'POLDA LAMPUNG', tipe_satker: 'POLDA' },
      { id: 2, parent_id: 1, deskripsi: 'DIT KRIMUM POLDA LAMPUNG', tipe_satker: 'FUNGSI' },
      { id: 3, parent_id: 1, deskripsi: 'DIT KRIMSUS POLDA LAMPUNG', tipe_satker: 'FUNGSI' },
      { id: 4, parent_id: 1, deskripsi: 'DIT NARKOBA POLDA LAMPUNG', tipe_satker: 'FUNGSI' },
      { id: 5, parent_id: 1, deskripsi: 'POLRESTA BANDAR LAMPUNG', tipe_satker: 'POLRES' },
      { id: 6, parent_id: 5, deskripsi: 'SAT RESKRIM POLRESTA BANDAR LAMPUNG', tipe_satker: 'FUNGSI' },
      { id: 7, parent_id: 5, deskripsi: 'SAT NARKOBA POLRESTA BANDAR LAMPUNG', tipe_satker: 'FUNGSI' },
      { id: 8, parent_id: 5, deskripsi: 'POLSEK KEDATON', tipe_satker: 'POLSEK' },
      { id: 9, parent_id: 8, deskripsi: 'UNIT RESKRIM POLSEK KEDATON', tipe_satker: 'FUNGSI' }
    ];
    const purePlan = buildKinerjaRegionalScopePlan(synthetic, 2);
    assert(purePlan && purePlan.rootId === 1, 'Akun DIT harus berakar di Polda.');
    assert(purePlan.functionGroup === 'KRIMUM', 'Kelompok akun DIT KRIMUM tidak dikenali.');
    assert(JSON.stringify(purePlan.allowedIds) === JSON.stringify([1, 2, 5, 6, 8, 9]), 'Scope Krimum synthetic tidak tepat.');

    const superRows = await ds.query(`
      select id from auth_users
      where lower(coalesce(role_bdb,'')) in ('superadmin','admin_binops')
         or lower(coalesce(role_name,'')) like '%super%'
      order by case when lower(coalesce(role_bdb,''))='superadmin' then 0 else 1 end,id
      limit 1
    `);
    assert(superRows.length === 1, 'Akun all-access untuk tes tidak ditemukan.');
    const superId = Number(superRows[0].id);

    const nationalStarted = Date.now();
    const national = await service.buildTree(
      superId, '2026-01-01', '2026-08-30', 'both',
      undefined, undefined, undefined, 'national'
    );
    const nationalMs = Date.now() - nationalStarted;
    const wanted = new Map();
    const walk = (nodes) => nodes.forEach((node) => {
      if (node.nama === 'POLDA PAPUA BARAT DAYA' || node.nama === 'POLDA PAPUA TENGAH') wanted.set(node.nama, node);
      walk(node.children || []);
    });
    walk(national.roots);
    const pbd = wanted.get('POLDA PAPUA BARAT DAYA');
    const pt = wanted.get('POLDA PAPUA TENGAH');
    assert(pbd && pt, 'Node Polda Papua kandidat tidak ditemukan.');
    assert(pbd.ct === 2453 && pt.ct === 1974, 'Total Papua berubah dari baseline live.');
    assert(pbd.children.some((node) => node.nama === 'POLRESTA SORONG KOTA' && node.ct === 1784), 'Roll-up Polresta Sorong Kota gagal.');
    assert(pt.children.some((node) => node.nama === 'POLRES MIMIKA' && node.ct === 1173), 'Roll-up Polres Mimika gagal.');

    for (const node of [pbd, pt]) {
      const ccTotal = node.cc_aktual + node.cc_tunggakan;
      const cpTotal = node.cp_berjalan + node.cp_tunggakan;
      const expectedCrOld = node.ct > 0 ? (ccTotal / node.ct) * 100 : 0;
      const expectedCrNew = node.ct + node.cc_tunggakan > 0 ? (ccTotal / (node.ct + node.cc_tunggakan)) * 100 : 0;
      const expectedPrOld = node.ct > 0 ? (cpTotal / node.ct) * 100 : 0;
      const expectedPrNew = node.ct + node.cp_tunggakan > 0 ? (cpTotal / (node.ct + node.cp_tunggakan)) * 100 : 0;
      assert(closeTo(node.cr_lama, expectedCrOld), `${node.nama}: CR lama salah.`);
      assert(closeTo(node.cr, expectedCrNew), `${node.nama}: CR baru salah.`);
      assert(closeTo(node.pr_lama, expectedPrOld), `${node.nama}: PR lama salah.`);
      assert(closeTo(node.pr, expectedPrNew), `${node.nama}: PR baru salah.`);
    }

    const regionalUsers = await ds.query(`
      select u.id,s.deskripsi
      from auth_users u
      join bdb_satker s on s.id=u.scope_satker_id
      where upper(s.deskripsi) like '%KRIMUM%LAMPUNG%'
      order by u.id limit 1
    `);
    assert(regionalUsers.length === 1, 'Akun Krimum Lampung untuk tes regional tidak ditemukan.');
    const regionalStarted = Date.now();
    const regional = await service.buildTree(
      Number(regionalUsers[0].id), '2026-01-01', '2026-08-30', 'both',
      undefined, undefined, undefined, 'scoped'
    );
    const regionalMs = Date.now() - regionalStarted;
    const liveSatkers = await service.getSatkerTree();
    const livePlan = buildKinerjaRegionalScopePlan(liveSatkers, Number((await ds.query('select scope_satker_id from auth_users where id=$1',[Number(regionalUsers[0].id)]))[0].scope_satker_id));
    console.log(JSON.stringify({ regional_probe: { user: regionalUsers[0], plan: livePlan && { rootId: livePlan.rootId, rootNama: livePlan.rootNama, functionGroup: livePlan.functionGroup, allowedCount: livePlan.allowedIds.length }, roots: regional.roots.map((node) => node.nama) } }, null, 2));
    assert(regional.roots.length === 1 && regional.roots[0].nama === 'POLDA LAMPUNG', 'Root regional bukan Polda Lampung.');
    const names = [];
    const collect = (nodes) => nodes.forEach((node) => { names.push(node.nama); collect(node.children || []); });
    collect(regional.roots);
    assert(!names.some((name) => /KRIMSUS|NARKOBA/i.test(name)), 'Scope Krimum masih menampilkan fungsi Krimsus/Narkoba.');

    console.log(JSON.stringify({
      ok: true,
      national_ms: nationalMs,
      regional_ms: regionalMs,
      papua_barat_daya: { ct: pbd.ct, children: pbd.children.map((n) => [n.nama, n.ct]) },
      papua_tengah: { ct: pt.ct, children: pt.children.map((n) => [n.nama, n.ct]) },
      regional: { account_satker: regionalUsers[0].deskripsi, root: regional.roots[0].nama, node_count: names.length }
    }, null, 2));
  } finally {
    await client.end();
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
