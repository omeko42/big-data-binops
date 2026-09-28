import fs from 'fs';
import cp from 'child_process';

const formatFn = `
function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  if (c.startsWith('pers_') || c.startsWith('user_')) c = '';
  var invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
    return '@' + c.toLowerCase();
  }
  var seed = idStr || username || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + code;
}

function formatCount(num) {
  var n = Number(num || 0);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return String(n);
}

if (typeof globalThis !== 'undefined') {
  globalThis.formatCallsign = formatCallsign;
  globalThis.formatCount = formatCount;
}
`;

let c3def = fs.readFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', 'utf8');

// Also place formatCallsign and formatCount in module 34850
const targetIn34850 = 'globalThis.maskPhone=maskPhone;';
if (c3def.includes(targetIn34850) && !c3def.includes('formatCallsign(rawCallsign, authorId, username) {\n  var idStr = String(authorId || \'\');\n  if (idStr === \'1\'', c3def.indexOf(targetIn34850))) {
  console.log('Inserting formatCallsign into module 34850...');
  c3def = c3def.replace(targetIn34850, targetIn34850 + '\n' + formatFn);
}

// Make sure globalThis.formatCallsign is also set at module 97778
const targetIn97778 = 'globalThis.formatCallsign = formatCallsign;';
if (!c3def.includes(targetIn97778)) {
  const endFn = 'return String(n);\n}\n';
  const endFnIdx = c3def.indexOf(endFn);
  if (endFnIdx !== -1) {
    c3def = c3def.slice(0, endFnIdx + endFn.length) + '\nif(typeof globalThis !== "undefined"){ globalThis.formatCallsign = formatCallsign; globalThis.formatCount = formatCount; }\n' + c3def.slice(endFnIdx + endFn.length);
  }
}

fs.writeFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', c3def, 'utf8');
cp.execSync('node -c frontend-patch/3def3ti6rk0vr.linkedin_v3.js');
console.log('✓ 3def3ti6rk0vr.linkedin_v3.js compiled with 0 syntax errors!');

// Let's verify module boundaries
const idx34850 = c3def.indexOf('34850,e=>{');
const defIn34850 = c3def.indexOf('function formatCallsign(', idx34850);
console.log('Module 34850 starts at:', idx34850);
console.log('formatCallsign defined inside 34850 at:', defIn34850);
console.log('Is defined inside module 34850?', defIn34850 > idx34850);
