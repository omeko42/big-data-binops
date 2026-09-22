'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{Client}=require('pg');
(async()=>{
 const before=JSON.parse(fs.readFileSync('/tmp/lp-address-before-20260903.json','utf8'));
 const plan=JSON.parse(fs.readFileSync('/tmp/address-plan-20260903.json','utf8'));
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-postdeploy-address-dlhk-readonly',statement_timeout:20000,options:'-c default_transaction_read_only=on'});
 await c.connect();try{
 const ids=before.rows.map(x=>x.id);const current=await c.query('select * from bdb_laporan_polisi where id=any($1) order by id',[ids]);assert.equal(current.rowCount,136);
 const allowed=['satker_id','satker_nama','unit_satker_id','unit_satker_nama','unit_satker_kode','unit_nama','unit_level','kode_pusiknas','penanganan_level','raw_lp_id','data_scope','payload_json','synced_at','updated_at'];
 const stable=x=>JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k])=>!allowed.includes(k)))));
 const target=new Map(plan.resolved.map(x=>[Number(x.id),x]));
 for(let i=0;i<current.rowCount;i++){const a=current.rows[i],b=before.rows[i];assert.equal(a.id,b.id);assert.equal(Number(a.unit_satker_id),Number(target.get(Number(a.id)).new_unit));assert.deepEqual(stable(a),stable(b));}
 const lp=current.rows.find(x=>Number(x.id)===402704);assert.equal(Number(lp.unit_satker_id),19466);
 const hist=await c.query('select count(*)::int c from bdb_lp_pelimpahan where lp_id=any($1)',[ids]);assert.equal(hist.rows[0].c,0);
 const names=await c.query("select count(*) filter(where nama ilike '%Dinas Lingkungan Hidup dan Kebersihan (DLHK)%')::int wrong,count(*) filter(where nama ilike '%Dinas Lingkungan Hidup dan Kehutanan (DLHK)%')::int correct from bdb_satker_eksternal");assert.equal(names.rows[0].wrong,0);assert.equal(names.rows[0].correct,514);
 const snapshots=await c.query('select lp_id,satker_id from bdb_kinerja_perkara_snapshot where lp_id=any($1)',[ids]);assert.equal(snapshots.rowCount,136);for(const s of snapshots.rows)assert.equal(Number(s.satker_id),Number(target.get(Number(s.lp_id)).new_unit));
 const audits=await c.query("select count(*)::int count from bdb_audit_log where action='DORS_ADDRESS_RECONCILED' and entity_id=any($1)",[ids.map(String)]);
 console.log(JSON.stringify({lp1541:{id:lp.id,unit:lp.unit_satker_nama,unitId:lp.unit_satker_id},verifiedLP:current.rowCount,unchangedStatusAndOtherFields:true,formalTransfersCreated:hist.rows[0].c,snapshotsVerified:snapshots.rowCount,auditCount:audits.rows[0].count,dlhk:names.rows[0]}));
 }finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

