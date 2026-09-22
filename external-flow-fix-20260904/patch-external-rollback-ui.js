const fs = require('fs');

const input = process.argv[2];
const output = process.argv[3] || input;
let source = fs.readFileSync(input, 'utf8');

if (source.includes('Kembalikan ke Satker Polri')) {
  throw new Error(`Already patched: ${input}`);
}

const functionAnchor = '}finally{a4(!1)}}}let tj="cms-card";';
const functionReplacement = '}finally{a4(!1)}}}async function tR(){if(!E||!H?.dilimpahkan_eksternal)return;let e=Number(H.unit_satker_id||H.satker_id);if(!e)return void U.current?.show({severity:"error",summary:"Gagal",detail:"Satker asal Polri tidak ditemukan. Rollback dibatalkan agar data tidak salah tujuan."});if(await (0,R.confirmAction)("Kembalikan penanganan LP ini dari instansi eksternal ke satker Polri asal? Isi kasus dan status penanganan tidak akan diubah.",{header:"Rollback Pelimpahan Eksternal",danger:!0,acceptLabel:"Ya, Kembalikan"})){a4(!0);try{let t=await L.apiAuth.post(`/bdb/laporan-polisi/${E}/correct-satker`,{satker_id:e,keterangan:"Rollback pelimpahan eksternal oleh superadmin"});U.current?.show({severity:"success",summary:"Dikembalikan",detail:t.data?.message||"LP dikembalikan ke satker Polri asal.",life:6e3}),await a9()}catch(e){U.current?.show({severity:"error",summary:"Gagal",detail:e.response?.data?.message||"Gagal mengembalikan LP ke satker Polri."})}finally{a4(!1)}}}let tj="cms-card";';

const buttonAnchor = '(0,a.jsxs)(l.Button,{severity:"warning",onClick:ty,disabled:!E,className:"att-btn",children:[(0,a.jsx)(C,{size:15,style:{marginRight:"0.4rem"}})," Pelimpahan"]}),(0,a.jsxs)(l.Button,{severity:"help",onClick:tf,disabled:!E,className:"att-btn",children:[(0,a.jsx)(W.Building2,{size:15,style:{marginRight:"0.4rem"}})," Limpahkan ke Instansi Eksternal"]})';
const buttonReplacement = 'e1.isSuperadmin&&H?.dilimpahkan_eksternal&&(0,a.jsxs)(l.Button,{severity:"secondary",onClick:tR,loading:a8,disabled:!E,className:"att-btn",children:[(0,a.jsx)(C,{size:15,style:{marginRight:"0.4rem"}})," Kembalikan ke Satker Polri"]}),(0,a.jsxs)(l.Button,{severity:"warning",onClick:ty,disabled:!E||H?.dilimpahkan_eksternal,className:"att-btn",children:[(0,a.jsx)(C,{size:15,style:{marginRight:"0.4rem"}})," Pelimpahan"]}),(0,a.jsxs)(l.Button,{severity:"help",onClick:tf,disabled:!E||H?.dilimpahkan_eksternal,className:"att-btn",children:[(0,a.jsx)(W.Building2,{size:15,style:{marginRight:"0.4rem"}})," Limpahkan ke Instansi Eksternal"]})';

function replaceExactlyOnce(anchor, replacement, label) {
  const first = source.indexOf(anchor);
  const last = source.lastIndexOf(anchor);
  if (first < 0 || first !== last) {
    throw new Error(`${label} anchor count is not exactly one in ${input}`);
  }
  source = source.slice(0, first) + replacement + source.slice(first + anchor.length);
}

replaceExactlyOnce(functionAnchor, functionReplacement, 'function');
replaceExactlyOnce(buttonAnchor, buttonReplacement, 'button');

const irreversible = 'Tindakan ini tidak bisa dibatalkan.';
if (!source.includes(irreversible)) {
  throw new Error(`Irreversible warning anchor missing in ${input}`);
}
source = source.replace(
  irreversible,
  'Jika salah tujuan, superadmin dapat mengembalikannya ke satker Polri asal.'
);

fs.writeFileSync(output, source);
console.log(JSON.stringify({
  patched: true,
  input,
  output,
  rollbackEndpoint: source.includes('/correct-satker'),
  superadminGate: source.includes('e1.isSuperadmin&&H?.dilimpahkan_eksternal'),
  preservesCaseStatusCopy: source.includes('Isi kasus dan status penanganan tidak akan diubah.'),
}));
