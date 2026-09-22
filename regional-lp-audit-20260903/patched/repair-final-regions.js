'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{Client}=require('pg');
const apply=process.argv.includes('--apply'),dir='/tmp/final-regions-repair-v2-20260903',action='FINAL_REGIONS_REPAIRED_V2_20260903';
const parentIds=[11786,11789,11792,11795],disabledIds=[12641,12643,11792,11794];
const merges=[[12641,12643,19870,20901,25,'POLSEK ALALAK','POLRES BARITO KUALA'],[11792,11794,21027,21028,6,'POLSEK KUBU','POLRES KUBU RAYA']];
const aliasesPlan=[
 [null,'POLSEK ALALAK','POLRES BARITO KUALA',null,19870],
 [null,'POLSEK BERANGAS','POLRES BARITO KUALA',null,19870],
 ['060.01.19.10.07','POLSEK ALALAK','POLRES BARITO KUALA','RESKRIM',20901],
 ['060.01.19.10.07','POLSEK BERANGAS','POLRES BARITO KUALA','RESKRIM',20901],
 [null,'POLSEK TELUK PAKEDAI','POLRES KUBU RAYA',null,11786],
 [null,'POLSEK TERENTANG','POLRES KUBU RAYA',null,11789],
 [null,'POLSEK KUBU','POLRES KUBU RAYA',null,21027],
 ['060.01.18.02.10','POLSEK KUBU','POLRES KUBU RAYA','RESKRIM',21028],
 [null,'POLSEK BATU AMPAR','POLRES KUBU RAYA',null,11795]
];
const note='Approved final regional correction 20260903; metadata only; current parent and account destination verified';
(async()=>{const c=new Client({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||5432),user:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,database:process.env.DB_DATABASE,application_name:'codex-approved-final-regions-repair',statement_timeout:30000,lock_timeout:5000,...(!apply?{options:'-c default_transaction_read_only=on'}:{})});await c.connect();let tx=false;try{
 if(apply){await c.query('begin');tx=true;await c.query('select pg_advisory_xact_lock(20260903,2101)');}
 assert.equal((await c.query("select id from bdb_dors_sync_log where status='running'")).rowCount,0,'DORS job active; defer');
 assert.equal((await c.query('select id from bdb_audit_log where action=$1 limit 1',[action])).rowCount,0,'Already applied; use verification');
 const allIds=[11757,12282,12615,11786,11788,11789,11791,11792,11794,11795,11797,12641,12643,19870,20901,21027,21028];
 const nodes=(await c.query('select id,kode,kode_canonical,deskripsi,parent_id,parent_kode,root_id,depth,tipe_satker,kinerja_aktif,dors_mapping_aktif,pelimpahan_target_aktif,function_domain,organization_domain from bdb_satker where id=any($1) order by id'+(apply?' for update':''),[allIds])).rows;
 const node=id=>{const n=nodes.find(n=>Number(n.id)===id);assert.ok(n,'Missing node '+id);return n;};
 for(const id of parentIds){assert.equal(Number(node(id).parent_id),11757);assert.equal(node(id).tipe_satker,'POLSEK');}
 assert.equal(node(12282).deskripsi,'POLRES KUBU RAYA');assert.equal(node(12282).kode_canonical,'060.01.18.14');assert.equal(node(19870).deskripsi,'POLSEK ALALAK');assert.equal(node(21027).deskripsi,'POLSEK KUBU');
 assert.equal(Number(node(19870).parent_id),12615);assert.equal(Number(node(12641).parent_id),12615);assert.equal(Number(node(21027).parent_id),12282);
 for(const id of [21027,21028]){assert.equal(node(id).function_domain,null);assert.equal(node(id).organization_domain,null);}
 const accounts=(await c.query('select id,role_bdb,role_name,scope_satker_id,scope_satker_key,requested_scope_satker_id,requested_scope_satker_key from auth_users where scope_satker_id=any($1) or requested_scope_satker_id=any($1) order by id'+(apply?' for update':''),[allIds])).rows;
 assert.ok(accounts.every(a=>!disabledIds.includes(Number(a.scope_satker_id))&&!disabledIds.includes(Number(a.requested_scope_satker_id))),'Legacy account references: re-audit');
 assert.equal(Number(accounts.find(a=>Number(a.id)===15845)?.scope_satker_id),20901);assert.equal(Number(accounts.find(a=>Number(a.id)===14320)?.scope_satker_id),21028);
 const columns=(await c.query("select table_name,column_name from information_schema.columns where table_schema='public' and data_type in ('bigint','integer') and column_name like '%satker%id' and table_name not in ('bdb_satker_profiles','bdb_satker_master','bdb_laporan_polisi','bdb_kinerja_perkara_snapshot','bdb_dors_satker_map') and column_name not in ('satker_master_id','satker_eksternal_id')")).rows;
 for(const x of columns)assert.equal((await c.query(`select 1 from "${x.table_name}" where "${x.column_name}"=any($1) limit 1`,[disabledIds])).rowCount,0,'Unexpected reference '+x.table_name+'.'+x.column_name);
 const lps=(await c.query('select lp.id,lp.satker_id,lp.satker_nama,lp.unit_satker_id,lp.unit_satker_nama,lp.unit_satker_kode from bdb_laporan_polisi lp where lp.satker_id=any($1) or lp.unit_satker_id=any($1) order by lp.id'+(apply?' for update of lp':''),[disabledIds])).rows;
 assert.equal(lps.length,31,'LP count changed: re-audit');const ids=lps.map(l=>l.id);
 assert.equal((await c.query("select lp.id from bdb_laporan_polisi lp where lp.id=any($1) and (lp.deleted_at is not null or coalesce(lp.sudah_dilimpahkan,false) or coalesce(lp.dilimpahkan_eksternal,false) or lower(coalesce(lp.payload_json#>>'{_cas_owner_override,locked}',''))='true' or exists(select 1 from bdb_lp_pelimpahan h where h.lp_id=lp.id))",[ids])).rowCount,0,'Protected ownership must not change');
 for(const [old,oldUnit,target,unit,count,name,parent]of merges){
  assert.equal(Number(node(oldUnit).parent_id),old);assert.equal(Number(node(unit).parent_id),target);
  const subset=lps.filter(l=>Number(l.satker_id)===old&&Number(l.unit_satker_id)===oldUnit);assert.equal(subset.length,count);
  const r=await c.query("select count(*)::int n from bdb_laporan_polisi lp join bdb_dors_raw_lp r on r.dors_lp_id=lp.dors_lp_id and r.model_lp=lp.model_lp where lp.id=any($1) and upper(trim(r.payload_json#>>'{polsek,nama}'))=$2 and upper(trim(r.payload_json#>>'{polres,nama}'))=$3 and upper(trim(r.payload_json#>>'{unit,unit}'))='RESKRIM' and lower(r.payload_json#>>'{unit,level}')='polsek'",[subset.map(l=>l.id),name,parent]);assert.equal(r.rows[0].n,count,'Source address mismatch');
 }
 const snapshot=(await c.query('select lp_id,satker_id from bdb_kinerja_perkara_snapshot where lp_id=any($1) order by lp_id'+(apply?' for update':''),[ids])).rows;assert.equal(snapshot.length,31);
 for(const s of snapshot)assert.equal(String(s.satker_id),String(lps.find(l=>String(l.id)===String(s.lp_id)).unit_satker_id));
 const aliases=[];for(const [kp,name,parent,unit]of aliasesPlan){const rows=(await c.query("select id,dors_kode_pusiknas,dors_nama,dors_parent_nama,unit_nama,satker_id,satker_nama,catatan from bdb_dors_satker_map where coalesce(dors_kode_pusiknas,'')=coalesce($1,'') and lower(dors_nama)=lower($2) and lower(coalesce(dors_parent_nama,''))=lower(coalesce($3,'')) and lower(coalesce(unit_nama,''))=lower(coalesce($4,''))"+(apply?' for update':''),[kp,name,parent,unit])).rows;aliases.push(...rows);}
 const summary={dryRun:!apply,parentCorrections:parentIds,mergeCounts:merges.map(([from,oldUnit,to,unit,count])=>({from,to,unit,count})),inactiveLegacyNodes:disabledIds,aliases:aliasesPlan.length,taxonomyCorrections:[21027,21028],accountScopesUnchanged:true,caseContentAndStatusUntouched:true};
 if(!apply){console.log(JSON.stringify(summary,null,2));return;}
 fs.mkdirSync(dir,{recursive:true,mode:0o700});fs.writeFileSync(dir+'/data-before.json',JSON.stringify({capturedAt:new Date().toISOString(),nodes,accounts,lps,snapshot,aliases},null,2),{mode:0o600,flag:'wx'});
 const parent=node(12282);for(const id of parentIds)assert.equal((await c.query('update bdb_satker set parent_id=12282,parent_kode=$1,root_id=$2,depth=$3,updated_at=now() where id=$4 and parent_id=11757',[parent.kode_canonical,parent.root_id,Number(parent.depth)+1,id])).rowCount,1);
 for(const [id,domain]of [[21027,'STRUCTURAL'],[21028,'INTERNAL_RESERSE']])assert.equal((await c.query("update bdb_satker set organization_domain='INTERNAL_POLRI',function_domain=$1,updated_at=now() where id=$2 and organization_domain is null and function_domain is null",[domain,id])).rowCount,1);
 for(const [old,oldUnit,target,unit,count]of merges){const subset=lps.filter(l=>Number(l.satker_id)===old).map(l=>l.id);assert.equal((await c.query('update bdb_laporan_polisi set satker_id=$1,satker_nama=$2,unit_satker_id=$3,unit_satker_nama=$4,unit_satker_kode=$5,updated_at=now() where id=any($6) and satker_id=$7 and unit_satker_id=$8',[target,node(target).deskripsi,unit,node(unit).deskripsi,node(unit).kode,subset,old,oldUnit])).rowCount,count);assert.equal((await c.query('select count(*)::int n from bdb_kinerja_perkara_snapshot where lp_id=any($1) and satker_id=$2',[subset,unit])).rows[0].n,count,'Snapshot trigger consistency');}
 assert.equal((await c.query('update bdb_satker set kinerja_aktif=false,dors_mapping_aktif=false,pelimpahan_target_aktif=false,updated_at=now() where id=any($1)',[disabledIds])).rowCount,4);
 const changedAliases=[];for(const [kp,name,parent,unit,target]of aliasesPlan){const r=await c.query("insert into bdb_dors_satker_map(dors_kode_pusiknas,dors_nama,dors_parent_nama,unit_nama,satker_id,satker_nama,catatan) values($1,$2,$3,$4,$5,$6,$7) on conflict(coalesce(dors_kode_pusiknas,''),lower(dors_nama),lower(coalesce(dors_parent_nama,'')),lower(coalesce(unit_nama,''))) do update set satker_id=excluded.satker_id,satker_nama=excluded.satker_nama,catatan=excluded.catatan,updated_at=now() returning id",[kp,name,parent,unit,target,node(target).deskripsi,note]);changedAliases.push(r.rows[0].id);}
 const audit=await c.query('insert into bdb_audit_log(user_id,user_nama,action,entity,entity_id,meta,outcome) values(null,$1,$2,$3,$4,$5::jsonb,$6) returning id',['Codex (atas persetujuan pengguna)',action,'bdb_satker','final-regions-20260903',JSON.stringify({...summary,dryRun:false,changedAliases,backup:dir+'/data-before.json'}),'success']);
 await c.query('commit');tx=false;console.log(JSON.stringify({...summary,dryRun:false,applied:true,auditId:audit.rows[0].id,changedAliases},null,2));
}catch(e){if(tx)await c.query('rollback');throw e;}finally{await c.end();}})().catch(e=>{console.error(e.stack);process.exitCode=1;});
