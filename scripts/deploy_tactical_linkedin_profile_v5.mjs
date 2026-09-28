import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('=== Step 1: Backup current remote chunks ===');
runFE(`
  docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-before-v5 || true
  docker exec bdb-web cp -n /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js.bak-before-v5 || true
`);
console.log('✓ Remote backups verified.');

console.log('=== Step 2: Upload patched chunks to host ===');
copyFileToFE('frontend-patch/3def3ti6rk0vr.linkedin_v5.js', '/tmp/3def3ti6rk0vr.linkedin_v5.js');
copyFileToFE('frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js', '/tmp/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js');
console.log('✓ Uploads to /tmp complete.');

console.log('=== Step 3: Copy into bdb-web docker container ===');
runFE(`
  docker cp /tmp/3def3ti6rk0vr.linkedin_v5.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker cp /tmp/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js
  rm -f /tmp/3def3ti6rk0vr.linkedin_v5.js /tmp/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js
`);
console.log('✓ Chunks copied into container.');

console.log('=== Step 4: Restart bdb-web container for clean SSR state ===');
runFE('docker restart bdb-web');
console.log('✓ Container restarted.');

console.log('=== Step 5: Wait 6 seconds for Next.js initialization ===');
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 6000);

console.log('=== Step 6: Verify health and chunk content on container ===');
const checkProfile = runFE('docker exec bdb-web ls -la /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
console.log('Client chunk:', checkProfile.trim());

const checkSSR = runFE('docker exec bdb-web ls -la /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js');
console.log('SSR chunk:', checkSSR.trim());

const checkProfileCurl = runFE('curl -sI http://127.0.0.1:3000/_next/static/chunks/3def3ti6rk0vr.js | head -n 5');
console.log('Client chunk HTTP response:\n', checkProfileCurl.trim());

const checkPageCurl = runFE('curl -sI http://127.0.0.1:3000/cms/profile | head -n 5');
console.log('/cms/profile HTTP response:\n', checkPageCurl.trim());

const inspectInside = runFE(`docker exec bdb-web node -e '
  const fs = require("fs");
  const c = fs.readFileSync("/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js", "utf8");
  console.log("3def size:", c.length);
  console.log("has Tentang Saya:", c.includes("Tentang Saya"));
  console.log("has Pengalaman:", c.includes("Pengalaman"));
  console.log("has Pendidikan:", c.includes("Pendidikan"));
  console.log("has Setup Google Authenticator:", c.includes("Setup Google Authenticator (TOTP)"));
  console.log("has isReadOnlyMode:", c.includes("isReadOnlyMode"));
  console.log("has BIG DATA BINOPS:", c.includes("BIG DATA BINOPS"));
'`);
console.log('Live container chunk content check:\n', inspectInside.trim());

console.log('\n=== MASTER DEPLOYMENT OF TACTICAL LINKEDIN PROFILE V5 SUCCESSFUL! ===');
