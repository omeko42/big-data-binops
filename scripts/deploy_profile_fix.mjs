import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('--- DEPLOYING FIXED 3def3ti6rk0vr.js TO BDB-WEB ---');
  
  console.log('1. Uploading frontend-patch/3def3ti6rk0vr.linkedin_v3.js to FE host /tmp ...');
  copyFileToFE('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', '/tmp/3def3ti6rk0vr.linkedin_v3.js');

  console.log('2. Copying into container bdb-web...');
  runFE(`
    docker cp /tmp/3def3ti6rk0vr.linkedin_v3.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    rm -f /tmp/3def3ti6rk0vr.linkedin_v3.js
  `);

  console.log('3. Validating syntax inside bdb-web container...');
  const syntax = runFE(`
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    echo "PROFILE_SYNTAX_OK"
  `);
  console.log('   Syntax check:', syntax.trim());

  console.log('4. Restarting bdb-web...');
  runFE('docker restart bdb-web');

  console.log('5. Waiting 7 seconds for Next.js to initialize...');
  await new Promise(r => setTimeout(r, 7000));

  console.log('6. Verifying profile page and chunk HTTP status...');
  const res = runFE(`
    echo "Profile Page HTTP: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/cms/profile)"
    echo "Profile Chunk HTTP: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/_next/static/chunks/3def3ti6rk0vr.js)"
    echo "Inside Module 34850 has formatCallsign: $(docker exec bdb-web grep -o 'globalThis.formatCallsign = formatCallsign' /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | wc -l)"
  `);
  console.log(res);

  console.log('✓ Deployment of profile scoping fix finished successfully!');
}

main().catch(err => {
  console.error('❌ ERROR:', err);
  process.exit(1);
});
