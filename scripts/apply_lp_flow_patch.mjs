import fs from 'fs';

let lpFlow = fs.readFileSync('scratch/lp-flow-perma-56d42847ec39.js', 'utf8');

// 1. tF
const oldTf = 'if(e.size>1048576)return U.current?.show({severity:"warn",summary:"Berkas terlalu besar",detail:`"${e.name}" melebihi 1 MB. Kompres atau pilih berkas lain.`,life:6e3}),null;';
const newTf = 'if(e.size>20971520)return U.current?.show({severity:"warn",summary:"Berkas terlalu besar",detail:`"${e.name}" melebihi 20 MB. Kompres atau pilih berkas lain.`,life:6e3}),null;';

if (!lpFlow.includes(oldTf)) {
    console.error('ERROR: oldTf not found!');
    process.exit(1);
}
lpFlow = lpFlow.replace(oldTf, newTf);
console.log('1. tF patched');

// 2. tM filter
const oldTmFilter = 'n=t.filter(e=>e.size>1048576),r=t.filter(e=>e.size<=1048576)';
const newTmFilter = 'n=t.filter(e=>e.size>20971520),r=t.filter(e=>e.size<=20971520)';
if (!lpFlow.includes(oldTmFilter)) {
    console.error('ERROR: oldTmFilter not found!');
    process.exit(1);
}
lpFlow = lpFlow.replace(oldTmFilter, newTmFilter);
console.log('2. tM filter patched');

// 3. tM text
const oldTmText = '${n.length} berkas melebihi 1 MB dan tidak ditambahkan. Kompres atau pilih ulang.';
const newTmText = '${n.length} berkas melebihi 20 MB dan tidak ditambahkan. Kompres atau pilih ulang.';
if (!lpFlow.includes(oldTmText)) {
    console.error('ERROR: oldTmText not found!');
    process.exit(1);
}
lpFlow = lpFlow.replace(oldTmText, newTmText);
console.log('3. tM text patched');

// 4. tE error text
const oldTeText = '"Berkas terlalu besar. Maksimum 1 MB per file. Kompres atau pilih berkas lain."';
const newTeText = '"Berkas terlalu besar. Maksimum 20 MB per file. Kompres atau pilih berkas lain."';
if (!lpFlow.includes(oldTeText)) {
    console.error('ERROR: oldTeText not found!');
    process.exit(1);
}
lpFlow = lpFlow.replace(oldTeText, newTeText);
console.log('4. tE error text patched');

// 5. Helper 1: Semua jenis file, maks 1 MB.
const oldH1 = 'Semua jenis file, maks 1 MB.';
const newH1 = 'Semua jenis file, maks 20 MB.';
const countH1 = lpFlow.split(oldH1).length - 1;
lpFlow = lpFlow.replaceAll(oldH1, newH1);
console.log(`5. Helper 1 patched (${countH1} occurrences)`);

// 6. Helper 2: PDF, maks 1 MB per file, maks 20 file.
const oldH2 = 'PDF, maks 1 MB per file, maks 20 file.';
const newH2 = 'PDF, maks 20 MB per file, maks 20 file.';
const countH2 = lpFlow.split(oldH2).length - 1;
lpFlow = lpFlow.replaceAll(oldH2, newH2);
console.log(`6. Helper 2 patched (${countH2} occurrences)`);

fs.writeFileSync('scratch/lp-flow-perma-56d42847ec39.patched.js', lpFlow, 'utf8');
console.log('Saved scratch/lp-flow-perma-56d42847ec39.patched.js, size:', lpFlow.length);

// Verify no remaining 1048576
console.log('Remaining 1048576 in lp-flow:', lpFlow.includes('1048576'));
console.log('Remaining "1 MB" in lp-flow:', lpFlow.includes('1 MB'));
