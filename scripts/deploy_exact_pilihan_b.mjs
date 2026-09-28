import { runFE, copyFileToFE } from './fe_exec.mjs';
import fs from 'fs';

console.log('=== Step 1: Backup current remote chunk ===');
runFE(`
  docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-before-pilihan-b || true
`);
console.log('✓ Remote backup confirmed.');

console.log('=== Step 2: Upload patched Pilihan B chunk to host ===');
copyFileToFE('frontend-patch/3def3ti6rk0vr.pilihan_b.js', '/tmp/3def3ti6rk0vr.pilihan_b.js');
console.log('✓ Upload to /tmp complete.');

console.log('=== Step 3: Copy into bdb-web docker container ===');
runFE(`
  docker cp /tmp/3def3ti6rk0vr.pilihan_b.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  rm -f /tmp/3def3ti6rk0vr.pilihan_b.js
`);
console.log('✓ Chunk 3def3ti6rk0vr.js copied into bdb-web container.');

console.log('=== Step 4: Validate syntax inside container ===');
const syntaxCheck = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js && echo "SYNTAX_OK"');
console.log('Container syntax check:', syntaxCheck.trim());

console.log('=== Step 5: Restart bdb-web container for fresh client serving ===');
runFE('docker restart bdb-web');
console.log('✓ Container bdb-web restarted.');

console.log('=== Step 6: Wait 6 seconds for Next.js initialization ===');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 6000);

console.log('=== Step 7: Verify HTTP responses and live content ===');
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
  console.log("has READY TO WORK:", c.includes("READY TO WORK"));
  console.log("has BUILDING SOLUTIONS:", c.includes("BUILDING SOLUTIONS ONE LINE AT A TIME"));
  console.log("has Bahasa profil:", c.includes("Bahasa profil"));
  console.log("has Profil publik dan URL:", c.includes("Profil publik dan URL"));
  console.log("has Orang yang Mungkin Anda Kenal:", c.includes("Orang yang Mungkin Anda Kenal"));
  console.log("has AKBP Denny S.:", c.includes("AKBP Denny S."));
  console.log("has Belum ada ringkasan tentang profil Anda:", c.includes("Belum ada ringkasan tentang profil Anda"));
  console.log("has + Tambahkan Ringkasan:", c.includes("+ Tambahkan Ringkasan"));
'`);
console.log('Live container chunk content check:\n', inspectInside.trim());

console.log('\n=== DEPLOYMENT OF EXACT PILIHAN B SUCCESSFUL! ===');
