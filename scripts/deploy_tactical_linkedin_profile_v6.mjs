import { runFE, copyFileToFE } from './fe_exec.mjs';
import fs from 'fs';

console.log('=== Step 1: Backup current remote chunks ===');
runFE(`
  docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-before-v6 || true
`);
console.log('✓ Remote backups verified.');

console.log('=== Step 2: Upload patched v6 chunks to host ===');
copyFileToFE('frontend-patch/3def3ti6rk0vr.linkedin_v6.js', '/tmp/3def3ti6rk0vr.linkedin_v6.js');
console.log('✓ Upload to /tmp complete.');

console.log('=== Step 3: Copy into bdb-web docker container ===');
runFE(`
  docker cp /tmp/3def3ti6rk0vr.linkedin_v6.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  rm -f /tmp/3def3ti6rk0vr.linkedin_v6.js
`);
console.log('✓ Chunk 3def3ti6rk0vr.js copied into container.');

console.log('=== Step 4: Restart bdb-web container for clean SSR/Client state ===');
runFE('docker restart bdb-web');
console.log('✓ Container bdb-web restarted.');

console.log('=== Step 5: Wait 6 seconds for Next.js initialization ===');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 6000);

console.log('=== Step 6: Verify health and chunk content on container ===');
const checkProfile = runFE('docker exec bdb-web ls -la /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('Client chunk:', checkProfile.trim());

const checkProfileCurl = runFE('curl -sI http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | head -n 5');
console.log('Client chunk HTTP response:\n', checkProfileCurl.trim());

const checkPageCurl = runFE('curl -sI http://127.0.0.1:3000/cms/profile | head -n 5');
console.log('/cms/profile HTTP response:\n', checkPageCurl.trim());

const inspectInside = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js", "utf8");
  console.log("3def size:", c.length);
  console.log("has cas-settings-dropdown-wrapper:", c.includes("cas-settings-dropdown-wrapper"));
  console.log("has Pengaturan Keamanan:", c.includes("Pengaturan Keamanan"));
  console.log("has Pengaturan Profile Satker:", c.includes("Pengaturan Profile Satker"));
  console.log("has Bahasa profil (should be false):", c.includes("Bahasa profil"));
  console.log("has READY TO WORK (should be false):", c.includes("READY TO WORK"));
  console.log("has Setup Google Authenticator:", c.includes("Google Authenticator (TOTP)"));
  console.log("has isReadOnlyMode:", c.includes("isReadOnlyMode"));
'`);
console.log('Live container chunk content check:\n', inspectInside.trim());

// Also sync locally
fs.copyFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v6.js', '3def3ti6rk0vr.patched.js');
fs.copyFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v6.js', 'frontend-patch/3def3ti6rk0vr.linkedin_v3.js');
console.log('✓ Synced local patched files.');

console.log('\n=== MASTER DEPLOYMENT OF TACTICAL LINKEDIN PROFILE V6 SUCCESSFUL! ===');
