import { runFE } from './fe_exec.mjs';

const chunks = [
  '0hamt5dfwnhm7.js',
  '0vnxm1yurd2-8.js',
  '22459xkv0m1tw.js',
  '3def3ti6rk0vr.js',
  '0cz1d0mv5g_q7.js',
  '310vm2bl3xxpt.js'
];

for (const c of chunks) {
  const res = runFE(`docker exec bdb-web sh -c "ls -la /usr/src/app/.next/static/chunks/${c}"`).trim();
  console.log(res);
}
