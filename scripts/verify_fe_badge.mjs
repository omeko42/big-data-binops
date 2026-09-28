import { runFE } from './fe_exec.mjs';

const res = runFE(`
  echo "--- Check 1: handleOpenUserProfile ---"
  docker exec bdb-web grep -o "handleOpenUserProfile" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 3
  echo "--- Check 2: Profil Personil CAS Dialog ---"
  docker exec bdb-web grep -o "Profil Personil CAS" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 2
  echo "--- Check 3: Network profile endpoint call ---"
  docker exec bdb-web grep -o "/bdb/jukrah/network/profile/" /usr/src/app/.next/static/chunks/3pp0f_cp6yg-o.js | head -n 1
`);

console.log(res);
