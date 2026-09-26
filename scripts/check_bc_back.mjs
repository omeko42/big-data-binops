import fs from 'fs';

const c = fs.readFileSync('0-gigr76s0g8t.patched.js', 'utf8');
console.log('Button with cms-bc-back present?:', c.includes('className:"cms-bc-back"'));
console.log('Sep present in breadcrumb?:', c.includes('className:"cms-bc-sep"'));
console.log('Occurrences of cms-bc-back:', c.split('cms-bc-back').length - 1);
