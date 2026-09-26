import { runFE } from './fe_exec.mjs';

const script = `
const fs = require('fs');
const css = fs.readFileSync('/usr/src/app/.next/static/chunks/34oh417k1w4ti.css', 'utf8');
const idx = css.indexOf('.p-button.p-button-info');
if (idx !== -1) {
    console.log(css.substring(idx - 100, idx + 400));
} else {
    console.log('Not found .p-button.p-button-info');
}
`;
const b64 = Buffer.from(script).toString('base64');
console.log(runFE(`echo '${b64}' | base64 -d | docker exec -i bdb-web node`));
