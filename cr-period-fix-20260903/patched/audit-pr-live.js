'use strict';
const assert=require('node:assert/strict');
const {Client}=require('pg');
const {KinerjaPerkaraService}=require('/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service');
const round=x=>Math.round(x*100)/100;
const check=n=>{
 const total=n.cp_berjalan+n.cp_tunggakan;
 assert.equal(n.pr_lama,round(n.ct>0?total/n.ct*100:0));
 assert.equal(n.pr,round(n.ct+n.cp_tunggakan>0?total/(n.ct+n.cp_tunggakan)*100:0));
 assert.ok(n.cp_berjalan<=n.ct);assert.ok(n.pr<=100);
};
(async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-pr-readonly',statement_timeout:20000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const cache=new Map();const ds={query:async(q,p=[])=>{if(/^\s*(create|alter)\b/i.test(q))return [];const key=JSON.stringify([q,p]);if(!cache.has(key))cache.set(key,(await c.query(q,p)).rows);return cache.get(key);}};
 for(const mode of ['both','mulai','selesai'])for(const bucket of ['age','difficulty']){
 const s=new KinerjaPerkaraService(ds,{});
 const args=[undefined,'2026-08-01','2026-08-31',mode,undefined,undefined,undefined,'national',undefined,undefined,undefined,bucket,['KRIMSUS']];
 const result=await s.buildTree(...args);
 const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children||[])]);const all=flat(result.roots);for(const n of all)check(n);
 s.buildTree=async()=>result;s.lastRefreshedAt=async()=>null;
 const summary=await s.summary(...args);check(summary.data);
 const exported=await s.exportRows(...args);for(const r of exported.rows)check(r);
 const j=all.find(n=>n.nama==='POLDA JAMBI');
 console.log(JSON.stringify({mode,bucket,rowsVerified:all.length,exportRowsVerified:exported.rows.length,summaryVerified:true,jambi:j?{ct:j.ct,cpAktual:j.cp_berjalan,cpTunggakan:j.cp_tunggakan,prLama:j.pr_lama,prBaru:j.pr}:null}));
 }
 }finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
