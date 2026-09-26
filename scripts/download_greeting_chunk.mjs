import { runFE } from './fe_exec.mjs';
import cp from 'child_process';
import fs from 'fs';

runFE('docker cp bdb-web:/usr/src/app/.next/static/chunks/0w77m6y2tq5qr.js /tmp/0w77m6y2tq5qr.js');

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const targetFE = config.CAS_SSH_USER + '@' + config.CAS_FE_HOST;
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';

cp.execFileSync('D:/Putty/pscp.exe', [
    '-batch', '-hostkey', feHostKey,
    '-pw', config.CAS_SSH_PASSWORD,
    `${targetFE}:/tmp/0w77m6y2tq5qr.js`,
    '0w77m6y2tq5qr.js'
], { timeout: 60000 });

console.log("Successfully downloaded 0w77m6y2tq5qr.js to local!");
