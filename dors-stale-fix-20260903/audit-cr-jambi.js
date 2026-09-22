const {Client}=require('pg');
const {KinerjaPerkaraService}=require('/usr/src/app/dist/bdb/kinerja-perkara/kinerja-perkara.service');
async function main(){
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,
 application_name:'codex-cr-readonly',statement_timeout:20000,options:'-c default_transaction_read_only=on'});
 await c.connect();
 try {
  let countQuery;
  const ds={query:async(sql,params=[])=>{
   if(/^\s*(create|alter)\b/i.test(sql))return [];
   if(/satker_id as sid/.test(sql)&&/count\(\*\) filter/.test(sql))countQuery={sql,params};
   return (await c.query(sql,params)).rows;
  }};
  const service=new KinerjaPerkaraService(ds,{});
  const result=await service.buildTree(undefined,process.argv[2]||'2026-01-01',process.argv[3]||'2026-09-03','both',undefined,undefined,undefined,'national',undefined,undefined,undefined,'age',['KRIMSUS']);
  let jambi;
  function walk(nodes){for(const n of nodes){if(n.nama==='POLDA JAMBI')jambi=n;walk(n.children||[]);}}
  walk(result.roots);
  if(!jambi)throw new Error('Jambi node not found');
  const ids=[];
  function collect(n){ids.push(Number(n.id));for(const child of n.children||[])collect(child);}
  collect(jambi);
  const ex=service.countExprs('both','age');
  const tail=countQuery.sql.slice(countQuery.sql.indexOf('from bdb_kinerja_perkara_snapshot')).replace(/group by satker_id\s*$/,'');
  const params=[...countQuery.params,ids];
  const cases=await c.query(`select lp_id,satker_id,tanggal_mulai_penanganan::text,tanggal_selesai::text,status_code,
   (${ex.ct}) as counted_ct,(${ex.cc_aktual}) as counted_cc_actual,(${ex.cc_tunggakan}) as counted_cc_backlog
   ${tail} and satker_id=any($${params.length}) and (${ex.cc_aktual} or ${ex.cc_tunggakan}) order by lp_id`,params);
  console.log(JSON.stringify({period:{from:result.from,to:result.to},jambi:{id:jambi.id,ct:jambi.ct,cc_aktual:jambi.cc_aktual,cc_tunggakan:jambi.cc_tunggakan,cr:jambi.cr},cases:cases.rows},null,2));
 }finally{await c.end();}
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
