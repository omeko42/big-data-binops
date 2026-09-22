const fs=require('fs');
const path=require('path');
const root=process.argv[2];
const base=process.argv[3];
const listOld='laporan-list-numbering-ba7ce8518953.js';
const listNew=process.argv[5];
if(!listNew)throw new Error('list candidate filename is required');
const detailOld='lp-external-history-20260904.js';
const detailNew=process.argv[4];
if(!detailNew)throw new Error('detail candidate filename is required');
const outChunks=path.join(root,'.next/static/chunks');
const outServer=path.join(root,'.next/server/app/cms/laporan-polisi');
fs.mkdirSync(outChunks,{recursive:true});
fs.mkdirSync(path.join(outServer,'[id]'),{recursive:true});
fs.copyFileSync(path.join(root,'.next/static/chunks',listOld),path.join(outChunks,listNew));
fs.copyFileSync(path.join(root,'.next/static/chunks',detailOld),path.join(outChunks,detailNew));
function manifest(rel,oldName,newName){
  const source=fs.readFileSync(path.join(base,rel),'utf8');
  if(!source.includes(oldName))throw new Error(`missing ${oldName} in ${rel}`);
  fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true});
  fs.writeFileSync(path.join(root,rel),source.split(oldName).join(newName));
}
manifest('.next/server/app/cms/laporan-polisi/page_client-reference-manifest.js',listOld,listNew);
manifest('.next/server/app/cms/laporan-polisi/[id]/page_client-reference-manifest.js',detailOld,detailNew);
for(const rel of [
  '.next/server/app/cms/laporan-polisi.rsc',
  '.next/server/app/cms/laporan-polisi.segments/cms/laporan-polisi/__PAGE__.segment.rsc',
  '.next/server/app/cms/laporan-polisi.segments/_full.segment.rsc',
  '.next/server/app/cms/laporan-polisi.html',
]){
  manifest(rel,listOld,listNew);
}
console.log(JSON.stringify({listNew,detailNew}));
