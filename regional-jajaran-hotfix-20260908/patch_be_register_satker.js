const fs = require('fs');
const crypto = require('crypto');

const targets = [
  {
    path: 'src/bdb/pihak-terlibat/pihak-terlibat.service.ts',
    sha: 'd64cbe21b8b8f4fe89426d9d8f53e59e700f45db3c75eddaca98429e4ac59c12',
  },
  {
    path: 'dist/bdb/pihak-terlibat/pihak-terlibat.service.js',
    sha: '30fcb35d385fcb2b39a0eaef324ff4111f2320deeb88777f0c77de37f3936982',
  },
];

const replacements = [
  {
    before: 'lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, jk.keterangan as kejahatan',
    after: 'lp.no_laporan, lp.satker_id, lp.satker_nama, lp.unit_nama, lp.unit_satker_nama, jk.keterangan as kejahatan',
    expected: 2,
  },
  {
    before: 'lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,jk.keterangan as kejahatan',
    after: 'lp.no_laporan,lp.satker_id,lp.satker_nama,lp.unit_nama,lp.unit_satker_nama,jk.keterangan as kejahatan',
    expected: 4,
  },
];

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const count = (haystack, needle) => haystack.split(needle).length - 1;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const staged = [];

for (const target of targets) {
  const current = fs.readFileSync(target.path, 'utf8');
  const currentSha = sha256(current);
  if (currentSha !== target.sha) {
    throw new Error(`STOP SHA mismatch ${target.path}: expected ${target.sha}, got ${currentSha}. FILE TIDAK BERUBAH.`);
  }

  let next = current;
  for (const replacement of replacements) {
    const actual = count(next, replacement.before);
    if (actual !== replacement.expected) {
      throw new Error(`STOP count mismatch ${target.path}: expected ${replacement.expected}, got ${actual}. FILE TIDAK BERUBAH.`);
    }
    next = next.split(replacement.before).join(replacement.after);
  }

  for (const replacement of replacements) {
    const actual = count(next, replacement.after);
    if (actual !== replacement.expected) {
      throw new Error(`STOP staged count mismatch ${target.path}: expected ${replacement.expected}, got ${actual}. FILE TIDAK BERUBAH.`);
    }
  }

  const stagePath = `${target.path}.stage-register-satker-${process.pid}.js`;
  const backupPath = `${target.path}.bak-register-satker-${timestamp}`;
  fs.writeFileSync(stagePath, next);
  staged.push({ ...target, current, next, stagePath, backupPath });
}

const distStage = staged.find((item) => item.path.startsWith('dist/')).stagePath;
require('child_process').execFileSync(process.execPath, ['--check', distStage], { stdio: 'inherit' });

try {
  for (const item of staged) fs.copyFileSync(item.path, item.backupPath, fs.constants.COPYFILE_EXCL);
  for (const item of staged) fs.renameSync(item.stagePath, item.path);
} catch (error) {
  for (const item of staged) {
    if (fs.existsSync(item.backupPath)) fs.copyFileSync(item.backupPath, item.path);
    if (fs.existsSync(item.stagePath)) fs.unlinkSync(item.stagePath);
  }
  throw error;
}

for (const item of staged) {
  const saved = fs.readFileSync(item.path, 'utf8');
  console.log(JSON.stringify({
    path: item.path,
    backup: item.backupPath,
    before_sha256: item.sha,
    after_sha256: sha256(saved),
    added_projection_count: count(saved, 'lp.unit_satker_nama'),
  }));
}

