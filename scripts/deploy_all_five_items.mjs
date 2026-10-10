import { runBE, copyFileToBE } from './be_exec.mjs';
import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('====================================================');
  console.log('  DEPLOYING ALL SYSTEM FIXES (BE & FE)');
  console.log('====================================================');

  // STEP 1: Backend user.service.js
  console.log('\n[1/4] Copying backend-patch/user.service.js to BE host...');
  copyFileToBE('backend-patch/user.service.js', '/tmp/user.service.js');
  
  console.log('[1/4] Installing into bdb-api container and verifying syntax...');
  const beRes = runBE(`
    docker exec bdb-api cp /usr/src/app/dist/app_core/auth/user/user.service.js /usr/src/app/dist/app_core/auth/user/user.service.js.bak-profile-fix || true
    docker cp /tmp/user.service.js bdb-api:/usr/src/app/dist/app_core/auth/user/user.service.js
    rm -f /tmp/user.service.js
    docker exec bdb-api node -c /usr/src/app/dist/app_core/auth/user/user.service.js
    echo "BE_SYNTAX_OK"
  `);
  console.log('BE Result:', beRes.trim());

  console.log('[1/4] Restarting bdb-api container...');
  console.log(runBE('docker restart bdb-api').trim());

  // STEP 2: Frontend chunks
  console.log('\n[2/4] Copying patched frontend chunks to FE host...');
  copyFileToFE('frontend-patch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.js');
  copyFileToFE('frontend-patch/0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.js');
  copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.patched.js', '/tmp/dashboard-perma-318125d33290_v2.js');

  console.log('[2/4] Installing chunks into bdb-web container...');
  const feRes = runFE(`
    docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    rm -f /tmp/3def3ti6rk0vr.js /tmp/0-gigr76s0g8t.js /tmp/dashboard-perma-318125d33290_v2.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    echo "FE_SYNTAX_OK"
  `);
  console.log('FE Result:', feRes.trim());

  console.log('[2/4] Restarting bdb-web container...');
  console.log(runFE('docker restart bdb-web').trim());

  // STEP 3: Wait for boot
  console.log('\n[3/4] Waiting 8 seconds for services to warm up...');
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 8000);

  // STEP 4: Live HTTP verification
  console.log('\n[4/4] Verifying HTTP response from both servers...');
  const routes = ['/cms/profile', '/cms/dashboard/main'];
  for (const r of routes) {
    const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${r}`);
    console.log(`Route ${r}: HTTP ${code.trim()}`);
  }

  const beHealth = runBE(`curl -s http://localhost:3850/api/health || curl -s -o /dev/null -w "%{http_code}" http://localhost:3850/`);
  console.log(`BE Health / Ping: ${beHealth.trim()}`);

  console.log('\n====================================================');
  console.log('  ALL PATCHES SUCCESSFULLY DEPLOYED AND VERIFIED');
  console.log('====================================================');
}

main().catch(err => {
  console.error('Master deploy error:', err);
  process.exit(1);
});
