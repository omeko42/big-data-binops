import fs from 'fs';
import { execSync } from 'child_process';

// 1. Update 3jkbfmy5u6eqq.js (Login page)
let login = fs.readFileSync('3jkbfmy5u6eqq.js', 'utf8');

// Update SVG to ScanFace Biometrics icon and update button label
const oldLoginButton = `(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"#0284c7",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",children:[(0,a.jsx)("path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"}),(0,a.jsx)("path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88"}),(0,a.jsx)("path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02"}),(0,a.jsx)("path",{d:"M2 12a10 10 0 0 1 18-6"}),(0,a.jsx)("path",{d:"M2 16h.01"}),(0,a.jsx)("path",{d:"M21.8 16c.2-2 .131-5.354 0-6"}),(0,a.jsx)("path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"}),(0,a.jsx)("path",{d:"M8.65 22c.21-.66.45-1.32.57-2"}),(0,a.jsx)("path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2"})]}),(0,a.jsx)("span",{children:passkeyLoading?"Menghubungkan Sensor…":"Masuk dengan Passkey (Biometrik / PIN / HP)"})`;

const newLoginButton = `(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"#0284c7",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",children:[(0,a.jsx)("path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}),(0,a.jsx)("path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}),(0,a.jsx)("path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}),(0,a.jsx)("path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}),(0,a.jsx)("path",{d:"M8 14s1.5 2 4 2 4-2 4-2"}),(0,a.jsx)("path",{d:"M9 9h.01"}),(0,a.jsx)("path",{d:"M15 9h.01"})]}),(0,a.jsx)("span",{children:passkeyLoading?"Memverifikasi Biometrik…":"Masuk dengan Biometrik / PIN / HP"})`;

if (login.includes(oldLoginButton)) {
    login = login.replace(oldLoginButton, newLoginButton);
    fs.writeFileSync('3jkbfmy5u6eqq.js', login, 'utf8');
    console.log('Successfully updated login button label to "Masuk dengan Biometrik / PIN / HP"');
} else {
    console.log('oldLoginButton pattern not found, trying partial replace...');
    login = login.replace(
        'Masuk dengan Passkey (Biometrik / PIN / HP)',
        'Masuk dengan Biometrik / PIN / HP'
    );
    login = login.replace(
        'Menghubungkan Sensor…',
        'Memverifikasi Biometrik…'
    );
    fs.writeFileSync('3jkbfmy5u6eqq.js', login, 'utf8');
    console.log('Partial replace applied to 3jkbfmy5u6eqq.js');
}

execSync('node --check 3jkbfmy5u6eqq.js', { stdio: 'inherit' });
console.log('3jkbfmy5u6eqq.js syntax OK!');

// 2. Update 3def3ti6rk0vr.js (Profile settings)
let profile = fs.readFileSync('3def3ti6rk0vr.js', 'utf8');

profile = profile.replaceAll('login sidik jari/wajah', 'login biometrik (wajah / sidik jari / PIN)');
profile = profile.replaceAll('sidik jari atau pengenalan wajah perangkat', 'biometrik wajah, sidik jari, atau PIN perangkat');
profile = profile.replaceAll('Proses sidik jari/wajah dibatalkan', 'Proses biometrik dibatalkan');
profile = profile.replaceAll('Daftarkan Gawai Ini Sekarang', 'Daftarkan Gawai Ini (Biometrik / PIN)');

fs.writeFileSync('3def3ti6rk0vr.js', profile, 'utf8');
execSync('node --check 3def3ti6rk0vr.js', { stdio: 'inherit' });
console.log('3def3ti6rk0vr.js syntax OK!');
