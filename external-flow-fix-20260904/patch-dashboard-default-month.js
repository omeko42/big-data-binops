const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'dashboard-kinerja-metrics-20260905.js');
const output = path.join(__dirname, 'dashboard-default-month-20260905.js');
let source = fs.readFileSync(input, 'utf8');

const before = '[Y,X]=(0,a.useState)("tahun")';
const after = '[Y,X]=(0,a.useState)("bulan")';
const count = source.split(before).length - 1;
if (count !== 1) throw new Error(`Expected one default-period state, found ${count}`);
source = source.replace(before, after);

const checks = {
  defaultMonth: source.includes(after),
  noDefaultYear: !source.includes(before),
  yearChoicePreserved: source.includes('{label:"Tahun Ini",value:"tahun"}'),
  customChoicePreserved: source.includes('{label:"Rentang Kustom",value:"custom"}'),
  ctUsesKinerja: source.includes('label:"CT — Crime Total",value:J?"…":z(i?.ct??0)'),
  ccUsesKinerja: source.includes('z((i?.cc_aktual??0)+(i?.cc_tunggakan??0))'),
  crUsesKinerja: source.includes('`${(i?.cr??0).toFixed(2)}%`'),
  responsiveSorotanPreserved: !source.includes('gridTemplateColumns:"repeat(3,minmax(0,1fr))"')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`Failed: ${name}`);

fs.writeFileSync(output, source);
console.log(JSON.stringify({ output, bytes: Buffer.byteLength(source), ...checks }, null, 2));
