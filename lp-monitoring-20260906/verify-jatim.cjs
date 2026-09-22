require('/usr/src/app/node_modules/ts-node/register/transpile-only');
const { Client } = require('/usr/src/app/node_modules/pg');
const { LpMonitoringAccessService } = require('/usr/src/app/src/bdb/common/lp-monitoring-access.service.ts');

function ok(value, message) { if (!value) throw new Error(message); }

(async () => {
  const pg = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  await pg.connect();
  try {
    await pg.query('begin read only');
    const polda = (await pg.query(`select id::int,deskripsi from bdb_satker where upper(coalesce(tipe_satker,''))='POLDA' and upper(deskripsi) like '%JAWA TIMUR%' order by id limit 1`)).rows[0];
    ok(polda, 'Polda Jawa Timur tidak ditemukan');
    const actor = (await pg.query(`select id::int,deskripsi from bdb_satker where parent_id=$1 and upper(deskripsi) ~ '(SIBER|CYBER)' order by id limit 1`, [polda.id])).rows[0];
    ok(actor, 'Ditressiber Polda Jawa Timur tidak ditemukan');

    const actualUsers = (await pg.query(`select id::int,role_bdb,role_name from auth_users where scope_satker_id=$1 order by id`, [actor.id])).rows;
    const fakeUser = 990060906;
    const fakeSuper = 990060907;
    const ds = { query: async (sql, params = []) => {
      if (/select role_bdb, role_name, scope_satker_id from auth_users/i.test(sql)) {
        if (Number(params[0]) === fakeUser) return [{ role_bdb: 'operator', role_name: 'Operator', scope_satker_id: actor.id }];
        if (Number(params[0]) === fakeSuper) return [{ role_bdb: 'superadmin', role_name: 'Superadmin', scope_satker_id: null }];
      }
      return (await pg.query(sql, params)).rows;
    }};
    const policy = new LpMonitoringAccessService(ds);
    const metadata = await policy.metadata(fakeUser);
    ok(metadata.domains.join(',') === 'SIBER', 'domain Ditressiber Jatim tidak terkunci ke SIBER');
    ok(metadata.targets.length > 0, 'pilihan satker bawahan kosong');
    const allowedCrimes = metadata.crimes.filter((x) => x.allowed);
    ok(allowedCrimes.length > 0 && allowedCrimes.every((x) => x.domain === 'SIBER'), 'filter kejahatan bocor lintas domain');
    const polsek = metadata.targets.find((x) => String(x.tipe).toUpperCase() === 'POLSEK');
    ok(polsek, 'target Polsek di Jawa Timur tidak ditemukan');
    const plan = await policy.plan(fakeUser, polsek.id);
    ok(plan.actorDomains.join(',') === 'SIBER', 'rencana monitoring Polsek tidak terkunci ke SIBER');
    ok(plan.ownerIds.length > 0 && plan.crimeIds.length > 0, 'owner atau kejahatan Siber Polsek kosong');
    const superMetadata = await policy.metadata(fakeSuper);
    ok(superMetadata.all && superMetadata.crimes.length > 0 && superMetadata.golongan.length > 0, 'filter Superadmin masih kosong');
    ok(superMetadata.crimes.every((x) => x.allowed), 'filter Superadmin tidak mengizinkan seluruh kejahatan');
    let actualTargetCount = null;
    if (actualUsers.length) {
      const actualMetadata = await policy.metadata(actualUsers[0].id);
      actualTargetCount = actualMetadata.targets.length;
      ok(actualMetadata.domains.join(',') === 'SIBER' && actualTargetCount > 0, 'akun aktual Ditressiber Jatim tidak memperoleh selector Siber');
    }
    console.log(JSON.stringify({
      status: 'ok',
      actor: actor.deskripsi,
      domain: metadata.domains,
      target_count: metadata.targets.length,
      allowed_crime_count: allowedCrimes.length,
      sample_target: polsek.nama,
      sample_owner_count: plan.ownerIds.length,
      actual_scoped_users: actualUsers.length,
      actual_target_count: actualTargetCount,
      super_crime_count: superMetadata.crimes.length,
      super_golongan_count: superMetadata.golongan.length,
    }));
    await pg.query('rollback');
  } finally {
    await pg.end();
  }
})().catch((error) => { console.error(error.stack || error.message); process.exit(1); });
