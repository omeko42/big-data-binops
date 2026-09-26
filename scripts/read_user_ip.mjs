import fs from 'fs';
import { runFE } from './fe_exec.mjs';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S grep "10.88.67.130" /var/log/nginx/access.log | tail -n 25 || true
`));
