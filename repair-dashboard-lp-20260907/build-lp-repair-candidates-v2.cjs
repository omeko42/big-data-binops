const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'lp-repair-candidate');
fs.mkdirSync(path.join(out, 'src', 'bdb', 'laporan-polisi'), { recursive: true });

function exact(text, pattern, replacement, label) {
  const matches = text.match(pattern) || [];
  if (matches.length !== 1) throw new Error(`${label}: expected one match, found ${matches.length}`);
  return text.replace(pattern, replacement);
}

let service = fs.readFileSync(path.join(root, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.service.ts'), 'utf8');
service = exact(
  service,
  /        functionDomain\?: string,\r?\n        organizationDomain\?: string\r?\n    \) \{/g,
  `        functionDomain?: string,\n        organizationDomain?: string,\n        search?: string,\n        level?: string,\n        model?: string,\n        status?: string\n    ) {`,
  'stats signature'
);
service = exact(
  service,
  /\r?\n        \/\/ tgl_laporan tersimpan sebagai TEXT:\r?\n/g,
  `\n        // Statistik dan tabel Daftar LP harus memakai filter dasar yang sama.\n        // Subquery status membuat predicate aman dipakai juga di query per-status.\n        if (search) {\n            params.push(\`%\${search}%\`);\n            where.push(\`(lp.no_laporan ilike $\${params.length} or lp.satker_nama ilike $\${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike $\${params.length}))\`);\n        }\n        if (level) {\n            params.push(level);\n            where.push(\`lp.penanganan_level = $\${params.length}\`);\n        }\n        if (model) {\n            params.push(model);\n            where.push(\`lp.model_lp = $\${params.length}\`);\n        }\n        if (status) {\n            params.push(status);\n            where.push(\`coalesce((select sm.code from bdb_status_master sm where sm.id=lp.status_id),'LP') = $\${params.length}\`);\n        }\n\n        // tgl_laporan tersimpan sebagai TEXT:\n`,
  'stats shared filters'
);

let controller = fs.readFileSync(path.join(root, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.controller.ts'), 'utf8');
controller = exact(
  controller,
  /        @Query\('functionDomain'\) functionDomain\?: string,\r?\n        @Query\('organizationDomain'\) organizationDomain\?: string\r?\n/g,
  `        @Query('functionDomain') functionDomain?: string,\n        @Query('organizationDomain') organizationDomain?: string,\n        @Query('search') search?: string,\n        @Query('level') level?: string,\n        @Query('model') model?: string,\n        @Query('status') status?: string\n`,
  'stats controller params'
);
controller = exact(
  controller,
  /            functionDomain,\r?\n            organizationDomain\r?\n        \);/g,
  `            functionDomain,\n            organizationDomain,\n            search,\n            level,\n            model,\n            status\n        );`,
  'stats controller call'
);

let frontend = fs.readFileSync(path.join(root, '.next', 'static', 'chunks', 'laporan-list-numbering-ba7ce8518953.js'), 'utf8');
const changes = [
  ['onChange:e=>{ep(e.value),ex(0)},placeholder:"Semua model"', 'onChange:e=>{ep(e.value),ex(0),eSetAP(t=>({...t,model:e.value}))},placeholder:"Semua model"', 'model'],
  ['onChange:e=>{eSetFD(e.value),ex(0)},placeholder:"Semua cakupan"', 'onChange:e=>{eSetFD(e.value),ex(0),eSetAP(t=>({...t,functionDomain:e.value}))},placeholder:"Semua cakupan"', 'domain'],
  ['onChange:e=>{es(e.value),ex(0)},placeholder:"Semua satker"', 'onChange:e=>{es(e.value),ex(0),eSetAP(t=>({...t,level:e.value}))},placeholder:"Semua satker"', 'level'],
  ['onChange:e=>{ec(e.value),ex(0)},placeholder:"Semua status"', 'onChange:e=>{ec(e.value),ex(0),eSetAP(t=>({...t,status:e.value}))},placeholder:"Semua status"', 'status'],
  ['value:em,onChange:e=>{ef(e.target.value),ex(0)},title:"Tanggal LP dari"', 'value:em,onChange:e=>{ef(e.target.value),ex(0),eSetAP(t=>({...t,from:e.target.value}))},title:"Tanggal LP dari"', 'from'],
  ['value:eg,onChange:e=>{ey(e.target.value),ex(0)},title:"Tanggal LP sampai"', 'value:eg,onChange:e=>{ey(e.target.value),ex(0),eSetAP(t=>({...t,to:e.target.value}))},title:"Tanggal LP sampai"', 'to'],
  ['params:{...eAP.from?{from:eAP.from}:{},...eAP.to?{to:eAP.to}:{},...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{}}', 'params:{...eAP.level?{level:eAP.level}:{},...eAP.model?{model:eAP.model}:{},...eAP.status?{status:eAP.status}:{},...eAP.from?{from:eAP.from}:{},...eAP.to?{to:eAP.to}:{},...eAP.search?{search:eAP.search}:{},...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{}}', 'stats params']
];
for (const [from, to, label] of changes) {
  const count = frontend.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one anchor, found ${count}`);
  frontend = frontend.replace(from, to);
}

const serviceOut = path.join(out, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.service.ts');
const controllerOut = path.join(out, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.controller.ts');
const frontendOut = path.join(out, 'laporan-list-filter-repaired-20260907.js');
fs.writeFileSync(serviceOut, service);
fs.writeFileSync(controllerOut, controller);
fs.writeFileSync(frontendOut, frontend);

const statsWindow = frontend.slice(frontend.indexOf('/bdb/laporan-polisi/stats') - 500, frontend.indexOf('/bdb/laporan-polisi/stats') + 1400);
const checks = {
  serviceStatsFilters: ['search?: string', 'level?: string', 'model?: string', 'status?: string', 'Subquery status'].every(x => service.includes(x)),
  controllerStatsFilters: ["@Query('search')", "@Query('level')", "@Query('model')", "@Query('status')"].every(x => controller.includes(x)),
  frontendImmediateHandlers: (frontend.match(/eSetAP\(t=>\(\{\.\.\.t,/g) || []).length === 6,
  frontendStatsMatchesList: ['eAP.level', 'eAP.model', 'eAP.status', 'eAP.search'].every(x => statsWindow.includes(x)),
  monitoringUiAbsent: !frontend.includes('target_satker_id')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`verification failed: ${name}`);
console.log(JSON.stringify({ ok: true, out, checks }, null, 2));
