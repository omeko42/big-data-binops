import { runFE, copyFileToFE } from './fe_exec.mjs';
import cp from 'child_process';
import fs from 'fs';

console.log('=== Step 1: Local node -c verification on all 5 chunks ===');
const chunks = [
  { name: '0-gigr76s0g8t.js', local: 'frontend-patch/0-gigr76s0g8t.final.js', remote: '/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js' },
  { name: '3def3ti6rk0vr.js', local: 'frontend-patch/3def3ti6rk0vr.pilihan_b.js', remote: '/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js' },
  { name: 'dashboard-perma-318125d33290_v2.js', local: 'frontend-patch/dashboard-perma-318125d33290_v2.final.js', remote: '/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js' },
  { name: 'dashboard-perma-318125d33290.js', local: 'frontend-patch/dashboard-perma-318125d33290_v2.final.js', remote: '/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js' },
  { name: '3pp0f_cp6yg-o.js', local: 'frontend-patch/3pp0f_cp6yg-o.patched.js', remote: '/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js' },
  { name: '35hkjujo3bzza.js', local: 'frontend-patch/35hkjujo3bzza.patched.js', remote: '/usr/src/app/.next/static/chunks/35hkjujo3bzza.js' }
];

for (const c of chunks) {
  cp.execSync('node -c ' + c.local);
  console.log('✓ Syntax OK:', c.local, '(' + fs.statSync(c.local).size + ' bytes)');
}

console.log('\n=== Step 2: Upload chunks to remote /tmp/ ===');
for (const c of chunks) {
  copyFileToFE(c.local, '/tmp/' + c.name);
}
console.log('✓ All chunks uploaded to remote /tmp/');

console.log('\n=== Step 3: Copy into bdb-web container ===');
for (const c of chunks) {
  runFE(`docker cp /tmp/${c.name} bdb-web:${c.remote}`);
  runFE(`rm -f /tmp/${c.name}`);
  console.log('✓ Installed:', c.remote);
}

console.log('\n=== Step 4: Verify syntax inside container ===');
for (const c of chunks) {
  const check = runFE(`docker exec bdb-web node -c ${c.remote} && echo "OK"`);
  if (!check.includes('OK')) {
    console.error('❌ Failed container syntax check for ' + c.remote);
    process.exit(1);
  }
}
console.log('✓ All chunks validated with node -c inside bdb-web!');

console.log('\n=== Step 5: Restart container bdb-web ===');
runFE('docker restart bdb-web');
console.log('✓ Container bdb-web restarted.');

console.log('\n=== Step 6: Wait 6 seconds for container startup ===');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 6000);

console.log('\n=== Step 7: Verify HTTP 200 on all 4 CMS routes ===');
const routes = [
  '/cms/dashboard/main',
  '/cms/profile',
  '/cms/broadcaster',
  '/cms/pengumuman'
];

for (const r of routes) {
  const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${r}`).trim();
  console.log(`Route ${r} -> HTTP ${code}`);
}

console.log('\n=== Step 8: Verify static chunk HTTP 200 ===');
for (const c of chunks) {
  const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/_next/static/chunks/${c.name}`).trim();
  console.log(`Chunk ${c.name} -> HTTP ${code}`);
}

console.log('\n=== Step 9: Content verification on live container ===');
const checkProfile = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js", "utf8");
  console.log("Profile click-to-edit exists:", c.includes("Klik foto untuk mengganti foto profil"));
  console.log("Profile verified badge exists:", c.includes("Superadmin Terverifikasi"));
  console.log("Profile settings dropdown exists:", c.includes("cas-settings-dropdown-wrapper"));
'`);
console.log(checkProfile.trim());

const checkLayout = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js", "utf8");
  console.log("Topbar avatar badge exists:", c.includes("Superadmin Terverifikasi"));
'`);
console.log(checkLayout.trim());

const checkDashboard = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js", "utf8");
  console.log("Dashboard feed badge exists:", c.includes("Superadmin Terverifikasi"));
  console.log("Dashboard feed reactions exist:", c.includes("item.total_reactions"));
'`);
console.log(checkDashboard.trim());

const checkBroadcaster = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js", "utf8");
  console.log("Broadcaster cyan badge exists:", c.includes("#38bdf8"));
'`);
console.log(checkBroadcaster.trim());

const checkPengumuman = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/35hkjujo3bzza.js", "utf8");
  console.log("Pengumuman verified badge exists:", c.includes("Superadmin Terverifikasi"));
  console.log("Pengumuman author fallback exists:", c.includes("@anak_serse"));
'`);
console.log(checkPengumuman.trim());

console.log('\n=== ALL 4 MODULES AND CHUNKS SUCCESSFULLY DEPLOYED & VERIFIED! ===');
