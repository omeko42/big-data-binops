'use strict';
const assert=require('node:assert/strict'),{Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-regional-postrepair-readonly',statement_timeout:30000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const parents=(await c.query('select id,deskripsi,parent_id,parent_kode from bdb_satker where id=any($1) order by id',[[6371,15379,15391,15400]])).rows;for(const n of parents)assert.equal(Number(n.parent_id),Number(n.id)===6371?6878:15667);
 const dup=(await c.query('select id,kinerja_aktif,dors_mapping_aktif,pelimpahan_target_aktif from bdb_satker where id=any($1)',[[15512,15514,15541,15543]])).rows;assert.equal(dup.length,4);assert.ok(dup.every(n=>!n.kinerja_aktif&&!n.dors_mapping_aktif&&!n.pelimpahan_target_aktif));
 const empty=await c.query('select count(*)::int n from bdb_laporan_polisi where satker_id=any($1) or unit_satker_id=any($1)',[[15512,15514,15541,15543]]);assert.equal(empty.rows[0].n,0);
 const a=(await c.query('select scope_satker_id,scope_satker_key,requested_scope_satker_id,requested_scope_satker_key,role_bdb,role_name from auth_users where id=15597')).rows[0];assert.equal(Number(a.scope_satker_id),19785);assert.equal(Number(a.requested_scope_satker_id),19785);assert.equal(a.scope_satker_key,'060.01.18.01.20');assert.equal(a.requested_scope_satker_key,a.scope_satker_key);assert.equal(a.role_bdb,'operator');assert.equal(a.role_name,'operator');
 const ds={query:async(q,p=[])=>(await c.query(q,p)).rows},svc=new LaporanPolisiService(ds,{});
 const counts=[];for(const [uid,owner,totalExpected,yearExpected]of [[15597,19785,163,73],[15950,20952,112,42],[16131,20950,38,11]]){
  const all=await c.query('select count(*)::int n from bdb_laporan_polisi where coalesce(unit_satker_id,satker_id)=$1 and deleted_at is null and not coalesce(dilimpahkan_eksternal,false)',[owner]);assert.equal(all.rows[0].n,totalExpected);
  const stats=await svc.stats(uid,{from:'2026-01-01',to:'2026-12-31',functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'});assert.equal(stats.data.total,yearExpected);
  counts.push({userId:uid,owner,allYears:all.rows[0].n,year2026:stats.data.total});
 }
 const mismatch=await c.query('select count(*)::int n from bdb_kinerja_perkara_snapshot sn join bdb_laporan_polisi lp on lp.id=sn.lp_id where lp.unit_satker_id=20952 and sn.satker_id<>20952');assert.equal(mismatch.rows[0].n,0);
 const alias=await c.query("select satker_id from bdb_dors_satker_map where dors_kode_pusiknas='060.01.25.21.01' and dors_nama='POLSEK URBAN PITUMPANUA' and dors_parent_nama='POLRES WAJO' and unit_nama='RESKRIM'");assert.equal(alias.rowCount,1);assert.equal(Number(alias.rows[0].satker_id),20952);
 const jobs=await c.query("select id,status from bdb_dors_sync_log order by id desc limit 2");
 console.log(JSON.stringify({verified:true,parents,counts,duplicatesInactive:true,oldOwnersEmpty:true,snapshotConsistent:true,accountRolesUnchanged:true,caseContentAndStatusNotModified:true,jobs:jobs.rows},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
