'use strict';
const assert=require('node:assert/strict'),{Client}=require('pg');
const root='/usr/src/app/dist/bdb';
const helper=require(root+'/common/lp-scope.util.js');
const {resolveScope}=require(root+'/common/scope.util.js');
const {LaporanPolisiService}=require(root+'/laporan-polisi/laporan-polisi.service.js');
(async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-regional-scope-live-readonly',statement_timeout:30000,options:'-c default_transaction_read_only=on'});
 await c.connect();try{
  const ds={query:async(q,p=[])=>(await c.query(q,p)).rows},svc=new LaporanPolisiService(ds,{});
  const opts={page:1,row:5,from:'2026-01-01',to:'2026-12-31',functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'};
  const results=[];
  for(const [uid,scope,expected]of [[14843,17093,135],[14970,12518,36],[14353,19437,188],[15957,15552,8]]){
   const access=await resolveScope(ds,uid);assert.equal(access.all,false);assert.equal(access.satkerId,scope);
   const list=await svc.list(opts,uid),stats=await svc.stats(uid,opts);
   assert.equal(list.total,expected);assert.equal(stats.data.total,list.total);
   assert.deepEqual(await helper.operationalLpScopeIds(ds,scope),[scope]);
   results.push({userId:uid,scope,total2026:list.total,statsMatch:true});
  }
  assert.equal(await helper.hasOperationalLpAccess(ds,{satker_id:17105,unit_satker_id:17107},17093),false);
  assert.equal(await helper.hasOperationalLpAccess(ds,{satker_id:17105,unit_satker_id:17107},17107),true);
  assert.equal((await svc.list({...opts,search:'LP/A/7/VII/2026/'},229)).total,0,'External transfer stays protected');
  const admins=await ds.query("select id from auth_users where lower(role_bdb)='superadmin' order by id limit 1");
  assert.equal(admins.length,1);const admin=await resolveScope(ds,Number(admins[0].id));assert.equal(admin.all,true);assert.equal(admin.isSuper,true);
  const jobs=await ds.query("select id,status,total_fetched,total_upserted,finished_at::text from bdb_dors_sync_log order by id desc limit 2");
  console.log(JSON.stringify({liveRuntime:true,results,foreignPolsekWriteDenied:true,ownPolsekWriteAllowed:true,externalTransferProtected:true,superadminAllScopePreserved:true,jobs},null,2));
 }finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
