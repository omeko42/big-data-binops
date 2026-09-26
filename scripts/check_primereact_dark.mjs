import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const css = fs.readFileSync('/usr/src/app/.next/static/chunks/34oh417k1w4ti.css', 'utf8');
console.log('Includes data-theme in PrimeReact CSS?', css.includes('data-theme'));
console.log('Includes dark in PrimeReact CSS?', css.includes('dark'));
"`;

console.log(runFE(cmd));
