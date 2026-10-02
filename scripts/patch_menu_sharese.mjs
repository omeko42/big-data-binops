import fs from 'fs';
import { execSync } from 'child_process';

let content = fs.readFileSync('frontend-patch/0-gigr76s0g8t.final.js', 'utf8');

// 1. Sidebar menu category label
const targetMenu = '{label:"Jukrahcaster",items:[{key:"jukrahcaster",label:"Feed",icon:"pi pi-fw pi-globe",to:"/cms/broadcaster",defaultRoles:a}';
const replaceMenu = '{label:"SHARESE",items:[{key:"jukrahcaster",label:"Feed",icon:"pi pi-fw pi-globe",to:"/cms/broadcaster",defaultRoles:a}';

if (!content.includes(targetMenu)) {
  console.error('ERROR: targetMenu not found!');
  process.exit(1);
}
content = content.replace(targetMenu, replaceMenu);
console.log('✓ Replaced Jukrahcaster menu label with SHARESE');

// 2. Breadcrumbs broadcaster
const targetBreadcrumb = 'broadcaster:"Jukrahcaster Feed"';
const replaceBreadcrumb = 'broadcaster:"SHARESE"';
if (content.includes(targetBreadcrumb)) {
  content = content.replace(targetBreadcrumb, replaceBreadcrumb);
  console.log('✓ Replaced broadcaster breadcrumb with SHARESE');
} else {
  console.warn('WARN: targetBreadcrumb not found');
}

// 3. Breadcrumbs profile spelling
const targetProfileBreadcrumb = 'profile:"Profile Saya"';
const replaceProfileBreadcrumb = 'profile:"Profil Saya"';
if (content.includes(targetProfileBreadcrumb)) {
  content = content.replace(targetProfileBreadcrumb, replaceProfileBreadcrumb);
  console.log('✓ Replaced profile breadcrumb with Profil Saya');
}

fs.writeFileSync('frontend-patch/0-gigr76s0g8t.final.js', content);
fs.writeFileSync('frontend-patch/0-gigr76s0g8t.patched.js', content);

try {
  execSync('node -c frontend-patch/0-gigr76s0g8t.final.js');
  console.log('✓ Syntax check passed on 0-gigr76s0g8t.final.js');
} catch (e) {
  console.error('Syntax error:', e);
  process.exit(1);
}
