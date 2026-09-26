import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -rn '0w77m6y2tq5qr' /usr/src/app/.next/ 2>/dev/null | head -n 10
grep -rn 'dashboard-ui-b7a2ccbcd3be' /usr/src/app/.next/ 2>/dev/null | head -n 5
"`;

console.log(runFE(cmd));
