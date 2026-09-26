import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
find /usr/src/app/.next/server/ -name '*.html' -o -name '*.js' | grep -v '\.bak' | head -n 40
"`;

console.log(runFE(cmd));
