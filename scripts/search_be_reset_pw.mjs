import fs from 'fs';

const c = fs.readFileSync('scratch/live_be_user/user.controller.ts', 'utf8');
let idx = 0;
while ((idx = c.indexOf('reset-password', idx)) !== -1) {
  console.log("Found in user.controller.ts at", idx, c.substring(idx - 30, idx + 200));
  idx += 14;
}
