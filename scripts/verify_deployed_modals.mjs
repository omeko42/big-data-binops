import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
console.log('File size:', content.length);
console.log('Contains Usulan Mutasi Operator:', content.includes('Usulan Mutasi Operator'));
console.log('Contains renderUserMiniCard:', content.includes('renderUserMiniCard'));
console.log('Contains formatIndoDateStr:', content.includes('formatIndoDateStr'));
console.log('Contains Alihkan ke Mutasi:', content.includes('Alihkan ke Mutasi'));
console.log('Contains REQUEST_DEACTIVATE:', content.includes('REQUEST_DEACTIVATE'));
"`;

console.log(runFE(cmd));
