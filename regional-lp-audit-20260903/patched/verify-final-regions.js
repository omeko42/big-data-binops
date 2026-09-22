'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-final-regions-verification-readonly',statement_timeout:30000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const before=JSON.parse(fs.readFileSync('/tmp/final-regions-repair-v2-20260903/data-before.json','utf8'));
 const taxonomy=(await c.query("select entity_id,organization_domain,function_domain from bdb_satker_taxonomy_r11 where source_table='BDB_SATKER' and entity_id in (21027,21028)")).rows;assert.equal(taxonomy.length,2);for(const t of taxonomy){assert.equal(t.organization_domain,'INTERNAL_POLRI');assert.equal(t.function_domain,Number(t.entity_id)===21027?'STRUCTURAL':'INTERNAL_RESERSE');}
 const parents=(await c.query('select id,deskripsi,parent_id,parent_kode from bdb_satker where id=any($1) order by id',[[11786,11789,11792,11795,21027]])).rows;assert.equal(parents.length,5);for(const n of parents){assert.equal(Number(n.parent_id),12282);assert.equal(n.parent_kode,'060.01.18.14');}
 const disabledIds=[12641,12643,11792,11794],inactive=(await c.query('select id,kinerja_aktif,dors_mapping_aktif,pelimpahan_target_aktif from bdb_satker where id=any($1)',[disabledIds])).rows;assert.equal(inactive.length,4);assert.ok(inactive.every(n=>!n.kinerja_aktif&&!n.dors_mapping_aktif&&!n.pelimpahan_target_aktif));
 assert.equal((await c.query('select count(*)::int n from bdb_laporan_polisi where satker_id=any($1) or unit_satker_id=any($1)',[disabledIds])).rows[0].n,0);
 const counts=(await c.query("select parent_id,count(*)::int n from bdb_satker where parent_id=any($1) and tipe_satker='POLSEK' and kinerja_aktif=true and dors_mapping_aktif=true group by 1 order by 1",[[12615,11757,12282]])).rows;
 for(const [id,n]of [[12615,17],[11757,10],[12282,7]])assert.equal(counts.find(x=>Number(x.parent_id)===id)?.n,n);
 const accountIds=before.accounts.map(a=>a.id);const accounts=(await c.query('select id,role_bdb,role_name,scope_satker_id,scope_satker_key,requested_scope_satker_id,requested_scope_satker_key from auth_users where id=any($1) order by id',[accountIds])).rows;assert.deepEqual(accounts,before.accounts,'Accounts must remain unchanged');
 const moved=(await c.query('select lp.id,lp.satker_id,lp.unit_satker_id,sn.satker_id snapshot_owner from bdb_laporan_polisi lp join bdb_kinerja_perkara_snapshot sn on sn.lp_id=lp.id where lp.id=any($1)',[before.lps.map(l=>l.id)])).rows;assert.equal(moved.length,31);
 for(const lp of moved){const old=before.lps.find(x=>String(x.id)===String(lp.id)),isAlalak=Number(old.satker_id)===12641;assert.equal(Number(lp.satker_id),isAlalak?19870:21027);assert.equal(Number(lp.unit_satker_id),isAlalak?20901:21028);assert.equal(String(lp.snapshot_owner),String(lp.unit_satker_id));}
 let projectedListQueries=0;
 const ds={query:async(q,p=[])=>{
  // Retain the real service WHERE/order/pagination; replace only sensitive output columns.
  if(q.startsWith('select lp.id, lp.dors_lp_id, lp.model_lp, lp.no_laporan')){
   const anchor='from bdb_laporan_polisi lp left join bdb_status_master sm on sm.id=lp.status_id';
   assert.equal(q.split(anchor).length,2);q='select lp.id, lp.satker_id, lp.unit_satker_id '+anchor+q.split(anchor)[1];projectedListQueries++;
  }
  return(await c.query(q,p)).rows;
 }},svc=new LaporanPolisiService(ds,{}),listStats=[];
 for(const [uid,owner,expectedAll,expectedYear]of [[15845,20901,46,null],[14320,21028,6,null],[15957,15552,14,8],[15950,20952,112,42],[14353,19437,581,188]]){
  const opts={page:1,row:25,functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'};
  const all=await svc.list(opts,uid);assert.equal(all.total,expectedAll);assert.equal(all.data.length,Math.min(25,expectedAll));assert.ok(all.data.every(r=>Number(r.unit_satker_id??r.satker_id)===owner));
  const dates={...opts,from:'2026-01-01',to:'2026-12-31'},year=await svc.list(dates,uid),stats=await svc.stats(uid,dates);assert.equal(year.total,stats.data.total);if(expectedYear!==null)assert.equal(year.total,expectedYear);
  listStats.push({userId:uid,owner,allYears:all.total,year2026:year.total,listMatchesStats:true});
 }
 assert.equal(projectedListQueries,10);
 const aliases=(await c.query("select a.dors_nama,a.dors_parent_nama,a.unit_nama,a.satker_id,s.parent_id,s.kinerja_aktif,s.dors_mapping_aktif from bdb_dors_satker_map a join bdb_satker s on s.id=a.satker_id where a.catatan=$1 order by a.id",['Approved final regional correction 20260903; metadata only; current parent and account destination verified'])).rows;assert.equal(aliases.length,9);assert.ok(aliases.every(a=>a.kinerja_aktif&&a.dors_mapping_aktif));
 const activeNames=(await c.query("select deskripsi,count(*)::int n from bdb_satker where parent_id=12282 and tipe_satker='POLSEK' and kinerja_aktif and dors_mapping_aktif and deskripsi=any($1) group by 1",[['POLSEK TELUK PAKEDAI','POLSEK TERENTANG','POLSEK KUBU','POLSEK BATU AMPAR']])).rows;assert.equal(activeNames.length,4);assert.ok(activeNames.every(x=>x.n===1));
 console.log(JSON.stringify({verified:true,parents,activePolsekCounts:counts,movedMetadataRows:31,snapshotsConsistent:true,accountsUnchanged:true,aliasesVerified:9,listStats,caseContentRead:false,oldDuplicatesExcluded:true},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
