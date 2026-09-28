import { runFE } from './fe_exec.mjs';

const checks = [
  { name: 'Profile click-to-edit', cmd: 'docker exec bdb-web grep -o "Klik foto untuk mengganti foto profil" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js' },
  { name: 'Profile verified badge', cmd: 'docker exec bdb-web grep -o "Superadmin Terverifikasi" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1' },
  { name: 'Profile settings dropdown', cmd: 'docker exec bdb-web grep -o "cas-settings-dropdown-wrapper" /usr/src/app/.next/static/chunks/3def3ti6rk0vr.js | head -n 1' },
  { name: 'Topbar avatar verified badge', cmd: 'docker exec bdb-web grep -o "Superadmin Terverifikasi" /usr/src/app/.next/static/chunks/0-gigr76s0g8t.js | head -n 1' },
  { name: 'Dashboard feed verified badge', cmd: 'docker exec bdb-web grep -o "Superadmin Terverifikasi" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js | head -n 1' },
  { name: 'Dashboard feed reactions count', cmd: 'docker exec bdb-web grep -o "item.total_reactions" /usr/src/app/.next/static/chunks/dashboard-perma-318125d33290_v2.js | head -n 1' },
  { name: 'Broadcaster cyan badge', cmd: 'docker exec bdb-web grep -o "#38bdf8" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1' },
  { name: 'Pengumuman verified badge', cmd: 'docker exec bdb-web grep -o "Superadmin Terverifikasi" /usr/src/app/.next/static/chunks/35hkjujo3bzza.js | head -n 1' }
];

for (const c of checks) {
  try {
    const res = runFE(c.cmd).trim();
    console.log(`✓ ${c.name}: [${res}]`);
  } catch(e) {
    console.log(`❌ ${c.name}: failed`);
  }
}
