import cp from 'child_process';

const url = 'https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js';
console.log('Fetching', url, 'via curl...');
try {
    const res = cp.execSync(`curl -k -s "${url}"`, { maxBuffer: 20 * 1024 * 1024 }).toString('utf8');
    console.log('Downloaded length:', res.length);
    console.log('Has Setup Google Authenticator?', res.includes('Setup Google Authenticator (TOTP)'));
    console.log('Has Otentikasi Dua Langkah (2FA)?', res.includes('Otentikasi Dua Langkah (2FA)'));
    console.log('Has startTotpSetup?', res.includes('startTotpSetup'));
    console.log('Has renderSwitch?', res.includes('renderSwitch'));
} catch (e) {
    console.error('Error fetching chunk:', e.message);
}

const layoutUrl = 'https://cas.bareskrim.polri.go.id/_next/static/chunks/0-gigr76s0g8t.js';
console.log('\nFetching', layoutUrl, 'via curl...');
try {
    const res = cp.execSync(`curl -k -s "${layoutUrl}"`, { maxBuffer: 20 * 1024 * 1024 }).toString('utf8');
    console.log('Downloaded length:', res.length);
    console.log('Has livePhoto?', res.includes('livePhoto'));
    console.log('Has user-updated listener?', res.includes('user-updated'));
} catch (e) {
    console.error('Error fetching layout chunk:', e.message);
}
