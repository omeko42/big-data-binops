'use strict';const {Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,options:'-c default_transaction_read_only=on',statement_timeout:15000});await c.connect();try{
 const triggers=await c.query("select tgname,pg_get_triggerdef(oid) definition,tgfoid::regproc::text function from pg_trigger where tgrelid='bdb_laporan_polisi'::regclass and not tgisinternal");
 const summary=await c.query("select (select count(*) from bdb_laporan_polisi where satker_id=15541 and unit_satker_id=15543)::int old_lp,(select count(*) from bdb_kinerja_perkara_snapshot where satker_id=15543)::int old_snapshot,(select scope_satker_id from auth_users where id=15597) account_scope,(select count(*) from bdb_audit_log where action='REGIONAL_MASTER_REPAIRED_20260903') audit_count");
 console.log(JSON.stringify({triggers:triggers.rows,rollbackState:summary.rows[0]},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.message);process.exitCode=1;});
