'use strict';
const fs=require('fs'),{Client}=require('pg');
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-regional-reference-check',statement_timeout:25000,options:'-c default_transaction_read_only=on'});await c.connect();try{
 const prev=JSON.parse(fs.readFileSync('/tmp/regional-repair-inspect-20260903.json','utf8'));
 const roots=[6371,15379,15391,15400,15512,15541];
 const tree=(await c.query('with recursive t as(select s.* from bdb_satker s where id=any($1) union all select s.* from bdb_satker s join t on s.parent_id=t.id) select * from t order by id',[roots])).rows;
 const refs=[];const oldIds=tree.filter(n=>[15512,15541].includes(Number(n.id))||[15512,15541].includes(Number(n.parent_id))).map(n=>n.id);
 for(const x of prev.columns.filter(x=>x.data_type==='bigint'&&x.column_name!=='id'&&!x.table_name.endsWith('_master')&&!['satker_eksternal_id','satker_master_id'].includes(x.column_name))){
  const q=`select "${x.column_name}" as id,count(*)::int n from "${x.table_name}" where "${x.column_name}"=any($1) group by 1`;
  try{const r=await c.query(q,[oldIds]);if(r.rowCount)refs.push({...x,counts:r.rows});}catch(e){refs.push({...x,error:e.message});}
 }
 const master=(await c.query("select id,satker_key,parent_key,grandparent_key,level,nama_satker_canonical,nama_satker_dors,nama_parent_satker_dors,nama_grandparent_satker_dors,dors_kode,manual_code,status,source_type from bdb_satker_master where nama_satker_canonical ~* 'PITUMPANUA|LAPRI|LAPPARIAJA|RANTE.?PAO|SANGGALANGI|SESEAN|PANGANDARAN|TORAJA UTARA' order by id")).rows;
 const grouped=new Map();for(const l of prev.lp){const key=JSON.stringify([l.satker_id,l.unit_satker_id,l.raw_unit,l.raw_polsek,l.raw_polres,l.raw_polda]);if(!grouped.has(key))grouped.set(key,{satker_id:l.satker_id,unit_id:l.unit_satker_id,unit:l.raw_unit,polsek:l.raw_polsek,polres:l.raw_polres,polda:l.raw_polda,total:0});grouped.get(key).total++;}
 const prefixes=['060.01.13.23.16','060.01.25.25.01','060.01.25.25.05','060.01.25.25.08'];
 const collisions=(await c.query('select id,kode,deskripsi,parent_id from bdb_satker where kode_canonical=any($1)',[prefixes])).rows;
 const columns=(await c.query("select table_name,column_name,data_type from information_schema.columns where table_schema='public' and table_name in ('bdb_kinerja_perkara_snapshot','bdb_lp_master') order by table_name,ordinal_position")).rows;
 const result={tree:tree.map(n=>({id:n.id,kode:n.kode,canonical:n.kode_canonical,name:n.deskripsi,parent:n.parent_id,active:n.kinerja_aktif,mapping:n.dors_mapping_aktif,domain:n.function_domain})),refs,master,sourceGroups:[...grouped.values()],collisions,columns};
 fs.writeFileSync('/tmp/regional-repair-references-20260903.json',JSON.stringify(result,null,2),{mode:0o600});
 console.log(JSON.stringify(result,null,2));
}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
