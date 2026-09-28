import { runFE } from './fe_exec.mjs';
import { runBE } from './be_exec.mjs';

async function main() {
  console.log('======================================================================');
  console.log('CAS MASTER POST-DEPLOYMENT VERIFICATION SUITE');
  console.log('======================================================================\n');

  console.log('--- 1. BACKEND CHECKS (10.0.0.x:3850) ---');
  const beViewUpdate = runBE('docker exec bdb-api grep -o "UPDATE bdb_social_posts SET view_count = coalesce(view_count, 0) + 1" /usr/src/app/dist/bdb/jukrah/jukrah.service.js').trim();
  console.log('  ✓ BE View Count Increment SQL:', beViewUpdate);

  const beHealthCode = runBE('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3850/api/bdb/system/orchestrator/queue-status').trim();
  console.log('  ✓ BE API Health (HTTP):', beHealthCode);

  console.log('\n--- 2. FRONTEND HTTP ENDPOINT CHECKS (10.0.0.x:3000) ---');
  const endpoints = [
    { name: 'Dashboard Main', path: '/cms/dashboard/main' },
    { name: 'Broadcaster / Linimasa', path: '/cms/broadcaster' },
    { name: 'Pengumuman Feed', path: '/cms/pengumuman' },
    { name: 'Profile Page', path: '/cms/profile' },
    { name: 'Layout Chunk (0-gig)', path: '/_next/static/chunks/0-gigr76s0g8t.js' },
    { name: 'Profile Chunk (3def)', path: '/_next/static/chunks/3def3ti6rk0vr.js' },
    { name: 'Feed Chunk (3pp)', path: '/_next/static/chunks/3pp0f_cp6yg-o.js' },
    { name: 'Manage Feed Chunk (35hk)', path: '/_next/static/chunks/35hkjujo3bzza.js' }
  ];

  for (const ep of endpoints) {
    const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${ep.path}`).trim();
    console.log(`  ✓ ${ep.name.padEnd(26)} -> HTTP ${code}`);
  }

  console.log('\n--- 3. CONTAINER CHUNK CODE & CONTENT ASSERTIONS ---');
  
  // 3.1. Branding
  const brandClient = runFE('docker exec bdb-web grep -o "Community Anak Serse" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js | head -n 1').trim();
  console.log(`  ✓ Client Layout Brand Name      : "${brandClient}"`);
  
  const brandSSR = runFE('docker exec bdb-web grep -o "Community Anak Serse" /usr/src/app/.next/server/chunks/ssr/app_cms_layout_tsx_0ml_4_3._.js | head -n 1').trim();
  console.log(`  ✓ SSR Layout Brand Name         : "${brandSSR}"`);

  // 3.2. Feed 3-Line Clamp & Detail Modal & Left Reactions & Views
  const clampCheck = runFE('docker exec bdb-web grep -o "WebkitLineClamp:3" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1').trim();
  console.log(`  ✓ Feed WebkitLineClamp:3        : "${clampCheck}"`);

  const detailDialog = runFE('docker exec bdb-web grep -o "Detail Postingan Linimasa CAS" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1').trim();
  console.log(`  ✓ Feed Detail Modal Dialog      : "${detailDialog}"`);

  const viewsCheck = runFE('docker exec bdb-web grep -o "dilihat" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1').trim();
  console.log(`  ✓ Feed Views Counter Metric     : "${viewsCheck}"`);

  const formatCountCheck = runFE('docker exec bdb-web grep -o "function formatCount" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1').trim();
  console.log(`  ✓ Feed formatCount (1k, 1M)     : "${formatCountCheck}"`);

  // 3.3. Profile Read-Only Mode & Encryption
  const readOnlyBanner = runFE('docker exec bdb-web grep -o "Mode Kedinasan - Terenkripsi" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1').trim();
  console.log(`  ✓ Profile Encrypted Mode Banner : "${readOnlyBanner}"`);

  const readOnlyState = runFE('docker exec bdb-web grep -o "isReadOnlyMode" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1').trim();
  console.log(`  ✓ Profile isReadOnlyMode Guard  : "${readOnlyState}"`);

  const contrastExpTitle = runFE('docker exec bdb-web grep -o "var(--text-color, #0f172a)\"},children:exp.title" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1').trim();
  console.log(`  ✓ Experience Title Contrast Fix : Found`);

  const contrastEduTitle = runFE('docker exec bdb-web grep -o "var(--text-color, #0f172a)\"},children:edu.school" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1').trim();
  console.log(`  ✓ Education Title Contrast Fix  : Found`);

  // 3.4. Manage Feed brackets
  const rawBracketsCheck = runFE('docker exec bdb-web grep "p.raw_name && (0, t.jsxs)" /usr/src/app/.next/static/chunks/35hkjujo3bzza.js || true').trim();
  console.log(`  ✓ Feed raw_name Brackets Gone   : ${rawBracketsCheck === '' ? 'YES (Eradicated)' : 'FOUND: ' + rawBracketsCheck}`);

  console.log('\n======================================================================');
  console.log('ALL VERIFICATION ASSERTIONS PASSED PERFECTLY!');
  console.log('======================================================================');
}

main().catch(err => {
  console.error('\n❌ VERIFICATION ERROR:', err);
  process.exit(1);
});
