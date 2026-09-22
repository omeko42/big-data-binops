'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{Client}=require('pg');
const provinces=[
'Aceh','Sumatera Utara','Sumatera Barat','Riau','Jambi','Sumatera Selatan','Bengkulu','Lampung','Kepulauan Bangka Belitung','Kepulauan Riau',
'DKI Jakarta','Jawa Barat','Jawa Tengah','Daerah Istimewa Yogyakarta','Jawa Timur','Banten','Bali','Nusa Tenggara Barat','Nusa Tenggara Timur',
'Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara',
'Sulawesi Utara','Sulawesi Tengah','Sulawesi Selatan','Sulawesi Tenggara','Gorontalo','Sulawesi Barat','Maluku','Maluku Utara',
'Papua','Papua Barat','Papua Selatan','Papua Tengah','Papua Pegunungan','Papua Barat Daya'];
const normalize=s=>s.toUpperCase().replace(/DAERAH ISTIMEWA YOGYAKARTA|DI[. ]+YOGYAKARTA/g,'YOGYAKARTA').replace(/[^A-Z0-9]/g,'');
const name=p=>'Dinas Lingkungan Hidup dan Kehutanan (DLHK) - Provinsi '+p;
const match=(row,p)=>{
 const n=normalize(row.nama);
 return n===normalize(name(p))||n===normalize('DLHK Provinsi '+p)||n===normalize('Dinas Lingkungan Hidup dan Kehutanan Provinsi '+p);
};
const serial=x=>JSON.parse(JSON.stringify(x));
(async()=>{
 assert.equal(provinces.length,38);assert.equal(new Set(provinces.map(normalize)).size,38);
 const apply=process.argv.includes('--apply'),verify=process.argv.includes('--verify');
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-approved-dlhk-all-provinces',statement_timeout:15000,lock_timeout:3000,...(!apply?{options:'-c default_transaction_read_only=on'}:{})});
 await c.connect();let tx=false;
 try{
 await c.query('begin');tx=true;
 if(apply)await c.query('lock table bdb_satker_eksternal in share row exclusive mode');
 const before=await c.query('select * from bdb_satker_eksternal order by id');
 const plan=provinces.map(p=>{const rows=before.rows.filter(r=>match(r,p));assert.ok(rows.length<=1,'Duplicate province DLHK: '+p);return{province:p,nama:name(p),existingId:rows[0]?.id||null};});
 const provinceRows=before.rows.filter(r=>/DLHK|Lingkungan Hidup dan Kehutanan/i.test(r.nama)&&/provinsi|prov\./i.test(r.nama));
 const unmatched=provinceRows.filter(r=>!provinces.some(p=>match(r,p)));assert.equal(unmatched.length,0,'Review unmatched province DLHK names before inserting');
 const missing=plan.filter(x=>!x.existingId);
 if(verify)assert.equal(missing.length,0,'A province DLHK is still missing');
 if(!apply||!missing.length){
  await c.query('rollback');tx=false;
  console.log(JSON.stringify({mode:verify?'verify':apply?'already-complete':'dry-run',provinceCount:provinces.length,existing:38-missing.length,toInsert:missing.length,missing:missing.map(x=>x.province),externalTotal:before.rowCount}));
 }else{
  const backup='/tmp/dlhk-provinces-before-20260903.json';
  fs.writeFileSync(backup,JSON.stringify({capturedAt:new Date().toISOString(),provinceSource:'wilayah_indonesia_2025.json; province coverage checked against BPS current 38-province tables',totalBefore:before.rowCount,existingProvinceRows:provinceRows,plan},null,2),{flag:'wx',mode:0o600});
  const inserted=[];
  for(const p of missing){
   const result=await c.query("insert into bdb_satker_eksternal(nama,alamat,keterangan,function_domain,organization_domain) values($1,null,$2,'NOT_APPLICABLE','EKSTERNAL_POLRI') returning *",[p.nama,'Kelompok: DLHK | Tingkat: Provinsi | Wilayah: '+p.province]);
   assert.equal(result.rowCount,1);inserted.push(result.rows[0]);
  }
  const after=await c.query('select * from bdb_satker_eksternal order by id');
  const newIds=new Set(inserted.map(x=>x.id));assert.equal(after.rowCount,before.rowCount+missing.length);
  assert.deepEqual(serial(after.rows.filter(x=>!newIds.has(x.id))),serial(before.rows),'Existing external master data changed');
  for(const p of provinces)assert.equal(after.rows.filter(x=>match(x,p)).length,1,'Province must have exactly one DLHK: '+p);
  const receipt={createdAt:new Date().toISOString(),insertedCount:inserted.length,totalAfter:after.rowCount,inserted:serial(inserted),existingRowsUnchanged:true};
  fs.writeFileSync('/tmp/dlhk-provinces-created-20260903.json',JSON.stringify(receipt,null,2),{flag:'wx',mode:0o600});
  const audit=await c.query("insert into bdb_audit_log(user_nama,action,entity,entity_id,meta,outcome) values($1,$2,$3,$4,$5::jsonb,'success') returning id",['Codex (atas permintaan pengguna)','DLHK_PROVINCES_ADDED','satker_eksternal','province-batch-20260903',JSON.stringify({inserted:inserted.map(x=>({id:x.id,nama:x.nama})),count:inserted.length,existingRowsUnchanged:true})]);
  await c.query('commit');tx=false;
  console.log(JSON.stringify({applied:true,inserted:inserted.length,totalAfter:after.rowCount,auditId:audit.rows[0].id,provinceCoverage:38,existingRowsUnchanged:true}));
 }
 // Verify actual deployed list service and the same unpaged picker contract used by LP.
 if(apply||verify){
  const {SatkerEksternalService}=require('/usr/src/app/dist/bdb/satker-eksternal/satker-eksternal.service');
  const service=new SatkerEksternalService({query:async(q,p)=>(await c.query(q,p)).rows});
  const search='Dinas Lingkungan Hidup dan Kehutanan (DLHK) - Provinsi';
  const page1=await service.list(search,1,25),page2=await service.list(search,2,25),picker=await service.list(search);
  assert.equal(page1.total,38);assert.equal(page1.data.length,25);assert.equal(page2.data.length,13);assert.equal(picker.data.length,38);
  assert.equal(new Set([...page1.data,...page2.data].map(x=>x.id)).size,38);
  for(const p of provinces)assert.equal(picker.data.filter(r=>match(r,p)).length,1);
  console.log(JSON.stringify({liveServiceVerified:true,searchTotal:page1.total,page1:25,page2:13,pickerChoices:38}));
 }
 }catch(e){if(tx)await c.query('rollback');throw e;}finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

