const fs = require('fs');
const path = require('path');

const root = __dirname;
const replacements = [
    {
        file: path.join(root, 'static', '144-jsrepw95l.js'),
        old: 'let n=[e.unit_nama,e.satker_nama].map(e=>(e||"").trim()).filter(Boolean).join(" ");return',
        next: 'let n=(e.unit_satker_nama||[e.unit_nama,e.satker_nama].map(e=>(e||"").trim()).filter(Boolean).join(" ")).trim();return'
    },
    {
        file: path.join(root, 'ssr', 'app_cms_laporan-polisi_page_tsx_18fssj0._.js'),
        old: 'let c=[a.unit_nama,a.satker_nama].map(a=>(a||"").trim()).filter(Boolean).join(" ");return',
        next: 'let c=(a.unit_satker_nama||[a.unit_nama,a.satker_nama].map(a=>(a||"").trim()).filter(Boolean).join(" ")).trim();return'
    }
];

for (const replacement of replacements) {
    const source = fs.readFileSync(replacement.file, 'utf8');
    const oldCount = source.split(replacement.old).length - 1;
    const newCount = source.split(replacement.next).length - 1;
    if (oldCount === 0 && newCount === 1) {
        console.log(`already patched ${replacement.file}`);
        continue;
    }
    if (oldCount !== 1 || newCount !== 0) {
        throw new Error(`${replacement.file}: expected old=1/new=0 or old=0/new=1, got old=${oldCount}/new=${newCount}`);
    }
    fs.writeFileSync(replacement.file, source.replace(replacement.old, replacement.next));
    const verified = fs.readFileSync(replacement.file, 'utf8');
    if (verified.includes(replacement.old) || !verified.includes(replacement.next)) {
        throw new Error(`${replacement.file}: replacement verification failed`);
    }
    console.log(`patched ${replacement.file}`);
}

const displayName = (row) => (row.unit_satker_nama || [row.unit_nama, row.satker_nama]
    .map((value) => (value || '').trim())
    .filter(Boolean)
    .join(' ')).trim();

if (displayName({ unit_satker_nama: 'DIT KRIMUM PAPUA TENGAH', unit_nama: 'SATLANTAS', satker_nama: 'POLDA PAPUA TENGAH' }) !== 'DIT KRIMUM PAPUA TENGAH') {
    throw new Error('mapped-unit regression case failed');
}
if (displayName({ unit_satker_nama: null, unit_nama: 'SATLANTAS', satker_nama: 'POLRES MIMIKA' }) !== 'SATLANTAS POLRES MIMIKA') {
    throw new Error('legacy fallback regression case failed');
}
console.log('display-name regression checks passed');
