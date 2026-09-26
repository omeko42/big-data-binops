import fs from 'fs';

const s = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
try {
  new Function(s);
  console.log('SYNTAX VALID 100%!');
} catch (e) {
  console.error('Syntax error:', e);
}
console.log('Includes header: "Pilih Satker Berjenjang":', s.includes('header:"Pilih Satker Berjenjang"'));
console.log('Includes showSatkerModal in JSX:', s.includes('visible:showSatkerModal'));
