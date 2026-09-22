'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),Module=require('module'),path=require('path'),{Client}=require('pg');
const {processedMetrics}=require('./processed-rate.util');
const live='/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js';
function load(code){const m=new Module(live,module);m.filename=live;m.paths=Module._nodeModulePaths(path.dirname(live));const req=m.require.bind(m);m.require=id=>id==='./processed-rate.util'?{processedMetrics}:req(id);m._compile(code,live);return m.exports.KinerjaPerkaraService;}
const Updated=process.env.VERIFY_LIVE==='1'?require(live).KinerjaPerkaraService:load(fs.readFileSync(path.join(__dirname,'kinerja-perkara.service.js'),'utf8'));
const Before=load(fs.readFileSync(path.join(__dirname,'before.service.js'),'utf8'));
const p=new Updated({},{}),b=new Before({},{});
const client=()=>new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-pr-regression-readonly',statement_timeout:25000,options:'-c default_transaction_read_only=on'});
const round=x=>Math.round(x*100)/100;
test('Exact user PR formulas; no clamp; zero denominator; Aktual API contract unchanged',()=>{
 assert.deepEqual(processedMetrics({ct:7,cp_berjalan:6,cp_tunggakan:8}),{pr:14/15*100,prLama:14/7*100});
 assert.deepEqual(processedMetrics({ct:0,cp_berjalan:0,cp_tunggakan:0}),{pr:0,prLama:0});
 assert.equal(processedMetrics({ct:0,cp_berjalan:0,cp_tunggakan:5}).pr,100);
 assert.ok(processedMetrics({ct:1,cp_berjalan:2,cp_tunggakan:0}).pr>100);
 for(let ct=0;ct<30;ct++)for(let a=0;a<=ct;a++)for(let t=0;t<30;t++)assert.ok(processedMetrics({ct,cp_berjalan:a,cp_tunggakan:t}).pr<=100);
});
test('Only combined-date CP backlog changes; CT, CC, CP Aktual and strict cohorts preserved',()=>{
 for(const bucket of ['age','difficulty']){
  for(const mode of ['mulai','selesai'])assert.deepEqual(p.countExprs(mode,bucket),b.countExprs(mode,bucket));
  for(const key of ['ct','cc_aktual','cc_tunggakan','cp_berjalan','belum_kesulitan'])assert.equal(p.countExprs('both',bucket)[key],b.countExprs('both',bucket)[key]);
 }
});
test('Source/runtime parity and shared PR implementation in table and summary',()=>{
 const ts=require('typescript');
 const src=fs.readFileSync(path.join(__dirname,'kinerja-perkara.service.ts'),'utf8');
 const Source=load(ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:true}}).outputText);
 const s=new Source({},{});for(const mode of ['both','mulai','selesai'])for(const bucket of ['age','difficulty'])assert.deepEqual(s.countExprs(mode,bucket),p.countExprs(mode,bucket));
 assert.equal((src.match(/= processedMetrics\(/g)||[]).length,2);
 const helper=ts.transpileModule(fs.readFileSync(path.join(__dirname,'processed-rate.util.ts'),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
 const m={exports:{}};new Function('exports',helper)(m.exports);
 assert.deepEqual(m.exports.processedMetrics({ct:7,cp_berjalan:6,cp_tunggakan:8}),processedMetrics({ct:7,cp_berjalan:6,cp_tunggakan:8}));
});
test('Read-only SQL fixtures: recent carryover, old overdue, missing SLA, closed/future exclusions',async()=>{
 const c=client();await c.connect();try{
 const values=`(1,'2026-07-31'::date,null::date,'2026-09-01'::date,false,'PENYELIDIKAN'),(2,'2024-01-01',null,'2024-03-01',false,'PENYIDIKAN'),(3,'2026-07-31',null,null,true,'SPDP'),(4,'2026-07-31','2026-08-10','2026-09-01',false,'TAHAP_II'),(5,'2026-09-01',null,'2026-10-01',false,'SPDP'),(6,'2026-08-01',null,'2026-09-01',false,'SPDP'),(7,'2026-08-31',null,'2026-08-31',false,'SPDP'),(8,'2026-08-01',null,'2026-08-30',false,'SPDP'),(9,null,null,null,true,'SPDP'),(10,'2026-07-31',null,'2026-09-01',false,'LP')`;
 for(const bucket of ['age','difficulty']){
 const ex=p.countExprs('both',bucket),old=b.countExprs('both',bucket);
 const {rows}=await c.query(`with cases(id,tanggal_mulai_penanganan,tanggal_selesai,tanggal_jatuh_tempo,kesulitan_belum_dipilih,status_code) as(values ${values}) select id,(${ex.cp_berjalan}) aktual,(${ex.cp_tunggakan}) tunggakan,(${old.cp_tunggakan}) old_tunggakan,((${ex.cp_tunggakan}) and status_code in ('PENYELIDIKAN','PENYIDIKAN','SPDP','TAHAP_I','P19','P21')) counted_tunggakan from cases order by id`,['2026-08-01','2026-08-31']);
 for(const id of [1,2,3]){assert.equal(rows[id-1].counted_tunggakan,true);assert.equal(rows[id-1].old_tunggakan,false);}
 for(const id of [4,5,9,10])assert.notEqual(rows[id-1].counted_tunggakan,true);
 assert.equal(rows[5].aktual,true);assert.equal(rows[6].aktual,true);assert.equal(rows[5].tunggakan,false);
 if(bucket==='difficulty')assert.equal(rows[7].tunggakan,true);
 for(const r of rows)assert.ok(!(r.aktual===true&&r.tunggakan===true));
 }
 }finally{await c.end();}
});
test('Live filtered data: all nodes, breakdowns, summaries, exports; CR and Belum Update preserved',async()=>{
 const c=client();await c.connect();try{
 const cache=new Map();let queryCapture;
 const ds={query:async(sql,args=[])=>{if(/^\s*(create|alter)\b/i.test(sql))return [];if(/satker_id as sid/.test(sql)&&/count\(\*\) filter/.test(sql))queryCapture={sql,args};const key=JSON.stringify([sql,args]);if(!cache.has(key))cache.set(key,(await c.query(sql,args)).rows);return cache.get(key);}};
 const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children||[])]);
 let totalNodes=0;
 for(const bucket of ['age','difficulty']){
 const args=[undefined,'2026-08-01','2026-08-31','both',undefined,undefined,undefined,'national',undefined,undefined,undefined,bucket,['KRIMSUS']];
 const before=new Before(ds,{}),updated=new Updated(ds,{});
 const oldTree=await before.buildTree(...args),tree=await updated.buildTree(...args);
 const previous=new Map(flat(oldTree.roots).map(n=>[n.id,n]));let changed=0;
 for(const n of flat(tree.roots)){
 const old=previous.get(n.id);assert.ok(old);
 for(const k of ['ct','cc_aktual','cc_tunggakan','cr','cr_lama','indeks','level','cp_berjalan','cp_berjalan_belum_update','cp_tunggakan_belum_update'])assert.equal(n[k],old[k],n.nama+': '+k);
 assert.ok(n.cp_tunggakan>=old.cp_tunggakan);
 assert.equal(n.cp_tunggakan,Object.values(n.cp_tunggakan_rincian).reduce((a,v)=>a+v,0));
 assert.equal(n.cp_berjalan,Object.values(n.cp_berjalan_rincian).reduce((a,v)=>a+v,0));
 const expected=processedMetrics(n);assert.equal(n.pr,round(expected.pr));assert.equal(n.pr_lama,round(expected.prLama));assert.ok(n.pr<=100);
 if(n.cp_tunggakan!==old.cp_tunggakan)changed++;
 }
 assert.ok(changed>0);
 const tail=queryCapture.sql.slice(queryCapture.sql.indexOf('from bdb_kinerja_perkara_snapshot')).replace(/group by satker_id\s*$/,'');
 const extra=await c.query(`select count(*)::int total ${tail} and $2::date is not null and tanggal_mulai_penanganan < $1 and tanggal_selesai is null and status_code in ('PENYELIDIKAN','PENYIDIKAN','SPDP','TAHAP_I','P19','P21')`,queryCapture.args);
 assert.equal(tree.totals.cp_tunggakan-oldTree.totals.cp_tunggakan,extra.rows[0].total);
 updated.buildTree=async()=>tree;updated.lastRefreshedAt=async()=>null;
 const summary=await updated.summary(...args),exported=await updated.exportRows(...args);const expected=processedMetrics(tree.totals);assert.equal(summary.data.pr,round(expected.pr));assert.equal(summary.data.pr_lama,round(expected.prLama));
 for(const r of exported.rows){const x=processedMetrics(r);assert.equal(r.pr,round(x.pr));assert.equal(r.pr_lama,round(x.prLama));}
 const j=flat(tree.roots).find(n=>n.nama==='POLDA JAMBI');const oldJ=previous.get(j.id);
 console.log(JSON.stringify({bucket,nodesVerified:previous.size,nodesChanged:changed,addedProcessedCarryover:extra.rows[0].total,jambiBefore:{ct:oldJ.ct,aktual:oldJ.cp_berjalan,tunggakan:oldJ.cp_tunggakan,prOld:oldJ.pr_lama,prNew:oldJ.pr},jambiAfter:{ct:j.ct,aktual:j.cp_berjalan,tunggakan:j.cp_tunggakan,prOld:j.pr_lama,prNew:j.pr}}));
 totalNodes+=previous.size;
 }
 assert.ok(totalNodes>0);
 }finally{await c.end();}
});
