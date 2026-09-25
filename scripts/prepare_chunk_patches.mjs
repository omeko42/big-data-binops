import fs from 'fs';

console.log('=== Inspecting upload-doc-form-1mb-help-6acc5bceec6e.js ===');
let docForm = fs.readFileSync('scratch/upload-doc-form-1mb-help-6acc5bceec6e.js', 'utf8');

const docTarget1 = 'let FILE_MAX_MB=1,FILE_MAX_BYTES=1048576,FILE_MAX_COUNT=20;';
const docRepl1 = 'let FILE_MAX_MB=20,FILE_MAX_BYTES=20971520,FILE_MAX_COUNT=20;';

const docTarget2 = 'Semua jenis file, maks 1 MB per file, maks 20 file.';
const docRepl2 = 'Semua jenis file, maks 20 MB per file, maks 20 file.';

if (!docForm.includes(docTarget1) || !docForm.includes(docTarget2)) {
    console.error('ERROR: targets not found in docForm!');
    process.exit(1);
}

let patchedDocForm = docForm.replace(docTarget1, docRepl1).replaceAll(docTarget2, docRepl2);
fs.writeFileSync('scratch/upload-doc-form-1mb-help-6acc5bceec6e.patched.js', patchedDocForm, 'utf8');
console.log('Saved scratch/upload-doc-form-1mb-help-6acc5bceec6e.patched.js');

console.log('Remaining 1048576 in docForm:', patchedDocForm.includes('1048576'));
console.log('Remaining 1 MB in docForm:', patchedDocForm.includes('1 MB'));
console.log('Includes 20971520 in docForm:', patchedDocForm.includes('20971520'));
console.log('Includes 20 MB in docForm:', patchedDocForm.includes('20 MB'));
