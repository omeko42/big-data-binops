// dashboard-sorotan-links-20260925/deploy.mjs
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

console.log('=== Step 1: Reading patched chunk ===');
const js = fs.readFileSync('dashboard-sorotan-links-20260925/dashboard-perma-318125d33290.patched.js', 'utf8');
console.log('Chunk size to deploy:', js.length);

console.log('=== Step 2: Deploying to container ===');
const remoteCmd = `
cat > /tmp/dash.chunk.patched &&
docker cp /tmp/dash.chunk.patched bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js &&
docker cp /tmp/dash.chunk.patched bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js &&
rm -f /tmp/dash.chunk.patched &&
echo "DEPLOY_DASHBOARD_SUCCESS"
`;

const res = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, remoteCmd], {
    input: js,
    encoding: 'utf8',
    timeout: 90000
});

if (res.stdout && res.stdout.includes('DEPLOY_DASHBOARD_SUCCESS')) {
  console.log('=== Step 3: Restarting bdb-web container ===');
  runFE('docker restart bdb-web');
  console.log('bdb-web container restarted successfully!');
} else {
  console.error('Deployment failed:', res.stderr?.toString());
  process.exit(1);
}
