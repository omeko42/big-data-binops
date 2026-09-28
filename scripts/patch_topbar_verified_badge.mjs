import fs from 'fs';
import cp from 'child_process';

let content = fs.readFileSync('frontend-patch/0-gigr76s0g8t.final.js', 'utf8');

const target = '(0,a.jsx)("div",{className:"cms-user-avatar",children:ec})';
if (!content.includes(target)) {
  console.error('Target not found in 0-gigr76s0g8t.final.js');
  process.exit(1);
}

const replacement = `(0,a.jsxs)("div",{className:"cms-user-avatar",style:{position:"relative",overflow:"visible"},children:[ec,(0,a.jsx)("div",{title:(function(){var isSuper=String(e?.id)==='1'||e?.username==='omeko11'||String(e?.role_bdb).toLowerCase()==='superadmin';if(isSuper)return"Superadmin Terverifikasi";var r=String(e?.role_bdb||'').toLowerCase();if(r==='admin_binops'||r==='binops')return"Admin Binops Terverifikasi";return"Personil CAS Terverifikasi";})(),style:{position:"absolute",bottom:"-2px",right:"-2px",width:"13px",height:"13px",borderRadius:"50%",background:(function(){var isSuper=String(e?.id)==='1'||e?.username==='omeko11'||String(e?.role_bdb).toLowerCase()==='superadmin';if(isSuper)return"#f59e0b";var r=String(e?.role_bdb||'').toLowerCase();if(r==='admin_binops'||r==='binops')return"#10b981";return"#38bdf8";})(),border:"2px solid #0f172a",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.5)"},children:[(0,a.jsx)("svg",{viewBox:"0 0 24 24",width:8,height:8,children:[(0,a.jsx)("path",{d:"m6 12 4 4 8-8",stroke:"#ffffff",strokeWidth:3.5,strokeLinecap:"round",strokeLinejoin:"round",fill:"none"})]})]})]})`;

content = content.replace(target, replacement);

fs.writeFileSync('frontend-patch/0-gigr76s0g8t.final.js', content, 'utf8');
console.log('✓ Patched 0-gigr76s0g8t.final.js with top-right verified badge!');
cp.execSync('node -c frontend-patch/0-gigr76s0g8t.final.js');
console.log('✓ node -c passed for 0-gigr76s0g8t.final.js!');
