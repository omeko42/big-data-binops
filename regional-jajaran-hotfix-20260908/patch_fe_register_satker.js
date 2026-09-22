const fs = require('fs');
const crypto = require('crypto');
const childProcess = require('child_process');

const path = '.next/static/chunks/register-pihak-v5-6478da3b8c2c.js';
const expectedSha = '482753257d6e90abec776dc694a16c34b0baf7d8e08395d6f8110b8dbd721175';
const rendererBefore = 'function u(e){return[e.unit_nama,e.satker_nama].map((e=>(e||"").trim())).filter(Boolean).join(" ")||"—"}';
const rendererAfter = 'function u(e){let a=(e.unit_satker_nama||"").trim();return a||[e.unit_nama,e.satker_nama].map((e=>(e||"").trim())).filter(Boolean).join(" ")||"—"}';
const cacheBefore = 'bdb-pihak-list-v1:';
const cacheAfter = 'bdb-pihak-list-v2:';
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const count = (haystack, needle) => haystack.split(needle).length - 1;

const current = fs.readFileSync(path, 'utf8');
const currentSha = sha256(current);
if (currentSha !== expectedSha) {
  throw new Error(`STOP SHA mismatch: expected ${expectedSha}, got ${currentSha}. FILE TIDAK BERUBAH.`);
}
for (const [name, marker] of [['renderer', rendererBefore], ['cache', cacheBefore]]) {
  const actual = count(current, marker);
  if (actual !== 1) throw new Error(`STOP ${name} count mismatch: expected 1, got ${actual}. FILE TIDAK BERUBAH.`);
}

const next = current.replace(rendererBefore, rendererAfter).replace(cacheBefore, cacheAfter);
if (count(next, rendererAfter) !== 1 || count(next, cacheAfter) !== 1) {
  throw new Error('STOP staged verification failed. FILE TIDAK BERUBAH.');
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const stagePath = `${path}.stage-register-satker-${process.pid}.js`;
const backupPath = `${path}.bak-register-satker-${timestamp}`;
fs.writeFileSync(stagePath, next);
childProcess.execFileSync(process.execPath, ['--check', stagePath], { stdio: 'inherit' });
fs.copyFileSync(path, backupPath, fs.constants.COPYFILE_EXCL);
try {
  fs.renameSync(stagePath, path);
} catch (error) {
  fs.copyFileSync(backupPath, path);
  if (fs.existsSync(stagePath)) fs.unlinkSync(stagePath);
  throw error;
}

const saved = fs.readFileSync(path, 'utf8');
console.log(JSON.stringify({
  path,
  backup: backupPath,
  before_sha256: expectedSha,
  after_sha256: sha256(saved),
  renderer_count: count(saved, rendererAfter),
  cache_v2_count: count(saved, cacheAfter),
}));
