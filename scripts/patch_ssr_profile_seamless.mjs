import fs from 'fs';
import vm from 'vm';

const originalSSR = fs.readFileSync('live-ssr-profile.js', 'utf8');
const exactSSR = fs.readFileSync('scratch/exact_ssr_header_block.js', 'utf8');

const s = fs.readFileSync('scripts/test_ssr_valid.mjs', 'utf8');
const start = s.indexOf('const s = `') + 'const s = `'.length;
const end = s.indexOf('`;', start);
const replacementSSR = s.substring(start, end);

if (!originalSSR.includes(exactSSR)) {
    console.error("ERROR: Target block to replace NOT found in live-ssr-profile.js!");
    process.exit(1);
}

const patchedSSR = originalSSR.replace(exactSSR, replacementSSR + ',(0,b.jsxs)');
console.log("SSR Replaced successfully! Old length:", originalSSR.length, "New length:", patchedSSR.length);

fs.writeFileSync('app_cms_profile_page_tsx_0_ymkmx._.patched.js', patchedSSR);

try {
    new vm.Script(patchedSSR);
    console.log("SSR JS syntax check PASSED! app_cms_profile_page_tsx_0_ymkmx._.patched.js is valid JavaScript.");
} catch (err) {
    console.error("SSR JS syntax validation FAILED:", err);
    process.exit(1);
}
