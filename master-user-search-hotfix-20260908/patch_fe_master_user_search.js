const fs = require('fs');
const crypto = require('crypto');
const childProcess = require('child_process');

const path = '.next/static/chunks/user-page-pagination-v8-454119d3.js';
const expectedSha = '454119d3796dea3a0bd851f8953fdedc4ffb456f1c408f80d407057d28e713fb';
const replacements = [
  ['function(){let e=(0,s.useRef)(null),[b,h]=', 'function(){let e=(0,s.useRef)(null),userRequestSeq=(0,s.useRef)(0),[b,h]='],
  ['let searchFields=["name","email","email_google","email_polri"],a=', 'let requestSeq=++userRequestSeq.current,a='],
  ['...(userSearchTerm?{searchOrWhereBy:searchFields,searchOrwhere:searchFields.map(()=>userSearchTerm)}:{})', '...(userSearchTerm?{searchAll:userSearchTerm}:{})'],
  ['p=Array.isArray(i)?i:[];h(p),setUserTotal', 'p=Array.isArray(i)?i:[];if(requestSeq!==userRequestSeq.current)return;h(p),setUserTotal'],
  ['}catch(s){let a=s.response?s.response?.data?.message', '}catch(s){if(requestSeq!==userRequestSeq.current)return;let a=s.response?s.response?.data?.message'],
  ['}finally{k(!1)}}', '}finally{requestSeq===userRequestSeq.current&&k(!1)}}'],
  ['placeholder:"Cari nama / email…"', 'placeholder:"Cari nama / email / satker…"'],
];

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (haystack, needle) => haystack.split(needle).length - 1;
const current = fs.readFileSync(path, 'utf8');
const actualSha = sha256(current);
if (actualSha !== expectedSha) {
  throw new Error(`STOP SHA mismatch: expected ${expectedSha}, got ${actualSha}. FILE TIDAK BERUBAH.`);
}

let next = current;
for (const [before, after] of replacements) {
  if (count(next, before) !== 1) throw new Error(`STOP marker mismatch: ${before}. FILE TIDAK BERUBAH.`);
  next = next.replace(before, after);
}
for (const marker of ['userRequestSeq=(0,s.useRef)(0)', 'searchAll:userSearchTerm', 'Cari nama / email / satker…']) {
  if (count(next, marker) !== 1) throw new Error(`STOP staged marker mismatch: ${marker}. FILE TIDAK BERUBAH.`);
}
if (count(next, 'requestSeq!==userRequestSeq.current') !== 2) {
  throw new Error('STOP race guard mismatch. FILE TIDAK BERUBAH.');
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const stagePath = `${path}.stage-master-user-search-${process.pid}.js`;
const backupPath = `${path}.bak-master-user-search-${timestamp}`;
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
  search_all_count: count(saved, 'searchAll:userSearchTerm'),
  stale_guard_count: count(saved, 'requestSeq!==userRequestSeq.current'),
  placeholder_count: count(saved, 'Cari nama / email / satker…'),
}));
