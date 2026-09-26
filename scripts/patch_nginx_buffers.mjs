import fs from 'fs';
import { runFE } from './fe_exec.mjs';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const pyModifier = `
with open('/etc/nginx/nginx.conf', 'r') as f:
    lines = f.readlines()

new_lines = []
seen_client_header = False
seen_large_buffers = False

for line in lines:
    if 'client_header_buffer_size' in line:
        if seen_client_header:
            continue
        seen_client_header = True
    if 'large_client_header_buffers' in line:
        if seen_large_buffers:
            continue
        seen_large_buffers = True
    new_lines.append(line)

with open('/etc/nginx/nginx.conf', 'w') as f:
    f.writelines(new_lines)
print('Deduplicated config successfully')
`;

const b64 = Buffer.from(pyModifier).toString('base64');

console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S python3 -c "$(echo '${b64}' | base64 -d)"
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S nginx -t
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S nginx -s reload
`));
