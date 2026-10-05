import { runFE } from './fe_exec.mjs';

const cmd = "curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o 'Otorisasi Cabut Akses Gawai'";
console.log('Public check:', runFE(cmd).trim());
