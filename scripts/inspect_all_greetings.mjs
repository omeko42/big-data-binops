import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const dir = '/usr/src/app/.next/static/chunks/';
const files = [
  '0w77m6y2tq5qr.js',
  'dashboard-ct-total-79de4cddc9e6.js',
  'dashboard-perma-318125d33290.js',
  'dashboard-perma-318125d33290_v2.js',
  'dashboard-repair-d76b08a0fc43.js',
  'dashboard-review-4efd35014c4b.js',
  'dashboard-status-width-1c44eff3348b.js',
  'dashboard-top-crime-af36f038d85e.js',
  'dashboard-ui-07559a346868.js',
  'dashboard-ui-b7a2ccbcd3be.js'
];
for (const f of files) {
  try {
    const c = fs.readFileSync(dir + f, 'utf8');
    const idx = c.indexOf('Selamat datang');
    if (idx !== -1) {
      console.log('=== ' + f + ' ===');
      console.log(c.substring(idx - 20, idx + 140));
    }
  } catch(e) {}
}
"`;

console.log(runFE(cmd));
