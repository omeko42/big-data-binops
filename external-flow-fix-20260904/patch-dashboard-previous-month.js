const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'dashboard-default-month-20260905.js');
const output = path.join(__dirname, 'dashboard-default-previous-month-20260905.js');
let source = fs.readFileSync(input, 'utf8');

const before = '[Y,X]=(0,a.useState)("bulan"),[q,G]=(0,a.useState)(""),[Z,Q]=(0,a.useState)("")';
const after = '[Y,X]=(0,a.useState)("custom"),[q,G]=(0,a.useState)(()=>{let e=new Date;return N(new Date(e.getFullYear(),e.getMonth()-1,1))}),[Z,Q]=(0,a.useState)(()=>{let e=new Date;return N(new Date(e.getFullYear(),e.getMonth(),0))})';
const count = source.split(before).length - 1;
if (count !== 1) throw new Error(`Expected one current-month default state group, found ${count}`);
source = source.replace(before, after);

const checks = {
  defaultsToCustomRange: source.includes('[Y,X]=(0,a.useState)("custom")'),
  previousMonthStart: source.includes('e.getMonth()-1,1'),
  previousMonthEnd: source.includes('e.getMonth(),0'),
  noNewPreset: (source.match(/label:"Bulan Lalu"/g) || []).length === 0,
  currentMonthChoicePreserved: source.includes('{label:"Bulan Ini",value:"bulan"}'),
  yearChoicePreserved: source.includes('{label:"Tahun Ini",value:"tahun"}'),
  kinerjaMetricsPreserved: source.includes('z((i?.cc_aktual??0)+(i?.cc_tunggakan??0))'),
  responsiveSorotanPreserved: !source.includes('gridTemplateColumns:"repeat(3,minmax(0,1fr))"')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`Failed: ${name}`);

const sample = new Date(2026, 8, 5);
const previousFrom = `${new Date(sample.getFullYear(), sample.getMonth() - 1, 1).getFullYear()}-${String(new Date(sample.getFullYear(), sample.getMonth() - 1, 1).getMonth() + 1).padStart(2, '0')}-01`;
const previousEnd = new Date(sample.getFullYear(), sample.getMonth(), 0);
const previousTo = `${previousEnd.getFullYear()}-${String(previousEnd.getMonth() + 1).padStart(2, '0')}-${String(previousEnd.getDate()).padStart(2, '0')}`;
if (previousFrom !== '2026-08-01' || previousTo !== '2026-08-31') throw new Error('Previous-month boundary regression failed');

fs.writeFileSync(output, source);
console.log(JSON.stringify({ output, bytes: Buffer.byteLength(source), sampleRange: `${previousFrom}..${previousTo}`, ...checks }, null, 2));
