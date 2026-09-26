import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const css = fs.readFileSync('/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css', 'utf8');
const idx = css.indexOf('--cas-bg-app');
if (idx !== -1) {
  console.log('--- Light theme variables ---');
  console.log(css.slice(idx - 50, idx + 800));
  const idxDark = css.indexOf('--cas-bg-app', idx + 100);
  if (idxDark !== -1) {
    console.log('--- Dark theme variables ---');
    console.log(css.slice(idxDark - 50, idxDark + 800));
  } else {
    console.log('NO DARK --cas- variables found!');
  }
}
"`;

console.log(runFE(cmd));
