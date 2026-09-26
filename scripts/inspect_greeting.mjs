import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
grep -on 'Selamat datang[^.]*' /usr/src/app/.next/static/chunks/0w77m6y2tq5qr.js
"`;

console.log(runFE(cmd));
