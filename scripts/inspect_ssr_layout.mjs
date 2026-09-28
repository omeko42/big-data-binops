import fs from 'fs';

const content = fs.readFileSync('frontend-patch/app_cms_layout_tsx_0ml_4_3._.js', 'utf8');
const idx = content.indexOf('["superadmin","admin_binops"');
console.log('Found in SSR:', idx);
if (idx !== -1) {
    console.log(content.substring(idx - 30, idx + 4000));
} else {
    console.log('Not found by role array, searching Jukrah:');
    let jIdx = content.indexOf('Jukrah');
    console.log('Jukrah at:', jIdx);
    if (jIdx !== -1) console.log(content.substring(jIdx - 200, jIdx + 400));
}
