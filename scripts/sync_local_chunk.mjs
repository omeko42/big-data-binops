import { runFE } from './fe_inspect.mjs';
import fs from 'fs';

console.log('Syncing patched chunk back to local repository...');
const remoteScript = `
docker exec bdb-web cat /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
`;
const chunkContent = runFE(remoteScript);

fs.writeFileSync('dashboard-sorotan-links-20260925/dashboard-perma-318125d33290.patched.js', chunkContent, 'utf8');
if (fs.existsSync('scratch/staging_deploy/dashboard-perma-318125d33290.js')) {
    fs.writeFileSync('scratch/staging_deploy/dashboard-perma-318125d33290.js', chunkContent, 'utf8');
}
console.log('Saved to local files. Size:', chunkContent.length);
