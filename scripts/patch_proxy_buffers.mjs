import fs from 'fs';
import { runFE } from './fe_exec.mjs';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const pyModifier = `
for conf_path in ['/etc/nginx/sites-available/api.cas', '/etc/nginx/sites-available/cms.cas']:
    with open(conf_path, 'r') as f:
        text = f.read()

    if 'proxy_buffer_size' not in text:
        target = 'proxy_set_header Host '
        replacement = 'proxy_buffer_size 128k;\\n        proxy_buffers 4 256k;\\n        proxy_busy_buffers_size 256k;\\n        proxy_set_header Host '
        text = text.replace(target, replacement)
        with open(conf_path, 'w') as f:
            f.write(text)
        print('Updated proxy buffers in', conf_path)
    else:
        print('Already present in', conf_path)
`;

const b64 = Buffer.from(pyModifier).toString('base64');

console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S python3 -c "$(echo '${b64}' | base64 -d)"
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S nginx -t
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S nginx -s reload
`));
