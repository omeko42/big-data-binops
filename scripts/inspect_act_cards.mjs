import fs from 'fs';

const content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/user-page-pagination-v9-dfbc949b.js', 'utf8');

const idx = content.indexOf('isDorman&&');
console.log(content.slice(idx, idx + 2000));
