import { runFE } from './fe_exec.mjs';

const routes = [
  '/cms/dashboard/main',
  '/cms/profile',
  '/cms/broadcaster',
  '/cms/pengumuman'
];

for (const r of routes) {
  const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${r}`).trim();
  console.log(`${r} -> HTTP ${code}`);
}

const chunks = [
  '0-gigr76s0g8t.js',
  '3def3ti6rk0vr.js',
  'dashboard-perma-318125d33290_v2.js',
  'dashboard-perma-318125d33290.js',
  '3pp0f_cp6yg-o.js',
  '35hkjujo3bzza.js'
];

for (const c of chunks) {
  const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/_next/static/chunks/${c}`).trim();
  console.log(`chunk ${c} -> HTTP ${code}`);
}
