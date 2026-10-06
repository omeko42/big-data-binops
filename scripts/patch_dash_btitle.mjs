import fs from 'fs';

let dash = fs.readFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', 'utf8');

const oldBTitle = `let bTitle = isSuper ? 'Superadmin Terverifikasi' : 'Personil Terverifikasi';`;
const newBTitle = `let bTitle = isSuper ? 'Superadmin Terverifikasi' : ((roleStr === 'admin_binops' || roleStr === 'binops') ? 'Admin Binops Terverifikasi' : ((roleStr === 'operator') ? 'Operator Terverifikasi' : 'Personil Terverifikasi'));`;

if (!dash.includes(oldBTitle)) {
  throw new Error('oldBTitle not found in dashboard chunk');
}

dash = dash.replace(oldBTitle, newBTitle);
new Function(dash);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.final.js', dash);
fs.writeFileSync('frontend-patch/dashboard-perma-318125d33290_v2.patched.js', dash);
console.log('Successfully updated bTitle in dashboard chunks!');
