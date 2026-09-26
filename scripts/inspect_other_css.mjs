import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
for (const f of ['233p45nuh4m5b.css', '34oh417k1w4ti.css']) {
  const p = '/usr/src/app/.next/static/chunks/' + f;
  if (fs.existsSync(p)) {
    console.log('=== ' + f + ' (size: ' + fs.statSync(p).size + ') ===');
    console.log(fs.readFileSync(p, 'utf8').slice(0, 500));
  }
}
"`;

console.log(runFE(cmd));
