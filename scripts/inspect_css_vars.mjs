import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const css = fs.readFileSync('/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css', 'utf8');

// Find :root variables
const rootVars = [...css.matchAll(/--[a-zA-Z0-9_-]+:[^;]+;/g)].map(m => m[0]);
console.log('Total CSS variables defined:', rootVars.length);
console.log('Sample variables:');
console.log(rootVars.slice(0, 30));
"`;

console.log(runFE(cmd));
