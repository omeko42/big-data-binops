import cp from 'child_process';
import fs from 'fs';

console.log('=== RECONSTRUCTING AUTHENTIC SSR PROFILE ===');

let ssr = cp.execSync('git show 625014b:profile-seamless-header-fix-20260927/fe/app_cms_profile_page_tsx_0_ymkmx._.js').toString();

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

// Insert formatCallsign at the top of SSR file
if (ssr.includes('"use strict";')) {
  ssr = ssr.replace('"use strict";', '"use strict";\n' + formatFn);
}

// Add Callsign badge next to Name in SSR hero if name exists
const ssrNameTarget = 'children:d.name||"-"';
if (ssr.includes(ssrNameTarget)) {
  const ssrNameRep = `children:[
            (0,b.jsx)("div",{style:{fontSize:"1.35rem",fontWeight:800,color:"#fff",lineHeight:1.2,wordBreak:"break-word"},children:d.name||"-"}),
            (0,b.jsx)("span",{style:{fontSize:"0.84rem",fontWeight:800,color:"#38bdf8",background:"rgba(56,189,248,0.18)",border:"1px solid rgba(56,189,248,0.35)",padding:"0.15rem 0.65rem",borderRadius:"999px",fontFamily:"monospace"},children:formatCallsign(d?.callsign, d?.id, d?.username)})
          ]`;
  const parentNameTarget = '(0,b.jsx)("div",{style:{fontSize:"1.35rem",fontWeight:800,color:"#fff",lineHeight:1.2,wordBreak:"break-word"},children:d.name||"-"})';
  if (ssr.includes(parentNameTarget)) {
    ssr = ssr.replace(parentNameTarget, `(0,b.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.65rem",flexWrap:"wrap"},${ssrNameRep}}`);
  }
}

fs.writeFileSync('frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js', ssr, 'utf8');
cp.execSync('node -c frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js');
console.log('✓ Authentic SSR profile compiled with 0 syntax errors!');
