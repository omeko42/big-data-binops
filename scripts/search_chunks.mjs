import fs from 'fs';

function searchFile(filename) {
    console.log('==================== Searching', filename, '====================');
    const content = fs.readFileSync(filename, 'utf8');

    const patterns = [
        /15403/g,
        /isUsrOne/g,
        /currentUser\??\.photo_url/g,
        /currentUser\??\.foto/g,
        /author_photo/g,
        /photo_url/g
    ];

    for (const pat of [/15403/g, /isUsrOne/g, /currentUser\??\.photo_url/g]) {
        let match;
        while ((match = pat.exec(content)) !== null) {
            const start = Math.max(0, match.index - 150);
            const end = Math.min(content.length, match.index + 250);
            console.log(`[${pat.source}] at ${match.index}:`);
            console.log(content.slice(start, end));
            console.log('--------------------------------------------------');
        }
    }
}

searchFile('3pp0f_cp6yg-o.js');
searchFile('3def3ti6rk0vr.js');
