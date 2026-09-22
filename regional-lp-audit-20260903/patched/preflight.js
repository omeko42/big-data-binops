'use strict';
const fs=require('fs'),path=require('path'),Module=require('module'),assert=require('node:assert/strict'),{Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-candidate-scope-readonly',statement_timeout:30000,options:'-c default_transaction_read_only=on'});await c.connect();try{
const candidate=require('./lp-scope.util');const real='/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js';
const m=new Module(real,module);m.filename=real;m.paths=Module._nodeModulePaths(path.dirname(real));const original=m.require.bind(m);
m.require=id=>id==='../common/lp-scope.util'?candidate:original(id);m._compile(fs.readFileSync(real,'utf8'),real);
const ds={query:async(q,p=[])=>(await c.query(q,p)).rows},svc=new m.exports.LaporanPolisiService(ds,{});
const opts={page:1,row:1,from:'2026-01-01',to:'2026-12-31',functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'};
const result=[];
for(const [uid,scope,expected]of [[14843,17093,135],[14970,12518,36],[14353,19437,188],[15957,15552,8]]){
 const list=await svc.list(opts,uid),stats=await svc.stats(uid,opts);
 assert.equal(list.total,expected);assert.equal(stats.data.total,list.total);
 assert.deepEqual(await candidate.operationalLpScopeIds(ds,scope),[scope]);
 result.push({userId:uid,scope,preview2026:list.total,statsMatch:true});
}
const denied=await candidate.hasOperationalLpAccess(ds,{satker_id:17105,unit_satker_id:17107},17093);assert.equal(denied,false);
const j=await svc.list({...opts,search:'LP/A/7/VII/2026/'},229);assert.equal(j.total,0,'External Jembrana case must remain protected');
const jobs=await c.query("select id,status,from_date::text,to_date::text,total_fetched,total_upserted,current_page,current_last_page,current_chunk_from::text,current_chunk_to::text,chunks_done,chunks_total,started_at::text from bdb_dors_sync_log where status='running' order by id");
const aliases=await c.query("select id,dors_kode_pusiknas,dors_nama,dors_parent_nama,unit_nama,satker_id,catatan from bdb_dors_satker_map where dors_nama ~* 'PITUMPANUA|PENRANG|PANGANDARAN|RANTE.?PAO|SANGGALANGI|SESEAN' order by id");
const counts=await c.query("select lp.unit_satker_id,r.payload_json#>>'{polsek,kode_pusiknas}' source_kp,r.payload_json#>>'{polsek,kode}' source_dors_code,count(*)::int total from bdb_laporan_polisi lp join bdb_dors_raw_lp r on r.dors_lp_id=lp.dors_lp_id and r.model_lp=lp.model_lp where lp.unit_satker_id in (15543,20952,6373,15381,15393,15402) and lp.deleted_at is null group by 1,2,3 order by 1,2");
console.log(JSON.stringify({candidateOnly:true,result,foreignPolsekWriteDenied:!denied,externalLPStillProtected:true,jobs:jobs.rows,aliases:aliases.rows,sourceCodes:counts.rows},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});

