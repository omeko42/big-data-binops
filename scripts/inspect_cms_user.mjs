import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js', 'utf8');

// Search for user-meta or user-avatar or user name in L
const idxL = content.indexOf('function L(');
const sliceL = content.substring(idxL, idxL + 12000);
const uMetaIdx = sliceL.indexOf('cms-user');
console.log('cms-user in L at relative pos:', uMetaIdx);
if (uMetaIdx !== -1) {
    console.log(sliceL.substring(uMetaIdx - 150, uMetaIdx + 800));
}
"`;

console.log(runFE(cmd));
