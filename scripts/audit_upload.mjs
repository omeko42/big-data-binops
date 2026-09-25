import fs from 'fs';
import cp from 'child_process';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const targetBE = config.CAS_SSH_USER + '@' + config.CAS_BE_HOST;
const targetFE = config.CAS_SSH_USER + '@' + config.CAS_FE_HOST;
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';
const beHostKey = 'SHA256:zAYHmppgblxgqRQp+jYN9Gs3sNIt2LQ91UJO5I1J2WI';
const plinkPath = 'D:/Putty/plink.exe';

export function runBE(cmd) {
    const b64 = Buffer.from(cmd).toString('base64');
    return cp.execFileSync(plinkPath, [
        '-batch', '-ssh', '-hostkey', beHostKey, 
        '-pw', config.CAS_SSH_PASSWORD, 
        targetBE, 
        `echo '${b64}' | base64 -d | bash`
    ], { timeout: 30000, maxBuffer: 20 * 1024 * 1024 }).toString();
}

export function runFE(cmd) {
    const b64 = Buffer.from(cmd).toString('base64');
    return cp.execFileSync(plinkPath, [
        '-batch', '-ssh', '-hostkey', feHostKey, 
        '-pw', config.CAS_SSH_PASSWORD, 
        targetFE, 
        `echo '${b64}' | base64 -d | bash`
    ], { timeout: 30000, maxBuffer: 20 * 1024 * 1024 }).toString();
}

console.log('=== Checking nginx / proxy on FE host ===');
console.log(runFE('which nginx || true; ps aux | grep -i nginx | head -n 5; grep -rn "client_max_body_size" /etc/nginx/ 2>/dev/null || true'));

console.log('=== Checking nginx / proxy on BE host ===');
console.log(runBE('which nginx || true; ps aux | grep -i nginx | head -n 5; grep -rn "client_max_body_size" /etc/nginx/ 2>/dev/null || true'));
