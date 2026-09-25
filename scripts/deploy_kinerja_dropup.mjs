import fs from 'fs';
import cp from 'child_process';

const envContent = fs.readFileSync('CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const target = config.CAS_SSH_USER + '@' + config.CAS_FE_HOST;
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';
const plinkPath = 'D:/Putty/plink.exe';

export function runFE(cmd) {
    const b64 = Buffer.from(cmd).toString('base64');
    return cp.execFileSync(plinkPath, [
        '-batch', '-ssh', '-hostkey', feHostKey, 
        '-pw', config.CAS_SSH_PASSWORD, 
        target, 
        `echo '${b64}' | base64 -d | bash`
    ], { timeout: 30000 }).toString();
}

console.log('=== Step 1: Backup remote files ===');
runFE(`
docker exec bdb-web cp /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js.bak-before-dropup-20260925 || true
docker exec bdb-web cp /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css.bak-before-dropup-20260925 || true
`);
console.log('Remote backups created.');

console.log('=== Step 2: Deploying 20sy5p32bn-wu.css ===');
const cssContent = fs.readFileSync('20sy5p32bn-wu.css', 'utf8');
console.log('CSS size:', cssContent.length, 'bytes');

const cssRemoteCmd = `
cat > /tmp/20sy5p32bn-wu.css &&
docker cp /tmp/20sy5p32bn-wu.css bdb-web:/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css &&
rm -f /tmp/20sy5p32bn-wu.css &&
echo "DEPLOY_CSS_SUCCESS"
`;

const resCss = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, cssRemoteCmd], {
    input: cssContent,
    encoding: 'utf8',
    timeout: 60000
});

if (resCss.stdout && resCss.stdout.includes('DEPLOY_CSS_SUCCESS')) {
    console.log('CSS deployed successfully!');
} else {
    console.error('CSS Deployment failed:', resCss.stderr || resCss.stdout);
    process.exit(1);
}

console.log('=== Step 3: Deploying kinerja-perma-external-a42edc88f706.js ===');
const jsContent = fs.readFileSync('kinerja-perma-external-a42edc88f706.patched.js', 'utf8');
console.log('JS size:', jsContent.length, 'bytes');

const jsRemoteCmd = `
cat > /tmp/kinerja-perma-external-a42edc88f706.js &&
docker cp /tmp/kinerja-perma-external-a42edc88f706.js bdb-web:/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js &&
rm -f /tmp/kinerja-perma-external-a42edc88f706.js &&
echo "DEPLOY_JS_SUCCESS"
`;

const resJs = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, jsRemoteCmd], {
    input: jsContent,
    encoding: 'utf8',
    timeout: 90000
});

if (resJs.stdout && resJs.stdout.includes('DEPLOY_JS_SUCCESS')) {
    console.log('JS chunk deployed successfully!');
} else {
    console.error('JS Deployment failed:', resJs.stderr || resJs.stdout);
    process.exit(1);
}

console.log('=== Step 4: Restarting bdb-web ===');
console.log(runFE('docker restart bdb-web'));

console.log('=== Step 5: Verification ===');
const verifyOutput = runFE(`
sleep 3
echo "--- Docker container status ---"
docker ps --filter name=bdb-web --format '{{.Names}} - {{.Status}}'

echo "--- Check chunk sizes inside container ---"
docker exec bdb-web ls -la /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js

echo "--- Check CSS dropup rule presence in container ---"
docker exec bdb-web grep -o "kp-filter-dropup" /usr/src/app/.next/static/chunks/20sy5p32bn-wu.css | head -n 3

echo "--- Check JS dropup class presence in container ---"
docker exec bdb-web grep -o "kp-filter-dropup-right" /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js

echo "--- HTTP test localhost:3000 ---"
curl -s -I http://localhost:3000 | head -n 5
`);

console.log(verifyOutput);
console.log('=== ALL DEPLOYMENT & VERIFICATION STEPS COMPLETED ===');
