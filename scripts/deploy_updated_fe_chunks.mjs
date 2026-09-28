import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('Deploying updated frontend chunks to bdb-web...');
copyFileToFE('frontend-patch/0-gigr76s0g8t.synchronized.js', '/tmp/0-gigr76s0g8t.js');
copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js', '/tmp/dashboard-perma-318125d33290_v2.js');
copyFileToFE('frontend-patch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.js');

const deployCmd = `
  docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
  docker cp /tmp/3pp0f_cp6yg-o.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js

  rm -f /tmp/0-gigr76s0g8t.js /tmp/dashboard-perma-318125d33290_v2.js /tmp/3pp0f_cp6yg-o.js

  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
  echo "ALL_CONTAINER_SYNTAX_PASS"
`;

console.log(runFE(deployCmd));
