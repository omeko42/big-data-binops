import { runFE } from './fe_exec.mjs';

async function verify() {
  console.log('--- 1. Check curl localhost:3000/cms/broadcaster ---');
  const r1 = runFE('curl -s -i http://localhost:3000/cms/broadcaster | head -n 12');
  console.log(r1);

  console.log('--- 2. Check curl static chunk 3pp0f_cp6yg-o.js ---');
  const r2 = runFE('curl -s -I http://localhost:3000/_next/static/chunks/3pp0f_cp6yg-o.js');
  console.log(r2);

  console.log('--- 3. Check SHARESE in static chunk served by localhost:3000 ---');
  const r3 = runFE('curl -s http://localhost:3000/_next/static/chunks/3pp0f_cp6yg-o.js | grep -o "SHARESE" | wc -l');
  console.log('SHARESE matches in served chunk:', r3.trim());

  console.log('--- 4. Check that UI "Akun Aktif" text is eliminated ---');
  const r4 = runFE('curl -s http://localhost:3000/_next/static/chunks/3pp0f_cp6yg-o.js | grep -c \'"Akun Aktif"\' || echo "0"');
  console.log('"Akun Aktif" occurrences in served chunk:', r4.trim());
}

verify().catch(console.error);
