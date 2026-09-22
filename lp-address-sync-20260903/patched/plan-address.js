'use strict';
const fs=require('fs'),Module=require('module'),path=require('path'),{Client}=require('pg');
const live='/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js';
const m=new Module(live,module);m.filename=live;m.paths=Module._nodeModulePaths(path.dirname(live));m._compile(fs.readFileSync(path.join(__dirname,'laporan-polisi.service.js'),'utf8'),live);
(async()=>{
 let sql;const s=new m.exports.LaporanPolisiService({query:async(q)=>{sql=q;return [{}];}},{});await s.syncPelimpahanOwnershipFromDors();
 const prefix=sql.slice(0,sql.indexOf('locked as materialized')).replace(/,\s*$/,'');
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-address-plan-readonly',statement_timeout:45000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const r=await c.query(prefix+` select jsonb_build_object(
 'summary',jsonb_build_object('candidates',(select count(*) from universe),'protected',(select count(*) from universe)-(select count(*) from processable),'territory_quarantined',(select count(*) from territory_coverage where territory_count<>1),'unit_quarantined',(select count(*) from resolved_coverage where territory_count=1 and unit_count<>1)),
 'resolved',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'old_satker',satker_id,'old_unit',unit_satker_id,'new_satker',territory_id,'new_unit',unit_id,'new_unit_nama',resolved_unit_nama,'source_unit',target_unit)), '[]'::jsonb) from resolved),
 'unresolved',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'old_satker',satker_id,'old_unit',unit_satker_id,'source_unit',target_unit,'parent',target_parent_nama,'territory_count',territory_count,'unit_count',unit_count)), '[]'::jsonb) from resolved_coverage where territory_count<>1 or unit_count<>1)
 ) as plan`);
 const plan=r.rows[0].plan;fs.writeFileSync('/tmp/address-plan-20260903.json',JSON.stringify(plan,null,2),{mode:0o600});
 console.log(JSON.stringify({summary:plan.summary,resolvedCount:plan.resolved.length,lp1541:plan.resolved.find(x=>Number(x.id)===402704),unresolved:plan.unresolved.slice(0,30),units:[...new Set(plan.resolved.map(x=>x.source_unit))]}));
 }finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

