import fs from 'fs';

const content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/laporan-filter-perma-a15e28ec2e81.js', 'utf8');

const bgMatches = [...content.matchAll(/style:\{[^}]*background(Color)?:\s*['\"](#fff|#ffffff|white|#f8fafc|#f1f5f9)['\"][^}]*\}/gi)];
console.log('Background matches:', bgMatches.length);
for (const m of bgMatches.slice(0, 10)) {
  console.log(m[0]);
}

const colorMatches = [...content.matchAll(/style:\{[^}]*color:\s*['\"](#0f172a|#1e293b|#334155|#111827)['\"][^}]*\}/gi)];
console.log('Color matches:', colorMatches.length);
for (const m of colorMatches.slice(0, 10)) {
  console.log(m[0]);
}
