import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('scratch/35hkjujo3bzza.live.js', 'utf8');

// 1. Replace "Nasional" with "Robinopsnal Bareskrim Polri"
const targetNasional = `children: (function(item){ var isSuper = String(item?.author_id) === '1' || item?.author_username === 'omeko11' || item?.author_callsign === 'omeko11' || String(item?.author_role).toLowerCase() === 'superadmin'; if (isSuper) return "Nasional"; return item?.author_satker || item?.satker_name || item?.satker || "Robinops Bareskrim"; })(p)`;

const replNasional = `children: (function(item){ var isSuper = String(item?.author_id) === '1' || item?.author_username === 'omeko11' || item?.author_callsign === 'omeko11' || String(item?.author_role).toLowerCase() === 'superadmin' || ['1', '320', '15403', '15404', '16568', '16576', '16594'].includes(String(item?.author_id)); if (isSuper) return "Robinopsnal Bareskrim Polri"; return item?.author_satker || item?.satker_name || item?.satker || "Robinopsnal Bareskrim Polri"; })(p)`;

if (!content.includes(targetNasional)) {
  console.error('ERROR: targetNasional not found!');
  process.exit(1);
}
content = content.replace(targetNasional, replNasional);
console.log('✓ 1. Replaced Nasional with Robinopsnal Bareskrim Polri in feed');

// Write out patched file
fs.writeFileSync('scratch/35hkjujo3bzza.patched.js', content);
fs.writeFileSync('frontend-patch/35hkjujo3bzza.patched.js', content);

// Syntax validation
try {
  execSync('node -c scratch/35hkjujo3bzza.patched.js');
  console.log('✓ Syntax check passed on scratch/35hkjujo3bzza.patched.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
