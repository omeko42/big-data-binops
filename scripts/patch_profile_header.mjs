import fs from 'fs';

let content = fs.readFileSync('frontend-patch/3def3ti6rk0vr.live.js', 'utf8');

// 1. Update formatCallsign
const oldFormatCallsign = `function formatCallsign(rawCallsign, authorId, username) {
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
}`;

const newFormatCallsign = `function formatCallsign(rawCallsign, authorId, username) {
  var idStr = String(authorId || '');
  if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
  if (idStr === '122' || username === '02110642@polri.go.id' || rawCallsign === 'hendrik_dwi') return '@hendrik_dwi';
  if (idStr === '16568' || rawCallsign === 'mat.doang7') return '@mat.doang7';
  var c = String(rawCallsign || '').trim().replace(/^@/, '');
  if (c.startsWith('pers_') || c.startsWith('user_')) c = '';
  if (c.includes('@')) c = c.split('@')[0];
  c = c.replace(/[^a-zA-Z0-9_.]/g, '_');
  var invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
  if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
    return '@' + c.toLowerCase();
  }
  var seed = idStr || username || 'polri';
  var num = 0;
  for (var i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
  var code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
  return '@user_' + code;
}`;

if (!content.includes(oldFormatCallsign)) {
  console.error('Could not find oldFormatCallsign in chunk');
  process.exit(1);
}
content = content.replace(oldFormatCallsign, newFormatCallsign);
console.log('✓ Patched formatCallsign');

// 2. Update Name & Callsign row in Hero
const oldHeroIdentity = `      // Name & Callsign row: @OMEKO11 [Verified Badge] ● Online monolitik
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.55rem",flexWrap:"wrap"},children:[
        (0,t.jsx)("span",{style:{fontSize:"1.6rem",fontWeight:800,color:"#ffffff",lineHeight:1.2},children:(function(){
          var cs = a?.callsign || a?.username || "OMEKO11";
          if (cs.startsWith('@')) return cs.toUpperCase();
          return '@' + cs.toUpperCase();
        })()}),
        (function(){
          var isUserOne = String(a?.id) === '1' || a?.username === 'omeko11' || String(a?.role_bdb).toLowerCase() === 'superadmin';
          var roleStr = String(a?.role_bdb || '').toLowerCase();
          var bColor = isUserOne ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isUserOne ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
          return (0,t.jsx)("span",{
            title:bLabel,
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:"50%",background:bColor,boxShadow:"0 1px 4px rgba(0,0,0,0.3)"},
            children:[
              (0,t.jsx)("svg",{viewBox:"0 0 24 24",width:12,height:12,children:[
                (0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
              ]})
            ]
          });
        })(),
        // Clean Online Status Pill
        (0,t.jsxs)("span",{style:{fontSize:"0.76rem",fontWeight:700,padding:"0.2rem 0.65rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.35)",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[
          "● Online"
        ]})
      ]}),`;

const newHeroIdentity = `      // Name & Callsign row: Full Name, Verified Badge, Callsign pill, ● Online
      (0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"},children:[
        (0,t.jsx)("span",{
          style:{fontSize:"1.65rem",fontWeight:800,color:"#ffffff",lineHeight:1.2},
          children:(function(){
            var isUserOne = String(a?.id) === '1' || a?.username === 'omeko11' || String(a?.role_bdb).toLowerCase() === 'superadmin';
            if (a?.name && a?.name !== a?.username && !a?.name.includes('@')) return a.name;
            return isUserOne ? "EKO" : "HENDRIK DWI HARIADI";
          })()
        }),
        (function(){
          var isUserOne = String(a?.id) === '1' || a?.username === 'omeko11' || String(a?.role_bdb).toLowerCase() === 'superadmin';
          var roleStr = String(a?.role_bdb || '').toLowerCase();
          var bColor = isUserOne ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          var bLabel = isUserOne ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
          return (0,t.jsx)("span",{
            title:bLabel,
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:"50%",background:bColor,boxShadow:"0 1px 4px rgba(0,0,0,0.3)"},
            children:[
              (0,t.jsx)("svg",{viewBox:"0 0 24 24",width:12,height:12,children:[
                (0,t.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})
              ]})
            ]
          });
        })(),
        (0,t.jsx)("span",{
          style:{fontSize:"0.9rem",fontWeight:700,color:"#38bdf8",fontFamily:"monospace",background:"rgba(56,189,248,0.12)",padding:"0.15rem 0.55rem",borderRadius:"6px",border:"1px solid rgba(56,189,248,0.25)"},
          children:formatCallsign(a?.callsign, a?.id, a?.username)
        }),
        // Clean Online Status Pill
        (0,t.jsxs)("span",{style:{fontSize:"0.76rem",fontWeight:700,padding:"0.2rem 0.65rem",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.35)",display:"inline-flex",alignItems:"center",gap:"0.35rem"},children:[
          "● Online"
        ]})
      ]}),`;

if (!content.includes(oldHeroIdentity)) {
  console.error('Could not find oldHeroIdentity in chunk');
  process.exit(1);
}
content = content.replace(oldHeroIdentity, newHeroIdentity);
console.log('✓ Patched Hero Identity');

// 3. Update Subline satker fallback
const oldSublineSatker = `        (0,t.jsx)("span",{children:(function(){
          var isSuper = String(a?.id) === '1' || a?.username === 'omeko11' || String(a?.role_bdb).toLowerCase() === 'superadmin';
          if (isSuper) return "Nasional";
          return a?.scope_satker_name || a?.satker || a?.satker_nama || a?.satuan || "Nasional";
        })()}),`;

const newSublineSatker = `        (0,t.jsx)("span",{children:(function(){
          var isSuper = String(a?.id) === '1' || a?.username === 'omeko11' || String(a?.role_bdb).toLowerCase() === 'superadmin';
          if (isSuper) return "Nasional";
          var s = a?.scope_satker_name || a?.satker || a?.satker_nama || a?.satuan;
          if (!s || s === 'BDB Superadmin' || s === '-') return "DIT RES SIBER JAWA TIMUR";
          return s;
        })()}),`;

if (!content.includes(oldSublineSatker)) {
  console.error('Could not find oldSublineSatker in chunk');
  process.exit(1);
}
content = content.replace(oldSublineSatker, newSublineSatker);
console.log('✓ Patched Subline Satker');

fs.writeFileSync('frontend-patch/3def3ti6rk0vr.patched.js', content);
console.log('Saved frontend-patch/3def3ti6rk0vr.patched.js');
