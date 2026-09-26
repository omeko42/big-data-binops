import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const c = fs.readFileSync('/usr/src/app/.next/static/chunks/34x5c31vs359z.js', 'utf8');

// Search for api calls
let p = 0;
while ((p = c.indexOf('/api', p)) !== -1) {
  console.log('API call at', p, c.substring(p, p + 50));
  p += 4;
}
// Also search for /auth or /user or password
let p2 = 0;
while ((p2 = c.indexOf('password', p2)) !== -1) {
  console.log('password at', p2, c.substring(p2 - 20, p2 + 50));
  p2 += 8;
}
"`;

console.log(runFE(cmd));
