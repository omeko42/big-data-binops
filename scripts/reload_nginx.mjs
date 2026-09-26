import { runFE } from './fe_exec.mjs';
import fs from 'fs';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const pass = (envContent.match(/^CAS_SUDO_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');

const out = runFE(`
  echo '${pass}' | sudo -S systemctl reload nginx
  echo "NGINX_RELOAD_OK"
`);

console.log(out);
