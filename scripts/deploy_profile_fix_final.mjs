import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('--- Uploading 3def3ti6rk0vr.linkedin_v6.js to bdb-web ---');
copyFileToFE('frontend-patch/3def3ti6rk0vr.linkedin_v6.js', '/tmp/3def3ti6rk0vr.js');
console.log(runFE(`
  docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker exec bdb-web chmod 644 /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  rm -f /tmp/3def3ti6rk0vr.js
`));

const check = runFE(`docker exec bdb-web grep -n "sp.get('id')" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js`);
console.log('Verification check in container:', check);
