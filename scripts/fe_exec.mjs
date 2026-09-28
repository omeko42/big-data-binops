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
    let lastErr;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            return cp.execFileSync(plinkPath, [
                '-batch', '-ssh', '-hostkey', feHostKey, 
                '-pw', config.CAS_SSH_PASSWORD, 
                targetFE, 
                `echo '${b64}' | base64 -d | bash`
            ], { timeout: 35000, maxBuffer: 20 * 1024 * 1024 }).toString();
        } catch (e) {
            lastErr = e;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        }
    }
    throw lastErr;
}

export function copyFileToFE(localPath, remotePath) {
    let lastErr;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            return cp.execFileSync('D:/Putty/pscp.exe', [
                '-batch', '-hostkey', feHostKey,
                '-pw', config.CAS_SSH_PASSWORD,
                localPath,
                `${targetFE}:${remotePath}`
            ], { timeout: 60000 }).toString();
        } catch (e) {
            lastErr = e;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
        }
    }
    throw lastErr;
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('fe_exec.mjs') && process.argv[2]) {
    console.log(runFE(process.argv[2]));
}
