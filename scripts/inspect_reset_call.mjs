import { runFE } from './fe_exec.mjs';

const res = runFE(`docker exec bdb-web grep -n -C 5 "Authentication/reset-password" /usr/src/app/.next/static/chunks/profile-password-v2-eedb4a42b164.js || true`);
console.log(res.substring(0, 3000));
