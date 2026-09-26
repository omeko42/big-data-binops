import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -l 'totp' /usr/src/app/.next/static/chunks/*.js | head -n 15
"`;

console.log(runFE(cmd));
