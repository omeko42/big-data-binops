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
    return cp.execFileSync(plinkPath, [
        '-batch', '-ssh', '-hostkey', beHostKey, 
        '-pw', config.CAS_SSH_PASSWORD, 
        targetBE, 
        `echo '${b64}' | base64 -d | bash`
    ], { timeout: 45000, maxBuffer: 20 * 1024 * 1024 }).toString();
}

if (process.argv[2]) {
    console.log(runBE(process.argv[2]));
}
