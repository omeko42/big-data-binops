import { runFE } from './fe_exec.mjs';
import fs from 'fs';

const feAuditScript = `
docker exec bdb-web node -e "
const fs = require('fs');
const path = '/usr/src/app/.next/static/chunks/';
const files = fs.readdirSync(path).filter(f => f.endsWith('.js'));

const patterns = [
  { name: 'omeko11', regex: /omeko11/g },
  { name: 'anak_serse', regex: /anak_serse/g },
  { name: 'hardcoded_id_arrays', regex: /(?:15403|16568|320)/g },
  { name: 'isReadOnlyMode_override', regex: /!isReadOnlyMode/g },
  { name: 'forced_super_ternary', regex: /isSuper\\s*\\?\\s*['\\"]@omeko11/g }
];

const results = {};

for (const f of files) {
  const content = fs.readFileSync(path + f, 'utf8');
  const lines = content.split('\\n');
  
  for (const p of patterns) {
    let matchCount = 0;
    const matches = [];
    lines.forEach((l, idx) => {
      if (p.regex.test(l)) {
        matchCount++;
        matches.push({ line: idx + 1, snippet: l.trim().substring(0, 140) });
      }
    });
    if (matchCount > 0) {
      if (!results[f]) results[f] = {};
      results[f][p.name] = { count: matchCount, samples: matches.slice(0, 5) };
    }
  }
}

console.log(JSON.stringify(results, null, 2));
"
`;

try {
  const feOut = runFE(feAuditScript);
  fs.writeFileSync('scratch/fe_root_audit.json', feOut);
  console.log('Frontend Audit Results Summary:');
  const parsed = JSON.parse(feOut);
  for (const [file, pMap] of Object.entries(parsed)) {
    console.log(`\nFile: ${file}`);
    for (const [pName, details] of Object.entries(pMap)) {
      console.log(`  - Pattern: ${pName} (${details.count} matches)`);
      details.samples.forEach(s => console.log(`      L${s.line}: ${s.snippet}`));
    }
  }
} catch (e) {
  console.error('FE Audit error:', e.message);
}
