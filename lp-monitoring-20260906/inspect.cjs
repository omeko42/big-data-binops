const {Client}=require('pg');
async function main(){
 const db=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE});
 await db.connect();
 try{
  await db.query('begin read only');
  const queries={
   tables:`select table_name from information_schema.tables where table_schema='public' and (table_name like '%mapping%' or table_name like '%taxonomy%' or table_name like '%golongan%') order by 1`,
   columns:`select table_name,column_name,data_type from information_schema.columns where table_schema='public' and table_name in ('bdb_satker','cm_jenis_kejahatan','bdb_kinerja_ppappo_crime_mapping','bdb_kinerja_crime_group_mapping','bdb_operasi_satgas') order by table_name,ordinal_position`,
   groups:`select distinct fungsi,sub_domain,operational_role from bdb_satker order by 1,2,3`,
   mapping:`select ck.id,ck.keterangan,m.kelompok from cm_jenis_kejahatan ck left join bdb_kinerja_crime_group_mapping m on m.jenis_kejahatan_id=ck.id and m.active=true where ck.keterangan ~* '(siber|cyber|data pribadi|narkot|psikot)' order by ck.id`,
   aceh:`select id,deskripsi,parent_id,tipe_satker,fungsi,sub_domain,operational_role,function_domain,dors_mapping_aktif,pelimpahan_target_aktif from bdb_satker where id in (24,33,18823,18824,18825,143,145,18748,151,153) or sub_domain ilike '%PPA%' limit 35`,
  };
  for(const [name,sql] of Object.entries(queries)) console.log(JSON.stringify({name,rows:(await db.query(sql)).rows}));
 }finally{await db.query('rollback');await db.end();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
