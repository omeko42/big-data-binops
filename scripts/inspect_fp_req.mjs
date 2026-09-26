import fs from 'fs';

const content = fs.readFileSync('auth.service.ts', 'utf8');
const idx = content.indexOf('forgotPasswordRequest(');
console.log(content.substring(idx, idx + 1800));
