const fs = require('fs');
const path = require('path');

const root = __dirname;
const serviceSource = path.join(root, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.service.ts');
const controllerSource = path.join(root, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.controller.ts');
const frontendSource = path.join(root, '.next', 'static', 'chunks', 'laporan-list-numbering-ba7ce8518953.js');
const out = path.join(root, 'lp-repair-candidate');
fs.mkdirSync(path.join(out, 'src', 'bdb', 'laporan-polisi'), { recursive: true });

function replaceOnce(text, from, to, label) {
  const first = text.indexOf(from);
  if (first < 0) throw new Error(`anchor missing: ${label}`);
  if (text.indexOf(from, first + from.length) >= 0) throw new Error(`anchor not unique: ${label}`);
  return text.slice(0, first) + to + text.slice(first + from.length);
}

let service = fs.readFileSync(serviceSource, 'utf8');
service = replaceOnce(
  service,
  '        functionDomain?: string,\r\n        organizationDomain?: string\r\n    ) {',
  '        functionDomain?: string,\r\n        organizationDomain?: string,\r\n        search?: string,\r\n        level?: string,\r\n        model?: string,\r\n        status?: string\r\n    ) {',
  'stats signature'
);
service = replaceOnce(
  service,
  "\r\n        // tgl_laporan tersimpan sebagai TEXT:\r\n",
  `\r\n        // Statistik dan tabel Daftar LP harus memakai filter dasar yang sama.\r\n        // Subquery status membuat predicate aman dipakai juga di query per-status.\r\n        if (search) {\r\n            params.push(\`%\${search}%\`);\r\n            where.push(\`(lp.no_laporan ilike $\${params.length} or lp.satker_nama ilike $\${params.length} or exists (select 1 from bdb_lp_pelimpahan px where px.lp_id=lp.id and px.satker_eksternal_id is not null and px.satker_eksternal_nama ilike $\${params.length}))\`);\r\n        }\r\n        if (level) {\r\n            params.push(level);\r\n            where.push(\`lp.penanganan_level = $\${params.length}\`);\r\n        }\r\n        if (model) {\r\n            params.push(model);\r\n            where.push(\`lp.model_lp = $\${params.length}\`);\r\n        }\r\n        if (status) {\r\n            params.push(status);\r\n            where.push(\`coalesce((select sm.code from bdb_status_master sm where sm.id=lp.status_id),'LP') = $\${params.length}\`);\r\n        }\r\n\r\n        // tgl_laporan tersimpan sebagai TEXT:\r\n`,
  'stats shared filters'
);

let controller = fs.readFileSync(controllerSource, 'utf8');
controller = replaceOnce(
  controller,
  "        @Query('functionDomain') functionDomain?: string,\r\n        @Query('organizationDomain') organizationDomain?: string\r\n",
  "        @Query('functionDomain') functionDomain?: string,\r\n        @Query('organizationDomain') organizationDomain?: string,\r\n        @Query('search') search?: string,\r\n        @Query('level') level?: string,\r\n        @Query('model') model?: string,\r\n        @Query('status') status?: string\r\n",
  'stats controller params'
);
controller = replaceOnce(
  controller,
  '            functionDomain,\r\n            organizationDomain\r\n        );',
  '            functionDomain,\r\n            organizationDomain,\r\n            search,\r\n            level,\r\n            model,\r\n            status\r\n        );',
  'stats controller call'
);

let frontend = fs.readFileSync(frontendSource, 'utf8');
const frontendReplacements = [
  ['onChange:e=>{ep(e.value),ex(0)},placeholder:"Semua model"', 'onChange:e=>{ep(e.value),ex(0),eSetAP(t=>({...t,model:e.value}))},placeholder:"Semua model"', 'model'],
  ['onChange:e=>{eSetFD(e.value),ex(0)},placeholder:"Semua cakupan"', 'onChange:e=>{eSetFD(e.value),ex(0),eSetAP(t=>({...t,functionDomain:e.value}))},placeholder:"Semua cakupan"', 'domain'],
  ['onChange:e=>{es(e.value),ex(0)},placeholder:"Semua satker"', 'onChange:e=>{es(e.value),ex(0),eSetAP(t=>({...t,level:e.value}))},placeholder:"Semua satker"', 'level'],
  ['onChange:e=>{ec(e.value),ex(0)},placeholder:"Semua status"', 'onChange:e=>{ec(e.value),ex(0),eSetAP(t=>({...t,status:e.value}))},placeholder:"Semua status"', 'status'],
  ['value:em,onChange:e=>{ef(e.target.value),ex(0)},title:"Tanggal LP dari"', 'value:em,onChange:e=>{ef(e.target.value),ex(0),eSetAP(t=>({...t,from:e.target.value}))},title:"Tanggal LP dari"', 'from'],
  ['value:eg,onChange:e=>{ey(e.target.value),ex(0)},title:"Tanggal LP sampai"', 'value:eg,onChange:e=>{ey(e.target.value),ex(0),eSetAP(t=>({...t,to:e.target.value}))},title:"Tanggal LP sampai"', 'to'],
  ['params:{...eAP.from?{from:eAP.from}:{},...eAP.to?{to:eAP.to}:{},...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{}}', 'params:{...eAP.level?{level:eAP.level}:{},...eAP.model?{model:eAP.model}:{},...eAP.status?{status:eAP.status}:{},...eAP.from?{from:eAP.from}:{},...eAP.to?{to:eAP.to}:{},...eAP.search?{search:eAP.search}:{},...eAP.functionDomain?{functionDomain:eAP.functionDomain,organizationDomain:"INTERNAL_POLRI"}:{}}', 'stats params']
];
for (const [from, to, label] of frontendReplacements) frontend = replaceOnce(frontend, from, to, label);

const serviceOut = path.join(out, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.service.ts');
const controllerOut = path.join(out, 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.controller.ts');
const frontendOut = path.join(out, 'laporan-list-filter-repaired-20260907.js');
fs.writeFileSync(serviceOut, service);
fs.writeFileSync(controllerOut, controller);
fs.writeFileSync(frontendOut, frontend);

const checks = {
  serviceStatsFilters: ['search?: string', 'level?: string', 'model?: string', 'status?: string', 'Subquery status'].every(x => service.includes(x)),
  controllerStatsFilters: ["@Query('search')", "@Query('level')", "@Query('model')", "@Query('status')"].every(x => controller.includes(x)),
  frontendImmediateHandlers: (frontend.match(/eSetAP\(t=>\(\{\.\.\.t,/g) || []).length === 6,
  frontendStatsMatchesList: ['eAP.level', 'eAP.model', 'eAP.status', 'eAP.search'].every(x => frontend.slice(frontend.indexOf('/bdb/laporan-polisi/stats') - 100, frontend.indexOf('/bdb/laporan-polisi/stats') + 1200).includes(x)),
  monitoringUiAbsent: !frontend.includes('target_satker_id')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`verification failed: ${name}`);
console.log(JSON.stringify({ ok: true, out, checks }, null, 2));
