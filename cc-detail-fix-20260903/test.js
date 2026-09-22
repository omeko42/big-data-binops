'use strict';
const fs=require('fs'),Module=require('module'),path=require('path'),assert=require('node:assert/strict'),{Client}=require('pg');
const dir='/tmp/cc-detail-fix-20260903',live='/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service.js';
function load(code){const m=new Module(live,module);m.filename=live;m.paths=Module._nodeModulePaths(path.dirname(live));m._compile(code+'\nmodule.exports.testBreakdown=CC_BREAKDOWN;',live);return{Service:m.exports.KinerjaPerkaraService,breakdown:m.exports.testBreakdown};}
const candidate=load(fs.readFileSync(process.env.VERIFY_LIVE==='1'?live:dir+'/kinerja-perkara.service.js','utf8')),before=load(fs.readFileSync(dir+'/before.service.js','utf8'));
const ts=require('typescript'),source=load(ts.transpileModule(fs.readFileSync('/tmp/cc-detail-fix-20260903/kinerja-perkara.service.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:true}}).outputText);
assert.deepEqual(candidate.breakdown,source.breakdown);assert.deepEqual(candidate.breakdown.map(x=>x.key),['sp2lid','sp3','tipiring','thp2']);
const changedOnly=new Set(['cc_aktual_rincian','cc_tunggakan_rincian','children']);
const flat=nodes=>nodes.flatMap(n=>[n,...flat(n.children||[])]),sum=r=>Object.values(r).reduce((a,v)=>a+v,0);
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-cc-detail-regression-readonly',statement_timeout:30000});await c.connect();try{await c.query('begin transaction isolation level repeatable read read only');
 const masters=(await c.query("select code from bdb_status_master where kategori='CC'")).rows.map(r=>r.code);for(const b of candidate.breakdown)assert.ok(masters.includes(b.cond.split("'")[1]),'CC status not in canonical master');
 const model=new candidate.Service({},{}),prior=new before.Service({},{}),src=new source.Service({},{});let fixtureTests=0;
 for(const mode of ['both','mulai','selesai'])for(const bucket of ['age','difficulty']){
  const ex=model.countExprs(mode,bucket);assert.deepEqual(ex,prior.countExprs(mode,bucket));assert.deepEqual(ex,src.countExprs(mode,bucket));
  for(const reason of [null,'RJ','NON_RJ']){
   const rows=[];for(const code of ['SP2_LID','PUTUSAN_TIPIRING','SP3','TAHAP_II'])for(const old of [false,true])for(const rj of [false,true])rows.push(`('${code}', '${old?'2025-01-01':'2026-08-01'}'::date,'2026-08-15'::date,'${old?'2025-02-01':'2026-09-01'}'::date,false,${rj})`);
   const cols=candidate.breakdown.flatMap(b=>['cc_aktual','cc_tunggakan'].map(k=>`count(*) filter(where ${ex[k]} and ${b.cond}${reason&&(b.key==='sp2lid'||b.key==='sp3')?' and is_rj = '+(reason==='RJ') :''})::int ${k}_${b.key}`));
   const q=`with fixture(status_code,tanggal_mulai_penanganan,tanggal_selesai,tanggal_jatuh_tempo,kesulitan_belum_dipilih,is_rj) as(values ${rows.join(',')}) select count(*) filter(where ${ex.cc_aktual})::int cc_aktual,count(*) filter(where ${ex.cc_tunggakan})::int cc_tunggakan,${cols.join(',')} from fixture`;
   const r=(await c.query(q,['2026-08-01','2026-08-31'])).rows[0];
   for(const k of ['cc_aktual','cc_tunggakan']){const breakdownSum=candidate.breakdown.reduce((n,b)=>n+r[k+'_'+b.key],0);assert.equal(breakdownSum,reason?r[k]*.75:r[k]);assert.equal(r[k+'_sp2lid'],r[k+'_sp3']);assert.equal(r[k+'_tipiring'],r[k+'_thp2']);}fixtureTests++;
  }
 }
 const cache=new Map();let captured;
 const ds={query:async(q,p=[])=>{if(/^\s*(create|alter)\b/i.test(q))return[];if(/satker_id as sid/.test(q)&&/count\(\*\) filter/.test(q))captured={q,p};const key=JSON.stringify([q,p]);if(!cache.has(key))cache.set(key,(await c.query(q,p)).rows);return cache.get(key);}};
 const results=[];
 for(const bucket of ['age','difficulty']){
  const args=[undefined,'2026-01-01','2026-12-31','both',undefined,undefined,undefined,'national',undefined,undefined,undefined,bucket,[]];
  const oldService=new before.Service(ds,{}),newService=new candidate.Service(ds,{}),oldTree=await oldService.buildTree(...args),tree=await newService.buildTree(...args),query=captured;
  const oldNodes=new Map(flat(oldTree.roots).map(n=>[n.id,n]));let changed=0;
  for(const n of flat(tree.roots)){const old=oldNodes.get(n.id);assert.ok(old);for(const key of Object.keys(n))if(!changedOnly.has(key))assert.deepEqual(n[key],old[key],'Unexpected change '+key);for(const k of ['cc_aktual_rincian','cc_tunggakan_rincian']){for(const unchanged of ['sp3','thp2'])assert.equal(n[k][unchanged]??0,old[k][unchanged]??0);assert.ok((n[k].sp2lid??0)>=(old[k].sp2lid??0));assert.ok((n[k].tipiring??0)>=(old[k].tipiring??0));}if((n.cc_aktual_rincian.sp2lid??0)+(n.cc_tunggakan_rincian.sp2lid??0)+(n.cc_aktual_rincian.tipiring??0)+(n.cc_tunggakan_rincian.tipiring??0)>0)changed++;}
  assert.ok(changed>0);for(const k of Object.keys(tree.totals))if(!changedOnly.has(k))assert.deepEqual(tree.totals[k],oldTree.totals[k]);
  const ex=newService.countExprs('both',bucket),tail=query.q.slice(query.q.indexOf('from bdb_kinerja_perkara_snapshot')).replace(/group by satker_id\s*$/,'');
  const direct=(await c.query(`select ${candidate.breakdown.flatMap(b=>['cc_aktual','cc_tunggakan'].map(k=>`count(*) filter(where ${ex[k]} and ${b.cond})::int ${k}_${b.key}`)).join(',')} ${tail}`,query.p)).rows[0];for(const b of candidate.breakdown)for(const k of ['cc_aktual','cc_tunggakan'])assert.equal(tree.totals[k+'_rincian'][b.key],direct[k+'_'+b.key]);
  newService.buildTree=async()=>tree;newService.lastRefreshedAt=async()=>null;
  const summary=await newService.summary(...args),exported=await newService.exportRows(...args);for(const k of ['cc_aktual_rincian','cc_tunggakan_rincian'])assert.deepEqual(summary.data[k],tree.totals[k]);
  const byCode=new Map(flat(tree.roots).map(n=>[n.kode,n]));for(const r of exported.rows){const n=byCode.get(r.kode);assert.ok(n);for(const b of candidate.breakdown)for(const k of ['cc_aktual','cc_tunggakan'])assert.equal(r[k+'_'+b.key],n[k+'_rincian'][b.key]??0);}
  results.push({bucket,nodesVerified:oldNodes.size,nodesWithCorrectedDetails:changed,ccTotal:tree.totals.cc_aktual+tree.totals.cc_tunggakan,details:{aktual:tree.totals.cc_aktual_rincian,tunggakan:tree.totals.cc_tunggakan_rincian},ctCpPrCrIndeksUnchanged:true,summaryExportConsistent:true});
 }
 console.log(JSON.stringify({verified:true,live:process.env.VERIFY_LIVE==='1',fixtureTests,sourceRuntimeParity:true,caseContentRead:false,results},null,2));
}finally{await c.query('rollback').catch(()=>{});await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
