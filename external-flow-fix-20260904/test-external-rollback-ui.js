const fs = require('fs');

const chunk = process.argv[2];
const manifest = process.argv[3];
const source = fs.readFileSync(chunk, 'utf8');
const manifestSource = fs.readFileSync(manifest, 'utf8');

const checks = {
  rollbackLabel: (source.match(/Kembalikan ke Satker Polri/g) || []).length === 1,
  endpoint: source.includes('/correct-satker'),
  superadminOnly: source.includes('e1.isSuperadmin&&H?.dilimpahkan_eksternal'),
  externalOnly: source.includes('if(!E||!H?.dilimpahkan_eksternal)return'),
  originFallback: source.includes('H.unit_satker_id||H.satker_id'),
  noStatusPayload: !/correct-satker[^}]+status_id/.test(source),
  refreshesDetail: source.includes('await a9()'),
  manifestUsesNewChunk: manifestSource.includes('/_next/static/chunks/lp-external-rollback-20260904.js'),
  manifestDropsOldChunk: !manifestSource.includes('/_next/static/chunks/lp-flow-upload-complete-b8b368e8a8b5.js'),
};

if (Object.values(checks).some((value) => !value)) {
  console.error(JSON.stringify({ verified: false, checks }));
  process.exit(1);
}

console.log(JSON.stringify({ verified: true, caseContentRead: false, caseStatusMutation: false, checks }));
