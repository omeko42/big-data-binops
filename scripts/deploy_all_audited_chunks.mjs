import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log('1. Copying 7 patched chunks to remote host /tmp/ ...');

copyFileToFE('frontend-patch/0-gigr76s0g8t.synchronized.js', '/tmp/0-gigr76s0g8t.js');
copyFileToFE('frontend-patch/app_cms_layout_tsx_0ml_4_3._.synchronized.js', '/tmp/app_cms_layout_tsx_0ml_4_3._.js');
copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js', '/tmp/dashboard-perma-318125d33290_v2.js');
copyFileToFE('frontend-patch/35hkjujo3bzza.patched.js', '/tmp/35hkjujo3bzza.js');
copyFileToFE('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', '/tmp/3def3ti6rk0vr.js');
copyFileToFE('frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js', '/tmp/app_cms_profile_page_tsx_0_ymkmx._.js');
copyFileToFE('frontend-patch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.js');

console.log('2. Deploying files into bdb-web container...');

const deployCmd = `
  set -e
  docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  docker cp /tmp/app_cms_layout_tsx_0ml_4_3._.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js
  docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  docker cp /tmp/dashboard-perma-318125d33290_v2.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
  docker cp /tmp/35hkjujo3bzza.js bdb-web:/usr/src/app/.next/static/chunks/35hkjujo3bzza.js
  docker cp /tmp/3def3ti6rk0vr.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker cp /tmp/app_cms_profile_page_tsx_0_ymkmx._.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js
  docker cp /tmp/3pp0f_cp6yg-o.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js

  rm -f /tmp/0-gigr76s0g8t.js /tmp/app_cms_layout_tsx_0ml_4_3._.js /tmp/dashboard-perma-318125d33290_v2.js /tmp/35hkjujo3bzza.js /tmp/3def3ti6rk0vr.js /tmp/app_cms_profile_page_tsx_0_ymkmx._.js /tmp/3pp0f_cp6yg-o.js

  echo "3. Running container syntax check on all deployed chunks..."
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
  docker exec bdb-web node -c /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/35hkjujo3bzza.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
  docker exec bdb-web node -c /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js
  docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js

  echo "CONTAINER_ALL_CHUNKS_VALIDATED_SUCCESSFULLY"
`;

console.log(runFE(deployCmd));
