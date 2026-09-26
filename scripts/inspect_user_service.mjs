import fs from 'fs';

const content = fs.readFileSync('user.service.ts', 'utf8');

let idx = content.indexOf('effectivePolri');
if (idx !== -1) {
  console.log('--- Context in updateProfile: ---');
  console.log(content.substring(idx - 200, idx + 600));
}
