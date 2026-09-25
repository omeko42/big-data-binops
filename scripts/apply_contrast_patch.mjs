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

console.log('=== Step 1: Deploying updated 20sy5p32bn-wu.css via stdin pipe ===');
const localCss = fs.readFileSync('20sy5p32bn-wu.css', 'utf8');
console.log('CSS size to deploy:', localCss.length, 'bytes');

const cssRemoteCmd = `
cat > /tmp/20sy5p32bn-wu.css &&
docker cp /tmp/20sy5p32bn-wu.css bdb-web:/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css &&
rm -f /tmp/20sy5p32bn-wu.css &&
echo "DEPLOY_CSS_SUCCESS"
`;

const resCss = cp.spawnSync(plinkPath, ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, cssRemoteCmd], {
    input: localCss,
    encoding: 'utf8',
    timeout: 60000
});

if (resCss.stdout && resCss.stdout.includes('DEPLOY_CSS_SUCCESS')) {
    console.log('CSS deployed to bdb-web successfully!');
} else {
    console.error('CSS Deployment failed:', resCss.stderr || resCss.stdout);
    process.exit(1);
}

console.log('=== Step 2: Patching dashboard JS chunks in bdb-web ===');
const patchScript = `
const fs = require('fs');

function patchFile(p) {
    if (!fs.existsSync(p)) {
        console.log("File not found, skipping:", p);
        return;
    }
    let s = fs.readFileSync(p, 'utf8');
    let modified = false;

    // 1. Rank badge style in function E and L
    const oldRank = 'background:"#f1f5f9",color:"#64748b",fontWeight:800,fontSize:"0.72rem",display:"inline-flex",alignItems:"center",justifyContent:"center"';
    const newRank = 'background:"rgba(255,255,255,0.08)",color:"var(--cas-text-primary, #f1f5f9)",border:"1px solid var(--cas-border-card, rgba(255,255,255,0.12))",fontWeight:800,fontSize:"0.72rem",display:"inline-flex",alignItems:"center",justifyContent:"center"';
    if (s.includes(oldRank)) {
        s = s.replaceAll(oldRank, newRank);
        console.log(p, 'Rank badge updated');
        modified = true;
    }

    // 2. Item name style in function E and L
    const oldItem = 'color:"#334155",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e.nama';
    const newItem = 'color:"var(--cas-text-primary, #f1f5f9)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e.nama';
    if (s.includes(oldItem)) {
        s = s.replaceAll(oldItem, newItem);
        console.log(p, 'Item names updated');
        modified = true;
    }

    // 3. LP unit in function E
    const oldLp = 'style:{color:"#64748b",fontSize:"0.72rem",fontWeight:700},children:" LP "';
    const newLp = 'style:{color:"var(--cas-text-muted, #94a3b8)",fontSize:"0.72rem",fontWeight:700},children:" LP "';
    if (s.includes(oldLp)) {
        s = s.replaceAll(oldLp, newLp);
        console.log(p, 'LP unit updated');
        modified = true;
    }

    // 4. Suffix in function L
    const oldSuffix = 'style:{flex:"0 0 auto",color:"#94a3b8",fontSize:"0.72rem",whiteSpace:"nowrap"},children:n';
    const newSuffix = 'style:{flex:"0 0 auto",color:"var(--cas-text-muted, #94a3b8)",fontSize:"0.72rem",fontWeight:700,whiteSpace:"nowrap"},children:n';
    if (s.includes(oldSuffix)) {
        s = s.replaceAll(oldSuffix, newSuffix);
        console.log(p, 'Suffix L updated');
        modified = true;
    }

    // 5. Indeks Kinerja number color
    const oldIndeks = 'lineHeight:1,fontWeight:850,color:"#0f172a"}';
    const newIndeks = 'lineHeight:1,fontWeight:850,color:"var(--cas-text-primary, #f1f5f9)"}';
    if (s.includes(oldIndeks)) {
        s = s.replaceAll(oldIndeks, newIndeks);
        console.log(p, 'Indeks Kinerja number color updated');
        modified = true;
    }

    // 6. Minicard subtitles (Orang, Berisiko..., Terjadi kejahatan)
    const oldSub = 'fontSize:"0.72rem",\\nfontWeight:650,\\ncolor:"#64748b",\\nmarginTop:"0.18rem"';
    const newSub = 'fontSize:"0.72rem",\\nfontWeight:650,\\ncolor:"var(--cas-text-secondary, #cbd5e1)",\\nmarginTop:"0.18rem"';
    if (s.includes(oldSub)) {
        s = s.replaceAll(oldSub, newSub);
        console.log(p, 'Minicard subtitles updated');
        modified = true;
    }

    // 7. Bump cache key
    if (s.includes('bdb-dashboard-v9')) {
        s = s.replaceAll('bdb-dashboard-v9', 'bdb-dashboard-v10');
        console.log(p, 'Bumped bdb-dashboard-v9 -> bdb-dashboard-v10');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(p, s, 'utf8');
        console.log(p, 'SUCCESSFULLY SAVED');
    } else {
        console.log(p, 'No modifications needed or markers not found');
    }
}

patchFile('/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js');
patchFile('/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js');
`;

const patchB64 = Buffer.from(patchScript).toString('base64');
const runPatchCmd = `docker exec bdb-web node -e 'eval(Buffer.from("${patchB64}", "base64").toString("utf8"))'`;
console.log(runFE(runPatchCmd));

console.log('=== Step 3: Restarting bdb-web ===');
console.log(runFE('docker restart bdb-web'));

console.log('=== Step 4: Verifying bdb-web status ===');
console.log(runFE('docker ps | grep bdb-web'));
