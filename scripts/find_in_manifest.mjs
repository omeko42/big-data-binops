import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web sh -c "
find /usr/src/app/.next/ -name '*.json' | xargs grep -l '0w77m6y2tq5qr' 2>/dev/null
find /usr/src/app/.next/ -name '*.json' | xargs grep -l '0-gigr76s0g8t' 2>/dev/null
"`;

console.log(runFE(cmd));
