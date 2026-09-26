import fs from 'fs';

const orig = fs.readFileSync('bdb-web-audit-20260812/.next/static/chunks/3def3ti6rk0vr.js', 'utf8');
const patched = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

// Find differences
let i = 0, j = 0;
while (i < orig.length && j < patched.length) {
    if (orig[i] !== patched[j]) {
        const startOrig = i;
        const startPatched = j;
        let matchLen = 40;
        let look = 0;
        for (look = i + 1; look < i + 1000 && look < orig.length; look++) {
            const probe = orig.substring(look, look + matchLen);
            const pIdx = patched.indexOf(probe, j);
            if (pIdx !== -1 && pIdx < j + 5000) {
                console.log(`\n=== Diff at orig:${startOrig}, patched:${startPatched} ===`);
                console.log('--- ORIG (' + (look - startOrig) + ' chars) ---');
                console.log(orig.substring(startOrig, look));
                console.log('--- PATCHED (' + (pIdx - startPatched) + ' chars) ---');
                console.log(patched.substring(startPatched, pIdx));
                i = look;
                j = pIdx;
                break;
            }
        }
        if (look >= i + 1000 || look >= orig.length) {
            console.log(`\n=== Final Diff at orig:${startOrig}, patched:${startPatched} ===`);
            console.log('--- ORIG ---', orig.substring(startOrig, startOrig + 200));
            console.log('--- PATCHED ---', patched.substring(startPatched, startPatched + 200));
            break;
        }
    } else {
        i++;
        j++;
    }
}
