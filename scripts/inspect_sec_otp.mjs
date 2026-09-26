import fs from 'fs';

const content = fs.readFileSync('auth.service.ts', 'utf8');

function show(name) {
    const idx = content.indexOf(name);
    console.log(`=== ${name} (idx: ${idx}) ===`);
    if (idx !== -1) console.log(content.substring(idx, idx + 1000));
}

show('updateProfilePrimaryEmail');
show('requestProfileSecurityOtp');
