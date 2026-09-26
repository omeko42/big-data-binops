import fs from 'fs';

const content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/user-page-pagination-v9-dfbc949b.js', 'utf8');

const idx = content.indexOf('Rincian Keaktifan');
if (idx !== -1) {
  console.log('--- Rincian Keaktifan Dialog ---');
  console.log(content.slice(Math.max(0, idx - 150), Math.min(content.length, idx + 1500)));
} else {
  console.log('Rincian Keaktifan not found');
}
