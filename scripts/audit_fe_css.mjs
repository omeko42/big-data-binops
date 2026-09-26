import { runFE } from './fe_exec.mjs';

console.log('=== CSS Files in Next Static ===');
console.log(runFE('docker exec bdb-web find /usr/src/app/.next/static -name "*.css"'));

console.log('=== How Dark Mode is applied to DOM (HTML / Body tags) ===');
console.log(runFE(`docker exec bdb-web grep -rn "dark" /usr/src/app/.next/static/chunks/ | grep -E "(classList|data-theme|setAttribute|theme)" | head -n 30`));
