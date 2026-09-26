import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -rn 'Selamat datang' /usr/src/app/.next/static/chunks/ 2>/dev/null | head -n 5
grep -rn 'role ' /usr/src/app/.next/static/chunks/ 2>/dev/null | head -n 5
grep -rn 'Kembali' /usr/src/app/.next/static/chunks/ 2>/dev/null | head -n 10
"`;

console.log("Searching chunks on bdb-web with sh...");
const res = runFE(cmd);
console.log(res);
