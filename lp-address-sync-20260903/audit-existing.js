'use strict';
const {Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
(async()=>{
 let sql;const s=new LaporanPolisiService({query:async(q)=>{sql=q;return [{}];}},{});await s.syncPelimpahanOwnershipFromDors();
 const prefix=sql.slice(0,sql.indexOf('locked as materialized')).replace(/,\s*$/,'');
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-address-audit-readonly',statement_timeout:30000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 const r=await c.query(prefix+` select target_unit,territory_count,unit_count,count(*)::int total from resolved_coverage group by 1,2,3 order by total desc`);
 console.log(JSON.stringify({existingResolver:r.rows}));
 const total=await c.query(`select count(*)::int changed_address,count(*) filter(where lp.deleted_at is not null or lp.sudah_dilimpahkan or lp.dilimpahkan_eksternal or lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}',''))='true' or exists(select 1 from bdb_lp_pelimpahan p where p.lp_id=lp.id))::int protected from bdb_laporan_polisi lp join bdb_dors_raw_lp r on r.id=lp.raw_lp_id where jsonb_build_array(lp.payload_json#>>'{unit,unit}',lp.payload_json#>>'{unit,level}',lp.payload_json#>>'{polda,kode_pusiknas}',lp.payload_json#>>'{polres,kode_pusiknas}',lp.payload_json#>>'{polsek,kode_pusiknas}') is distinct from jsonb_build_array(r.payload_json#>>'{unit,unit}',r.payload_json#>>'{unit,level}',r.payload_json#>>'{polda,kode_pusiknas}',r.payload_json#>>'{polres,kode_pusiknas}',r.payload_json#>>'{polsek,kode_pusiknas}')`);
 console.log(JSON.stringify({allAddressChanges:total.rows}));
 }finally{await c.end();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});

