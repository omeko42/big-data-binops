'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{Client}=require('pg');
const apply=process.argv.includes('--apply');
const dir='/tmp/regional-master-repair-20260903';
const parentChanges=[[6371,6318,6878],[15379,15371,15667],[15391,15371,15667],[15400,15371,15667]];
const disabledIds=[15512,15514,15541,15543];
const aliasPlans=[
 [null,'POLSEK RANTEPAO','POLRES TORAJA UTARA',null,15379],
 [null,'POLSEK SANGGALANGI','POLRES TORAJA UTARA',null,15391],
 [null,'POLSEK SESEAN','POLRES TORAJA UTARA',null,15400],
 [null,'POLSEK LAPRI','POLRES BONE',null,20246],
 ['060.01.25.20.19','POLSEK LAPRI','POLRES BONE','RESKRIM',20950],
 [null,'POLSEK PITUMPANUA','POLRES WAJO',null,20254],
 ['060.01.25.21.01','POLSEK URBAN PITUMPANUA','POLRES WAJO','RESKRIM',20952]
];
const accountCols='id,role_bdb,role_name,scope_satker_id,scope_satker_key,requested_scope_satker_id,requested_scope_satker_key';
const lpCols='lp.id,lp.satker_id,lp.satker_nama,lp.unit_satker_id,lp.unit_satker_nama,lp.unit_satker_kode,lp.updated_at';
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-approved-regional-address-repair',statement_timeout:30000,lock_timeout:5000,...(!apply?{options:'-c default_transaction_read_only=on'}:{})});await c.connect();let tx=false;try{
 if(apply){await c.query('begin');tx=true;await c.query('select pg_advisory_xact_lock(20260903,1701)');}
 assert.equal((await c.query("select id from bdb_dors_sync_log where status='running'")).rowCount,0,'DORS job active; defer repair');
 const prior=await c.query("select id from bdb_audit_log where action='REGIONAL_MASTER_REPAIRED_20260903' limit 1");if(prior.rowCount){if(tx){await c.query('rollback');tx=false;}console.log(JSON.stringify({alreadyApplied:true,auditId:prior.rows[0].id}));return;}
 const allIds=[...new Set(parentChanges.flat().concat(disabledIds,[20246,20950,20254,20952,11716,19785]))];
 const nodes=(await c.query('select * from bdb_satker where id=any($1) order by id'+(apply?' for update':''),[allIds])).rows;
 const node=id=>{const n=nodes.find(n=>Number(n.id)===id);assert.ok(n,'Missing satker '+id);return n;};
 for(const [id,old,target]of parentChanges){assert.equal(Number(node(id).parent_id),old);assert.equal(node(id).tipe_satker,'POLSEK');assert.equal(node(target).tipe_satker,'POLRES');}
 assert.equal(node(20254).deskripsi,'POLSEK URBAN PITUMPANUA');assert.equal(Number(node(20952).parent_id),20254);assert.equal(Number(node(15541).parent_id),Number(node(20254).parent_id));
 assert.equal(node(20246).deskripsi,'POLSEK LAPPARIAJA');assert.equal(Number(node(20950).parent_id),20246);assert.equal(Number(node(15512).parent_id),Number(node(20246).parent_id));
 assert.equal(Number(node(11716).parent_id),Number(node(19785).parent_id));assert.equal(node(19785).deskripsi,'SAT NARKOBA RESTA PONTIANAK');
 const account=(await c.query(`select ${accountCols} from auth_users where id=15597`+(apply?' for update':''))).rows[0];assert.equal(Number(account.scope_satker_id),11716);assert.equal(account.role_bdb,'operator');assert.equal(Number(account.requested_scope_satker_id),11716);
 const lps=(await c.query(`select ${lpCols} from bdb_laporan_polisi lp where lp.satker_id=15541 or lp.unit_satker_id=15543 order by lp.id`+(apply?' for update of lp':''))).rows;
 assert.equal(lps.length,56,'Unexpected Pitumpanua row count: re-audit');for(const lp of lps){assert.equal(Number(lp.satker_id),15541);assert.equal(Number(lp.unit_satker_id),15543);}
 const ids=lps.map(l=>l.id);
 const protectedRows=await c.query("select lp.id from bdb_laporan_polisi lp where lp.id=any($1) and (lp.deleted_at is not null or coalesce(lp.sudah_dilimpahkan,false) or coalesce(lp.dilimpahkan_eksternal,false) or lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}',''))='true' or exists(select 1 from bdb_lp_pelimpahan h where h.lp_id=lp.id))",[ids]);assert.equal(protectedRows.rowCount,0,'Protected transfer/override: stop');
 const matched=await c.query("select count(*)::int n from bdb_laporan_polisi lp join bdb_dors_raw_lp r on r.dors_lp_id=lp.dors_lp_id and r.model_lp=lp.model_lp where lp.id=any($1) and upper(trim(r.payload_json#>>'{polsek,nama}'))='POLSEK URBAN PITUMPANUA' and r.payload_json#>>'{polsek,kode_pusiknas}'='060.01.25.21.01' and upper(trim(r.payload_json#>>'{polres,nama}'))='POLRES WAJO' and upper(trim(r.payload_json#>>'{unit,unit}'))='RESKRIM' and lower(r.payload_json#>>'{unit,level}')='polsek'",[ids]);assert.equal(matched.rows[0].n,56);
 assert.equal((await c.query('select id from bdb_laporan_polisi where satker_id=any($1) or unit_satker_id=any($1)',[[15512,15514,11716]])).rowCount,0,'Expected empty legacy masters');
 assert.equal((await c.query('select id from auth_users where scope_satker_id=any($1) or requested_scope_satker_id=any($1)',[disabledIds])).rowCount,0,'Unexpected account in duplicate master');
 assert.equal((await c.query('select id from bdb_lp_master where operational_satker_id=any($1)',[disabledIds])).rowCount,0,'Legacy operational references require review');
 const snapshot=(await c.query('select lp_id,satker_id from bdb_kinerja_perkara_snapshot where lp_id=any($1) order by lp_id'+(apply?' for update':''),[ids])).rows;assert.equal(snapshot.length,56);assert.ok(snapshot.every(s=>Number(s.satker_id)===15543));
 const aliases=(await c.query('select * from bdb_dors_satker_map where satker_id=any($1) or id=any($2) order by id',[allIds,[1513,1514]])).rows;
 const before={capturedAt:new Date().toISOString(),nodes,account,lps,snapshot,aliases};
 const summary={dryRun:!apply,parentChanges:parentChanges.map(([id,from,to])=>({id,from,to})),accountRelink:{id:15597,from:11716,to:19785},lpOwnerCorrections:lps.length,snapshotOwnerCorrections:snapshot.length,duplicateNodesDisabled:disabledIds,aliasPlans:aliasPlans.length,sensitiveCaseFieldsRead:false};
 if(!apply){console.log(JSON.stringify(summary,null,2));return;}
 fs.mkdirSync(dir,{recursive:true,mode:0o700});
 if(fs.existsSync(dir+'/data-before.json')){
  const previous=JSON.parse(fs.readFileSync(dir+'/data-before.json','utf8'));
  assert.deepEqual(previous.lps.map(l=>[l.id,l.satker_id,l.unit_satker_id]),lps.map(l=>[l.id,l.satker_id,l.unit_satker_id]),'Backup does not match current owners');
  assert.deepEqual(previous.account,account,'Account changed since saved backup');
 }else fs.writeFileSync(dir+'/data-before.json',JSON.stringify(before,null,2),{mode:0o600,flag:'wx'});
 for(const [id,old,to]of parentChanges){const n=node(to);assert.equal((await c.query('update bdb_satker set parent_id=$1,parent_kode=$2,root_id=$3,depth=$4,updated_at=now() where id=$5 and parent_id=$6',[to,n.kode_canonical,n.root_id,Number(n.depth)+1,id,old])).rowCount,1);}
 const newUnit=node(20952),newTerritory=node(20254);
 assert.equal((await c.query('update bdb_laporan_polisi set satker_id=$1,satker_nama=$2,unit_satker_id=$3,unit_satker_nama=$4,unit_satker_kode=$5,updated_at=now() where id=any($6) and satker_id=15541 and unit_satker_id=15543',[20254,newTerritory.deskripsi,20952,newUnit.deskripsi,newUnit.kode,ids])).rowCount,56);
 // The existing LP trigger may already have refreshed snapshot ownership.
 await c.query('update bdb_kinerja_perkara_snapshot set satker_id=20952 where lp_id=any($1) and satker_id=15543',[ids]);
 const correctSnapshots=await c.query('select count(*)::int n from bdb_kinerja_perkara_snapshot where lp_id=any($1) and satker_id=20952',[ids]);
 assert.equal(correctSnapshots.rows[0].n,56,'Every moved LP must have consistent snapshot ownership');
 assert.equal((await c.query('update auth_users set scope_satker_id=19785,scope_satker_key=$1,requested_scope_satker_id=19785,requested_scope_satker_key=$1,updated_at=now() where id=15597 and scope_satker_id=11716 and requested_scope_satker_id=11716',[node(19785).kode])).rowCount,1);
 assert.equal((await c.query('update bdb_satker set kinerja_aktif=false,dors_mapping_aktif=false,pelimpahan_target_aktif=false,updated_at=now() where id=any($1)',[disabledIds])).rowCount,4);
 const changedAliases=[];
 for(const [kp,name,parent,unit,target]of aliasPlans){const r=await c.query("insert into bdb_dors_satker_map(dors_kode_pusiknas,dors_nama,dors_parent_nama,unit_nama,satker_id,satker_nama,catatan) values($1,$2,$3,$4,$5,$6,$7) on conflict(coalesce(dors_kode_pusiknas,''),lower(dors_nama),lower(coalesce(dors_parent_nama,'')),lower(coalesce(unit_nama,''))) do update set satker_id=excluded.satker_id,satker_nama=excluded.satker_nama,catatan=excluded.catatan,updated_at=now() returning id",[kp,name,parent,unit,target,node(target).deskripsi,'Approved regional correction 20260903; parent + function verified; legacy IDs retained']);changedAliases.push(r.rows[0].id);}
 const audit=await c.query('insert into bdb_audit_log(user_id,user_nama,action,entity,entity_id,meta,outcome) values(null,$1,$2,$3,$4,$5::jsonb,$6) returning id',['Codex (atas persetujuan pengguna)','REGIONAL_MASTER_REPAIRED_20260903','bdb_satker','regional-20260903',JSON.stringify({...summary,changedAliases,backup:dir+'/data-before.json',caseStatusDocumentsUntouched:true}),'success']);
 await c.query('commit');tx=false;console.log(JSON.stringify({...summary,dryRun:false,applied:true,auditId:audit.rows[0].id,changedAliases,backup:dir+'/data-before.json'},null,2));
}catch(e){if(tx)await c.query('rollback');throw e;}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
