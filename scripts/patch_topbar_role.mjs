import fs from 'fs';

let content = fs.readFileSync('frontend-patch/0-gigr76s0g8t.live.js', 'utf8');

const target = '(0,a.jsx)("div",{className:"cms-user-role",children:(e?.scope_satker_name||e?.satker||e?.satker_nama||e?.satuan||("superadmin"===String(e?.role_bdb||"").toLowerCase()?"Nasional":"-"))})';

const replacement = `(0,a.jsx)("div",{className:"cms-user-role",children:(function(){
  var isSuper = String(e?.id) === '1' || e?.username === 'omeko11' || String(e?.role_bdb || '').toLowerCase() === 'superadmin';
  if (isSuper) return "BDB Superadmin";
  var r = String(e?.role_bdb || e?.requested_role_bdb || 'Operator').toUpperCase();
  var rLabel = "Operator";
  if (r === 'ADMIN_BINOPS' || r === 'BINOPS') rLabel = "Admin Binops";
  else if (r === 'VIEWER') rLabel = "Viewer";

  var s = e?.scope_satker_name || e?.satker || e?.satker_nama || e?.satuan || "";
  if (!s || s === 'BDB Superadmin' || s === '-') s = "Dit Res Siber Jatim";
  var sClean = s.replace(/DIT RES SIBER JAWA TIMUR/i, 'Dit Res Siber Jatim')
                .replace(/DITRESKRIMSUS/i, 'Dit Reskrimsus')
                .replace(/DITRESKRIMUM/i, 'Dit Reskrimum')
                .replace(/DITRESNARKOBA/i, 'Dit Resnarkoba');
  return rLabel + " - " + sClean;
})()})`;

if (!content.includes(target)) {
  console.error('Target not found in 0-gigr76s0g8t.live.js');
  process.exit(1);
}

content = content.replace(target, replacement);
fs.writeFileSync('frontend-patch/0-gigr76s0g8t.patched.js', content);
console.log('✓ Successfully created frontend-patch/0-gigr76s0g8t.patched.js');
