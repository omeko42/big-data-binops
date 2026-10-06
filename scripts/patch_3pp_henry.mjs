import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('scratch/3pp0f_cp6yg-o.live.js', 'utf8');

const targetProfileBtn = `(String(previewUser.id) === String(currentUser?.id || currentUser?.user_id) || previewUser.username === 'omeko11') ? (`;
const replProfileBtn = `(String(previewUser.id) === String(currentUser?.id || currentUser?.user_id)) ? (`;

if (!content.includes(targetProfileBtn)) {
  console.error('ERROR: targetProfileBtn not found!');
  process.exit(1);
}
content = content.replace(targetProfileBtn, replProfileBtn);
console.log('✓ 1. Fixed own profile button check in preview modal');

// Write out patched file
fs.writeFileSync('scratch/3pp0f_cp6yg-o.patched.js', content);
fs.writeFileSync('frontend-patch/3pp0f_cp6yg-o.patched.js', content);

// Syntax validation
try {
  execSync('node -c scratch/3pp0f_cp6yg-o.patched.js');
  console.log('✓ Syntax check passed on scratch/3pp0f_cp6yg-o.patched.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
