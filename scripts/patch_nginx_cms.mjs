import fs from 'fs';
import cp from 'child_process';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const targetFE = config.CAS_SSH_USER + '@' + config.CAS_FE_HOST;
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';
const plinkPath = 'D:/Putty/plink.exe';

export function runFE(cmd) {
    const b64 = Buffer.from(cmd).toString('base64');
    return cp.execFileSync(plinkPath, [
        '-batch', '-ssh', '-hostkey', feHostKey, 
        '-pw', config.CAS_SSH_PASSWORD, 
        targetFE, 
        `echo '${b64}' | base64 -d | bash`
    ], { timeout: 30000, maxBuffer: 20 * 1024 * 1024 }).toString();
}

console.log('=== Step 1: Backup /etc/nginx/sites-enabled/cms.cas ===');
console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S cp /etc/nginx/sites-enabled/cms.cas /etc/nginx/sites-enabled/cms.cas.bak-before-upload-fix-20260925
`));

console.log('=== Step 2: Read current cms.cas and insert client_max_body_size 24m; ===');
const currentConf = runFE(`cat /etc/nginx/sites-enabled/cms.cas`);

let updatedConf = currentConf;
if (updatedConf.includes('client_max_body_size')) {
    console.log('client_max_body_size already present, updating value to 24m...');
    updatedConf = updatedConf.replace(/client_max_body_size\s+[^;]+;/, 'client_max_body_size 24m;');
} else {
    console.log('Inserting client_max_body_size 24m; into server block...');
    updatedConf = updatedConf.replace(
        'server_name cas.bareskrim.polri.go.id;',
        'server_name cas.bareskrim.polri.go.id;\n\n    # CAS upload: 20 MB per file, buffer proxy 24 MB\n    client_max_body_size 24m;'
    );
}

const b64NewConf = Buffer.from(updatedConf).toString('base64');
console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S bash -c "echo '${b64NewConf}' | base64 -d > /etc/nginx/sites-enabled/cms.cas"
`));

console.log('=== Step 3: Test Nginx configuration ===');
console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S nginx -t
`));

console.log('=== Step 4: Reload Nginx ===');
console.log(runFE(`
echo '${config.CAS_SUDO_PASSWORD}' | sudo -S systemctl reload nginx
`));

console.log('=== Step 5: Verify cms.cas contains client_max_body_size ===');
console.log(runFE(`grep -C 3 "client_max_body_size" /etc/nginx/sites-enabled/cms.cas`));
