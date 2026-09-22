const fs = require('fs');
const src = process.argv[2];
const dst = process.argv[3];
let s = fs.readFileSync(src, 'utf8');

function once(from, to, label) {
  const at = s.indexOf(from);
  if (at < 0) throw new Error(`anchor missing: ${label}`);
  if (s.indexOf(from, at + 1) >= 0) throw new Error(`anchor not unique: ${label}`);
  s = s.slice(0, at) + to + s.slice(at + from.length);
}

once('onChange:e=>{ep(e.value),ex(0)},placeholder:"Semua model"', 'onChange:e=>{ep(e.value),ex(0),eSetAP(t=>({...t,model:e.value}))},placeholder:"Semua model"', 'model filter');
once('onChange:e=>{eSetFD(e.value),ex(0)},placeholder:"Semua cakupan"', 'onChange:e=>{eSetFD(e.value),ex(0),eSetAP(t=>({...t,functionDomain:e.value}))},placeholder:"Semua cakupan"', 'scope filter');
once('onChange:e=>{es(e.value),ex(0)},placeholder:"Semua satker"', 'onChange:e=>{es(e.value),ex(0),eSetAP(t=>({...t,level:e.value}))},placeholder:"Semua satker"', 'level filter');
once('onChange:e=>{ec(e.value),ex(0)},placeholder:"Semua status"', 'onChange:e=>{ec(e.value),ex(0),eSetAP(t=>({...t,status:e.value}))},placeholder:"Semua status"', 'status filter');
once('value:em,onChange:e=>{ef(e.target.value),ex(0)},title:"Tanggal LP dari"', 'value:em,onChange:e=>{ef(e.target.value),ex(0),eSetAP(t=>({...t,from:e.target.value}))},title:"Tanggal LP dari"', 'from date');
once('value:eg,onChange:e=>{ey(e.target.value),ex(0)},title:"Tanggal LP sampai"', 'value:eg,onChange:e=>{ey(e.target.value),ex(0),eSetAP(t=>({...t,to:e.target.value}))},title:"Tanggal LP sampai"', 'to date');

fs.writeFileSync(dst, s);
console.log(JSON.stringify({ ok: true, bytes: s.length, output: dst }));
