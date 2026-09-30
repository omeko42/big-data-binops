import fs from 'fs';
import { runFE, copyFileToFE } from './fe_exec.mjs';

// 1. Read dashboard-perma-318125d33290_v2.final.js
let content = fs.readFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', 'utf8');

const oldLogic = `          let isSuper = String(item.author_id) === '1' || item.author_username === 'omeko11' || item.author_callsign === 'omeko11' || String(item.author_role).toLowerCase() === 'superadmin';
          let roleStr = String(item.author_role || '').toLowerCase();
          let callsign = isSuper ? '@omeko11' : (item.author_callsign ? ('@' + String(item.author_callsign).replace(/^@/, '')) : ('@' + (item.author_username || 'anak_serse')));
          let bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          let bTitle = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
          let satker = item.satker_name || item.satker || (isSuper ? 'Nasional' : 'Bareskrim');`;

const newLogic = `          let isUserOne = String(item.author_id) === '1' || item.author_username === 'omeko11' || item.author_callsign === 'omeko11';
          let isSuper = isUserOne || String(item.author_role || '').toLowerCase() === 'superadmin';
          let roleStr = String(item.author_role || '').toLowerCase();
          let callsign = isUserOne ? '@omeko11' : (item.author_callsign ? ('@' + String(item.author_callsign).replace(/^@/, '')) : (item.author_username ? ('@' + item.author_username) : '@user_' + String(item.author_id || 'polri').slice(-4)));
          let bColor = isSuper ? '#f59e0b' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? '#10b981' : '#38bdf8');
          let bTitle = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : 'Personil Terverifikasi');
          let satker = item.satker_name || item.satker || (isUserOne ? 'Nasional' : 'Mabes Bareskrim');`;

if (!content.includes(oldLogic)) {
  console.error('Could not find oldLogic in dashboard-perma-318125d33290_v2.final.js');
  process.exit(1);
}

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', content);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290.js', content);
console.log('✓ Patched local dashboard files');

// 2. Upload and deploy to bdb-web
copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.final.js', '/tmp/dashboard-chunk.js');
runFE(`
  docker cp /tmp/dashboard-chunk.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
  docker cp /tmp/dashboard-chunk.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  rm -f /tmp/dashboard-chunk.js
`);
console.log('✓ Injected to bdb-web container chunks');

// 3. Verify syntax
const chk = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js');
console.log('Syntax check:', chk.trim() === '' ? 'VALID OK' : chk.trim());

// 4. Test HTTP 200
const httpCode = runFE('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/dashboard/main');
console.log('HTTP /cms/dashboard/main:', httpCode.trim());
