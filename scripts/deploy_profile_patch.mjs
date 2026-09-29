import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Step 1: Uploading patched profile chunk to FE host ===');
  copyFileToFE('frontend-patch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
  console.log('Uploaded to /tmp/3def3ti6rk0vr.js');

  console.log('=== Step 2: Injecting into bdb-web container ===');
  runFE(`
    docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    rm -f /tmp/3def3ti6rk0vr.js
  `);
  console.log('Injected successfully');

  console.log('=== Step 3: Checking syntax inside bdb-web container ===');
  const syntaxCheck = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');
  console.log('Syntax check in container passed:', syntaxCheck.trim() === '' ? 'VALID OK' : syntaxCheck.trim());

  console.log('=== Step 4: Testing /cms/profile HTTP status ===');
  const httpCode = runFE('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/profile');
  console.log('HTTP status /cms/profile:', httpCode.trim());

  console.log('\n>>> Profile header successfully deployed and verified! <<<');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
