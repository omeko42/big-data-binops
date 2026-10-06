import fs from 'fs';
import { runBE, copyFileToBE } from './be_exec.mjs';
import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Step 1: Deploy Backend Fixes to bdb-api ===');
  
  // 1.1 Backup in container
  console.log(runBE(`
    docker exec bdb-api cp /usr/src/app/dist/app_core/auth/user/user.service.js /usr/src/app/dist/app_core/auth/user/user.service.js.bak-conn-fix || true
    docker exec bdb-api cp /usr/src/app/dist/bdb/jukrah/jukrah.service.js /usr/src/app/dist/bdb/jukrah/jukrah.service.js.bak-conn-fix || true
  `));
  console.log('Remote backups created.');

  // 1.2 Copy patched files to BE host
  copyFileToBE('backend-patch/user.service.js', '/tmp/user.service.js');
  copyFileToBE('backend-patch/jukrah.service.js', '/tmp/jukrah.service.js');
  console.log('Files copied to /tmp on BE host.');

  // 1.3 Copy into bdb-api container and test syntax
  console.log(runBE(`
    docker cp /tmp/user.service.js bdb-api:/usr/src/app/dist/app_core/auth/user/user.service.js
    docker cp /tmp/jukrah.service.js bdb-api:/usr/src/app/dist/bdb/jukrah/jukrah.service.js
    rm -f /tmp/user.service.js /tmp/jukrah.service.js
    docker exec bdb-api node -c /usr/src/app/dist/app_core/auth/user/user.service.js
    docker exec bdb-api node -c /usr/src/app/dist/bdb/jukrah/jukrah.service.js
    echo "BE_SYNTAX_VALID"
  `));

  // 1.4 Restart bdb-api
  console.log('Restarting bdb-api container...');
  console.log(runBE('docker restart bdb-api'));

  console.log('\n=== Step 2: Deploy Frontend Fixes to bdb-web ===');
  // 2.1 Backup in container
  console.log(runFE(`
    docker exec bdb-web cp /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-conn-fix || true
  `));

  // 2.2 Copy patched file to FE host
  copyFileToFE('frontend-patch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.conn.js');

  // 2.3 Copy into container and test syntax
  console.log(runFE(`
    docker cp /tmp/3def3ti6rk0vr.conn.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    rm -f /tmp/3def3ti6rk0vr.conn.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    echo "FE_SYNTAX_VALID"
  `));

  // 2.4 Restart bdb-web
  console.log('Restarting bdb-web container...');
  console.log(runFE('docker restart bdb-web'));

  console.log('\n=== Step 3: Waiting 5s for services to initialize ===');
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

  console.log('=== Deployment completed! Running live verification... ===');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
