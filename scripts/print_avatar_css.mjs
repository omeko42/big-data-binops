import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sed -n '600,625p' /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css`;
console.log(runFE(cmd));
