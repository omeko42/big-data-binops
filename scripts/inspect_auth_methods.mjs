import fs from 'fs';

const content = fs.readFileSync('auth.service.ts', 'utf8');

function findMethod(name) {
    const idx = content.indexOf(name);
    if (idx === -1) {
        console.log(`Method ${name} not found`);
        return;
    }
    console.log(`\n=== METHOD: ${name} ===`);
    console.log(content.substring(idx, idx + 1000));
}

findMethod('forgotPassword');
findMethod('requestForgotPassword');
findMethod('totp');
findMethod('profile/security');
