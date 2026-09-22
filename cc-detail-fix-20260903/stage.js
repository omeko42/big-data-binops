'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('node:assert/strict');
const dir='/tmp/cc-detail-fix-20260903';fs.mkdirSync(dir,{recursive:true,mode:0o700});
const files=[['dist','js','dbc08229df19635ba8ea911c278849b88cf13c22248bfaffcad0f6bc79f9defd'],['src','ts','fa37c2f75a83797f3c0c14009e51e33427bcb0aaeee0dd4297c0a0b2287fb451']];
const edits=[["{ key: 'sp2lid', cond: \"status_code = 'SP2_LIDIK'\" }","{ key: 'sp2lid', cond: \"status_code = 'SP2_LID'\" }"],["{ key: 'tipiring', cond: \"status_code = 'TIPIRING_PUTUSAN'\" }","{ key: 'tipiring', cond: \"status_code = 'PUTUSAN_TIPIRING'\" }"]];
const result=[];
for(const [tree,ext,expected]of files){const body=fs.readFileSync(`/usr/src/app/${tree}/bdb/kinerja-perkara/kinerja-perkara.service.${ext}`,'utf8');assert.equal(crypto.createHash('sha256').update(body).digest('hex'),expected,'Live code changed: re-audit');let next=body;for(const [old,replacement]of edits){assert.equal(next.split(old).length,2);next=next.replace(old,replacement);}fs.writeFileSync(`${dir}/before.service.${ext}`,body,{mode:0o600});fs.writeFileSync(`${dir}/kinerja-perkara.service.${ext}`,next,{mode:0o600});result.push({file:ext,changedConditions:2,hash:crypto.createHash('sha256').update(next).digest('hex')});}
console.log(JSON.stringify({staged:true,changes:result,databaseNotModified:true},null,2));
