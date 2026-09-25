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

console.log('=== Step 1: Backup current chunk and CSS in container ===');
console.log(runFE(`
docker exec bdb-web cp /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js.bak-before-pdf-fix-20260926 &&
docker exec bdb-web cp /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css.bak-before-pdf-fix-20260926 &&
echo "BACKUP_SUCCESS"
`));

console.log('=== Step 2: Upload patched JS chunk to host & copy into bdb-web ===');
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

console.log('Deploy JS Output:', resJs.stdout ? resJs.stdout.toString() : '');
if (resJs.stderr && resJs.stderr.toString()) console.error('Deploy JS Error:', resJs.stderr.toString());

console.log('=== Step 3: Upload patched CSS chunk to host & copy into bdb-web ===');
const cssContent = fs.readFileSync('kinerja-unified-filter-export-20260925/20sy5p32bn-wu.css', 'utf8');
const remoteCmdCss = `
cat > /tmp/20sy5p32bn-wu.css &&
docker cp /tmp/20sy5p32bn-wu.css bdb-web:/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css &&
echo "DEPLOY_CSS_SUCCESS"
`;

const resCss = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, targetFE, remoteCmdCss], {
    input: cssContent,
    encoding: 'utf8',
    timeout: 90000
});

console.log('Deploy CSS Output:', resCss.stdout ? resCss.stdout.toString() : '');
if (resCss.stderr && resCss.stderr.toString()) console.error('Deploy CSS Error:', resCss.stderr.toString());

console.log('=== Step 4: Restart bdb-web container ===');
console.log(runFE(`
docker restart bdb-web &&
sleep 3 &&
curl -s -I http://127.0.0.1:3000 | head -n 5 &&
echo "CONTAINER_RESTARTED"
`));

console.log('=== Step 5: Verify live HTTPS endpoints ===');
console.log(runFE(`
echo "JS:"
curl -s -I -k https://cas.bareskrim.polri.go.id/_next/static/chunks/kinerja-perma-external-a42edc88f706.js | head -n 8
echo "CSS:"
curl -s -I -k https://cas.bareskrim.polri.go.id/_next/static/chunks/20sy5p32bn-wu.css | head -n 8
`));

console.log('=== Step 6: Check md5sums on container ===');
console.log(runFE(`
docker exec bdb-web md5sum /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css
`));
