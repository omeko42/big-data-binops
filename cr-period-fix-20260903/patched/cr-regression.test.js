'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),Module=require('module'),path=require('path'),{Client}=require('pg');
const {clearanceMetrics}=require('./clearance-rate.util');
const live='/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js';
function load(code){
 const m=new Module(live,module);m.filename=live;m.paths=Module._nodeModulePaths(path.dirname(live));
 const req=m.require.bind(m);m.require=(id)=>id==='./clearance-rate.util'?{clearanceMetrics}:req(id);
 m._compile(code,live);return m.exports.KinerjaPerkaraService;
}
const Patched=load(fs.readFileSync(path.join(__dirname,'kinerja-perkara.service.js'),'utf8'));
const Before=load(fs.readFileSync(path.join(__dirname,'before.service.js'),'utf8'));
const p=new Patched({},{}),b=new Before({},{});
test('Exact user formulas, including zero denominator and no artificial clamp',()=>{
 assert.equal(clearanceMetrics({ct:7,cc_aktual:0,cc_tunggakan:8}).cr,8/15*100);
 assert.equal(clearanceMetrics({ct:7,cc_aktual:0,cc_tunggakan:8}).crLama,8/7*100);
 assert.equal(clearanceMetrics({ct:0,cc_aktual:0,cc_tunggakan:8}).cr,100);
 assert.equal(clearanceMetrics({ct:0,cc_aktual:0,cc_tunggakan:0}).cr,0);
 assert.ok(clearanceMetrics({ct:7,cc_aktual:8,cc_tunggakan:0}).cr>100);
 for(let ct=0;ct<40;ct++)for(let a=0;a<=ct;a++)for(let t=0;t<40;t++)assert.ok(clearanceMetrics({ct,cc_aktual:a,cc_tunggakan:t}).cr<=100);
});
test('Only combined-date CC cohort changes; CP and other date modes unchanged',()=>{
 for(const mode of ['mulai','selesai'])for(const bucket of ['age','difficulty'])assert.deepEqual(p.countExprs(mode,bucket),b.countExprs(mode,bucket));
 for(const bucket of ['age','difficulty'])for(const key of ['ct','cp_berjalan','cp_tunggakan','belum_kesulitan'])assert.equal(p.countExprs('both',bucket)[key],b.countExprs('both',bucket)[key]);
});
test('TypeScript and deployed JS classification agree',()=>{
 const ts=require('typescript');
 const Source=load(ts.transpileModule(fs.readFileSync(path.join(__dirname,'kinerja-perkara.service.ts'),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:true}}).outputText);
 const s=new Source({},{});for(const m of ['mulai','selesai','both'])for(const bucket of ['age','difficulty'])assert.deepEqual(s.countExprs(m,bucket),p.countExprs(m,bucket));
 const src=fs.readFileSync(path.join(__dirname,'kinerja-perkara.service.ts'),'utf8');
 assert.equal((src.match(/= clearanceMetrics\(/g)||[]).length,2);
});
test('Read-only PostgreSQL fixtures: boundaries, carryover, overdue, nulls, conservation',async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-cr-fixtures',statement_timeout:15000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const values=`(1,'2026-08-01'::date,'2026-08-31'::date,'2026-09-01'::date,false),(2,'2026-07-31','2026-08-01','2026-09-01',false),(3,'2025-01-01','2026-08-15','2026-01-01',false),(4,'2026-08-15','2026-08-20','2026-08-19',false),(5,'2026-08-31',null,'2026-09-01',false),(6,'2026-09-01','2026-09-02','2026-10-01',false),(7,null,'2026-08-10','2026-09-01',false),(8,'2026-08-10','2026-08-10',null,false)`;
 for(const mode of ['both','mulai','selesai'])for(const bucket of ['age','difficulty']){
 const ex=p.countExprs(mode,bucket),old=b.countExprs(mode,bucket);
 const {rows}=await c.query(`with cases(id,tanggal_mulai_penanganan,tanggal_selesai,tanggal_jatuh_tempo,kesulitan_belum_dipilih) as (values ${values}) select id,(${ex.ct}) ct,(${ex.cc_aktual}) a,(${ex.cc_tunggakan}) t,(${old.cc_aktual} or ${old.cc_tunggakan}) old_cc from cases order by id`,['2026-08-01','2026-08-31']);
 for(const r of rows){assert.equal(r.a===true||r.t===true,r.old_cc===true);assert.ok(!(r.a===true&&r.t===true));if(r.a===true)assert.equal(r.ct,true);}
 if(mode==='both'){assert.equal(rows[0].a,true);assert.equal(rows[1].a,false);assert.equal(rows[1].t,true);assert.equal(rows[2].t,true);if(bucket==='difficulty'){assert.equal(rows[3].t,true);assert.equal(rows[6].t,true);}}
 }
 }finally{await c.end();}
});
test('Live filtered tree, every ancestor, breakdown, summary, export all consistent',async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-cr-live-readonly',statement_timeout:25000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const cache=new Map();const ds={query:async(sql,args=[])=>{if(/^\s*(create|alter)\b/i.test(sql))return [];const key=JSON.stringify([sql,args]);if(!cache.has(key))cache.set(key,(await c.query(sql,args)).rows);return cache.get(key);}};
 const old=new Before(ds,{}),updated=new Patched(ds,{});
 const args=[undefined,'2026-08-01','2026-08-31','both',undefined,undefined,undefined,'national',undefined,undefined,undefined,'age',['KRIMSUS']];
 const original=await old.buildTree(...args),result=await updated.buildTree(...args);
 const flat=(roots)=>roots.flatMap(n=>[n,...flat(n.children||[])]);
 const previous=new Map(flat(original.roots).map(n=>[n.id,n]));let count=0;
 for(const n of flat(result.roots)){
 const o=previous.get(n.id);assert.ok(o);assert.equal(n.ct,o.ct);assert.equal(n.cc_aktual+n.cc_tunggakan,o.cc_aktual+o.cc_tunggakan);assert.equal(n.cp_berjalan,o.cp_berjalan);assert.equal(n.cp_tunggakan,o.cp_tunggakan);assert.ok(n.cc_aktual<=n.ct);assert.ok(n.cr<=100);
 for(const key of Object.keys(n.cc_aktual_rincian)){assert.equal(n.cc_aktual_rincian[key]+n.cc_tunggakan_rincian[key],o.cc_aktual_rincian[key]+o.cc_tunggakan_rincian[key]);}
 count++;
 }
 const j=flat(result.roots).find(n=>n.nama==='POLDA JAMBI');assert.ok(j);
 assert.equal(j.cc_aktual,0);assert.ok(j.cc_tunggakan>=8);assert.equal(j.cr,Math.round((j.cc_aktual+j.cc_tunggakan)/(j.ct+j.cc_tunggakan)*10000)/100);
 updated.buildTree=async()=>result;updated.lastRefreshedAt=async()=>null;
 const summary=await updated.summary(...args);const totals=clearanceMetrics(result.totals);assert.equal(summary.data.cr,Math.round(totals.cr*100)/100);
 const exported=await updated.exportRows(...args);const row=exported.rows.find(r=>r.satker.trim()==='POLDA JAMBI');assert.equal(row.cr,j.cr);assert.equal(row.cr_lama,j.cr_lama);assert.equal(updated.lite(j).cr,j.cr);
 console.log(JSON.stringify({nodesVerified:count,jambi:{ct:j.ct,ccActual:j.cc_aktual,ccBacklog:j.cc_tunggakan,crOld:j.cr_lama,crNew:j.cr},summaryCR:summary.data.cr}));
 }finally{await c.end();}
});

