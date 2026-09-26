import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/3def3ti6rk0vr.js', 'utf8');

const idx = content.indexOf('onClick:eA');
console.log("onClick:eA at:", idx);
if (idx !== -1) {
    console.log(content.substring(idx - 40, idx + 100));
}

// search for eA definition: async function eA, let eA=, const eA=
const m = content.match(/async\s+function\s+eA\s*\(/);
if (m) {
    const p = m.index;
    console.log("async function eA at", p, ":", content.substring(p, p + 600));
} else {
    // search regex for eA=
    const m2 = content.match(/eA\s*=\s*(?:async)?\s*(?:function|\([^)]*\)\s*=>)/);
    if (m2) {
        console.log("eA= at", m2.index, ":", content.substring(m2.index, m2.index + 600));
    }
}
