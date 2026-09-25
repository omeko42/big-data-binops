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
    ], { timeout: 45000, maxBuffer: 20 * 1024 * 1024 }).toString();
}

console.log('=== Step 1: Check HTTPS headers for both chunks ===');
console.log(runFE(`
curl -s -I -k https://cas.bareskrim.polri.go.id/_next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js | head -n 6
curl -s -I -k https://cas.bareskrim.polri.go.id/_next/static/chunks/lp-flow-perma-56d42847ec39.js | head -n 6
`));

console.log('=== Step 2: Test 5MB multipart payload against Nginx /api/ on cas.bareskrim.polri.go.id ===');
console.log(runFE(`
dd if=/dev/zero of=/tmp/test_5mb.bin bs=1M count=5 2>/dev/null
curl -s -I -k -X POST -F "test=@/tmp/test_5mb.bin" https://cas.bareskrim.polri.go.id/api/network/probe | head -n 5
rm -f /tmp/test_5mb.bin
`));
