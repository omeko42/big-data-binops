'use strict';
const {Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-check-job463-readonly',statement_timeout:15000,options:'-c default_transaction_read_only=on'});await c.connect();try{
const result=await c.query("select now()::text checked_at,id,trigger,from_date::text,to_date::text,status,total_fetched,total_upserted,attempt,max_attempts,current_source,current_page,current_last_page,current_chunk_from::text,current_chunk_to::text,chunks_done,chunks_total,started_at::text,finished_at::text,duration_ms,error,stopped_reason,sources_json from bdb_dors_sync_log order by id desc limit 3");
const jobs=result.rows.map(r=>({...r,sources_json:(Array.isArray(r.sources_json)?r.sources_json:[]).map(s=>({key:s.key,model:s.model,chunk_from:s.chunk_from,chunk_to:s.chunk_to,status:s.status,last_success_page:s.last_success_page,pages:s.pages,fetched:s.fetched,upserted:s.upserted,error:s.error}))}));
const running=await c.query("select id from bdb_dors_sync_log where status='running' order by id");
const activity=await c.query("select pid,application_name,state,wait_event_type,wait_event,now()-query_start as query_age,pg_blocking_pids(pid) blocked_by,case when query ilike '%bdb_dors_raw_lp%' then 'DORS_RAW' when query ilike '%bdb_dors_sync_log%' then 'SYNC_LOG' when query ilike '%bdb_laporan_polisi%' then 'LP' when query ilike '%bdb_satker%' then 'SATKER' else 'OTHER' end query_group,left(regexp_replace(query,'[[:space:]]+',' ','g'),180) query_start_text from pg_stat_activity where datname=current_database() and pid<>pg_backend_pid() and state='active' order by query_start limit 12");
console.log(JSON.stringify({jobs,running:running.rows,dbActivity:activity.rows},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.message);process.exitCode=1;});

