import fs from 'fs';

const content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/user-page-pagination-v9-dfbc949b.js', 'utf8');

const idx = content.indexOf('Rincian Keaktifan');
console.log(content.slice(idx + 1000, idx + 3500));
