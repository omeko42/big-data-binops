import { runFE } from './fe_exec.mjs';

const script = `
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js', 'utf8');
const idx = content.indexOf('cms-user-avatar');
// Let's find "eo" and "ec" inside this file
const sub = content.substring(idx - 15000, idx);
const parts = sub.split(/function\s*\(/);
console.log('Parts count:', parts.length);
console.log('Start of component (part -2):', parts[parts.length - 2]?.substring(0, 500));
console.log('Or last part (part -1):', parts[parts.length - 1]?.substring(0, 500));
`;
const b64 = Buffer.from(script).toString('base64');
const res = runFE(`docker exec bdb-web node -e "$(echo '${b64}' | base64 -d)"`);
console.log(res);
