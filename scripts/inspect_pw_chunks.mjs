import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
['profile-password-v2-eedb4a42b164.js', '34x5c31vs359z.js'].forEach(f => {
  try {
    const c = fs.readFileSync('/usr/src/app/.next/static/chunks/' + f, 'utf8');
    console.log('=== ' + f + ' (len: ' + c.length + ') ===');
    console.log(c.substring(0, 500));
  } catch(e) {}
});
"`;

console.log(runFE(cmd));
