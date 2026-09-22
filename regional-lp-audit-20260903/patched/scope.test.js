'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('path'),fs=require('fs'),Module=require('module');
const helper=require(process.env.VERIFY_LIVE==='1'?'/usr/src/app/dist/bdb/common/lp-scope.util.js':'./lp-scope.util');
const ds={query:async(q,p)=>{assert.equal(q,'select id from bdb_satker where id=$1');return [100,101,102,200,201].includes(p[0])?[{id:p[0]}]:[];}};
test('Operational Satreskrim scope is exact and cannot expand to Polsek or siblings',async()=>{
 assert.deepEqual(await helper.operationalLpScopeIds(ds,100),[100]);
 assert.equal(await helper.hasOperationalLpAccess(ds,{satker_id:200,unit_satker_id:201},100),false);
 assert.equal(await helper.hasOperationalLpAccess(ds,{satker_id:200,unit_satker_id:201},201),true);
});
test('DORS destination unit preserves Narkoba and PPA/PPO ownership separately from Reskrim',async()=>{
 for(const unit of [100,101,102])for(const actor of [100,101,102,201])
  assert.equal(await helper.hasOperationalLpAccess(ds,{satker_id:200,unit_satker_id:unit},actor),unit===actor);
});
test('Invalid/nonexistent scopes fail closed; territorial fallback and string IDs remain compatible',async()=>{
 for(const root of [null,undefined,0,-1,1.5,NaN,Infinity,'bad',999])assert.deepEqual(await helper.operationalLpScopeIds(ds,root),[]);
 assert.equal(await helper.hasOperationalLpAccess(ds,{satker_id:200,unit_satker_id:null},200),true);
 assert.equal(helper.effectiveLpOwnerId({satker_id:200,unit_satker_id:'101'}),101);
 assert.equal(helper.effectiveLpScopeSql('lp','$2'),'coalesce(lp.unit_satker_id, lp.satker_id) = $2');
});
test('Source/runtime parity',async()=>{
 let compiler;try{compiler=require('typescript');}catch{return;}
 const source=process.env.VERIFY_LIVE==='1'?'/usr/src/app/src/bdb/common/lp-scope.util.ts':path.join(__dirname,'lp-scope.util.ts');
 const out=compiler.transpileModule(fs.readFileSync(source,'utf8'),{compilerOptions:{module:compiler.ModuleKind.CommonJS,target:compiler.ScriptTarget.ES2020}}).outputText;
 const mod=new Module(__filename,module);mod._compile(out,__filename);
 for(const root of [100,101,201,999,-1])assert.deepEqual(await mod.exports.operationalLpScopeIds(ds,root),await helper.operationalLpScopeIds(ds,root));
});
