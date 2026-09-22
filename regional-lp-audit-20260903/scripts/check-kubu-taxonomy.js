'use strict';
const {Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-kubu-master-taxonomy-readonly',statement_timeout:25000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const ids=[11792,11794,21027,21028,19870,20901];
 const nodes=(await c.query('select id,deskripsi,parent_id,tipe_satker,is_synthetic,source,function_domain,organization_domain,operational_role,kinerja_aktif,dors_mapping_aktif from bdb_satker where id=any($1) order by id',[ids])).rows;
 const taxonomy=(await c.query("select source_table,entity_id,organization_domain,function_domain from bdb_satker_taxonomy_r11 where source_table='BDB_SATKER' and entity_id=any($1) order by entity_id",[ids])).rows;
 const structure=(await c.query("select c.relkind,case when c.relkind in ('v','m') then pg_get_viewdef(c.oid,true) else null end definition from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='bdb_satker_taxonomy_r11'")).rows;
 const audits=(await c.query("select id,action from bdb_audit_log where action in ('FINAL_REGIONS_REPAIRED_20260903','FINAL_REGIONS_REPAIR_ROLLED_BACK') order by id")).rows;
 console.log(JSON.stringify({nodes,taxonomy,structure,audits},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
