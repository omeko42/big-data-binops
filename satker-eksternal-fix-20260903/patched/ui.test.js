'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('vm'),fs=require('fs'),path=require('path');
function mount(){
 const entries=[],context={TURBOPACK:entries};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'satker-eksternal-paged-20260903.js'),'utf8'),context);
 let component,cursor=0,hooks=[],effects=[],requests=[];
 const same=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
 const react={
  useState:(init)=>{const i=cursor++;if(!hooks[i])hooks[i]={value:init};return[hooks[i].value,v=>{hooks[i].value=typeof v==='function'?v(hooks[i].value):v;}];},
  useRef:(init)=>{const i=cursor++;if(!hooks[i])hooks[i]={ref:{current:init}};return hooks[i].ref;},
  useCallback:(fn,deps)=>{const i=cursor++;if(!hooks[i]||!same(deps,hooks[i].deps))hooks[i]={fn,deps};return hooks[i].fn;},
  useEffect:(fn,deps)=>{const i=cursor++;if(!hooks[i]||!same(deps,hooks[i].deps)){const old=hooks[i];hooks[i]={deps};effects.push(()=>{old?.cleanup?.();hooks[i].cleanup=fn();});}}
 };
 const jsx={jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
 const api={apiAuth:{get:(url,opts)=>new Promise((resolve,reject)=>requests.push({url,opts,resolve,reject}))},assertOk:x=>x};
 const generic=new Proxy({},{get:(_,p)=>String(p)});
 const entry=entries.find(x=>x.includes(76446)),index=entry.indexOf(76446);
 entry[index+1]({i:id=>id===71645?react:id===43476?jsx:id===54858?api:id===71326?{confirmAction:async()=>false}:generic,s:items=>{component=items[2];}});
 let tree;
 const render=()=>{cursor=0;tree=component();const run=effects;effects=[];run.forEach(x=>x());return tree;};
 const walk=(type,node)=>{if(!node||typeof node!=='object')return null;if(node.type===type)return node;if(Array.isArray(node)){for(const n of node){const r=walk(type,n);if(r)return r;}}else return walk(type,node.props?.children);return null;};
 const find=type=>walk(type,tree);
 const flush=async()=>{await new Promise(resolve=>setImmediate(resolve));render();};
 return{render,find,requests,flush};
}
test('Typing does not fetch; Cari applies query; pagination, response races and page clamp work',async()=>{
 const app=mount();app.render();assert.equal(app.requests.length,1);assert.equal(app.requests[0].opts.params.row,25);
 app.requests[0].resolve({data:{data:[{id:1,nama:'A'}],total:80}});await app.flush();
 const input=app.find('InputText');input.props.onChange({target:{value:'DLHK'}});app.render();assert.equal(app.requests.length,1);
 app.find('InputText').props.onKeyDown({key:'Enter',preventDefault(){}});app.render();assert.equal(app.requests.length,2);assert.equal(app.requests[1].opts.params.search,'DLHK');
 app.find('InputText').props.onChange({target:{value:'Siber'}});app.render();assert.equal(app.requests.length,2);app.find('InputText').props.onKeyDown({key:'Enter',preventDefault(){}});app.render();assert.equal(app.requests.length,3);
 app.requests[2].resolve({data:{data:[{id:30,nama:'Siber'}],total:80}});await app.flush();app.requests[1].resolve({data:{data:[{id:20,nama:'stale'}],total:90}});await app.flush();assert.equal(app.find('DataTable').props.value[0].id,30);
 let dt=app.find('DataTable');assert.equal(dt.props.lazy,true);assert.equal(dt.props.paginator,true);assert.equal(dt.props.totalRecords,80);dt.props.onPage({page:1,rows:25});app.render();assert.equal(app.requests[3].opts.params.page,2);
 app.requests[3].resolve({data:{data:[],total:10}});await app.flush();assert.equal(app.requests[4].opts.params.page,1);assert.equal(app.requests[4].opts.params.search,'Siber');
});
