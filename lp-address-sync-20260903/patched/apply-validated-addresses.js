'use strict';
const fs=require('fs'),path=require('path'),Module=require('module'),assert=require('node:assert/strict'),{Client}=require('pg');
const live='/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service.js';
function load(source){const m=new Module(live,module);m.filename=live;m.paths=Module._nodeModulePaths(path.dirname(live));m._compile(source,live);return m.exports.LaporanPolisiService;}
async function capture(C){let q;const s=new C({query:async(sql)=>{q=sql;return [{}];}},{});await s.syncPelimpahanOwnershipFromDors();return q;}
const addressKeys=['unit','polda','polres','polsek','pelimpahan','_cas_dors_address_sync'];
const allowed=['satker_id','satker_nama','unit_satker_id','unit_satker_nama','unit_satker_kode','unit_nama','unit_level','kode_pusiknas','penanganan_level','raw_lp_id','data_scope','payload_json','synced_at','updated_at'];
(async()=>{
 const apply=process.argv.includes('--apply');const plan=JSON.parse(fs.readFileSync('/tmp/address-plan-20260903.json','utf8'));
 const ids=plan.resolved.map(x=>Number(x.id));assert.ok(ids.includes(402704));assert.ok(ids.length<=200);
 const source=fs.readFileSync(path.join(__dirname,'laporan-polisi.service.js'),'utf8');const C=load(source);
 const sql=await capture(C);
 const ts=require('typescript');const typed=ts.transpileModule(fs.readFileSync(path.join(__dirname,'laporan-polisi.service.ts'),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:true}}).outputText;
 assert.equal((await capture(load(typed))).replace(/\s+/g,' '),sql.replace(/\s+/g,' '),'Source/runtime SQL must agree');
 assert.ok(sql.includes('unit_cfg'));assert.ok(sql.includes('grandparent'));assert.ok(sql.includes('_cas_owner_override'));
 assert.ok(!sql.includes('insert into bdb_lp_pelimpahan'));assert.ok(!sql.includes('sudah_dilimpahkan ='));
 const scoped=sql.replace('from bdb_laporan_polisi lp\n                join bdb_dors_raw_lp r','from (select * from bdb_laporan_polisi where id=any($1)) lp\n                join bdb_dors_raw_lp r');
 assert.notEqual(scoped,sql);
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-validated-address-correction',statement_timeout:60000,lock_timeout:5000});await c.connect();let tx=false;
 try{
 await c.query('begin');tx=true;
 const before=await c.query('select * from bdb_laporan_polisi where id=any($1) order by id for update',[ids]);assert.equal(before.rowCount,ids.length);
 const expectations=new Map(plan.resolved.map(x=>[Number(x.id),x]));
 for(const row of before.rows){const p=expectations.get(Number(row.id));assert.equal(Number(row.satker_id),Number(p.old_satker));assert.equal(Number(row.unit_satker_id),Number(p.old_unit));assert.ok(!row.sudah_dilimpahkan&&!row.dilimpahkan_eksternal&&!row.deleted_at);}
 const historyBefore=await c.query('select count(*)::int c from bdb_lp_pelimpahan where lp_id=any($1)',[ids]);assert.equal(historyBefore.rows[0].c,0);
 const snapshots=await c.query('select lp_id,satker_id from bdb_kinerja_perkara_snapshot where lp_id=any($1)',[ids]);
 if(apply)fs.writeFileSync('/tmp/lp-address-before-20260903.json',JSON.stringify({capturedAt:new Date().toISOString(),rows:before.rows,snapshots:snapshots.rows},null,2),{flag:'wx',mode:0o600});
 const result=await c.query(scoped,[ids]);
 const after=await c.query('select * from bdb_laporan_polisi where id=any($1) order by id',[ids]);
 for(let i=0;i<before.rows.length;i++){
  const a=after.rows[i],b=before.rows[i],p=expectations.get(Number(a.id));assert.equal(a.id,b.id);assert.equal(Number(a.satker_id),Number(p.new_satker));assert.equal(Number(a.unit_satker_id),Number(p.new_unit));
  const stable=r=>Object.fromEntries(Object.entries(r).filter(([k])=>!allowed.includes(k)));assert.deepEqual(stable(a),stable(b),'Unrelated LP fields changed for '+a.id);
  const body=r=>Object.fromEntries(Object.entries(r.payload_json||{}).filter(([k])=>!addressKeys.includes(k)));assert.deepEqual(body(a),body(b),'Non-address payload changed');
  assert.equal(a.payload_json.unit.unit,p.source_unit);
 }
 const hist=await c.query('select count(*)::int c from bdb_lp_pelimpahan where lp_id=any($1)',[ids]);assert.equal(hist.rows[0].c,0);
 const snapAfter=await c.query('select lp_id,satker_id from bdb_kinerja_perkara_snapshot where lp_id=any($1)',[ids]);assert.equal(snapAfter.rowCount,snapshots.rowCount);
 for(const row of snapAfter.rows)assert.equal(Number(row.satker_id),Number(expectations.get(Number(row.lp_id)).new_unit));
 const again=await c.query(scoped,[ids]);assert.equal(again.rows[0].ownership_updated,0);assert.equal(again.rows[0].already_owner_acknowledged,0);
 if(apply){await c.query('commit');}else{await c.query('rollback');}tx=false;
 console.log(JSON.stringify({applied:apply,dryRunRolledBack:!apply,verifiedRows:ids.length,summary:result.rows[0],snapshotRowsVerified:snapAfter.rowCount,idempotent:true,documentsAndStatusUnchanged:true,formalTransfersCreated:0}));
 }catch(e){if(tx)await c.query('rollback');throw e;}finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

