const { Client } = require('pg');
(async()=>{
  const db=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE});
  await db.connect();
  try{
    await db.query('begin read only');
    const columns=await db.query(`select table_name,column_name,data_type from information_schema.columns where table_schema='public' and table_name in ('cm_golongan_kejahatan','bdb_kasus_atensi','bdb_kasus_menonjol','bdb_kinerja_crime_group_mapping_version') order by table_name,ordinal_position`);
    console.log(JSON.stringify(columns.rows));
    await db.query('rollback');
  }finally{await db.end();}
})().catch(e=>{console.error(e.message);process.exit(1)});
