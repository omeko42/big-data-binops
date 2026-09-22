const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const root = __dirname;
const files = {
  dashboard: path.join(root, 'dashboard-repaired-20260907.js'),
  kinerja: path.join(root, 'kinerja-previous-month-repaired-20260907.js'),
  lp: path.join(root, 'lp-repair-candidate', 'laporan-list-filter-repaired-20260907.js'),
  lpBase: path.join(root, '.next', 'static', 'chunks', 'laporan-list-numbering-ba7ce8518953.js'),
  service: path.join(root, 'lp-repair-candidate', 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.service.ts'),
  controller: path.join(root, 'lp-repair-candidate', 'src', 'bdb', 'laporan-polisi', 'laporan-polisi.controller.ts')
};
for (const [name, file] of Object.entries(files)) if (!fs.existsSync(file)) throw new Error(`${name} missing: ${file}`);

const read = key => fs.readFileSync(files[key], 'utf8');
const dashboard = read('dashboard');
const kinerja = read('kinerja');
const lp = read('lp');
const lpBase = read('lpBase');
const service = read('service');
const controller = read('controller');

const checks = {
  dashboardDefaultPreviousMonth: dashboard.includes('[Y,X]=(0,a.useState)("custom")') && dashboard.includes('getMonth()-1,1') && dashboard.includes('getMonth(),0'),
  dashboardCustomExact: dashboard.includes('if("custom"===e)return{from:t||n,to:a||n}'),
  dashboardNationalScope: (dashboard.match(/isSuperadmin\|\|e\.isAdminBinops\?"national":"scoped"/g) || []).length === 3,
  dashboardKinerjaMetrics: dashboard.includes('z(i?.ct??0)') && dashboard.includes('z((i?.cc_aktual??0)+(i?.cc_tunggakan??0))') && dashboard.includes('`${(i?.cr??0).toFixed(2)}%`'),
  dashboardDpoComplete: dashboard.includes('[dpoRows,setDpoRows]') && dashboard.includes('keterlibatan:"DPO"') && dashboard.includes('title:"DPO"'),
  kinerjaDefaultPreviousMonth: kinerja.includes('getMonth()-1,1') && kinerja.includes('getMonth(),0') && !kinerja.includes('getFullYear(),0,1'),
  kinerjaCustomExact: kinerja.includes('eSetAP({from:el,to:eo,mode:ec'),
  lpPreservesTipiringLabel: lp.includes('"PUTUSAN_TIPIRING"===e.code?"TIPIRING"'),
  lpAllSixControlsApply: (lp.match(/eSetAP\(t=>\(\{\.\.\.t,/g) || []).length === 6,
  lpStatsUsesSameBasicFilters: ['eAP.level', 'eAP.model', 'eAP.status', 'eAP.search'].every(x => lp.slice(lp.indexOf('/bdb/laporan-polisi/stats') - 500, lp.indexOf('/bdb/laporan-polisi/stats') + 1400).includes(x)),
  lpNoMonitoringUi: !lp.includes('target_satker_id'),
  lpBasePreserved: lp.includes('functionDomain:"INTERNAL_RESERSE"') && lp.length > lpBase.length,
  backendStatsSignature: /organizationDomain\?: string,\s+search\?: string,\s+level\?: string,\s+model\?: string,\s+status\?: string/.test(service),
  backendStatsPredicates: service.includes('if (search)') && service.includes('if (level)') && service.includes('if (model)') && service.includes('if (status)'),
  controllerForwardsFilters: ["@Query('search')", "@Query('level')", "@Query('model')", "@Query('status')"].every(x => controller.includes(x))
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`FAILED: ${name}`);

const sample = new Date(2026, 0, 5);
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const januaryBoundary = `${ymd(new Date(sample.getFullYear(), sample.getMonth() - 1, 1))}..${ymd(new Date(sample.getFullYear(), sample.getMonth(), 0))}`;
if (januaryBoundary !== '2025-12-01..2025-12-31') throw new Error(`year boundary failed: ${januaryBoundary}`);

const hashes = {};
for (const key of ['dashboard', 'kinerja', 'lp', 'service', 'controller']) hashes[key] = crypto.createHash('sha256').update(read(key)).digest('hex');
console.log(JSON.stringify({ verified: true, januaryBoundary, checks, hashes }, null, 2));
