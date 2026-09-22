const fs = require('fs');
const crypto = require('crypto');
const childProcess = require('child_process');

const targets = [
  {
    path: 'src/app_core/auth/user/user.service.ts',
    sha: 'bf01bb1a4577a977aeaa822ceeb924b18f0a06d33917798b3daac5a715024a97',
    before: "        }\n\n        const result = await this.tableHelper.applyFilters(queryBuilder, request, {",
  },
  {
    path: 'dist/app_core/auth/user/user.service.js',
    sha: '37209f67fd48bd494e777422c729157efcd4775cf0da73bb45186aee64ded20d',
    before: "        }\n        const result = await this.tableHelper.applyFilters(queryBuilder, request, {",
  },
];

const insertion = `

        const rawSearchAll = request?.query?.searchAll;
        const masterUserKeyword = String(Array.isArray(rawSearchAll) ? rawSearchAll[0] : rawSearchAll || '').trim().toLowerCase();
        if (masterUserKeyword) {
            queryBuilder.andWhere(\`(
                lower(coalesce(user.name, '')) like :masterUserKeyword
                or lower(coalesce(user.email, '')) like :masterUserKeyword
                or lower(coalesce(user.email_google, '')) like :masterUserKeyword
                or lower(coalesce(user.email_polri, '')) like :masterUserKeyword
                or lower(coalesce(user.username, '')) like :masterUserKeyword
                or lower(coalesce(user.role_name, '')) like :masterUserKeyword
                or lower(coalesce(user.role_bdb, '')) like :masterUserKeyword
                or lower(coalesce(user.approval_status, '')) like :masterUserKeyword
                or lower(coalesce(user.status, '')) like :masterUserKeyword
                or exists (
                    select 1
                    from bdb_satker scope_search
                    where scope_search.is_synthetic = false
                      and (scope_search.id = user.scope_satker_id or scope_search.kode = user.scope_satker_key)
                      and (
                          lower(coalesce(scope_search.deskripsi, '')) like :masterUserKeyword
                          or lower(coalesce(scope_search.kode, '')) like :masterUserKeyword
                      )
                )
            )\`, { masterUserKeyword: \`%\${masterUserKeyword}%\` });
        }

        const filterRequest = masterUserKeyword
            ? { ...request, query: { ...request.query, searchAll: undefined } }
            : request;
`;

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (haystack, needle) => haystack.split(needle).length - 1;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const staged = [];

for (const target of targets) {
  const current = fs.readFileSync(target.path, 'utf8');
  const actualSha = sha256(current);
  if (actualSha !== target.sha) {
    throw new Error(`STOP SHA mismatch ${target.path}: expected ${target.sha}, got ${actualSha}. FILE TIDAK BERUBAH.`);
  }
  if (count(current, target.before) !== 1) {
    throw new Error(`STOP anchor mismatch ${target.path}. FILE TIDAK BERUBAH.`);
  }
  const after = `        }${insertion}\n        const result = await this.tableHelper.applyFilters(queryBuilder, filterRequest, {`;
  const next = current.replace(target.before, after);
  if (count(next, 'const masterUserKeyword =') !== 1 || count(next, 'from bdb_satker scope_search') !== 1) {
    throw new Error(`STOP staged marker mismatch ${target.path}. FILE TIDAK BERUBAH.`);
  }
  const stagePath = `${target.path}.stage-master-user-search-${process.pid}${target.path.endsWith('.js') ? '.js' : ''}`;
  const backupPath = `${target.path}.bak-master-user-search-${timestamp}`;
  fs.writeFileSync(stagePath, next);
  staged.push({ ...target, stagePath, backupPath, next });
}

const distStage = staged.find(item => item.path.startsWith('dist/')).stagePath;
childProcess.execFileSync(process.execPath, ['--check', distStage], { stdio: 'inherit' });

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
    keyword_marker_count: count(saved, 'const masterUserKeyword ='),
    satker_marker_count: count(saved, 'from bdb_satker scope_search'),
  }));
}

