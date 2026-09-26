import fs from 'fs';

const c = fs.readFileSync('scratch/live_be_user/user.controller.ts', 'utf8');
const idx = c.indexOf("@Post(':id/reset-password-email')");
console.log(c.substring(idx, idx + 600));
