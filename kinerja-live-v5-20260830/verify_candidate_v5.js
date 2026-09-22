const { Client } = require('/usr/src/app/node_modules/pg');
const {
  KinerjaPerkaraService,
  buildKinerjaRegionalScopePlan
} = require('/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js');
const {
  KinerjaPerkaraController
} = require('/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.controller.js');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const build = (service, userId, visibility, groups = [], scopeSatkerId) =>
  service.buildTree(
    userId,
    '2026-01-01',
    '2026-08-30',
    'both',
    undefined,
    undefined,
    undefined,
    visibility,
    undefined,
    undefined,
    undefined,
    undefined,
    groups,
    scopeSatkerId
  );

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
  const controller = new KinerjaPerkaraController(service);

  try {
    const synthetic = [
      { id: 1, parent_id: null, deskripsi: 'POLDA ACEH', tipe_satker: 'POLDA' },
      { id: 2, parent_id: 1, deskripsi: 'DITRESKRIMSUS POLDA ACEH', tipe_satker: 'FUNGSI' },
      { id: 3, parent_id: 1, deskripsi: 'POLRES ACEH BARAT', tipe_satker: 'POLRES' },
      { id: 4, parent_id: 3, deskripsi: 'SATRESKRIM POLRES ACEH BARAT', tipe_satker: 'FUNGSI' },
      { id: 5, parent_id: 3, deskripsi: 'POLSEK JOHAN PAHLAWAN', tipe_satker: 'POLSEK' },
      { id: 6, parent_id: 5, deskripsi: 'UNIT RESKRIM POLSEK JOHAN PAHLAWAN', tipe_satker: 'FUNGSI' },
      { id: 7, parent_id: null, deskripsi: 'POLDA SUMATERA UTARA', tipe_satker: 'POLDA' },
      { id: 8, parent_id: 7, deskripsi: 'POLRES MEDAN', tipe_satker: 'POLRES' }
    ];
    assert(buildKinerjaRegionalScopePlan(synthetic, 1, 3)?.rootId === 3, 'Polda tidak dapat memilih Polres child.');
    assert(buildKinerjaRegionalScopePlan(synthetic, 1, 8) === null, 'Polda dapat memilih wilayah di luar hierarki.');
    assert(buildKinerjaRegionalScopePlan(synthetic, 3, 5)?.rootId === 5, 'Polres tidak dapat memilih Polsek child.');
    assert(buildKinerjaRegionalScopePlan(synthetic, 5)?.rootId === 5, 'Polsek tidak berakar di wilayah sendiri.');
    const functionPlan = buildKinerjaRegionalScopePlan(synthetic, 2, 3);
    assert(functionPlan?.functionGroup === 'KRIMSUS', 'Kelompok fungsi akun hilang saat target regional berubah.');
    assert(!functionPlan.allowedIds.includes(4), 'Fungsi KRIMUM lolos ke scope akun KRIMSUS.');
    assert(controller.visibility('national') === 'national', 'Controller menolak scope Nasional.');
    assert(controller.visibility('scoped') === 'scoped', 'Controller menolak scope Regional/scoped.');
    assert(controller.scopeSatkerId('123') === 123, 'Controller tidak meneruskan scope_satker_id.');

    const [superUser] = await ds.query(`
      select id
      from auth_users
      where lower(coalesce(role_bdb,'')) in ('superadmin','admin_binops')
         or lower(coalesce(role_name,'')) like '%super%'
      order by case when lower(coalesce(role_bdb,''))='superadmin' then 0 else 1 end,id
      limit 1
    `);
    assert(superUser, 'Akun all-access untuk smoke test tidak ditemukan.');
    const superId = Number(superUser.id);
    const superMeta = (await service.scopeOptions(superId)).data;
    assert(superMeta.defaultVisibility === 'national', 'Default Super Admin bukan Nasional.');
    assert(superMeta.options.length > 0 && superMeta.options.every((option) => option.tipe === 'POLDA'), 'Pilihan Super Admin bukan daftar Polda.');
    const aceh = superMeta.options.find((option) => /POLDA ACEH$/i.test(option.label));
    assert(aceh, 'POLDA ACEH tidak ditemukan pada pencarian regional Super Admin.');

    const regionalKrimsus = await build(service, superId, 'scoped', ['KRIMSUS'], aceh.value);
    assert(regionalKrimsus.roots.length === 1 && Number(regionalKrimsus.roots[0].id) === Number(aceh.value), 'Regional Super Admin tidak berakar di Polda Aceh.');
    assert(regionalKrimsus.applied_filters.kelompokHitung.includes('KRIMSUS'), 'Regional + KRIMSUS tidak diterapkan sebagai irisan.');

    const [poldaUser] = await ds.query(`
      select u.id,u.scope_satker_id,s.deskripsi
      from auth_users u
      join bdb_satker s on s.id=u.scope_satker_id
      where upper(coalesce(s.tipe_satker,''))='POLDA'
         or upper(coalesce(s.deskripsi,'')) like 'DIT%POLDA%'
      order by u.id
      limit 1
    `);
    assert(poldaUser, 'Akun Polda/fungsi Polda untuk smoke test tidak ditemukan.');
    const poldaMeta = (await service.scopeOptions(Number(poldaUser.id))).data;
    const polresOption = poldaMeta.options.find((option) => option.tipe === 'POLRES');
    assert(polresOption, 'Akun Polda tidak mendapat pilihan Polres child.');
    const poldaToPolres = await build(service, Number(poldaUser.id), 'scoped', [], polresOption.value);
    assert(poldaToPolres.roots.length === 1 && Number(poldaToPolres.roots[0].id) === Number(polresOption.value), 'Pilihan Polres akun Polda tidak menjadi root hasil.');
    const poldaNational = await build(service, Number(poldaUser.id), 'national');
    assert(poldaNational.scoped === false && poldaNational.roots.length > 0, 'Pilihan Nasional akun Polda tidak menghasilkan data nasional.');
    const denied = await build(service, Number(poldaUser.id), 'scoped', [], superMeta.options.find((option) => option.value !== poldaMeta.defaultRegionId)?.value);
    assert(denied.roots.length === 0, 'Target di luar Polda tidak ditolak fail-closed.');

    const [polresUser] = await ds.query(`
      select u.id,u.scope_satker_id,s.deskripsi
      from auth_users u
      join bdb_satker s on s.id=u.scope_satker_id
      where upper(coalesce(s.tipe_satker,'')) in ('POLRES','POLRESTA','POLRESTABES')
      order by u.id
      limit 1
    `);
    let polresProbe = null;
    if (polresUser) {
      const polresMeta = (await service.scopeOptions(Number(polresUser.id))).data;
      const polsekOption = polresMeta.options.find((option) => option.tipe === 'POLSEK');
      if (polsekOption) {
        const result = await build(service, Number(polresUser.id), 'scoped', [], polsekOption.value);
        assert(result.roots.length === 1 && Number(result.roots[0].id) === Number(polsekOption.value), 'Pilihan Polsek akun Polres tidak menjadi root hasil.');
        polresProbe = { account: polresUser.deskripsi, selected: polsekOption.label };
      }
    }

    const [polsekUser] = await ds.query(`
      select u.id,u.scope_satker_id,s.deskripsi
      from auth_users u
      join bdb_satker s on s.id=u.scope_satker_id
      where upper(coalesce(s.tipe_satker,''))='POLSEK'
      order by u.id
      limit 1
    `);
    let polsekProbe = null;
    if (polsekUser) {
      const polsekMeta = (await service.scopeOptions(Number(polsekUser.id))).data;
      assert(polsekMeta.options.length === 1 && Number(polsekMeta.options[0].value) === Number(polsekMeta.defaultRegionId), 'Akun Polsek tidak dibatasi ke wilayah sendiri.');
      const result = await build(service, Number(polsekUser.id), 'scoped', [], polsekMeta.defaultRegionId);
      assert(result.roots.length === 1 && Number(result.roots[0].id) === Number(polsekMeta.defaultRegionId), 'Root akun Polsek bukan Polsek sendiri.');
      polsekProbe = { account: polsekUser.deskripsi, selected: polsekMeta.options[0].label };
    }

    console.log(JSON.stringify({
      ok: true,
      superadmin: { regional: aceh.label, group: regionalKrimsus.applied_filters.kelompokHitung },
      polda: { account: poldaUser.deskripsi, selected: polresOption.label, nationalRoots: poldaNational.roots.length },
      polres: polresProbe,
      polsek: polsekProbe
    }, null, 2));
  } finally {
    await client.end();
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
