import { runFE } from './fe_inspect.mjs';

function verify() {
    console.log('=== VERIFY MODAL POLISH & SAME-TAB JUMP ===');
    const chunkPath = '/usr/src/app/.next/static/chunks/register-pihak-v5-6478da3b8c2c.js';

    const grepMax = runFE(`docker exec bdb-web grep -o lpModalMax ${chunkPath} || true`).trim();
    console.log('1. lpModalMax found in live container:', grepMax ? grepMax.split('\n').length + ' times' : 'NO');

    const grepSatkerMax = runFE(`docker exec bdb-web grep -o satkerModalMax ${chunkPath} || true`).trim();
    console.log('2. satkerModalMax found in live container:', grepSatkerMax ? grepSatkerMax.split('\n').length + ' times' : 'NO');

    const grepJump = runFE(`docker exec bdb-web grep -o cas_pt_jump ${chunkPath} || true`).trim();
    console.log('3. cas_pt_jump found in live container:', grepJump ? grepJump.split('\n').length + ' times' : 'NO');

    const grepCleanCrime = runFE(`docker exec bdb-web grep -o cleanCrime ${chunkPath} || true`).trim();
    console.log('4. cleanCrime found in live container:', grepCleanCrime ? grepCleanCrime.split('\n').length + ' times' : 'NO');

    const statusWeb = runFE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/cms/laporan/pihak-sering-terlibat || true").trim();
    console.log('5. HTTP status pihak-sering-terlibat:', statusWeb);

    const statusRekap = runFE("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/cms/laporan/rekap-pihak-terlibat || true").trim();
    console.log('6. HTTP status rekap-pihak-terlibat:', statusRekap);
}

verify();
