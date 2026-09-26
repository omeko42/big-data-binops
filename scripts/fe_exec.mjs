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

export function copyFileToFE(localPath, remotePath) {
    return cp.execFileSync('D:/Putty/pscp.exe', [
        '-batch', '-hostkey', feHostKey,
        '-pw', config.CAS_SSH_PASSWORD,
        localPath,
        `${targetFE}:${remotePath}`
    ], { timeout: 60000 }).toString();
}

if (process.argv[2]) {
    console.log(runFE(process.argv[2]));
}
