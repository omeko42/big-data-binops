import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -l 'Selamat datang' \$(find /usr/src/app/.next/server/ -name '*.js') 2>/dev/null
"`;

console.log(runFE(cmd));
