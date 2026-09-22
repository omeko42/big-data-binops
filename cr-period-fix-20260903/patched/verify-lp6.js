'use strict';
const {Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
const {encodeId}=require('/usr/src/app/dist/bdb/laporan-polisi/id-cipher.util');
(async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-lp6-exact-readonly',statement_timeout:15000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const {rows}=await c.query(`select lp.id,lp.dors_lp_id,lp.raw_lp_id,lp.no_laporan,lp.tgl_laporan,lp.created_at::text,lp.updated_at::text,lp.synced_at::text,lp.deleted_at::text,lp.satker_nama,lp.unit_satker_nama,lp.sudah_dilimpahkan,lp.dilimpahkan_eksternal,r.import_batch,r.synced_at::text as raw_synced_at from bdb_laporan_polisi lp left join bdb_dors_raw_lp r on r.id=lp.raw_lp_id where lp.id=961020`);
 console.log(JSON.stringify({lp:rows}));
 const transfers=await c.query('select id,lp_id,satker_asal_nama,satker_tujuan_nama,satker_eksternal_nama,created_at::text from bdb_lp_pelimpahan where lp_id=$1',[961020]);console.log(JSON.stringify({exactTransferHistory:transfers.rows}));
 const superuser=await c.query("select id from auth_users where role_bdb='superadmin' order by id limit 1");if(!superuser.rowCount)throw new Error('No superadmin found for read-only access test');
 const ds={query:async(q,p=[])=> (await c.query(q,p)).rows};
 const service=new LaporanPolisiService(ds,{});
 const list=await service.list({search:rows[0].no_laporan.trim(),page:1,row:5},Number(superuser.rows[0].id));
 const detail=await service.detail(encodeId(961020),Number(superuser.rows[0].id));
 console.log(JSON.stringify({superadminReadCheck:{listStatus:list.status,total:list.total,exactFound:list.data.some(x=>Number(x.id)===961020),detailStatus:detail.status,pid:encodeId(961020)}}));
 }finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
