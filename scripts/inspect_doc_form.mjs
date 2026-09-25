import fs from 'fs';

const c = fs.readFileSync('scratch/upload-doc-form-1mb-help-6acc5bceec6e.js', 'utf8');

console.log('--- Search file size and limits ---');
const patterns = [/1048576/, /1024\s*\*\s*1024/, /maxFileSize/, /file\.size/, /1\s*MB/i, /file/i];
for (const p of patterns) {
    let m;
    const re = new RegExp(p, 'g');
    let count = 0;
    while ((m = re.exec(c)) !== null && count < 10) {
        console.log('Pattern', p, 'at', m.index, ':\n', c.substring(Math.max(0, m.index - 50), Math.min(c.length, m.index + 120)));
        count++;
    }
}

console.log('\n--- Search for onSubmit or validate in form ---');
let pos = 0;
while ((pos = c.indexOf('onSubmit', pos)) !== -1) {
    console.log('onSubmit at', pos, ':\n', c.substring(Math.max(0, pos - 100), Math.min(c.length, pos + 300)));
    pos += 8;
}
