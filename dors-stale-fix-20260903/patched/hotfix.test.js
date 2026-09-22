const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('/usr/src/app/node_modules/typescript');
const root = __dirname;
const quiet = { warn() {}, log() {}, error() {} };

function loadService(name, overrides = {}) {
  const filename = '/usr/src/app/dist/bdb/' + name + '/' + name + '.service.js';
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = (id) => {
    if (Object.hasOwn(overrides, id)) return overrides[id];
    if (id === './sync-log.store') return require(path.join(root, 'sync-log.store.js'));
    return original(id);
  };
  mod._compile(fs.readFileSync(path.join(root, name + '.service.js'), 'utf8'), filename);
  return mod.exports;
}
const { DorsService } = loadService('dors');
const { LpPelimpahanService } = loadService('lp-pelimpahan');
const { SyncLogStore } = require('./sync-log.store');
const makeDors = () => {
  const ds = { query: async () => { throw new Error('shared pool must not be used'); } };
  const d = new DorsService(ds, {}, { mapFromDors: async () => ({data:{mapped_baru:0}}) }, {syncPopulasiWilayahDariDors:async()=>{}});
  d.logger = quiet;
  return d;
};
const transient = () => new Error('timeout exceeded when trying to connect');

test('workflow access remains enforced without ALTER TABLE', async () => {
  let allow = true;
  const { WorkflowService } = loadService('workflow', {
    '../common/scope.util': {resolveScope:async()=>({all:false,satkerId:99})},
    '../common/lp-scope.util': {hasOperationalLpAccess:async()=>allow},
  });
  const calls = [];
  const service = new WorkflowService({query:async(sql)=>{calls.push(sql);return [{satker_id:99,unit_satker_id:null,dilimpahkan_eksternal:false}];}}, {}, {});
  await service.assertLpAccess(123, 1);
  allow = false;
  await assert.rejects(service.assertLpAccess(123, 1), /bukan/);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(q => /^select /i.test(q)));
});
test('external-transfer access is still denied', async () => {
  const { WorkflowService } = loadService('workflow', {
    '../common/scope.util': {resolveScope:async()=>({all:false,satkerId:99})},
    '../common/lp-scope.util': {hasOperationalLpAccess:async()=>true},
  });
  const service = new WorkflowService({query:async()=>[{satker_id:99,dilimpahkan_eksternal:true}]}, {}, {});
  await assert.rejects(service.assertLpAccess(123, 1), /bukan/);
});
test('pelimpahan schema check is read-only and single-flight', async () => {
  const calls = [];
  const service = new LpPelimpahanService({query:async(q)=>{calls.push(q);return [];}}, {});
  await Promise.all(Array.from({length:15},()=>service.ensureTable()));
  assert.equal(calls.length,3);
  assert.ok(calls.every(q=>/^select /i.test(q)));
});
test('failed pelimpahan schema validation can retry', async () => {
  let calls=0;
  const service = new LpPelimpahanService({query:async()=>{if (++calls===1) throw transient();return [];}}, {});
  await assert.rejects(service.ensureTable());
  await service.ensureTable();
  assert.equal(calls,4);
});
test('DORS config validation uses isolated read-only single-flight path', async () => {
  const d=makeDors(), calls=[];
  d.syncLogStore={query:async(q)=>{calls.push(q);return [];}};
  await Promise.all(Array.from({length:15},()=>d.ensureConfigTable()));
  assert.equal(calls.length,2);
  assert.ok(calls.every(q=>/^select /i.test(q)));
});
test('control pool reuses primary identity including hidden password and SSL', async () => {
  const primary={host:'db-test',user:'same-user',database:'same-db',ssl:{rejectUnauthorized:true},max:8};
  Object.defineProperty(primary,'password',{value:'test-only-password',enumerable:false});
  let options;
  const store = new SyncLogStore({driver:{master:{options:primary}}}, quiet, async()=>{}, o=>{
    options=o;return {on(){},query:async()=>({rows:[]}),end:async()=>{}};
  });
  await store.query('select 1');
  assert.equal(options.password,primary.password);
  assert.equal(options.host,primary.host);
  assert.equal(options.user,primary.user);
  assert.equal(options.database,primary.database);
  assert.equal(options.ssl,primary.ssl);
  assert.equal(options.max,2);
  assert.equal(options.statement_timeout,10000);
  await store.close();
});
test('transient status errors retry; permanent SQL errors do not', async () => {
  let count=0;
  const store=new SyncLogStore({},quiet,async()=>{});
  store.pool={query:async()=>{if(++count<3) throw transient();return {rows:[{ok:true}]};}};
  assert.deepEqual(await store.query('select 1'),[{ok:true}]);
  assert.equal(count,3);
  count=0;
  store.pool.query=async()=>{count++;throw Object.assign(new Error('invalid column'),{code:'42703'});};
  await assert.rejects(store.query('select bad'));
  assert.equal(count,1);
});
test('job INSERT is not blindly retried after an uncertain response', async () => {
  let count=0;
  const store=new SyncLogStore({},quiet,async()=>{});
  store.pool={query:async()=>{count++;throw transient();}};
  await assert.rejects(store.query('insert test',[],false));
  assert.equal(count,1);
});
test('progress writes are ordered even when A/B update together', async () => {
  const store=new SyncLogStore({},quiet,async()=>{});
  const order=[];
  let release;
  store.pool={query:async(sql)=>{order.push(sql);if(sql==='A')await new Promise(r=>release=r);return {rows:[]};}};
  const a=store.progress('A',[]), b=store.progress('B',[]);
  await new Promise(r=>setImmediate(r));
  assert.deepEqual(order,['A']);
  release();
  await Promise.all([a,b]);
  assert.deepEqual(order,['A','B']);
});
test('progress counters are saved along with checkpoint', async () => {
  const d=makeDors();
  let saved;
  d.syncLogStore={progress:async(sql,params)=>{saved={sql,params};}};
  await d.persistProgress(462,[{status:'done',fetched:50,upserted:2},{status:'running',fetched:100,upserted:3}],{attempt:1,current_page:2});
  assert.match(saved.sql,/total_fetched=\$11/);
  assert.equal(saved.params[10],150);
  assert.equal(saved.params[11],5);
});
test('concurrent starts admit only one job before asynchronous config read', async () => {
  const d=makeDors();
  let release;
  d.getConfig=()=>new Promise(r=>release=r);
  d.syncLogStore={query:async()=>[{id:900}]};
  const first=d.beginSync('2026-02-26','2026-02-27');
  const second=await d.beginSync('2026-02-26','2026-02-27');
  assert.equal(second.ok,false);
  release({client_id:'test-only',sync_days_back:1});
  assert.equal((await first).ok,true);
});
test('failed start releases admission guard', async () => {
  const d=makeDors();
  d.getConfig=async()=>({client_id:'test-only'});
  d.syncLogStore={query:async()=>{throw transient();}};
  await assert.rejects(d.beginSync());
  assert.equal(d.syncing,false);
});
test('failed job retains guard until final error is successfully persisted', async () => {
  const d=makeDors();
  let writes=0;
  const store=new SyncLogStore({},quiet,async()=>{assert.equal(d.syncing,true);});
  store.pool={query:async(sql)=>{writes++;assert.match(sql,/status='error'/);if(writes<6)throw transient();return {rows:[]};}};
  d.syncLogStore=store;
  d.syncing=true;
  d.runSyncJob=async()=>{throw transient();};
  const result=await d.finishSyncJob(462,{data_scope:'OPERASIONAL'},'2026-02-26','2026-02-27','test',Date.now());
  assert.equal(result.status,0);
  assert.equal(writes,6);
  assert.equal(d.syncing,false);
});
test('successful sync finalization uses isolated store', async () => {
  const d=makeDors();let final;
  d.syncing=true;
  d.runSyncJob=async()=>({allDone:true,totalFetched:100,totalNew:0,states:[],stoppedReason:null,attempt:1});
  d.syncLogStore={terminal:async(sql,params)=>{final=params;}};
  const result=await d.finishSyncJob(462,{data_scope:'OPERASIONAL'},'2026-02-26','2026-02-27','test',Date.now());
  assert.equal(result.status,1);assert.equal(final[1],'success');assert.equal(d.syncing,false);
});
test('failed page insert does not increase fetched count', async () => {
  const d=makeDors();
  d.fetchPageWithRetry=async()=>({last_page:1,total:1,data:[{}]});
  d.insertNewRows=async()=>{throw transient();};
  const state={model:'lp_model_a',last_success_page:0,upserted:0,fetched:0,ms:0};
  await d.runOneSourceAttempt({}, {},'2026-02-26','2026-02-27','OPERASIONAL','test',state,async()=>{});
  assert.equal(state.fetched,0);assert.equal(state.last_success_page,0);assert.equal(state.status,'error');
});
function members(code) {
  const source=ts.createSourceFile('service.js',code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  let found;
  function visit(n){if(ts.isClassDeclaration(n)||ts.isClassExpression(n)){found=n;return;}ts.forEachChild(n,visit);}
  visit(source);
  return new Map(found.members.filter(m=>m.name).map(m=>[m.name.getText(source),m.getText(source)]));
}
function normalized(code){
  const s=ts.createSourceFile('member.js',code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  return ts.createPrinter({removeComments:true}).printFile(s).replace(/\s+/g,'').replace(/DorsService_1/g,'DorsService');
}
test('changed source methods and deployed JavaScript have identical compiled logic',()=>{
  const selection={
    dors:['onModuleDestroy','syncLogs','ensureConfigTable','getConfig','cleanupOrphanedSyncJobs','persistProgress','runOneSourceAttempt','beginSync','finishSyncJob','getSyncJobStatus','recentLogs'],
    workflow:['assertLpAccess'],
    'lp-pelimpahan':['ensureTable'],
  };
  for(const [name,methods] of Object.entries(selection)){
    const src=ts.transpileModule(fs.readFileSync(path.join(root,name+'.service.ts'),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2023,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:true,removeComments:true}}).outputText;
    const left=members(src),right=members(fs.readFileSync(path.join(root,name+'.service.js'),'utf8'));
    for(const method of methods)assert.equal(normalized(left.get(method)),normalized(right.get(method)),name+'.'+method);
  }
});

