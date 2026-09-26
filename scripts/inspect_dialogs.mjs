import fs from 'fs';

const content = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

function findDialog(str) {
    let idx = content.indexOf(str);
    if (idx !== -1) {
        console.log('=== Dialog with', str, 'at', idx, '===');
        console.log(content.substring(idx - 50, idx + 1000));
    } else {
        console.log('NOT FOUND:', str);
    }
}

findDialog('eTotpModal');
findDialog('eDisableModal');
findDialog('Konfirmasi Nonaktifkan');
