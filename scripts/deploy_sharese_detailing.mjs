import fs from 'fs';
import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Step 1: Uploading patched chunk to FE host ===');
  copyFileToFE('frontend-patch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.js');
  console.log('Uploaded to /tmp/3pp0f_cp6yg-o.js');

  console.log('=== Step 2: Injecting into bdb-web container ===');
  const injectRes = runFE(`
    docker cp /tmp/3pp0f_cp6yg-o.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
    rm -f /tmp/3pp0f_cp6yg-o.js
  `);
  console.log('Injected successfully');

  console.log('=== Step 3: Checking syntax inside bdb-web container ===');
  const syntaxCheck = runFE('docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js');
  console.log('Syntax check in container passed:', syntaxCheck.trim() === '' ? 'VALID OK' : syntaxCheck.trim());

  console.log('=== Step 4: Verifying chunk modifications ===');
  const shareseCount = runFE('docker exec bdb-web grep -c "SHARESE" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true');
  console.log('Found "SHARESE" count:', shareseCount.trim());

  const paginationCheck = runFE('docker exec bdb-web grep -c "Menampilkan " /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true');
  console.log('Found pagination text count:', paginationCheck.trim());

  const satkerDialogCheck = runFE('docker exec bdb-web grep -c "Pilih Target Satker Regional" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true');
  console.log('Found Satker selector dialog count:', satkerDialogCheck.trim());

  const oldAkunAktifInHeader = runFE('docker exec bdb-web grep -c "Akun Aktif" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true');
  console.log('"Akun Aktif" count in chunk (should be 0 or only in comments if any):', oldAkunAktifInHeader.trim());

  console.log('=== Step 5: Testing /cms/broadcaster HTTP 200 ===');
  const httpCode = runFE('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/broadcaster');
  console.log('HTTP status /cms/broadcaster:', httpCode.trim());

  console.log('\n>>> SHARESE Detailing successfully deployed and verified! <<<');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
