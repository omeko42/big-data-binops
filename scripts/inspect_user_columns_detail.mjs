import fs from 'fs';

const js = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const regexes = [
  /header:\s*"ROLE"/i,
  /header:\s*"SATKER MELEKAT"/i,
  /header:\s*"SKOR KEAKTIFAN"/i,
  /header:\s*"STATUS"/i,
  /header:\s*"AKSI"/i
];

for (const r of regexes) {
  const match = js.match(r);
  if (match) {
    const idx = match.index;
    console.log('=== MATCH FOR ' + r + ' ===');
    console.log(js.substring(idx - 50, idx + 1200));
    console.log('\n');
  } else {
    console.log('NO MATCH FOR ' + r);
  }
}
