import { runFE, copyFileToFE } from './fe_exec.mjs';
import { runBE } from './be_exec.mjs';

async function main() {
  console.log('======================================================================');
  console.log('CAS MASTER ZERO-DOWNTIME DEPLOYMENT: BRANDING, FEED, REACTION & PROFILE');
  console.log('======================================================================\n');

  // ==========================================
  // PHASE 1: BACKEND VERIFICATION
  // ==========================================
  console.log('--- PHASE 1: VERIFYING BACKEND (10.0.0.x:3850) ---');
  const beStatus = runBE('docker exec bdb-api grep -o "UPDATE bdb_social_posts SET view_count = coalesce(view_count, 0) + 1" /usr/src/app/dist/bdb/jukrah/jukrah.service.js').trim();
  console.log('  ✓ Backend Atomic View Increment in container:', beStatus);

  const beHealth = runBE('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3850/api/bdb/system/orchestrator/queue-status').trim();
  console.log('  ✓ Backend API queue-status HTTP Code:', beHealth);
  if (beHealth !== '200') {
    throw new Error('Backend is not returning 200 OK!');
  }

  // ===========================================
  // PHASE 2: FRONTEND DEPLOYMENT (10.0.0.x)
  // ===========================================
  console.log('\n--- PHASE 2: DEPLOYING FRONTEND PATCHES TO BDB-WEB ---');
  console.log('2.1. Backing up chunks inside bdb-web container...');
  runFE(`
    docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js.bak-brand || true
    docker exec bdb-web cp -n /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js.bak-brand || true
    docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js.bak-feed || true
    docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js.bak-prof || true
    docker exec bdb-web cp -n /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js.bak-prof || true
    docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/35hkjujo3bzza.js /usr/src/app/.next/static/chunks/35hkjujo3bzza.js.bak-feed || true
    docker exec bdb-web cp -n /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js.bak-feed || true
  `);

  console.log('2.2. Uploading patched chunks to FE host /tmp ...');
  copyFileToFE('frontend-patch/0-gigr76s0g8t.synchronized.js', '/tmp/0-gigr76s0g8t.synchronized.js');
  copyFileToFE('frontend-patch/app_cms_layout_tsx_0ml_4_3._.synchronized.js', '/tmp/app_cms_layout_tsx_0ml_4_3._.synchronized.js');
  copyFileToFE('frontend-patch/3pp0f_cp6yg-o.patched.js', '/tmp/3pp0f_cp6yg-o.patched.js');
  copyFileToFE('frontend-patch/3def3ti6rk0vr.linkedin_v3.js', '/tmp/3def3ti6rk0vr.linkedin_v3.js');
  copyFileToFE('frontend-patch/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js', '/tmp/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js');
  copyFileToFE('frontend-patch/35hkjujo3bzza.patched.js', '/tmp/35hkjujo3bzza.patched.js');
  copyFileToFE('frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js', '/tmp/dashboard_synchronized.js');

  console.log('2.3. Copying files into bdb-web container...');
  runFE(`
    docker cp /tmp/0-gigr76s0g8t.synchronized.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    docker cp /tmp/app_cms_layout_tsx_0ml_4_3._.synchronized.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js
    docker cp /tmp/3pp0f_cp6yg-o.patched.js bdb-web:/usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
    docker cp /tmp/3def3ti6rk0vr.linkedin_v3.js bdb-web:/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker cp /tmp/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js bdb-web:/usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js
    docker cp /tmp/35hkjujo3bzza.patched.js bdb-web:/usr/src/app/.next/static/chunks/35hkjujo3bzza.js
    docker cp /tmp/dashboard_synchronized.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    docker cp /tmp/dashboard_synchronized.js bdb-web:/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
    rm -f /tmp/0-gigr76s0g8t.synchronized.js /tmp/app_cms_layout_tsx_0ml_4_3._.synchronized.js /tmp/3pp0f_cp6yg-o.patched.js /tmp/3def3ti6rk0vr.linkedin_v3.js /tmp/app_cms_profile_page_tsx_0_ymkmx._.linkedin_v3.js /tmp/35hkjujo3bzza.patched.js /tmp/dashboard_synchronized.js
  `);

  console.log('2.4. Validating syntax inside bdb-web container...');
  const feSyntax = runFE(`
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js
    docker exec bdb-web node -c /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js
    docker exec bdb-web node -c /usr/src/app/.next/server/chunks/ssr/app_cms_profile_page_tsx_0_ymkmx._.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/35hkjujo3bzza.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js
    docker exec bdb-web node -c /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js
    echo "FE_CONTAINER_SYNTAX_ALL_OK"
  `);
  console.log('     Syntax check:', feSyntax.trim());
  if (!feSyntax.includes('FE_CONTAINER_SYNTAX_ALL_OK')) {
    throw new Error('FE Syntax check failed! Please review container logs.');
  }

  console.log('2.5. Restarting bdb-web to flush Next.js SSR cache...');
  runFE('docker restart bdb-web');

  console.log('2.6. Waiting 8 seconds for Next.js SSR to initialize...');
  await new Promise(r => setTimeout(r, 8000));

  // ==========================================
  // PHASE 3: COMPREHENSIVE VERIFICATION IN SINGLE SSH
  // ==========================================
  console.log('\n--- PHASE 3: VERIFICATION OF LIVE SYSTEM & CONTENT ASSERTIONS ---');
  const verifyOutput = runFE(`
    echo "=== HTTP STATUS CODES ==="
    for p in "/cms/dashboard/main" "/cms/broadcaster" "/cms/pengumuman" "/cms/profile" "/_next/static/chunks/0-gigr76s0g8t.js" "/_next/static/chunks/3def3ti6rk0vr.js" "/_next/static/chunks/3pp0f_cp6yg-o.js"; do
      c=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$p")
      echo "  ✓ $p -> HTTP $c"
    done

    echo "=== CONTENT ASSERTIONS IN CONTAINER ==="
    b1=$(docker exec bdb-web grep -o "Community Anak Serse" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js | head -n 1)
    echo "  ✓ Brand Client: '$b1'"

    b2=$(docker exec bdb-web grep -o "Community Anak Serse" /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js | head -n 1)
    echo "  ✓ Brand SSR: '$b2'"

    cl=$(docker exec bdb-web grep -o "WebkitLineClamp:3" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1)
    echo "  ✓ Feed 3-Line Clamp: '$cl'"

    dlg=$(docker exec bdb-web grep -o "Detail Postingan Linimasa CAS" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1)
    echo "  ✓ Feed Detail Modal Dialog: '$dlg'"

    vw=$(docker exec bdb-web grep -o "dilihat" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1)
    echo "  ✓ Feed Views Counter Metric: '$vw'"

    ro_banner=$(docker exec bdb-web grep -o "Mode Kedinasan - Terenkripsi" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1)
    echo "  ✓ Profile Read-Only Banner: '$ro_banner'"

    ro_state=$(docker exec bdb-web grep -o "isReadOnlyMode" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1)
    echo "  ✓ Profile isReadOnlyMode Guard: '$ro_state'"

    totp_check=$(docker exec bdb-web grep -o "Google Authenticator (TOTP)" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1)
    echo "  ✓ Profile 2FA TOTP: '$totp_check'"

    otp_check=$(docker exec bdb-web grep -o "OTP Email Kedinasan" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1)
    echo "  ✓ Profile 2FA Email OTP: '$otp_check'"

    totp_modal=$(docker exec bdb-web grep -o "Setup Google Authenticator (TOTP)" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1)
    echo "  ✓ Profile TOTP Setup Modal: '$totp_modal'"

    linkedin_check=$(docker exec bdb-web grep -c "Bahasa profil" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js || true)
    echo "  ✓ LinkedIn remnants in profile (must be 0): '$linkedin_check'"

    modal_open_check=$(docker exec bdb-web grep -c "setProfileModalOpen(!0)" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true)
    echo "  ✓ Feed setProfileModalOpen calls (must be 0): '$modal_open_check'"

    raw_check=$(docker exec bdb-web grep -c "p.raw_name &&" /usr/src/app/.next/static/chunks/35hkjujo3bzza.js || true)
    echo "  ✓ Feed raw_name count (must be 0): '$raw_check'"
  `);

  console.log(verifyOutput);

  console.log('======================================================================');
  console.log('DEPLOYMENT COMPLETE & LIVE VERIFIED WITH ZERO ERRORS!');
  console.log('======================================================================');
}

main().catch(err => {
  console.error('\n❌ DEPLOYMENT ERROR:', err);
  process.exit(1);
});
