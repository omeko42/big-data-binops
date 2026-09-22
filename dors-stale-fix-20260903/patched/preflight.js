const fs=require('fs'), path=require('path'), Module=require('module');
const {DataSource}=require('/usr/src/app/node_modules/typeorm');
function loadService(name) {
 const filename='/usr/src/app/dist/bdb/'+name+'/'+name+'.service.js';
 const mod=new Module(filename,module);mod.filename=filename;mod.paths=Module._nodeModulePaths(path.dirname(filename));
 const original=mod.require.bind(mod);
 mod.require=(id)=>id==='./sync-log.store'?require('./sync-log.store'):original(id);
 mod._compile(fs.readFileSync(path.join(__dirname,name+'.service.js'),'utf8'),filename);
 return mod.exports;
}
async function main(){
 const ds=new DataSource({type:'postgres',host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),
  username:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,
  synchronize:false,entities:[],extra:{max:1,connectionTimeoutMillis:5000,statement_timeout:10000}});
 await ds.initialize();
 let d;
 try{
  const {DorsService}=loadService('dors');
  const {LpPelimpahanService}=loadService('lp-pelimpahan');
  d=new DorsService(ds,{}, {}, {});
  await d.ensureConfigTable();
  await new LpPelimpahanService(ds,{}).ensureTable();
  const config=await d.getConfig();
  if(!config.client_id)throw new Error('Effective DORS configuration could not be read');
  const jobs=await d.syncLogs.query(`select id,status,from_date::text,to_date::text,started_at::text,finished_at::text,current_page,current_last_page from bdb_dors_sync_log order by id desc limit 4`);
  const unexpected=jobs.filter(j=>j.status==='running'&&!['461','462'].includes(String(j.id)));
  if(unexpected.length)throw new Error('Unexpected running job; deployment must wait: '+unexpected.map(j=>j.id));
  const pending=await ds.query(`select pid,state,wait_event_type,pg_blocking_pids(pid) as blocked_by,
   left(query,160) as query from pg_stat_activity where datname=current_database()
   and wait_event_type='Lock' order by query_start limit 10`);
  console.log(JSON.stringify({schema_contracts:'PASS',isolated_control_connection:'PASS',config_read:'PASS',jobs,blocked:pending},null,2));
 }finally{if(d)await d.onModuleDestroy();await ds.destroy();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});

