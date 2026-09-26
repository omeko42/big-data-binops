import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web grep -rl "cms-user-avatar" /usr/src/app/.next/static/chunks/ || true`;
console.log(runFE(cmd));
