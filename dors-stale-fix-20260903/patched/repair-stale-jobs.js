const {Client}=require('pg');
const fs=require('fs');
async function main(){
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-dors-stale-recovery',statement_timeout:10000});
 await c.connect();
 try{
  await c.query('begin');
  const active=await c.query("select * from bdb_dors_sync_log where status='running' order by id for update");
  const expected=new Map([['461',{page:354,last:596,attempt:2,finished:'2026-09-03 02:03:13'}],['462',{page:37,last:50,attempt:1,finished:'2026-09-03 03:00:47'}]]);
  for(const row of active.rows){
   const e=expected.get(String(row.id));
   if(!e||row.current_page!==e.page||row.current_last_page!==e.last||row.attempt!==e.attempt)throw new Error('Job changed or a new job is active; abort: '+row.id);
  }
  if(process.argv[2]==='--repair'){
   if(active.rows.length) fs.writeFileSync('/tmp/dors-stale-jobs-before-20260903.json',JSON.stringify(active.rows,null,2),{flag:'wx'});
   for(const row of active.rows){
    const e=expected.get(String(row.id));
    const states=Array.isArray(row.sources_json)?row.sources_json:[];
    const fetched=states.reduce((n,s)=>n+Number(s.fetched||0),0),fresh=states.reduce((n,s)=>n+Number(s.upserted||0),0);
    const reason='Proses penarikan terhenti karena koneksi database timeout. Pencatatan kegagalan saat itu ikut gagal; status dipulihkan dari log server. Checkpoint dan data yang sudah masuk tetap disimpan.';
    await c.query(`update bdb_dors_sync_log set status='error',error=$2,stopped_reason=$2,
     finished_at=$3::timestamp,duration_ms=greatest(0,extract(epoch from ($3::timestamp-started_at))*1000)::integer,
     total_fetched=$4,total_upserted=$5 where id=$1 and status='running'`,[row.id,reason,e.finished,fetched,fresh]);
   }
   await c.query('commit');
   console.log(JSON.stringify({repaired_job_ids:active.rows.map(r=>r.id),lp_data_changed:false,checkpoint_changed:false}));
  }else{
   await c.query('rollback');
   console.log(JSON.stringify({safe_to_deploy:true,stale_job_ids:active.rows.map(r=>r.id)}));
  }
 }catch(e){await c.query('rollback');throw e;}finally{await c.end();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
