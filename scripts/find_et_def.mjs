import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/3def3ti6rk0vr.js', 'utf8');

const m = content.match(/async\s+function\s+eT\s*\(/);
if (m) {
    console.log(content.substring(m.index, m.index + 500));
}
