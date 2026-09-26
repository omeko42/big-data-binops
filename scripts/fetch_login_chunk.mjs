import { runFE } from './fe_exec.mjs';
import fs from 'fs';

function main() {
    runFE(`docker exec bdb-web cat /usr/src/app/.next/static/chunks/3jkbfmy5u6eqq.js > /tmp/3jkbfmy5u6eqq.js`);
    // read it
    const out = runFE(`cat /tmp/3jkbfmy5u6eqq.js`);
    fs.writeFileSync('3jkbfmy5u6eqq.js', out, 'utf8');
    console.log("3jkbfmy5u6eqq.js copied, len:", out.length);
}

main();
