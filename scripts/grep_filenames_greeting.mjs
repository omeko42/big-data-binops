import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -l 'Selamat datang' /usr/src/app/.next/static/chunks/*.js | grep -v '\.bak'
"`;

console.log(runFE(cmd));
