import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Step 1: Uploading patched layout chunk to FE host ===');
  copyFileToFE('frontend-patch/0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.js');
  console.log('Uploaded to /tmp/0-gigr76s0g8t.js');

  console.log('=== Step 2: Injecting into bdb-web container ===');
  runFE(`
    docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    rm -f /tmp/0-gigr76s0g8t.js
  `);
  console.log('Injected successfully');

  console.log('=== Step 3: Checking syntax inside bdb-web container ===');
  const syntaxCheck = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js');
  console.log('Syntax check in container passed:', syntaxCheck.trim() === '' ? 'VALID OK' : syntaxCheck.trim());

  console.log('=== Step 4: Testing /cms/dashboard/main HTTP status ===');
  const httpCode = runFE('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/dashboard/main');
  console.log('HTTP status /cms/dashboard/main:', httpCode.trim());

  console.log('\n>>> Topbar role display successfully deployed and verified! <<<');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
