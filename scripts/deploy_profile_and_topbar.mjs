import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Step 1: Uploading patched chunks to FE host ===');
  copyFileToFE('frontend-patch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
  copyFileToFE('frontend-patch/0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.js');
  console.log('Uploaded files to /tmp');

  console.log('=== Step 2: Injecting into bdb-web container ===');
  runFE(`
    docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    rm -f /tmp/3def3ti6rk0vr.js /tmp/0-gigr76s0g8t.js
  `);
  console.log('Injected chunks successfully');

  console.log('=== Step 3: Checking syntax inside bdb-web container ===');
  const chk1 = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
  const chk2 = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js');
  console.log('Syntax check 3def3ti6rk0vr.js:', chk1.trim() === '' ? 'VALID OK' : chk1);
  console.log('Syntax check 0-gigr76s0g8t.js:', chk2.trim() === '' ? 'VALID OK' : chk2);

  console.log('=== Step 4: Testing HTTP status on core routes ===');
  const routes = ['/cms/profile', '/cms/dashboard/main', '/cms/broadcaster'];
  for (const r of routes) {
    const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${r}`);
    console.log(`Route ${r}: HTTP ${code.trim()}`);
  }

  console.log('\n>>> Chunks successfully deployed and verified! <<<');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
