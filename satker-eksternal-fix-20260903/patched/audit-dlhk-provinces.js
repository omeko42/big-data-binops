'use strict';
const {Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-dlhk-province-audit',statement_timeout:10000,options:'-c default_transaction_read_only=on'});await c.connect();try{
const columns=await c.query("select table_name,column_name,data_type,is_nullable,column_default from information_schema.columns where table_schema='public' and table_name in ('cm_provinsi','bdb_satker_eksternal') order by table_name,ordinal_position");
const provinces=await c.query('select code,name,status_aktif,status from cm_provinsi order by code');
const existing=await c.query("select id,nama,alamat,keterangan from bdb_satker_eksternal where nama ilike '%DLHK%' or nama ilike '%Lingkungan Hidup%' or nama ilike '%Kehutanan%' order by nama,id");
const provincial=existing.rows.filter(x=>/provinsi|prov\./i.test(x.nama+' '+(x.keterangan||''))||!/(kabupaten|kota) /i.test(x.nama));
const domains=await c.query("select function_domain,organization_domain,count(*)::int total from bdb_satker_eksternal where nama ilike 'Dinas Lingkungan Hidup dan Kehutanan (DLHK)%' group by function_domain,organization_domain");
const provinceExamples=await c.query("select nama,keterangan from bdb_satker_eksternal where nama ilike '% - Provinsi %' order by id limit 3");
console.log(JSON.stringify({provinces:provinces.rows,provinceRelated:provincial,domains:domains.rows,provinceExamples:provinceExamples.rows},null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.message);process.exitCode=1;});
