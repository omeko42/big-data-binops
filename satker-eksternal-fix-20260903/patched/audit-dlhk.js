'use strict';
const {Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-dlhk-readonly',statement_timeout:10000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const r=await c.query("select id,nama,alamat,keterangan from bdb_satker_eksternal where nama ilike '%DLHK%' or nama ilike '%Lingkungan Hidup%' order by nama,id");
 const wrong=r.rows.filter(x=>/Lingkungan Hidup dan Kebersihan/i.test(x.nama));
 const province=r.rows.filter(x=>/provinsi|prov\./i.test(x.nama));
 console.log(JSON.stringify({matched:r.rowCount,renameCount:wrong.length,examples:wrong.slice(0,5).map(x=>({id:x.id,nama:x.nama})),provinceEntries:province.map(x=>({id:x.id,nama:x.nama}))}));
 const total=await c.query('select count(*)::int total from bdb_satker_eksternal');console.log(JSON.stringify({total:total.rows[0].total}));
 }finally{await c.end();}})().catch(e=>{console.error(e.message);process.exitCode=1;});

