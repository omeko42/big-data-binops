const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, 'candidate', 'kinerja-external-20260904.js');
const output = path.join(__dirname, 'kinerja-default-previous-month-20260906.js');
let source = fs.readFileSync(input, 'utf8');

const before = '[el,es]=(0,t.useState)(U(new Date((e=new Date).getFullYear(),0,1))),[eo,ed]=(0,t.useState)(U(new Date))';
const after = '[el,es]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),e.getMonth()-1,1))}),[eo,ed]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),e.getMonth(),0))})';
const count = source.split(before).length - 1;
if (count !== 1) throw new Error(`Expected one Kinerja date-state group, found ${count}`);
source = source.replace(before, after);

const checks = {
  previousMonthStart: source.includes('e.getMonth()-1,1'),
  previousMonthEnd: source.includes('e.getMonth(),0'),
  noYearToDateDefault: !source.includes(before),
  appliedRangeStillUsesState: source.includes('from:el,to:eo,mode:ec'),
  externalColumnPreserved: source.includes('limpah_eksternal'),
  nationalScopePreserved: source.includes('kCanRefresh?"national":"scoped"'),
  newCrFormulaPreserved: source.includes('CR Baru = (CC Aktual + CC Tunggakan) / (CT + CC Tunggakan)')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`Failed: ${name}`);

function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const september = new Date(2026, 8, 6);
const sampleRange = `${ymd(new Date(september.getFullYear(), september.getMonth() - 1, 1))}..${ymd(new Date(september.getFullYear(), september.getMonth(), 0))}`;
const january = new Date(2027, 0, 5);
const januaryRange = `${ymd(new Date(january.getFullYear(), january.getMonth() - 1, 1))}..${ymd(new Date(january.getFullYear(), january.getMonth(), 0))}`;
if (sampleRange !== '2026-08-01..2026-08-31') throw new Error(`September boundary failed: ${sampleRange}`);
if (januaryRange !== '2026-12-01..2026-12-31') throw new Error(`January boundary failed: ${januaryRange}`);

fs.writeFileSync(output, source);
console.log(JSON.stringify({ output, bytes: Buffer.byteLength(source), sampleRange, januaryRange, ...checks }, null, 2));
