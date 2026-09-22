'use strict';
const fs=require('fs'),{Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
const {operationalLpScopeIds}=require('/usr/src/app/dist/bdb/common/lp-scope.util');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-regional-scope-readonly',statement_timeout:45000,options:'-c default_transaction_read_only=on'});await c.connect();try{
const ds={query:async(q,p=[])=>(await c.query(q,p)).rows},service=new LaporanPolisiService(ds,{});
const userids=[14843,15597,14970,229,14353,15957,15950,15179,15187,15196];
const users=await c.query('select u.id,u.name,u.scope_satker_id,s.deskripsi,s.parent_id from auth_users u left join bdb_satker s on s.id=u.scope_satker_id where u.id=any($1) order by u.id',[userids]);
const scopeReports=[];
for(const u of users.rows){
 const allowed=await operationalLpScopeIds(ds,Number(u.scope_satker_id));
 const listAll=await service.list({page:1,row:1},Number(u.id));
 const list2026=await service.list({page:1,row:1,from:'2026-01-01',to:'2026-12-31',functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'},Number(u.id));
 const owners=await c.query("select coalesce(lp.unit_satker_id,lp.satker_id) owner_id,s.deskripsi owner_name,s.parent_id,p.deskripsi parent,count(*)::int total,count(*) filter(where to_timestamp(nullif(lp.tgl_laporan,''),'DD-MM-YYYY HH24:MI:SS')::date between '2026-01-01' and '2026-12-31')::int tahun2026,count(*) filter(where lp.payload_json->'tindak_pidana'::text is not null and (lp.payload_json->'tindak_pidana')::text ~* 'Narkotika|Narkoba')::int narcotics from bdb_laporan_polisi lp left join bdb_satker s on s.id=coalesce(lp.unit_satker_id,lp.satker_id) left join bdb_satker p on p.id=s.parent_id where lp.deleted_at is null and not coalesce(lp.dilimpahkan_eksternal,false) and coalesce(lp.unit_satker_id,lp.satker_id)=any($1) group by 1,2,3,4 order by total desc",[allowed]);
 scopeReports.push({...u,allowedIds:allowed,total:listAll.total,visible2026:list2026.total,owners:owners.rows});
}
const masters=await c.query("select s.id,s.kode,s.deskripsi,s.parent_id,p.deskripsi parent,s.operational_role,s.kinerja_aktif,s.dors_status,s.dors_mapping_aktif,s.pelimpahan_target_aktif,s.nama_satker_dors,s.dors_satker_id,s.function_domain,s.organization_domain,s.created_at::text,s.updated_at::text,(select count(*)::int from bdb_laporan_polisi lp where coalesce(lp.unit_satker_id,lp.satker_id)=s.id and lp.deleted_at is null) direct_lp from bdb_satker s left join bdb_satker p on p.id=s.parent_id where s.parent_id in (11713,15667) or s.id in (12518,12519,15512,15514,20246,20950,15541,15543,20254,20952,15550,15552,6371,6373,15379,15391,15400) order by s.id");
const external=await c.query('select p.id,p.lp_id,p.satker_eksternal_id,e.nama,p.nomor_dokumen,p.tanggal_dokumen::text,p.dilimpahkan_oleh,p.dilimpahkan_oleh_nama,p.created_at::text from bdb_lp_pelimpahan p left join bdb_satker_eksternal e on e.id=p.satker_eksternal_id where p.lp_id=281806 order by p.id');
const output={scopeReports,masters:masters.rows,jembranaExternal:external.rows};fs.writeFileSync('/tmp/regional-audit-scope-20260903.json',JSON.stringify(output,null,2),{mode:0o600});console.log(JSON.stringify(output,null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});

