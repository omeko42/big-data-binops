import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -rn 'Selamat datang' /usr/src/app/.next/static/chunks/ | grep -v '\.bak'
"`;

console.log(runFE(cmd));
