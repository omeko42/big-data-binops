import { runFE } from './fe_exec.mjs';

const routes = [
  '/cms/dashboard/main',
  '/cms/laporan-polisi',
  '/cms/profile',
  '/cms/broadcaster',
  '/cms/pengumuman'
];

for (const r of routes) {
  const code = runFE(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${r}`);
  console.log(`Route ${r} status: ${code.trim()}`);
}
