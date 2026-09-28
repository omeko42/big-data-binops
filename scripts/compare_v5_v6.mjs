import fs from 'fs';

const v5 = fs.readFileSync('scripts/build_tactical_linkedin_profile_v5.mjs', 'utf8');
const v6 = fs.readFileSync('scripts/build_tactical_linkedin_profile_v6.mjs', 'utf8');

console.log('v5 length:', v5.length);
console.log('v6 length:', v6.length);

// Check key phrases in v5
const checks = [
  'BUILDING SOLUTIONS ONE LINE AT A TIME',
  'READY TO WORK',
  'Bahasa profil',
  'Profil publik dan URL',
  'Orang yang Mungkin Anda Kenal',
  'AKBP Denny S.',
  'Belum ada ringkasan tentang profil Anda',
  'Postingan, catatan operasional, dan pemikiran taktis Anda',
  'Tambahkan bagian',
  'cas-settings-dropdown-wrapper'
];

for (const phrase of checks) {
  console.log(`"${phrase}": v5=${v5.includes(phrase)}, v6=${v6.includes(phrase)}`);
}
