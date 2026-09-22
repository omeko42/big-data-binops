'use strict';
const fs=require('fs'),crypto=require('crypto'),path=require('path'),Module=require('module'),assert=require('node:assert/strict');
const dir='/tmp/final-regions-repair-v2-20260903';fs.mkdirSync(dir,{recursive:true,mode:0o700});
const pairs=['08','09','10','11'].map(x=>['060.01.18.02.'+x,'060.01.18.14']);
const previous=[['060.01.13.15.16','060.01.13.23'],['060.01.25.18.01','060.01.25.25'],['060.01.25.18.05','060.01.25.25'],['060.01.25.18.08','060.01.25.25']];
const files=[['dist','js','44c69789ccf1abcec0d2a6a7016e84a242d38ba89cc599f7c81ae18a0c066d60'],['src','ts','72f7405382c7dfaac95a29d708c6ba74f7c6db69cd8d6a959d54669fd815ee0d']];
const result=[];
for(const [tree,ext,expected]of files){
 const source=`/usr/src/app/${tree}/bdb/satker/satker.service.${ext}`,body=fs.readFileSync(source,'utf8');
 assert.equal(crypto.createHash('sha256').update(body).digest('hex'),expected,'Live baseline changed');
 const anchor=ext==='js'?'const hierarchyParentOverrides = new Map([':'const hierarchyParentOverrides = new Map<string, string>([';
 assert.equal(body.split(anchor).length,2);for(const [child]of pairs)assert.equal(body.includes(`['${child}',`),false,'Override already exists');
 const addition='\n            // Kubu Raya: retain historic identifiers while using the current territorial parent.\n'+pairs.map(([a,b])=>`            ['${a}', '${b}'],`).join('\n');
 const next=body.replace(anchor,anchor+addition);fs.writeFileSync(`${dir}/satker.service.${ext}`,next,{mode:0o600});
 result.push({file:`satker.service.${ext}`,before:expected,after:crypto.createHash('sha256').update(next).digest('hex')});
}
const real='/usr/src/app/dist/bdb/satker/satker.service.js';
function compile(text){const m=new Module(real,module);m.filename=real;m.paths=Module._nodeModulePaths(path.dirname(real));m._compile(text,real);return m.exports.SatkerService;}
async function check(Service){
 const all=[...pairs,...previous],codes=new Set(['060.01.18','060.01.18.02','060.01.18.14','060.01.13','060.01.13.15','060.01.25','060.01.25.18','060.01.18.14.101','060.01.18.14.101.06']);
 for(const [child,parent]of all){codes.add(child);codes.add(parent);codes.add(child+'.06');}
 const rows=[...codes].map((kode_canonical,i)=>({id:i+2,kode_canonical})),ids=new Map(rows.map(r=>[r.kode_canonical,r.id])),updates=new Map();let cleared=false;
 const mock=Object.create(Service.prototype);mock.ensureTable=async()=>{};mock.ensureRoot=async()=>1;mock.kinerjaPerkaraService={clearCache(){cleared=true;}};
 mock.dataSource={query:async(q,p=[])=>{if(q==='select id, kode_canonical from bdb_satker where is_synthetic=false')return rows;if(q.startsWith('update bdb_satker s set parent_id=v.pid')){for(let i=0;i<p.length-1;i+=4)updates.set(p[i],{parent:p[i+1],depth:p[i+2],parentKey:p[i+3]});return [];}throw Error('Unexpected test query');}};
 await mock.rebuildHierarchy();for(const [child,parent]of all){assert.equal(updates.get(ids.get(child)).parent,ids.get(parent));assert.equal(updates.get(ids.get(child+'.06')).parent,ids.get(child));}
 assert.equal(updates.get(ids.get('060.01.18.14.101')).parent,ids.get('060.01.18.14'));assert.equal(updates.get(ids.get('060.01.18.14.101.06')).parent,ids.get('060.01.18.14.101'));assert.equal(cleared,true);
}
(async()=>{await check(compile(fs.readFileSync(`${dir}/satker.service.js`,'utf8')));const ts=require('typescript');await check(compile(ts.transpileModule(fs.readFileSync(`${dir}/satker.service.ts`,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true,emitDecoratorMetadata:true}}).outputText));console.log(JSON.stringify({staged:true,runtimeHierarchyTest:true,sourceHierarchyTest:true,previousRegionalFixesPreserved:true,files:result},null,2));})().catch(e=>{console.error(e.stack);process.exitCode=1;});
