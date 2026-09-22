require('/usr/src/app/node_modules/ts-node/register/transpile-only');
const { Client } = require('pg');
const { LpMonitoringAccessService } = require('./src/bdb/common/lp-monitoring-access.service.ts');

function ok(value, message) { if (!value) throw new Error(message); }

(async()=>{
  const pg=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE});
  await pg.connect();
  const actors=new Map([[900001,18825],[900002,18823],[900003,33],[900004,18824],[900005,145],[900006,18748]]);
  const ds={query:async(sql,params=[])=>{
    if (/select role_bdb, role_name, scope_satker_id from auth_users/i.test(sql)) {
      return [{role_bdb:'operator',role_name:'Operator',scope_satker_id:actors.get(Number(params[0]))||null}];
    }
    return (await pg.query(sql,params)).rows;
  }};
  try {
    await pg.query('begin read only');
    const policy=new LpMonitoringAccessService(ds);
    const narkobaPolsek=await policy.plan(900001,151);
    ok(narkobaPolsek.actorDomains.join(',')==='NARKOBA','aktor narkoba mendapat domain lain');
    ok(narkobaPolsek.ownerIds.includes(153),'Unit Reskrim Polsek tidak terpilih untuk narkoba');
    ok(narkobaPolsek.crimeIds.includes(43) && !narkobaPolsek.crimeIds.includes(40),'isolasi narkoba/cyber gagal');

    const narkobaPolres=await policy.plan(900001,143);
    ok(narkobaPolres.ownerIds.includes(18748) && !narkobaPolres.ownerIds.includes(145),'Satres Narkoba bocor ke Satreskrim atau tidak terpilih');

    const krimum=await policy.plan(900002,143);
    ok(krimum.actorDomains.includes('PPA') && !krimum.actorDomains.includes('SIBER') && !krimum.actorDomains.includes('NARKOBA'),'fallback Krimum/PPA keliru');
    ok(krimum.ownerIds.includes(145) && !krimum.ownerIds.includes(18748),'owner Krimum target keliru');
    ok(krimum.crimeIds.includes(10) && !krimum.crimeIds.includes(40) && !krimum.crimeIds.includes(43),'isolasi crime Krimum/PPA gagal');

    const siber=await policy.plan(900003,151);
    ok(siber.actorDomains.join(',')==='SIBER' && siber.ownerIds.includes(153),'domain Siber Polsek keliru');
    ok(siber.crimeIds.includes(40) && !siber.crimeIds.includes(43),'isolasi Siber/Narkoba gagal');

    const krimsus=await policy.plan(900004,143);
    ok(krimsus.actorDomains.join(',')==='KRIMSUS' && !krimsus.crimeIds.includes(40),'Ditreskrimsus masih mengambil Siber yang sudah terbentuk');

    const satreskrimPolsek=await policy.plan(900005,151);
    ok(satreskrimPolsek.ownerIds.includes(153) && !satreskrimPolsek.crimeIds.includes(43),'Satreskrim Polres melihat Narkoba Polsek');
    const satnarkobaPolsek=await policy.plan(900006,151);
    ok(satnarkobaPolsek.ownerIds.includes(153) && satnarkobaPolsek.crimeIds.includes(43) && !satnarkobaPolsek.crimeIds.includes(40),'Satresnarkoba Polres gagal mengisolasi Narkoba Polsek');

    const outside=(await ds.query(`with recursive d as (
      select id,parent_id,tipe_satker from bdb_satker where upper(coalesce(tipe_satker,''))='POLDA' and id<>24
      union all select s.id,s.parent_id,s.tipe_satker from bdb_satker s join d on s.parent_id=d.id
    ) select id from d where upper(coalesce(tipe_satker,''))='POLRES' order by id limit 1`))[0];
    ok(outside && outside.id,'satker uji di luar Aceh tidak ditemukan');
    let denied=false; try { await policy.plan(900001,Number(outside.id)); } catch { denied=true; }
    ok(denied,'target di luar Polda tidak ditolak');
    console.log(JSON.stringify({status:'ok',checks:22,narkoba_polsek_owners:narkobaPolsek.ownerIds,narkoba_polres_owners:narkobaPolres.ownerIds,krimum_domains:krimum.actorDomains,siber_domains:siber.actorDomains,krimsus_domains:krimsus.actorDomains,satreskrim_domains:satreskrimPolsek.actorDomains,satnarkoba_domains:satnarkobaPolsek.actorDomains}));
    await pg.query('rollback');
  } finally { await pg.end(); }
})().catch(e=>{console.error(e.stack||e.message);process.exit(1)});
