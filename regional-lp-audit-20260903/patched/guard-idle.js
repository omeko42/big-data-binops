'use strict';
const {Client}=require('pg');
(async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-regional-deploy-guard',statement_timeout:10000,options:'-c default_transaction_read_only=on'});
 await c.connect();try{
  const running=await c.query("select id from bdb_dors_sync_log where status='running'");
  if(running.rowCount)throw Error('Active DORS jobs: '+running.rows.map(r=>r.id));
  const recent=await c.query("select id from bdb_dors_sync_log where finished_at > (now() at time zone 'UTC')-interval '2 minutes'");
  if(recent.rowCount)throw Error('DORS just finished; allow final postprocessing before restart');
  const mapping=await c.query("select pid from pg_stat_activity where datname=current_database() and pid<>pg_backend_pid() and state='active' and query ~* '(insert into|update|delete from)' and query ~* '(bdb_laporan_polisi|bdb_dors_raw_lp|cm_jenis_kejahatan)' and query_start < now()-interval '5 seconds'");
  if(mapping.rowCount)throw Error('LP processing still active: '+mapping.rows.map(r=>r.pid));
  console.log('NO_RUNNING_SYNC_OR_ACTIVE_MAPPING=1');
 }finally{await c.end();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
