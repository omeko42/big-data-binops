'use strict';
const {Client}=require('pg');
async function main(){
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-lp6-external-readonly',statement_timeout:15000,options:'-c default_transaction_read_only=on'});
 await c.connect();
 try{
 const transfers=await c.query(`select p.id as transfer_id,p.lp_id,p.satker_asal_nama,p.satker_tujuan_nama,p.satker_eksternal_nama,p.keterangan,p.nomor_dokumen,p.created_at::text,lp.no_laporan,lp.dors_lp_id,lp.satker_nama,lp.unit_satker_nama,lp.sudah_dilimpahkan,lp.dilimpahkan_eksternal from bdb_lp_pelimpahan p left join bdb_laporan_polisi lp on lp.id=p.lp_id where p.satker_asal_nama ilike '%KUTAI%BARAT%' or p.satker_tujuan_nama ilike '%KUTAI%BARAT%' or lp.no_laporan ilike '%KUTAI%BARAT%' order by p.id desc limit 80`);
 console.log(JSON.stringify({transfers:transfers.rows}));
 const candidates=await c.query(`select id,dors_lp_id,no_laporan,tgl_laporan,satker_nama,unit_satker_nama,sudah_dilimpahkan,dilimpahkan_eksternal from bdb_laporan_polisi where no_laporan ilike '%KUTAI%BARAT%' and no_laporan ~* '/0*[67]/' order by id desc limit 80`);
 console.log(JSON.stringify({candidates:candidates.rows}));
 const jobs=await c.query(`select id,status,started_at::text,finished_at::text,total_fetched,total_upserted from bdb_dors_sync_log order by id desc limit 3`);
 console.log(JSON.stringify({jobs:jobs.rows}));
 }finally{await c.end();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
