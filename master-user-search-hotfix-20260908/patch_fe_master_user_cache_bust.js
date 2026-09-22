const fs = require('fs');
const crypto = require('crypto');
const childProcess = require('child_process');

const oldName = 'user-page-pagination-v8-454119d3.js';
const newName = 'user-page-pagination-v9-dfbc949b.js';
const oldAsset = `.next/static/chunks/${oldName}`;
const newAsset = `.next/static/chunks/${newName}`;
const expectedAssetSha = 'dfbc949b35d4521db30eb76033a9e66efb14f69fc4e6aacecb42eafd65aaad15';
const targets = [
  { path: '.next/server/app/cms/master/user.html', sha: '3efe42cc2951cf35362e562f7e2e23593ea73c1fd9ca89629ba5a8a28c731ac8', count: 3 },
  { path: '.next/server/app/cms/master/user.rsc', sha: 'ac6712d9c59c1ccede53044040713b2c9254f29f8943a3d033f9a61d12b1e6ec', count: 2 },
  { path: '.next/server/app/cms/master/user.segments/_full.segment.rsc', sha: 'ac6712d9c59c1ccede53044040713b2c9254f29f8943a3d033f9a61d12b1e6ec', count: 2 },
  { path: '.next/server/app/cms/master/user.segments/cms/master/user/__PAGE__.segment.rsc', sha: 'a634852ab2b1447b4e862b19e42c85fdb255ec202a0f6ac51a117f8accd3fab7', count: 2 },
  { path: '.next/server/app/cms/master/user/page_client-reference-manifest.js', sha: '8d9224a7b11c7aa4ee5355a7875bf44658a46d141ac17b1885b88b663c4d2744', count: 3 },
];

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (haystack, needle) => haystack.split(needle).length - 1;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

const asset = fs.readFileSync(oldAsset, 'utf8');
if (sha256(asset) !== expectedAssetSha) throw new Error('STOP asset SHA mismatch. FILE TIDAK BERUBAH.');
if (fs.existsSync(newAsset)) throw new Error('STOP new asset already exists. FILE TIDAK BERUBAH.');

const staged = [];
for (const target of targets) {
  const current = fs.readFileSync(target.path, 'utf8');
  if (sha256(current) !== target.sha) throw new Error(`STOP SHA mismatch ${target.path}. FILE TIDAK BERUBAH.`);
  if (count(current, oldName) !== target.count) throw new Error(`STOP old reference count mismatch ${target.path}. FILE TIDAK BERUBAH.`);
  const next = current.split(oldName).join(newName);
  if (count(next, oldName) !== 0 || count(next, newName) !== target.count) throw new Error(`STOP staged reference mismatch ${target.path}. FILE TIDAK BERUBAH.`);
  const stagePath = `${target.path}.stage-master-user-cache-bust-${process.pid}`;
  const backupPath = `${target.path}.bak-master-user-cache-bust-${timestamp}`;
  fs.writeFileSync(stagePath, next);
  staged.push({ ...target, stagePath, backupPath });
}

const assetStage = `${newAsset}.stage-${process.pid}.js`;
fs.writeFileSync(assetStage, asset);
childProcess.execFileSync(process.execPath, ['--check', assetStage], { stdio: 'inherit' });

try {
  for (const item of staged) fs.copyFileSync(item.path, item.backupPath, fs.constants.COPYFILE_EXCL);
  fs.renameSync(assetStage, newAsset);
  for (const item of staged) fs.renameSync(item.stagePath, item.path);
} catch (error) {
  for (const item of staged) {
    if (fs.existsSync(item.backupPath)) fs.copyFileSync(item.backupPath, item.path);
    if (fs.existsSync(item.stagePath)) fs.unlinkSync(item.stagePath);
  }
  if (fs.existsSync(assetStage)) fs.unlinkSync(assetStage);
  if (fs.existsSync(newAsset)) fs.unlinkSync(newAsset);
  throw error;
}

console.log(JSON.stringify({
  old_asset: oldAsset,
  new_asset: newAsset,
  new_asset_sha256: sha256(fs.readFileSync(newAsset)),
  targets: staged.map(item => ({
    path: item.path,
    backup: item.backupPath,
    after_sha256: sha256(fs.readFileSync(item.path)),
    new_reference_count: count(fs.readFileSync(item.path, 'utf8'), newName),
  })),
}));
