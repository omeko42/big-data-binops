import fs from 'fs';

const content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/3def3ti6rk0vr.patched.js', 'utf8');

const bgMatches = [...content.matchAll(/style:\{[^}]*background(Color)?:\s*['\"](#fff|#ffffff|white|#f8fafc|#f1f5f9)['\"][^}]*\}/gi)];
console.log('Profile bg matches:', bgMatches.length);
for (const m of bgMatches) {
  console.log(m[0]);
}

const colorMatches = [...content.matchAll(/style:\{[^}]*color:\s*['\"](#0f172a|#1e293b|#334155|#111827)['\"][^}]*\}/gi)];
console.log('Profile color matches:', colorMatches.length);
for (const m of colorMatches) {
  console.log(m[0]);
}
