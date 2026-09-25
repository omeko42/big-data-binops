import fs from 'fs';
import cp from 'child_process';

const envContent = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const target = config.CAS_SSH_USER + '@' + config.CAS_FE_HOST;
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';

console.log('=== Step 1: Deploying CSS ===');
const cssContent = fs.readFileSync('scratch/20sy5p32bn-wu.refined.css', 'utf8');
const remoteCmdCss = `
cat > /tmp/20sy5p32bn-wu.refined.css &&
docker cp /tmp/20sy5p32bn-wu.refined.css bdb-web:/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css &&
echo "DEPLOY_CSS_SUCCESS"
`;

const resCss = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, remoteCmdCss], {
    input: cssContent,
    encoding: 'utf8',
    timeout: 60000
});

console.log('CSS Deploy Output:', resCss.stdout ? resCss.stdout.toString() : '');
if (resCss.stderr && resCss.stderr.toString()) console.error('CSS Deploy Error:', resCss.stderr.toString());

console.log('=== Step 2: Deploying JS Chunk ===');
const jsContent = fs.readFileSync('scratch/kinerja-perma-external-a42edc88f706.refined.js', 'utf8');
const remoteCmdJs = `
cat > /tmp/kp.chunk.refined.js &&
docker cp /tmp/kp.chunk.refined.js bdb-web:/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js &&
echo "DEPLOY_JS_SUCCESS"
`;

const resJs = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, remoteCmdJs], {
    input: jsContent,
    encoding: 'utf8',
    timeout: 90000
});

console.log('JS Deploy Output:', resJs.stdout ? resJs.stdout.toString() : '');
if (resJs.stderr && resJs.stderr.toString()) console.error('JS Deploy Error:', resJs.stderr.toString());

console.log('=== Step 3: Restarting bdb-web & Verifying ===');
const remoteRestart = `
docker restart bdb-web &&
sleep 3 &&
curl -s -I http://localhost:3000 | head -n 5 &&
docker exec bdb-web ls -la /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js &&
echo "ALL_DEPLOY_COMPLETE"
`;

const resRestart = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, remoteRestart], {
    encoding: 'utf8',
    timeout: 60000
});

console.log('Restart & Verify Output:', resRestart.stdout ? resRestart.stdout.toString() : '');
if (resRestart.stderr && resRestart.stderr.toString()) console.error('Restart Error:', resRestart.stderr.toString());
