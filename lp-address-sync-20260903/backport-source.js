'use strict';
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'patched');
const js=fs.readFileSync(path.join(root,'laporan-polisi.service.js'),'utf8');
const file=path.join(root,'laporan-polisi.service.ts').replace(/\\/g,'/');
let ts=fs.readFileSync(file,'utf8');
const exe='C:/Users/KOKO98/AppData/Local/OpenAI/Codex/bin/87e5fb3433dabab1/codex.exe';
function apply(body){const r=spawnSync(exe,['--codex-run-as-apply-patch','*** Begin Patch\n*** Update File: '+file+'\n'+body+'*** End Patch'],{encoding:'utf8'});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(r.status)process.exit(r.status);}
const method=js.slice(js.indexOf('    async syncPelimpahanOwnershipFromDors()'),js.indexOf('    async mapFromDors()'));
if(!ts.includes('async syncPelimpahanOwnershipFromDors()')){
 apply('@@\n'+method.trimEnd().split('\n').map(x=>'+'+x.replace(/\r$/,'')).join('\n')+'\n     async mapFromDors() {\n');
}
ts=fs.readFileSync(file,'utf8');
const old=ts.slice(ts.indexOf('    async mapFromDors()'),ts.indexOf('    private async unmappedCount'));
const replacement=js.slice(js.indexOf('    async mapFromDors()'),js.indexOf('    async unmappedCount()')).replace(/LaporanPolisiService_1/g,'LaporanPolisiService');
apply('@@\n'+old.trimEnd().split('\n').map(x=>'-'+x.replace(/\r$/,'')).join('\n')+'\n'+replacement.trimEnd().split('\n').map(x=>'+'+x.replace(/\r$/,'')).join('\n')+'\n');

