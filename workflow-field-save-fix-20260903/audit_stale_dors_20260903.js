const { Client } = require('pg');

async function main() {
  const client = new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-dors-stale-readonly',statement_timeout:10000,connectionTimeoutMillis:5000});
  await client.connect();
  try {
    await client.query('BEGIN READ ONLY');
    const activity = await client.query(`select pid,application_name,client_addr,state,
      round(extract(epoch from (clock_timestamp()-query_start))) as query_seconds,
      round(extract(epoch from (clock_timestamp()-xact_start))) as transaction_seconds,
      wait_event_type,wait_event,pg_blocking_pids(pid) as blocking_pids,
      left(regexp_replace(query,'\\s+',' ','g'),500) as query
      from pg_stat_activity where datname=current_database() and pid<>pg_backend_pid()
      and (state<>'idle' or query_start < now()-interval '5 minutes') order by query_start limit 70`);
    const locks = await client.query(`select l.pid,l.mode,l.granted,c.relname from pg_locks l
      join pg_class c on c.oid=l.relation where l.pid in
      (select pid from pg_stat_activity where datname=current_database() and state<>'idle')
      and (not l.granted or l.mode in ('AccessExclusiveLock','ShareLock','ShareRowExclusiveLock'))
      order by l.granted,l.pid limit 60`);
    const jobs = await client.query(`select id,status,trigger,from_date::text,to_date::text,
      started_at::text,finished_at::text,current_source,current_chunk_from::text,current_chunk_to::text,
      current_page,current_last_page,attempt,max_attempts,chunks_done,chunks_total,total_fetched,total_upserted,
      error,stopped_reason,sources_json from bdb_dors_sync_log order by id desc limit 3`);
    console.log(JSON.stringify({checked_at:new Date().toISOString(),activity:activity.rows,locks:locks.rows,jobs:jobs.rows},null,2));
    await client.query('ROLLBACK');
  } finally { await client.end(); }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
