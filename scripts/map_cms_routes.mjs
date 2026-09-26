import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page_client-reference-manifest.js')) {
      results.push(file);
    }
  });
  return results;
}

const manifests = walk('/usr/src/app/.next/server/app/cms');
for (const m of manifests) {
  try {
    const content = fs.readFileSync(m, 'utf8');
    // Extract chunk names
    const chunks = [...content.matchAll(/static\\/chunks\\/([a-zA-Z0-9_.-]+)/g)].map(x => x[1]);
    const uniqueChunks = [...new Set(chunks)].filter(c => !c.includes('turbopack') && !c.includes('node_modules'));
    const route = m.replace('/usr/src/app/.next/server/app', '').replace('/page_client-reference-manifest.js', '');
    console.log(route.padEnd(35), '->', uniqueChunks.join(', '));
  } catch(e) {}
}
"`;

console.log(runFE(cmd));
