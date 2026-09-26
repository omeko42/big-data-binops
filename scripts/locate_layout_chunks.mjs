import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
echo '=== GREETING SEARCH ==='
grep -l 'Selamat datang' /usr/src/app/.next/static/chunks/*.js

echo '=== ROLE SEARCH ==='
grep -l 'role superadmin' /usr/src/app/.next/static/chunks/*.js

echo '=== BREADCRUMB / KEMBALI SEARCH ==='
grep -l 'Kembali' /usr/src/app/.next/static/chunks/*.js | head -n 20
"`;

console.log(runFE(cmd));
