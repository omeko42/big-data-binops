'use strict';
const {Client}=require('pg');
const {LaporanPolisiService}=require('/usr/src/app/dist/bdb/laporan-polisi/laporan-polisi.service');
(async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-ika-access-readonly',statement_timeout:15000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{
 for(const simulated of [false,true]){
 const ds={query:async(sql,args=[])=>{const rows=(await c.query(sql,args)).rows;if(simulated&&sql==='select role_bdb, role_name, scope_satker_id from auth_users where id=$1'&&Number(args[0])===16391)return rows.map(r=>({...r,scope_satker_id:20164}));return rows;}};
 const service=new LaporanPolisiService(ds,{});
 for(const filter of [{},{functionDomain:'INTERNAL_RESERSE',organizationDomain:'INTERNAL_POLRI'}]){
 const r=await service.list({page:1,row:1,...filter},16391);console.log(JSON.stringify({mode:simulated?'read-only simulated correct link':'current account',filter,total:r.total,status:r.status}));
 }
 }
 }finally{await c.end();}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});

