import fs from 'fs';

const content = fs.readFileSync('0-gigr76s0g8t.js', 'utf8');

// 1. Inspect Kembali button
const bcIdx = content.indexOf('className:"cms-bc-back"');
console.log("=== BREADCRUMB BACK BUTTON ===");
console.log(content.substring(bcIdx - 100, bcIdx + 300));

// 2. Inspect L component where eo and ec are defined
const userIdx = content.indexOf('className:"cms-user"');
console.log("=== CMS USER SECTION ===");
console.log(content.substring(userIdx - 1000, userIdx + 500));
