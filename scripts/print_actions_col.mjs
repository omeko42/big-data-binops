import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
const idx = content.indexOf('local_password_enabled:e.');
console.log(content.slice(idx, idx + 1000));
"`;
console.log(runFE(cmd));
