import { runFE } from './fe_exec.mjs';

const res = runFE(`docker exec bdb-api node -e '
const cp = require("child_process");
// Run grep on FE container
'`);

const res2 = runFE("docker exec bdb-web grep -rn 'Kembali' /usr/src/app/.next/static/chunks/ 2>/dev/null | head -n 30 || true");
console.log('Grep Kembali in bdb-web chunks:\n', res2);
