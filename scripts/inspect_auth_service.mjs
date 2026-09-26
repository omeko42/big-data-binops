import fs from 'fs';

const content = fs.readFileSync('auth.service.ts', 'utf8');

let idx = 0;
while ((idx = content.indexOf('createSecurityOtp', idx)) !== -1) {
  console.log('Call at', idx, ':', content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 200)));
  console.log('------------------');
  idx += 17;
}
