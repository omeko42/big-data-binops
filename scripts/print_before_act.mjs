import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
const idx = content.indexOf('field:\\\"activity_score\\\"');
console.log(content.slice(Math.max(0, idx - 2500), idx + 200));
"`;
console.log(runFE(cmd));
