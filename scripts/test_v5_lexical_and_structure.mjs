import fs from 'fs';
import cp from 'child_process';

const code = fs.readFileSync('frontend-patch/3def3ti6rk0vr.linkedin_v5.js', 'utf8');

// 1. Syntax validation via node -c
try {
  cp.execSync('node -c frontend-patch/3def3ti6rk0vr.linkedin_v5.js');
  console.log('✓ Syntax Check Passed: No parse errors');
} catch (e) {
  console.error('❌ Syntax Check Failed:', e.message);
  process.exit(1);
}

// 2. Check essential tokens
const essentialTokens = [
  'isReadOnlyMode',
  'setIsReadOnlyMode',
  'formatCallsign',
  'formatCount',
  'Tentang Saya',
  'Aktivitas',
  'Pengalaman',
  'Pendidikan',
  'Setup Google Authenticator (TOTP)',
  'Pengaturan Profil & Keamanan Kedinasan',
  'Otentikasi Dua Langkah (2FA)',
  'Community Anak Serse',
  'Profil Personil CAS (Mode Kedinasan - Terenkripsi)',
  'Salin Callsign'
];

let allPassed = true;
for (const token of essentialTokens) {
  const count = (code.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (count === 0) {
    console.error(`❌ Missing essential token: "${token}"`);
    allPassed = false;
  } else {
    console.log(`✓ Token found: "${token}" (count: ${count})`);
  }
}

// 3. Check that BIG DATA BINOPS is NOT present
if (code.includes('BIG DATA BINOPS')) {
  console.error('❌ Found forbidden legacy brand: "BIG DATA BINOPS"');
  allPassed = false;
} else {
  console.log('✓ No legacy brand "BIG DATA BINOPS" found');
}

// 4. Verify all edit modals have isReadOnlyMode guards
const editModals = [
  { name: 'Edit Profil Dialog', pattern: 'visible:Boolean($ && !isReadOnlyMode)' },
  { name: 'Foto Profil Dialog', pattern: 'visible:Boolean(ePhotoModal && !isReadOnlyMode)' },
  { name: 'Setup TOTP Dialog', pattern: 'visible:Boolean(eTotpModal && !isReadOnlyMode)' },
  { name: 'Disable Modal Dialog', pattern: 'visible:Boolean(eDisableModal && !isReadOnlyMode)' },
  { name: 'Edit Satker Dialog', pattern: 'visible:Boolean(eO && !isReadOnlyMode)' },
  { name: '2FA Modal Dialog', pattern: 'visible:Boolean(Q && !isReadOnlyMode)' },
  { name: 'Settings Modal Dialog', pattern: 'visible:Boolean(eSettingsModal && !isReadOnlyMode)' },
  { name: 'Bio Modal Dialog', pattern: 'visible:Boolean(eBioModal && !isReadOnlyMode)' },
  { name: 'Exp Modal Dialog', pattern: 'visible:Boolean(eExpModal && !isReadOnlyMode)' },
  { name: 'Edu Modal Dialog', pattern: 'visible:Boolean(eEduModal && !isReadOnlyMode)' },
  { name: 'Banner Modal Dialog', pattern: 'visible:Boolean(eBannerModal && !isReadOnlyMode)' },
  { name: 'Add Section Dialog', pattern: 'visible:Boolean(eAddSectionModal && !isReadOnlyMode)' }
];

for (const m of editModals) {
  if (code.includes(m.pattern)) {
    console.log(`✓ Protected modal: ${m.name}`);
  } else {
    console.error(`❌ Modal not properly guarded: ${m.name} (pattern: ${m.pattern})`);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\nVerification FAILED!');
  process.exit(1);
} else {
  console.log('\n🎉 ALL CHECKS PASSED PERFECTLY!');
}
