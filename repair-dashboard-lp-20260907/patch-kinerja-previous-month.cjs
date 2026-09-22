const fs = require('fs');

const src = process.argv[2];
const dst = process.argv[3];
if (!src || !dst) throw new Error('usage: node patch-kinerja-previous-month.cjs SOURCE DEST');
let source = fs.readFileSync(src, 'utf8');

const before = '[el,es]=(0,t.useState)(U(new Date((e=new Date).getFullYear(),0,1))),[eo,ed]=(0,t.useState)(U(new Date))';
const after = '[el,es]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),e.getMonth()-1,1))}),[eo,ed]=(0,t.useState)(()=>{let e=new Date;return U(new Date(e.getFullYear(),e.getMonth(),0))})';
const count = source.split(before).length - 1;
if (count !== 1) throw new Error(`expected one Kinerja date-state group, found ${count}`);
source = source.replace(before, after);

const checks = {
  previousMonthStart: source.includes('e.getMonth()-1,1'),
  previousMonthEnd: source.includes('e.getMonth(),0'),
  noYearToDateDefault: !source.includes(before),
  initialAppliedRangeUsesState: source.includes('from:el,to:eo,mode:ec'),
  applyButtonUsesExactState: source.includes('eSetAP({from:el,to:eo,mode:ec'),
  currentScopePreserved: source.includes('visibility:kCanRefresh?eAP.scope:void 0'),
  monitoringUiAbsent: !source.includes('target_satker_id')
};
for (const [name, ok] of Object.entries(checks)) if (!ok) throw new Error(`verification failed: ${name}`);

fs.writeFileSync(dst, source);
console.log(JSON.stringify({ ok: true, output: dst, bytes: Buffer.byteLength(source), checks }, null, 2));
