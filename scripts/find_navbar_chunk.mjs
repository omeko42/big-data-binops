import { runFE } from './fe_exec.mjs';

const res = runFE("docker exec bdb-web grep -rn 'Sangat Baik' /usr/src/app/.next/static/chunks/ 2>/dev/null || true");
console.log('Search for Sangat Baik:\n', res);

const res2 = runFE("docker exec bdb-web grep -rn 'Kembali ke Akun Saya' /usr/src/app/.next/static/chunks/ 2>/dev/null || true");
console.log('Search for Kembali ke Akun Saya:\n', res2);
