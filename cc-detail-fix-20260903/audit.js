'use strict';
const {Client}=require('pg'),fs=require('fs'),crypto=require('crypto');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-cc-detail-aggregate-readonly',statement_timeout:30000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const statuses=(await c.query("select id,code,nama from bdb_status_master where code ~* 'SP2|TIPIR|SP3|TAHAP_II' order by id")).rows;
 const columns=(await c.query("select table_name,column_name,data_type from information_schema.columns where table_schema='public' and table_name in ('bdb_status_master','bdb_document_type_master') order by table_name,ordinal_position")).rows;
 const aggregate=(await c.query("select status_code,count(*)::int total,count(*) filter(where tanggal_selesai is not null)::int completed,count(*) filter(where tanggal_selesai between '2026-01-01'::date and '2026-12-31'::date)::int completed2026,count(*) filter(where tanggal_selesai is not null and is_rj)::int rj from bdb_kinerja_perkara_snapshot where status_code ~* 'SP2|TIPIR|SP3|TAHAP_II' group by 1 order by 1")).rows;
 const hashes=['dist/bdb/kinerja-perkara/kinerja-perkara.service.js','src/bdb/kinerja-perkara/kinerja-perkara.service.ts'].map(p=>{const body=fs.readFileSync('/usr/src/app/'+p,'utf8'),m=body.match(/const CC_BREAKDOWN[^=]*= \[([\s\S]*?)\];/);return{file:p,hash:crypto.createHash('sha256').update(body).digest('hex'),ccBreakdown:m?.[1]};});
 const jobs=(await c.query('select id,status from bdb_dors_sync_log order by id desc limit 2')).rows;
 const documentTargets=(await c.query("select dt.code document_code,st.code status_code from bdb_document_type_master dt join bdb_status_master st on st.id=dt.status_target_id where st.code in ('SP2_LID','PUTUSAN_TIPIRING','SP3','TAHAP_II') order by dt.id")).rows;
 console.log(JSON.stringify({readOnly:true,caseContentRead:false,statuses,aggregate,hashes,jobs,documentTargets},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
