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
const patchedJs = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/2euu9hqyjbvnk.themed.js', 'utf8');

const cssToAdd = `
/* --- DORS INTEGRATION THEME ENHANCEMENTS --- */
.dors-sched-grid .p-inputnumber .p-inputnumber-button,
.p-inputnumber-button-up,
.p-inputnumber-button-down {
  background: var(--surface-100, #f1f5f9) !important;
  border: 1px solid var(--surface-border, #cbd5e1) !important;
  color: var(--text-color, #334155) !important;
  box-shadow: none !important;
}
.p-inputnumber-button-up:hover,
.p-inputnumber-button-down:hover {
  background: var(--surface-200, #e2e8f0) !important;
  color: var(--text-color, #0f172a) !important;
}
:root[data-theme=dark] .p-inputnumber .p-inputnumber-button,
:root[data-theme=dark] .p-inputnumber-button-up,
:root[data-theme=dark] .p-inputnumber-button-down {
  background: #1e293b !important;
  border: 1px solid #334155 !important;
  color: #cbd5e1 !important;
  box-shadow: none !important;
}
:root[data-theme=dark] .p-inputnumber-button-up:hover,
:root[data-theme=dark] .p-inputnumber-button-down:hover {
  background: #334155 !important;
  border-color: #475569 !important;
  color: #f8fafc !important;
}
.dors-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.15rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-color-secondary, #94a3b8);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dors-tab-btn:hover {
  color: var(--text-color, #f1f5f9);
  background: var(--surface-hover, rgba(255, 255, 255, 0.04));
}
.dors-tab-btn.active-sync {
  font-weight: 800;
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}
.dors-tab-btn.active-hd {
  font-weight: 800;
  color: #ef4444;
  border-bottom: 2px solid #ef4444;
  background: rgba(239, 68, 68, 0.12);
}
.dors-tab-btn.active-sources {
  font-weight: 800;
  color: #0ea5e9;
  border-bottom: 2px solid #0ea5e9;
  background: rgba(14, 165, 233, 0.12);
}
:root[data-theme=dark] .dors-tab-btn.active-sync {
  color: #60a5fa !important;
  border-bottom: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.18) !important;
}
:root[data-theme=dark] .dors-tab-btn.active-hd {
  color: #f87171 !important;
  border-bottom: 2px solid #ef4444 !important;
  background: rgba(239, 68, 68, 0.18) !important;
}
:root[data-theme=dark] .dors-tab-btn.active-sources {
  color: #38bdf8 !important;
  border-bottom: 2px solid #0ea5e9 !important;
  background: rgba(14, 165, 233, 0.18) !important;
}
`;

fs.writeFileSync('scratch/dors_theme.css', cssToAdd, 'utf8');

const remoteCmd = `
cat > /tmp/2euu9hqyjbvnk.js.themed &&
cat > /tmp/dors_theme.css << 'EOF'
${cssToAdd}
EOF

# Backup JS if not exists
docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/2euu9hqyjbvnk.js /usr/src/app/.next/static/chunks/2euu9hqyjbvnk.js.bak-before-theme

# Copy new JS
docker cp /tmp/2euu9hqyjbvnk.js.themed bdb-web:/usr/src/app/.next/static/chunks/2euu9hqyjbvnk.js
docker exec bdb-web node --check /usr/src/app/.next/static/chunks/2euu9hqyjbvnk.js

# Append CSS if not already present
docker exec bdb-web node -e '
const fs = require("fs");
const cssPath = "/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css";
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes("DORS INTEGRATION THEME ENHANCEMENTS")) {
    const extra = fs.readFileSync("/tmp/dors_theme.css", "utf8");
    fs.appendFileSync(cssPath, "\\n" + extra, "utf8");
    console.log("CSS appended successfully.");
} else {
    console.log("CSS already contains DORS theme.");
}
'

docker restart bdb-web
echo "DEPLOY_THEMED_DORS_SUCCESS"
`;

console.log('Deploying themed 2euu9hqyjbvnk.js and CSS to bdb-web...');
const res = cp.spawnSync('D:/Putty/plink.exe', ['-batch', '-ssh', '-hostkey', feHostKey, '-pw', config.CAS_SSH_PASSWORD, target, remoteCmd], {
    input: patchedJs,
    encoding: 'utf8',
    timeout: 35000
});

console.log('Status:', res.status);
if (res.error) console.error('Error:', res.error);
console.log('STDOUT:\n', res.stdout ? res.stdout.toString() : '');
console.log('STDERR:\n', res.stderr ? res.stderr.toString() : '');
