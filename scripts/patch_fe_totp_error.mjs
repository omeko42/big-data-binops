import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const file = '/usr/src/app/.next/static/chunks/0e6hr18kin4n-.js';
const content = fs.readFileSync(file, 'utf8');

const target = 'y(t.data?.message||\\\"Kode authenticator salah.\\\")}catch(e){y(e.response?.data?.message||\\\"Kode authenticator salah.\\\")}';
console.log('Target found:', content.includes(target));

if (content.includes(target)) {
    const replacement = 'y((t.data?.message&&t.data?.message!==\\\"Internal server error\\\")?t.data?.message:\\\"Kode authenticator salah atau telah kedaluwarsa.\\\")}catch(e){let m=e.response?.data?.errors?.totp_token?.[0]||e.response?.data?.message;if(!m||m===\\\"Internal server error\\\")m=\\\"Kode authenticator salah atau telah kedaluwarsa.\\\";y(m)}';
    const newContent = content.replace(target, replacement);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('PATCH_SUCCESS');
}
"`;

console.log(runFE(cmd));
