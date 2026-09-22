'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{Client}=require('pg');
(async()=>{const apply=process.argv.includes('--apply');const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-approved-dlhk-name-correction',statement_timeout:15000,lock_timeout:3000});await c.connect();let tx=false;
 try{
 await c.query('begin');tx=true;
 const r=await c.query("select id,nama,alamat,keterangan,updated_at from bdb_satker_eksternal where nama ilike '%Dinas Lingkungan Hidup dan Kebersihan (DLHK)%' order by id for update");
 if(!r.rowCount){await c.query('rollback');tx=false;console.log(JSON.stringify({alreadyCorrect:true}));return;}
 assert.equal(r.rowCount,514,'Changed scope; inspect before proceeding');
 const proposed=r.rows.map(x=>({...x,newNama:x.nama.replace(/Dinas Lingkungan Hidup dan Kebersihan/ig,'Dinas Lingkungan Hidup dan Kehutanan')}));
 const duplicates=await c.query('select id,nama from bdb_satker_eksternal where lower(nama)=any($1) and id<>all($2)',[proposed.map(x=>x.newNama.toLowerCase()),r.rows.map(x=>x.id)]);assert.equal(duplicates.rowCount,0,'Potential duplicate names require review');
 const history=await c.query('select id,satker_eksternal_id,satker_eksternal_nama from bdb_lp_pelimpahan where satker_eksternal_id=any($1)',[r.rows.map(x=>x.id)]);
 if(!apply){await c.query('rollback');tx=false;console.log(JSON.stringify({dryRun:true,renameCount:r.rowCount,historyReferences:history.rowCount}));return;}
 fs.writeFileSync('/tmp/dlhk-name-before-20260903.json',JSON.stringify({masters:r.rows,history:history.rows},null,2),{flag:'wx',mode:0o600});
 for(const row of proposed){
 const u=await c.query('update bdb_satker_eksternal set nama=$2,updated_at=now() where id=$1 and nama=$3 returning id',[row.id,row.newNama,row.nama]);assert.equal(u.rowCount,1);
 await c.query('update bdb_lp_pelimpahan set satker_eksternal_nama=$2 where satker_eksternal_id=$1 and satker_eksternal_nama=$3',[row.id,row.newNama,row.nama]);
 }
 await c.query("insert into bdb_audit_log(user_nama,action,entity,entity_id,meta,outcome) values($1,$2,$3,$4,$5::jsonb,'success')",['Codex (atas permintaan pengguna)','DLHK_LABEL_CORRECTED','satker_eksternal','batch-20260903',JSON.stringify({count:r.rowCount,ids:r.rows.map(x=>x.id),from:'Dinas Lingkungan Hidup dan Kebersihan',to:'Dinas Lingkungan Hidup dan Kehutanan',sameIds:true,historyReferences:history.rowCount})]);
 await c.query('commit');tx=false;console.log(JSON.stringify({applied:true,renamed:r.rowCount,historyReferences:history.rowCount,idsPreserved:true}));
 }catch(e){if(tx)await c.query('rollback');throw e;}finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

