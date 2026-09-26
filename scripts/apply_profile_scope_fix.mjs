import fs from 'fs';

let content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

const target = '34850,e=>{"use strict";';
if (!content.includes(target)) {
    console.error("Target 34850 not found!");
    process.exit(1);
}

const replacement = '34850,e=>{"use strict";function maskEmail(e){if(!e||"string"!=typeof e)return e||"";let t=e.split("@");if(t.length<2){return e.length<=4?e[0]+"***":e.slice(0,2)+"****"+e.slice(-2)}let n=t[0],r=t.slice(1).join("@");return n.length<=4?n[0]+"***@"+r:n.slice(0,4)+"****@"+r}function maskPhone(e){return!e||"string"!=typeof e||e.length<8?e:e.slice(0,4)+"****"+e.slice(-3)}globalThis.maskEmail=maskEmail;globalThis.maskPhone=maskPhone;';

content = content.replace(target, replacement);

fs.writeFileSync('3def3ti6rk0vr.patched.js', content, 'utf8');
console.log("Successfully injected maskEmail and maskPhone directly into module 34850 and globalThis!");
