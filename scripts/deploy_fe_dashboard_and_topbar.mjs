import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('1. Copying patched dashboard and topbar to remote host...');
  copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.patched.js', '/tmp/dashboard-perma-318125d33290_v2.js');
  copyFileToFE('frontend-patch/0-gigr76s0g8t.enhanced.js', '/tmp/0-gigr76s0g8t.js');

  console.log('2. Deploying to bdb-web container...');
  console.log(runFE(`
    docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
    docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    rm -f /tmp/dashboard-perma-318125d33290_v2.js /tmp/0-gigr76s0g8t.js
  `));

  console.log('3. Validating syntax inside container...');
  const v = runFE(`
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    echo "CONTAINER_SYNTAX_OK"
  `);
  console.log(v);

  console.log('4. Verifying content on bdb-web...');
  const verify = runFE(`
    echo "--- Check 1: formatCallsign in dashboard ---"
    docker exec bdb-web grep -o "formatCallsign(r?.callsign" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    echo "--- Check 2: toTitleCase in dashboard ---"
    docker exec bdb-web grep -o "toTitleCase(l.scope_satker)" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    echo "--- Check 3: formatCallsign in topbar ---"
    docker exec bdb-web grep -o "formatCallsign(e?.callsign" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    echo "--- Check 4: toTitleCase in topbar ---"
    docker exec bdb-web grep -o "toTitleCase(e?.satker_nama" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  `);
  console.log(verify);

  console.log('5. Checking web response on port 3000...');
  const webStatus = runFE(`
    docker exec bdb-web node -e "
      const http = require('http');
      http.get('http://127.0.0.1:3000/cms/dashboard/main', res => {
        console.log('Dashboard HTTP Status:', res.statusCode);
        process.exit(0);
      }).on('error', e => {
        console.error('Error:', e.message);
        process.exit(1);
      });
    "
  `);
  console.log(webStatus);
}

main().catch(console.error);
