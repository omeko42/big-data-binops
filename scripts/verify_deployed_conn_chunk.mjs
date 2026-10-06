import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const content = fs.readFileSync('/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js', 'utf8');

const checks = [
  { name: 'activeConnId check', pass: content.includes('var activeConnId = connTo || eNetworkConnectedTarget || a?.id || mySelf?.id;') },
  { name: 'no hardcoded || 1 in option', pass: !content.includes('(a?.connections_count || 1)') },
  { name: 'pagination passes connTarget', pass: content.includes('eNetworkConnectedTarget || a?.id || mySelf?.id') },
  { name: 'onClick sets targetUid properly', pass: content.includes('var targetUid = a?.id || mySelf?.id;') },
  { name: 'setNetworkTotal uses cCount', pass: content.includes('setNetworkTotal(cCount);') }
];

console.table(checks);
const allPassed = checks.every(c => c.pass);
console.log('ALL FRONTEND CHECKS PASSED:', allPassed);
process.exit(allPassed ? 0 : 1);
"`;

console.log(runFE(cmd));
