import fs from 'fs';

const content = fs.readFileSync('auth.service.ts', 'utf8');

let idx = content.indexOf('private async createSecurityOtp');
if (idx !== -1) {
  console.log(content.substring(idx - 100, idx + 1000));
}

let idxVal = content.indexOf('falidationOtp(');
if (idxVal !== -1) {
  console.log('--- falidationOtp: ---');
  console.log(content.substring(idxVal - 50, idxVal + 800));
}
