require('/usr/src/app/node_modules/ts-node/register/transpile-only');
const { Client } = require('pg');
const { LpMonitoringAccessService } = require('./src/bdb/common/lp-monitoring-access.service.ts');
const { LaporanPolisiService } = require('./src/bdb/laporan-polisi/laporan-polisi.service.ts');

function ok(value,message){if(!value)throw new Error(message)}
(async()=>{
  const pg=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE});
  await pg.connect();
  const actors=new Map([[900001,18825],[900002,18823],[900003,33]]);
  const ds={query:async(sql,params=[])=>{
    if (/select role_bdb, role_name, scope_satker_id from auth_users/i.test(sql)) return [{role_bdb:'operator',role_name:'Operator',scope_satker_id:actors.get(Number(params[0]))||null}];
    return (await pg.query(sql,params)).rows;
  }};
  try{
    await pg.query('begin read only');
    const policy=new LpMonitoringAccessService(ds);
    const service=new LaporanPolisiService(ds,{log:async()=>{}},policy);
    service.ensureTable=async()=>{};
    const base={targetSatkerId:'151',page:1,row:5};
    const narc=await service.list({...base,jenisKejahatanIds:'43'},900001);
    ok(narc.status===1 && Array.isArray(narc.data),'list narkoba gagal');
    ok(narc.data.every(x=>Number(x.unit_satker_id||x.satker_id)===153 && Number(x.jenis_kejahatan_id)===43 && x.monitoring_mode===true && x.can_transfer===false),'hasil narkoba bocor domain/owner');
    const deniedCrime=await service.list({...base,jenisKejahatanIds:'40'},900001);
    ok(deniedCrime.total===0,'filter kejahatan terlarang tidak dikunci server');
    const krimum=await service.list({targetSatkerId:'143',page:1,row:10},900002);
    ok(krimum.data.every(x=>Number(x.unit_satker_id||x.satker_id)===145 && ![40,43].includes(Number(x.jenis_kejahatan_id))),'hasil Krimum bocor Siber/Narkoba');
    for(const tag of ['OPERASI','SATGAS','ATENSI','MENONJOL']){
      const tagged=await service.list({...base,monitoringTags:tag},900001);
      ok(tagged.status===1,`query tag ${tag} gagal`);
    }
    const byGolongan=await service.list({...base,golonganKejahatanIds:'1,2'},900001);
    ok(byGolongan.status===1,'query golongan gagal');
    const stats=await service.stats(900001,151);
    ok(stats.status===1 && stats.data.total>=0,'stats monitoring gagal');
    const meta=await service.monitoringOptions(900001);
    ok(meta.data.domains.length===1 && meta.data.domains[0]==='NARKOBA' && meta.data.targets.some(x=>x.id===151),'metadata monitoring gagal');
    console.log(JSON.stringify({status:'ok',checks:14,narcoba_total:narc.total,krimum_total:krimum.total,target_count:meta.data.targets.length,crime_option_count:meta.data.crimes.length}));
    await pg.query('rollback');
  }finally{await pg.end()}
})().catch(e=>{console.error(e.stack||e.message);process.exit(1)});
