'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),Module=require('module'),fs=require('fs'),path=require('path'),{Client}=require('pg');
function load(source){const filename='/usr/src/app/dist/bdb/satker-eksternal/satker-eksternal.service.js';const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));m._compile(source,filename);return m.exports.SatkerEksternalService;}
const Service=process.env.VERIFY_LIVE==='1'?require('/usr/src/app/dist/bdb/satker-eksternal/satker-eksternal.service').SatkerEksternalService:load(fs.readFileSync(path.join(__dirname,'satker-eksternal.service.js'),'utf8'));
test('Paged query uses bounded LIMIT/OFFSET, stable ordering, and bound search parameters',async()=>{
 const queries=[];const s=new Service({query:async(sql,p)=>{queries.push({sql,p:[...p]});return sql.includes('count(*)')?[{total:101}]:[{id:1}];}});
 const r=await s.list("DLHK' OR 1=1 --",2,25);assert.equal(r.total,101);assert.equal(r.total_page,5);assert.deepEqual(queries[1].p,["%DLHK' OR 1=1 --%",25,25]);assert.ok(!queries[1].sql.includes("OR 1=1"));assert.match(queries[1].sql,/order by nama,id limit/);
});
test('Invalid and oversized paging is normalized, with legacy picker compatibility',async()=>{
 const q=[];const s=new Service({query:async(sql,p)=>{q.push({sql,p:[...p]});return sql.includes('count(*)')?[{total:0}]:[];}});
 for(const [page,row,ep,er]of [[-1,1000,1,100],['bad','bad',1,25],[1,0.1,1,1],[2,0,2,25],[Infinity,Infinity,1,25]]){const r=await s.list('',page,row);assert.equal(r.page,ep);assert.equal(r.row,er);assert.equal(r.total_page,0);}
 q.length=0;const legacy=await s.list('Siber');assert.deepEqual(legacy,{status:1,data:[]});assert.equal(q.length,1);assert.ok(!q[0].sql.includes('limit'));
});
test('TypeScript and runtime list implementations produce identical results and queries',async()=>{
 const ts=require('typescript');const Source=load(ts.transpileModule(fs.readFileSync(path.join(__dirname,'satker-eksternal.service.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,experimentalDecorators:true,emitDecoratorMetadata:true}}).outputText);
 const run=async(C)=>{const queries=[];const s=new C({query:async(q,p)=>{queries.push([q,[...p]]);return q.includes('count(*)')?[{total:50}]:[];}});return{result:await s.list('DLHK',2,25),queries};};
 assert.deepEqual(await run(Service),await run(Source));
});
test('Live read-only pages are limited, disjoint and search counts are accurate',async()=>{
 const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-external-pagination-test',statement_timeout:10000,options:'-c default_transaction_read_only=on'});await c.connect();
 try{const s=new Service({query:async(q,p)=>(await c.query(q,p)).rows});const a=await s.list('',1,25),b=await s.list('',2,25),d=await s.list('DLHK',1,25);assert.equal(a.data.length,25);assert.equal(b.data.length,25);assert.equal(a.total,b.total);assert.ok(a.data.every(x=>!b.data.some(y=>y.id===x.id)));const exact=await c.query("select count(*)::int total from bdb_satker_eksternal where nama ilike '%DLHK%' or alamat ilike '%DLHK%' or keterangan ilike '%DLHK%'");assert.equal(d.total,exact.rows[0].total);assert.ok(d.data.length<=25);console.log(JSON.stringify({total:a.total,pageSize:a.row,searchTotal:d.total}));}finally{await c.end();}
});

