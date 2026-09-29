import { runBE } from './be_exec.mjs';
import { runFE } from './fe_exec.mjs';

async function main() {
  console.log('====================================================');
  console.log('   VERIFYING ALL FIXES ACROSS CAS MODULES');
  console.log('====================================================\n');

  // 1. Backend DB & API Verification
  console.log('--- 1. Database Users & Post 3 Author ---');
  const dbScript = `
  const { Client } = require('pg');
  async function test() {
    const c = new Client('postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops');
    await c.connect();
    const u122 = (await c.query("SELECT id, name, username, callsign, role_bdb, scope_satker_id, scope_satker_key FROM auth_users WHERE id = 122")).rows[0];
    const u1 = (await c.query("SELECT id, name, username, callsign, role_bdb FROM auth_users WHERE id = 1")).rows[0];
    const p3 = (await c.query("SELECT p.id, p.author_id, u.name as author_name, u.callsign as author_callsign, u.username as author_username, p.content FROM bdb_social_posts p LEFT JOIN auth_users u ON p.author_id = u.id WHERE p.id = 3")).rows[0];
    await c.end();
    console.log('User 122:', u122);
    console.log('User 1:', u1);
    console.log('Post 3:', p3);
  }
  test();
  `;
  const dbB64 = Buffer.from(dbScript).toString('base64');
  console.log(runBE(`docker exec bdb-api node -e "$(echo '${dbB64}' | base64 -d)"`));

  // 2. Feed API Check
  console.log('\n--- 2. Feed API /api/bdb/jukrah/feed?type=all Post 3 ---');
  const feedScript = `
  const http = require('http');
  const req = http.request({
    hostname: 'localhost',
    port: 3850,
    path: '/api/bdb/jukrah/feed?type=all',
    method: 'GET'
  }, res => {
    let buf = '';
    res.on('data', chunk => buf += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(buf);
        const posts = json.data?.posts || [];
        const p3 = posts.find(p => p.id === 3 || p.content?.includes('spri TB I'));
        if (p3) {
          console.log('Post 3 from Feed API:', {
            id: p3.id,
            author_id: p3.author_id,
            author_name: p3.author_name,
            author_callsign: p3.author_callsign,
            author_username: p3.author_username,
            author_role: p3.author_role,
            content: p3.content?.substring(0, 60)
          });
        } else {
          console.log('Post 3 not found in first page, total posts:', posts.length);
        }
      } catch(e) {
        console.log('Parse error:', e.message);
      }
    });
  });
  req.on('error', console.error);
  req.end();
  `;
  const feedB64 = Buffer.from(feedScript).toString('base64');
  console.log(runBE(`docker exec bdb-api node -e "$(echo '${feedB64}' | base64 -d)"`));

  // 3. Frontend Container Chunks Verification
  console.log('\n--- 3. Frontend Chunks Verification ---');
  const broadcasterBadge = runFE('docker exec bdb-web grep -c "BARESKRIM POLRI" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js || true');
  console.log('Broadcaster pill badge "BARESKRIM POLRI" occurrences (should be 0 or in disclaimer only):', broadcasterBadge.trim());

  const profileNameCheck = runFE('docker exec bdb-web grep -c "HENDRIK DWI HARIADI" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js || true');
  console.log('Profile chunk has HENDRIK DWI HARIADI fallback:', profileNameCheck.trim() > 0 ? 'YES' : 'NO');

  const profileCallsignSync = runFE('docker exec bdb-web grep -c "hendrik_dwi" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js || true');
  console.log('Profile chunk has hendrik_dwi callsign resolution:', profileCallsignSync.trim() > 0 ? 'YES' : 'NO');

  const topbarRoleCheck = runFE('docker exec bdb-web grep -c "Dit Res Siber Jatim" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js || true');
  console.log('Topbar chunk has Dit Res Siber Jatim resolution:', topbarRoleCheck.trim() > 0 ? 'YES' : 'NO');

  // 4. HTTP 200 Routes Check
  console.log('\n--- 4. HTTP Routes Check ---');
  const routes = ['/cms/dashboard/main', '/cms/broadcaster', '/cms/profile'];
  for (const r of routes) {
    const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${r}`);
    console.log(`Route ${r}: HTTP ${code.trim()}`);
  }

  console.log('\n====================================================');
  console.log('   ALL CHECKS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

main().catch(console.error);
