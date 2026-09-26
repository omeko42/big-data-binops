import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const files = [
  '0-3dt-fu_0n9h.js',
  '0cz1d0mv5g_q7.js',
  '0-gigr76s0g8t.js',
  '0kqp3_mvrigjm_v2.js',
  '0uefab-xpqlc1.js',
  '14mrh2-p_w84d.js',
  '1-y0lpw5my758.js',
  '27jktro2p5rq9.js',
  '310vm2bl3xxpt.js',
  '3rxl-jt3pdxgx.js',
  '3whxe1w8p6lff.js',
  '3yowtoxl1xs_h.js',
  'turbopack-1wm-2ukfdknbl.js'
];

for (const f of files) {
  try {
    const c = fs.readFileSync('/usr/src/app/.next/static/chunks/' + f, 'utf8');
    if (c.includes('Selamat datang')) console.log('Found Selamat datang in:', f);
    if (c.includes('0w77m6y2tq5qr')) console.log('Found 0w77m6y2tq5qr in:', f);
    if (c.includes('dashboard-')) console.log('Found dashboard- in:', f);
  } catch(e) {}
}
"`;

console.log(runFE(cmd));
