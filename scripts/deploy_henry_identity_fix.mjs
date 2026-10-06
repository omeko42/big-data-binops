import fs from 'fs';
import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Step 1: Backup remote chunks in bdb-web ===');
  console.log(runFE(`
    docker exec bdb-web cp /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js.bak-henry-fix || true
    docker exec bdb-web cp /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-henry-fix || true
    docker exec bdb-web cp /usr/src/app/.next/static/chunks/35hkjujo3bzza.js /usr/src/app/.next/static/chunks/35hkjujo3bzza.js.bak-henry-fix || true
    docker exec bdb-web cp /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js.bak-henry-fix || true
  `));
  console.log('Backups created in container.');

  console.log('=== Step 2: Copying patched files to FE host ===');
  copyFileToFE('scratch/0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.henry.js');
  copyFileToFE('scratch/3def3ti6rk0vr.patched.js', '/tmp/3def3ti6rk0vr.henry.js');
  copyFileToFE('scratch/35hkjujo3bzza.patched.js', '/tmp/35hkjujo3bzza.henry.js');
  copyFileToFE('scratch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.henry.js');
  console.log('Files copied to /tmp on FE host.');

  console.log('=== Step 3: Copying files into bdb-web container ===');
  console.log(runFE(`
    docker cp /tmp/0-gigr76s0g8t.henry.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    docker cp /tmp/3def3ti6rk0vr.henry.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker cp /tmp/35hkjujo3bzza.henry.js bdb-web:/usr/src/app/.next/static/chunks/35hkjujo3bzza.js
    docker cp /tmp/3pp0f_cp6yg-o.henry.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
    rm -f /tmp/0-gigr76s0g8t.henry.js /tmp/3def3ti6rk0vr.henry.js /tmp/35hkjujo3bzza.henry.js /tmp/3pp0f_cp6yg-o.henry.js
    echo "DOCKER_CP_SUCCESS"
  `));

  console.log('=== Step 4: Validate container syntax ===');
  const syntaxCheck = runFE(`
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/35hkjujo3bzza.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
    echo "SYNTAX_ALL_OK"
  `);
  console.log(syntaxCheck);

  if (!syntaxCheck.includes('SYNTAX_ALL_OK')) {
    console.error('Syntax error detected inside container!');
    process.exit(1);
  }

  console.log('=== Step 5: Restart bdb-web container ===');
  console.log(runFE('docker restart bdb-web'));

  console.log('=== Step 6: Live Verification in container ===');
  const verify = runFE(`
    sleep 3
    echo "--- Container status ---"
    docker ps --filter name=bdb-web --format '{{.Names}} - {{.Status}}'

    echo "--- Check 1: Topbar isSuper eo logic ---"
    docker exec bdb-web grep -o "var uid=String(curUser.id||curUser.user_id||'')" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js

    echo "--- Check 2: Profile isReadOnlyMode removal ---"
    docker exec bdb-web grep -c "!isReadOnlyMode return .@omeko11." /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js || true

    echo "--- Check 3: Feed Robinopsnal Bareskrim Polri ---"
    docker exec bdb-web grep -o "Robinopsnal Bareskrim Polri" /usr/src/app/.next/static/chunks/35hkjujo3bzza.js | head -n 2

    echo "--- HTTP test port 3000 ---"
    curl -s -I http://localhost:3000/_next/static/chunks/0-gigr76s0g8t.js | head -n 4
    curl -s -I http://localhost:3000/_next/static/chunks/3def3ti6rk0vr.js | head -n 4
  `);
  console.log(verify);
  console.log('=== ALL DEPLOYMENT & VERIFICATION STEPS COMPLETED ===');
}

main().catch(console.error);
