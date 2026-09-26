import cp from 'child_process';
import fs from 'fs';

const envContent = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/CAS_SSH_LOCAL.env', 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^\s*([^#][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) config[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const target = config.CAS_SSH_USER + '@' + config.CAS_FE_HOST;
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';

function deployFile(filename, content, targetContainerPath) {
    console.log(`Deploying ${filename} (${content.length} bytes)...`);
    const remoteCmd = `
cat > /tmp/${filename}.tmp &&
docker cp /tmp/${filename}.tmp bdb-web:${targetContainerPath} &&
rm -f /tmp/${filename}.tmp &&
echo "DEPLOY_${filename}_OK"
`;
    const res = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, remoteCmd], {
        input: content,
        encoding: 'utf8',
        timeout: 60000
    });
    console.log(`Result for ${filename}:`, res.status, res.stdout ? res.stdout.trim() : '');
    if (res.error) console.error('Error:', res.error);
}

// 1. Deploy Global CSS
const cssContent = fs.readFileSync('20sy5p32bn-wu.modern.css', 'utf8');
deployFile('20sy5p32bn-wu.css', cssContent, '/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css');

// 2. Deploy User Page chunk
const userContent = fs.readFileSync('user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
deployFile('user-page-pagination-v9-dfbc949b.js', userContent, '/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js');

// 3. Deploy LP Filter chunk
const lpContent = fs.readFileSync('laporan-filter-perma-a15e28ec2e81.patched.js', 'utf8');
deployFile('laporan-filter-perma-a15e28ec2e81.js', lpContent, '/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js');

// 4. Deploy Profile chunk
const profileContent = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
deployFile('3def3ti6rk0vr.js', profileContent, '/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js');

// 5. Deploy Kinerja Perkara chunk
const kpContent = fs.readFileSync('kinerja-perma-external-a42edc88f706.patched.js', 'utf8');
deployFile('kinerja-perma-external-a42edc88f706.js', kpContent, '/usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js');

// 6. Check syntax, restart container, commit, reload nginx
console.log('Verifying JS chunks inside container...');
const checkCmd = `
docker exec bdb-web node --check /usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js &&
docker exec bdb-web node --check /usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js &&
docker exec bdb-web node --check /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js &&
docker exec bdb-web node --check /usr/src/app/.next/static/chunks/kinerja-perma-external-a42edc88f706.js &&
echo "ALL_SYNTAX_CHECKS_PASSED"
`;

const resCheck = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, checkCmd], {
    encoding: 'utf8',
    timeout: 30000
});
console.log('Check output:', resCheck.stdout ? resCheck.stdout.trim() : '');

console.log('Restarting bdb-web...');
const restartCmd = `
docker restart bdb-web &&
sleep 3 &&
docker ps --filter "name=bdb-web" &&
docker commit bdb-web bdb-web:latest &&
echo "or@eK2q5" | sudo -S systemctl reload nginx &&
echo "DEPLOY_AND_COMMIT_SUCCESS"
`;

const resRestart = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, restartCmd], {
    encoding: 'utf8',
    timeout: 60000
});
console.log('Restart and commit output:', resRestart.stdout ? resRestart.stdout.trim() : '');
