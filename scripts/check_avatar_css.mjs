import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web grep -rn "cms-user-avatar" /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css || true`;
console.log(runFE(cmd));
