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
    ], { timeout: 60000, maxBuffer: 20 * 1024 * 1024 }).toString();
}

console.log('=== Step 1: Backup current chunk in container ===');
console.log(runFE(`
docker exec bdb-web cp /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js.bak-before-export-fix-20260926 &&
echo "BACKUP_SUCCESS"
`));

console.log('=== Step 2: Upload patched chunk to host & copy into bdb-web ===');
const jsContent = fs.readFileSync('kinerja-unified-filter-export-20260925/kinerja-perma-external-a42edc88f706.js', 'utf8');
const remoteCmdJs = `
cat > /tmp/kp-export-fixed.js &&
docker cp /tmp/kp-export-fixed.js bdb-web:/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js &&
docker exec bdb-web node --check /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js &&
echo "DEPLOY_CHUNK_SUCCESS"
`;

const resJs = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, targetFE, remoteCmdJs], {
    input: jsContent,
    encoding: 'utf8',
    timeout: 90000
});

console.log('Deploy Output:', resJs.stdout ? resJs.stdout.toString() : '');
if (resJs.stderr && resJs.stderr.toString()) console.error('Deploy Error:', resJs.stderr.toString());

console.log('=== Step 3: Restart bdb-web container ===');
console.log(runFE(`
docker restart bdb-web &&
sleep 3 &&
curl -s -I http://127.0.0.1:3000 | head -n 5 &&
echo "CONTAINER_RESTARTED"
`));

console.log('=== Step 4: Verify live HTTPS endpoint for chunk ===');
console.log(runFE(`
curl -s -I -k https://cas.bareskrim.polri.go.id/_next/static/chunks/kinerja-perma-external-a42edc88f706.js | head -n 8
`));

console.log('=== Step 5: Check md5sum on container ===');
console.log(runFE(`
docker exec bdb-web md5sum /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js
`));
