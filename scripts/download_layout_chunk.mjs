import { runFE, copyFileToFE } from './fe_exec.mjs';
import cp from 'child_process';
import fs from 'fs';

// Copy 0-gigr76s0g8t.js from container to host /tmp, then scp to local
runFE('docker cp bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js /tmp/0-gigr76s0g8t.js');

// Download from remote /tmp/0-gigr76s0g8t.js to local
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
    `${targetFE}:/tmp/0-gigr76s0g8t.js`,
    '0-gigr76s0g8t.js'
], { timeout: 60000 });

console.log("Successfully downloaded 0-gigr76s0g8t.js to local!");
