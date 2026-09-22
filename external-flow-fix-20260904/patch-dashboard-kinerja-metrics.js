const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'dashboard-data-responsive-20260904.js');
const output = path.join(__dirname, 'dashboard-kinerja-metrics-20260905.js');
let source = fs.readFileSync(input, 'utf8');

const oldCards = '(0,t.jsx)(D,{label:"CT — Crime Total",value:J?"…":z(l?.ct??0),color:"#ef4444",bg:"#fef2f2",icon:"pi-file",note:"Total laporan polisi"}),(0,t.jsx)(D,{label:"CC — Crime Clearance",value:J?"…":z(l?.cc??0),color:"#16a34a",bg:"#f0fdf4",icon:"pi-check-circle",note:"Perkara selesai"}),(0,t.jsx)(D,{label:"CR - Clearance Rate",value:J?"…":`${l?.pct??0}%`,color:"#2563eb",bg:"#eff6ff",icon:"pi-percentage",note:"Tingkat penyelesaian"})';
const newCards = '(0,t.jsx)(D,{label:"CT — Crime Total",value:J?"…":z(i?.ct??0),color:"#ef4444",bg:"#fef2f2",icon:"pi-file",note:"Sesuai Kinerja Perkara"}),(0,t.jsx)(D,{label:"CC — Crime Clearance",value:J?"…":z((i?.cc_aktual??0)+(i?.cc_tunggakan??0)),color:"#16a34a",bg:"#f0fdf4",icon:"pi-check-circle",note:"CC Aktual + CC Tunggakan"}),(0,t.jsx)(D,{label:"CR - Clearance Rate",value:J?"…":`${(i?.cr??0).toFixed(2)}%`,color:"#2563eb",bg:"#eff6ff",icon:"pi-percentage",note:"Rumus baru Kinerja Perkara"})';

const count = source.split(oldCards).length - 1;
if (count !== 1) throw new Error(`Expected one legacy Dashboard card group, found ${count}`);
source = source.replace(oldCards, newCards);

const checks = {
  ctUsesKinerja: source.includes('label:"CT — Crime Total",value:J?"…":z(i?.ct??0)'),
  ccUsesKinerja: source.includes('z((i?.cc_aktual??0)+(i?.cc_tunggakan??0))'),
  crUsesNewKinerjaFormula: source.includes('`${(i?.cr??0).toFixed(2)}%`'),
  noLegacyHeroMetrics: !source.includes('label:"CT — Crime Total",value:J?"…":z(l?.ct??0)') && !source.includes('label:"CC — Crime Clearance",value:J?"…":z(l?.cc??0)') && !source.includes('`${l?.pct??0}%`'),
  roleScopedCallsPreserved: (source.split('e.isSuperadmin||e.isAdminBinops?"national":"scoped"').length - 1) === 3,
  responsiveSorotanPreserved: !source.includes('gridTemplateColumns:"repeat(3,minmax(0,1fr))"'),
  maxFivePreserved: source.includes('.slice(0,5)')
};
for (const [name, ok] of Object.entries(checks)) {
  if (!ok) throw new Error(`Verification failed: ${name}`);
}

fs.writeFileSync(output, source);
console.log(JSON.stringify({ output, bytes: Buffer.byteLength(source), ...checks }, null, 2));
