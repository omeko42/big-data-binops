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

console.log('Downloading upload-doc-form-1mb-help-6acc5bceec6e.js from bdb-web...');
const b64Content = runFE('docker exec bdb-web cat /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js | base64 -w 0');
const buf = Buffer.from(b64Content.trim(), 'base64');
fs.writeFileSync('scratch/upload-doc-form-1mb-help-6acc5bceec6e.js', buf);
console.log('Saved to scratch/upload-doc-form-1mb-help-6acc5bceec6e.js, size:', buf.length, 'bytes');
