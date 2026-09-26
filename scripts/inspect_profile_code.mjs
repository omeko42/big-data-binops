import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/3def3ti6rk0vr.js', 'utf8');
console.log("Length:", content.length);

function findMatches(pattern, len = 300) {
    let pos = 0;
    const matches = [];
    while (true) {
        const idx = content.indexOf(pattern, pos);
        if (idx === -1) break;
        matches.push(content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + len)));
        pos = idx + pattern.length;
        if (matches.length >= 10) break;
    }
    return matches;
}

console.log("=== PANGKAT SEARCH ===");
console.log(findMatches("pangkat"));

console.log("=== EMAIL_POLRI SEARCH ===");
console.log(findMatches("email_polri"));

console.log("=== EMAIL SEARCH ===");
console.log(findMatches("email:"));

console.log("=== PASSWORD SEARCH ===");
console.log(findMatches("password"));
