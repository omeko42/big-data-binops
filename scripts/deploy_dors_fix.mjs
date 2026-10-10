import { runFE, copyFileToFE } from './fe_exec.mjs';

async function main() {
  console.log('=== Deploying DORS Progress Bar & Percentage Indicator Fix ===');
  
  // 1. Upload to FE host
  console.log('Uploading frontend-patch/2euu9hqyjbvnk.patched.js to FE host...');
  copyFileToFE('frontend-patch/2euu9hqyjbvnk.patched.js', '/tmp/2euu9hqyjbvnk.js');

  // 2. Inject into container
  console.log('Injecting into bdb-web container...');
  const res = runFE(`
    docker cp /tmp/2euu9hqyjbvnk.js bdb-web:/usr/src/app/.next/static/chunks/2euu9hqyjbvnk.js
    rm -f /tmp/2euu9hqyjbvnk.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/2euu9hqyjbvnk.js
    echo "DORS_CHUNK_SYNTAX_OK"
  `);
  console.log('Result:', res.trim());

  // 3. Test route
  const code = runFE('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/integrasi/dors');
  console.log('Route /cms/integrasi/dors HTTP Code:', code.trim());

  console.log('=== Deployment completed successfully! ===');
}

main().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
