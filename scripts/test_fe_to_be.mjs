import { runFE } from './fe_exec.mjs';

const script = `
const http = require('http');
http.get('http://10.0.0.x:3850/api/bdb/menu-access', res => {
  console.log('FE to BE HTTP Status:', res.statusCode);
  process.exit(0);
}).on('error', e => {
  console.error('FE to BE Error:', e.message);
  process.exit(1);
});
`;

const b64 = Buffer.from(script).toString('base64');
const out = runFE(`docker exec bdb-web node -e "eval(Buffer.from('${b64}', 'base64').toString('utf8'))"`);
console.log(out);
