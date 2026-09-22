const fs = require('fs');

const input = process.argv[2];
const output = process.argv[3];
let source = fs.readFileSync(input, 'utf8');

const anchor = 't&&(0,a.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:800,opacity:.75},children:"(EKSTERNAL)"})';
const replacement = 't&&(0,a.jsx)("span",{style:{fontSize:"0.68rem",fontWeight:800,opacity:.75},children:H?.dilimpahkan_eksternal?"(EKSTERNAL AKTIF)":"(RIWAYAT — SUDAH DIKEMBALIKAN)"})';
const count = source.split(anchor).length - 1;
if (count !== 1) throw new Error(`History label anchor count ${count} in ${input}`);
source = source.replace(anchor, replacement);
fs.writeFileSync(output, source);
console.log(JSON.stringify({ patched: true, activeHistorySeparated: true, input, output }));
