'use strict';
const {Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-recheck-four-reports-readonly',statement_timeout:25000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const roots=(await c.query("select id,deskripsi,parent_id from bdb_satker where tipe_satker='POLRES' and deskripsi ~* 'BARITO.*KUALA|MEMPAWAH|KUBU.*RAYA|POLRES PONTIANAK' order by id")).rows;
 const nodes=(await c.query("select s.id,s.deskripsi,s.kode,s.parent_id,p.deskripsi parent,s.tipe_satker,s.kinerja_aktif,s.dors_mapping_aktif from bdb_satker s left join bdb_satker p on p.id=s.parent_id where s.parent_id=any($1) or s.id=any($1) or s.deskripsi ~* 'BERANGAS|ALALAK' order by s.id",[roots.map(r=>r.id)])).rows;
 const polsekIds=nodes.filter(n=>n.tipe_satker==='POLSEK').map(n=>n.id);
 const units=(await c.query('select id,parent_id,deskripsi,kinerja_aktif,dors_mapping_aktif from bdb_satker where parent_id=any($1) order by id',[polsekIds])).rows;
 const relevant=nodes.filter(n=>n.tipe_satker==='POLSEK'&&/BERANGAS|ALALAK|BATU.?AMPAR|KUBU$|TELUK.?PAKEDAI|TERENTANG/i.test(n.deskripsi));
 const relevantIds=relevant.map(n=>n.id);
 const groups=(await c.query("select lp.satker_id,lp.unit_satker_id,r.payload_json#>>'{polsek,nama}' source_polsek,r.payload_json#>>'{polsek,kode}' source_polsek_code,r.payload_json#>>'{polres,nama}' source_polres,r.payload_json#>>'{polres,kode}' source_polres_code,count(*)::int total from bdb_laporan_polisi lp left join bdb_dors_raw_lp r on r.dors_lp_id=lp.dors_lp_id and r.model_lp=lp.model_lp where lp.satker_id=any($1) and lp.deleted_at is null group by 1,2,3,4,5,6 order by 1,2,3",[relevantIds])).rows;
 const counts=roots.map(r=>({root:r.id,name:r.deskripsi,allPolsek:nodes.filter(n=>n.tipe_satker==='POLSEK'&&String(n.parent_id)===String(r.id)).length,activePolsek:nodes.filter(n=>n.tipe_satker==='POLSEK'&&String(n.parent_id)===String(r.id)&&n.kinerja_aktif&&n.dors_mapping_aktif).length}));
 const aliases=(await c.query('select id,dors_nama,dors_parent_nama,satker_id from bdb_dors_satker_map where satker_id=any($1) order by id',[relevantIds])).rows;
 const ds={query:async(q,p=[])=>(await c.query(q,p)).rows},svc=new LaporanPolisiService(ds,{}),accounts=[];
 for(const uid of [14353,15957,15950]){
  const a=(await c.query('select id,scope_satker_id from auth_users where id=$1',[uid])).rows[0];
  const total=await c.query('select count(*)::int n from bdb_laporan_polisi where coalesce(unit_satker_id,satker_id)=$1 and deleted_at is null and not coalesce(dilimpahkan_eksternal,false)',[a.scope_satker_id]);
  const stats=await svc.stats(uid,{from:'2026-01-01',to:'2026-12-31',functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'});
  accounts.push({id:uid,scope:a.scope_satker_id,allYears:total.rows[0].n,year2026:stats.data.total});
 }
 const pangandaran=(await c.query('select s.id,s.parent_id,p.deskripsi parent from bdb_satker s join bdb_satker p on p.id=s.parent_id where s.id=6371')).rows;
 const ciamisSources=(await c.query("select trim(r.payload_json#>>'{polres,nama}') source_polres,count(*)::int total from bdb_laporan_polisi lp left join bdb_dors_raw_lp r on r.dors_lp_id=lp.dors_lp_id and r.model_lp=lp.model_lp where coalesce(lp.unit_satker_id,lp.satker_id)=19437 and lp.deleted_at is null and not coalesce(lp.dilimpahkan_eksternal,false) group by 1 order by 1")).rows;
 console.log(JSON.stringify({checkedAt:new Date().toISOString(),readOnly:true,caseContentRead:false,counts,relevant,units:units.filter(u=>relevantIds.includes(u.parent_id)),sourceAddressGroups:groups,aliases,accounts,pangandaran,ciamisSources},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
