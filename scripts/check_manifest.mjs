import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const bm = require('/usr/src/app/.next/build-manifest.json');
console.log('Pages in build-manifest:');
for (const p of Object.keys(bm.pages)) {
  if (p.includes('user') || p.includes('master') || p.includes('profile') || p.includes('cms')) {
    console.log(p, '->', bm.pages[p]);
  }
}
"`;
console.log(runFE(cmd));
