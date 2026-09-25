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

console.log('=== Step 1: Backup remote chunks in bdb-web ===');
console.log(runFE(`
docker exec bdb-web cp /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js.bak-20mb-20260925 || true
docker exec bdb-web cp /usr/src/app/.next/static/chunks/lp-flow-perma-56d42847ec39.js /usr/src/app/.next/static/chunks/lp-flow-perma-56d42847ec39.js.bak-20mb-20260925 || true
`));
console.log('Backups created in container.');

console.log('=== Step 2: Deploying upload-doc-form-1mb-help-6acc5bceec6e.js ===');
const docFormContent = fs.readFileSync('scratch/upload-doc-form-1mb-help-6acc5bceec6e.patched.js', 'utf8');
console.log('docForm size:', docFormContent.length, 'bytes');

const docFormRemoteCmd = `
cat > /tmp/upload-doc-form.patched.js &&
docker cp /tmp/upload-doc-form.patched.js bdb-web:/usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js &&
rm -f /tmp/upload-doc-form.patched.js &&
echo "DEPLOY_DOC_FORM_SUCCESS"
`;

const resDocForm = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, targetFE, docFormRemoteCmd], {
    input: docFormContent,
    encoding: 'utf8',
    timeout: 60000
});

if (resDocForm.stdout && resDocForm.stdout.includes('DEPLOY_DOC_FORM_SUCCESS')) {
    console.log('upload-doc-form chunk deployed successfully!');
} else {
    console.error('Deployment failed:', resDocForm.stderr || resDocForm.stdout);
    process.exit(1);
}

console.log('=== Step 3: Deploying lp-flow-perma-56d42847ec39.js ===');
const lpFlowContent = fs.readFileSync('scratch/lp-flow-perma-56d42847ec39.patched.js', 'utf8');
console.log('lpFlow size:', lpFlowContent.length, 'bytes');

const lpFlowRemoteCmd = `
cat > /tmp/lp-flow.patched.js &&
docker cp /tmp/lp-flow.patched.js bdb-web:/usr/src/app/.next/static/chunks/lp-flow-perma-56d42847ec39.js &&
rm -f /tmp/lp-flow.patched.js &&
echo "DEPLOY_LP_FLOW_SUCCESS"
`;

const resLpFlow = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, targetFE, lpFlowRemoteCmd], {
    input: lpFlowContent,
    encoding: 'utf8',
    timeout: 60000
});

if (resLpFlow.stdout && resLpFlow.stdout.includes('DEPLOY_LP_FLOW_SUCCESS')) {
    console.log('lp-flow chunk deployed successfully!');
} else {
    console.error('Deployment failed:', resLpFlow.stderr || resLpFlow.stdout);
    process.exit(1);
}

console.log('=== Step 4: Restarting bdb-web container ===');
console.log(runFE('docker restart bdb-web'));

console.log('=== Step 5: Verification inside container ===');
const verifyOutput = runFE(`
sleep 3
echo "--- Container status ---"
docker ps --filter name=bdb-web --format '{{.Names}} - {{.Status}}'

echo "--- Check 20971520 in container chunks ---"
docker exec bdb-web grep -o "20971520" /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js
docker exec bdb-web grep -o "20971520" /usr/src/app/.next/static/chunks/lp-flow-perma-56d42847ec39.js

echo "--- Check 20 MB text in container chunks ---"
docker exec bdb-web grep -o "maks 20 MB" /usr/src/app/.next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js | head -n 2
docker exec bdb-web grep -o "maks 20 MB" /usr/src/app/.next/static/chunks/lp-flow-perma-56d42847ec39.js | head -n 2

echo "--- HTTP test chunks localhost:3000 ---"
curl -s -I http://localhost:3000/_next/static/chunks/upload-doc-form-1mb-help-6acc5bceec6e.js | head -n 4
curl -s -I http://localhost:3000/_next/static/chunks/lp-flow-perma-56d42847ec39.js | head -n 4
`);

console.log(verifyOutput);
console.log('=== ALL DEPLOYMENT & VERIFICATION STEPS COMPLETED ===');
