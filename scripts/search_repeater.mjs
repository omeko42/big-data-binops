import fs from 'fs';

const c = fs.readFileSync('scratch/upload-doc-form-1mb-help-6acc5bceec6e.js', 'utf8');

let pos = 0;
while ((pos = c.indexOf('"repeater"', pos)) !== -1) {
    console.log('repeater at', pos, ':\n', c.substring(Math.max(0, pos - 150), Math.min(c.length, pos + 450)));
    pos += 10;
}
