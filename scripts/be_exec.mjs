import fs from 'fs';
import cp from 'child_process';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const targetBE = config.CAS_SSH_USER + '@' + config.CAS_BE_HOST;
const beHostKey = 'SHA256:zAYHmppgblxgqRQp+jYN9Gs3sNIt2LQ91UJO5I1J2WI';
const plinkPath = 'D:/Putty/plink.exe';

export function runBE(cmd) {
    const b64 = Buffer.from(cmd).toString('base64');
    let lastErr;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            return cp.execFileSync(plinkPath, [
                '-batch', '-ssh', '-hostkey', beHostKey, 
                '-pw', config.CAS_SSH_PASSWORD, 
                targetBE, 
                `echo '${b64}' | base64 -d | bash`
            ], { timeout: 120000, maxBuffer: 20 * 1024 * 1024 }).toString();
        } catch (e) {
            lastErr = e;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
        }
    }
    throw lastErr;
}

export function runBEWithInput(cmd, input) {
    let lastErr;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            return cp.execFileSync(plinkPath, [
                '-batch', '-ssh', '-hostkey', beHostKey,
                '-pw', config.CAS_SSH_PASSWORD,
                targetBE,
                cmd
            ], { input, timeout: 60000, maxBuffer: 20 * 1024 * 1024 }).toString();
        } catch (e) {
            lastErr = e;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
        }
    }
    throw lastErr;
}

export function copyFileToBE(localPath, remotePath) {
    const content = fs.readFileSync(localPath);
    return runBEWithInput(`cat > "${remotePath}"`, content);
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('be_exec.mjs') && process.argv[2]) {
    console.log(runBE(process.argv[2]));
}
