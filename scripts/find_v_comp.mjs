import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/3def3ti6rk0vr.js', 'utf8');

const idx = content.indexOf('fld-3def3ti6rk0vr-15');
console.log("Usage of V:", content.substring(idx - 100, idx + 400));

// find definition of V: var V= or function V or let V=
for (const p of ["function V(", "var V=", "let V=", "const V="]) {
    const pos = content.indexOf(p);
    if (pos !== -1) {
        console.log("Found:", p, "at", pos, ":", content.substring(pos, pos + 300));
    }
}
