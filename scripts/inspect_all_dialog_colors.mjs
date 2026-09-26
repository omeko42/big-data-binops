import fs from 'fs';

const js = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');

const dialogPositions = [
  { name: 'Detail Pengguna', pos: 44813 },
  { name: 'Rincian Keaktifan', pos: 47036 },
  { name: 'Mutasi Satker', pos: 56123 },
  { name: 'Pilih Satker Berjenjang', pos: 67259 },
  { name: 'Edit/Tambah Pengguna', pos: 72921 },
  { name: 'Review Hapus/Nonaktif', pos: 82445 },
  { name: 'Impersonate', pos: 88731 },
  { name: 'Import Massal', pos: 90291 },
  { name: 'Reset Massal', pos: 96908 }
];

for (let i = 0; i < dialogPositions.length; i++) {
  const d = dialogPositions[i];
  const nextPos = i < dialogPositions.length - 1 ? dialogPositions[i+1].pos : js.length;
  const chunk = js.substring(d.pos, nextPos);
  
  // Find all hex colors in styles or strings
  const hexes = chunk.match(/#[0-9a-fA-F]{3,6}/g) || [];
  const uniqueHexes = [...new Set(hexes)];
  console.log(`=== ${d.name} (length ${chunk.length}) ===`);
  console.log('Hexes found:', uniqueHexes.join(', '));
  
  // Find light backgrounds
  const bgMatches = chunk.match(/background:\s*["'][^"']+["']/g) || [];
  if (bgMatches.length) console.log('Backgrounds:', [...new Set(bgMatches)].join(' | '));
  
  // Find colors
  const colorMatches = chunk.match(/color:\s*["'][^"']+["']/g) || [];
  if (colorMatches.length) console.log('Colors:', [...new Set(colorMatches)].join(' | '));
  console.log('\n');
}
