'use strict';
const {Client}=require('pg');
(async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-ika-scope-readonly',statement_timeout:15000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const schema=await c.query("select column_name from information_schema.columns where table_schema='public' and table_name='auth_users'");
 const available=new Set(schema.rows.map(r=>r.column_name));
 const names=['name','nama','full_name','fullname','display_name','first_name','last_name','username'].filter(x=>available.has(x));
 if(!names.length)throw new Error('No known account name fields');
 const fields=['id',...names,'role_bdb','role_name','scope_satker_id','is_active','active'].filter(x=>available.has(x));
 const match=names.map(x=>'coalesce("'+x+'",\'\')').join(" || ' ' || ");
 const users=await c.query('select '+fields.map(x=>'"'+x+'"').join(',')+' from auth_users where ('+match+") ilike '%ika%' and (("+match+") ilike '%rez%' or ("+match+") ilike '%resk%' or ("+match+") ilike '%riz%') limit 15");
 console.log(JSON.stringify({users:users.rows}));
 const units=await c.query("select id,kode,deskripsi,parent_id,tipe_satker from bdb_satker where deskripsi ilike '%MAKASSAR%' and (deskripsi ilike '%NARKO%' or deskripsi ilike '%RESTABES%') order by id");
 console.log(JSON.stringify({units:units.rows}));
 const scopeIds=users.rows.map(x=>x.scope_satker_id).filter(Boolean);
 if(scopeIds.length){const s=await c.query('select id,kode,deskripsi,parent_id,tipe_satker from bdb_satker where id=any($1)',[scopeIds]);console.log(JSON.stringify({accountScopes:s.rows}));}
 const ids=[...new Set([...scopeIds,...units.rows.map(x=>x.id)])];
 if(ids.length){const r=await c.query("select satker_id,satker_nama,unit_satker_id,unit_satker_nama,count(*)::int total,count(*) filter(where deleted_at is null and not coalesce(dilimpahkan_eksternal,false))::int active from bdb_laporan_polisi where satker_id=any($1) or unit_satker_id=any($1) group by satker_id,satker_nama,unit_satker_id,unit_satker_nama order by total desc limit 50",[ids]);console.log(JSON.stringify({placementCounts:r.rows}));}
 }finally{await c.end();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});

