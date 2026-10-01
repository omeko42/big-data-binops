import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('frontend-patch/0-gigr76s0g8t.final.js', 'utf8');

// 1. Target eo declaration
const targetEo = 'let eo=e?.name||e?.email||"Pengguna",ec=(livePhoto||e?.photo_url||e?.foto)?';
const replacementEo = 'let isSuperTopbar=String(e?.id)===\'1\'||e?.username===\'omeko11\'||String(e?.role_bdb||\'\').toLowerCase()===\'superadmin\';let eo=(String(e?.id)===\'1\'||e?.username===\'omeko11\')?\'@omeko11\':(isSuperTopbar&&e?.callsign?(String(e.callsign).startsWith(\'@\')?e.callsign:\'@\'+e.callsign):(e?.name||e?.email||"Pengguna")),ec=(livePhoto||e?.photo_url||e?.foto)?';

if (!content.includes(targetEo)) {
  console.error('ERROR: targetEo not found!');
  process.exit(1);
}
content = content.replace(targetEo, replacementEo);
console.log('✓ Replaced eo declaration successfully');

// 2. Target avatar fallback
const targetAvatarFallback = 'String(eo).charAt(0).toUpperCase()';
const replacementAvatarFallback = "String(eo).replace(/^@/,'').charAt(0).toUpperCase()";
if (content.includes(targetAvatarFallback)) {
  content = content.replace(targetAvatarFallback, replacementAvatarFallback);
  console.log('✓ Replaced avatar fallback successfully');
}

// 3. Target cms-user-role
const targetRole = 'if (isSuper) return "BDB Superadmin";';
const replacementRole = 'if (isSuper) return "Nasional";';

if (!content.includes(targetRole)) {
  console.error('ERROR: targetRole not found!');
  process.exit(1);
}
content = content.replace(targetRole, replacementRole);
console.log('✓ Replaced cms-user-role successfully');

// Write out patched files
fs.writeFileSync('frontend-patch/0-gigr76s0g8t.final.js', content);
fs.writeFileSync('frontend-patch/0-gigr76s0g8t.patched.js', content);

// Syntax validation
try {
  execSync('node -c frontend-patch/0-gigr76s0g8t.final.js');
  console.log('✓ Syntax check passed on frontend-patch/0-gigr76s0g8t.final.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}

console.log('All patches applied cleanly and verified!');
