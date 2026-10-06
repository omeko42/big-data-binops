import fs from 'fs';

console.log('=== Patching Dashboard Chunk for Greeting & Satker Casing ===');
let dash = fs.readFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Ensure toTitleCase is defined
if (!dash.includes('function toTitleCase(')) {
  const toTitleCaseCode = `function toTitleCase(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\\s|-|\\/)[a-z]/g, function(c) {
      return c.toUpperCase();
    })
    .replace(/\\bPolri\\b/gi, 'Polri')
    .replace(/\\bPolda\\b/gi, 'Polda')
    .replace(/\\bPolres\\b/gi, 'Polres')
    .replace(/\\bPolsek\\b/gi, 'Polsek')
    .replace(/\\bDitreskrimum\\b/gi, 'Ditreskrimum')
    .replace(/\\bDitreskrimsus\\b/gi, 'Ditreskrimsus')
    .replace(/\\bDitresnarkoba\\b/gi, 'Ditresnarkoba')
    .replace(/\\bSatreskrim\\b/gi, 'Satreskrim')
    .replace(/\\bSatresnarkoba\\b/gi, 'Satresnarkoba')
    .replace(/\\bBareskrim\\b/gi, 'Bareskrim')
    .replace(/\\bRobinopsnal\\b/gi, 'Robinopsnal');
}
`;
  dash = toTitleCaseCode + dash;
}

// 2. Patch greeting line
// Find: children:["Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:"Nasional"}),"."
const oldGreeting = `children:["Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(l?.scoped&&l?.scope_satker)?l.scope_satker:"Nasional"}),"."`;
const newGreeting = `children:["Selamat datang, ",(0,t.jsx)("strong",{children:r?.name||r?.email||"Pengguna"})," - ",(0,t.jsx)("strong",{children:(String(r?.id)==='1'||r?.username==='omeko11'||r?.callsign==='omeko11'||String(r?.role_bdb||r?.role||'').toLowerCase().includes('super'))?"Robinopsnal Bareskrim Polri":((l?.scoped&&l?.scope_satker)?toTitleCase(l.scope_satker):"Robinopsnal Bareskrim Polri")}),"."`;

if (!dash.includes(oldGreeting)) throw new Error('oldGreeting not found in dashboard chunk');
dash = dash.replace(oldGreeting, newGreeting);

// 3. Patch feed item satker casing & badge color
const oldSatker = `let satker = isUserOne ? 'Nasional' : (item.author_satker || item.satker_name || item.satker || item.satker_singkat || item.satker_nama || 'Polri');`;
const newSatker = `let satker = isUserOne ? 'Robinopsnal Bareskrim Polri' : toTitleCase(item.author_satker || item.satker_name || item.satker || item.satker_singkat || item.satker_nama || 'Mabes Bareskrim');`;

if (!dash.includes(oldSatker)) throw new Error('oldSatker not found in dashboard chunk');
dash = dash.replace(oldSatker, newSatker);

// 4. Also check callsign formatting in dashboard feed items to ensure custom callsigns/usernames like 'dolly' and 'idrisganteng' are not masked
const oldDashCallsign = `let c = String(item.author_callsign || '').trim().replace(/^@/, '');
            let invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
            if (c && !invalid.includes(c.toLowerCase())) return '@' + c;
            let u = String(item.author_username || '').trim().replace(/^@/, '');
            if (u && !invalid.includes(u.toLowerCase())) return '@' + u;`;

const newDashCallsign = `let c = String(item.author_callsign || '').trim().replace(/^@/, '');
            let invalid = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
            if (c && !invalid.includes(c.toLowerCase()) && !c.startsWith('user_')) return '@' + c;
            let u = String(item.author_username || '').trim().replace(/^@/, '');
            if (u && !invalid.includes(u.toLowerCase()) && !u.startsWith('user_')) return '@' + u;
            if (c && !invalid.includes(c.toLowerCase())) return '@' + c;`;

if (dash.includes(oldDashCallsign)) {
  dash = dash.replace(oldDashCallsign, newDashCallsign);
}

new Function(dash);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', dash);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.patched.js', dash);
console.log('Dashboard chunk successfully patched and verified!');
