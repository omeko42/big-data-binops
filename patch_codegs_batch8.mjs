import fs from 'node:fs';

const sourcePath = 'D:/Prototype CAS/EDIT MASTER MASAL/current_Code.gs';
const outputPath = 'D:/Prototype CAS/EDIT MASTER MASAL/Code_fixed_batch8.gs';
const source = fs.readFileSync(sourcePath, 'utf8');
const anchor = "ensureRowCapacity_(responseSheet, targetRow);     ensureRowCapacity_(importSheet, targetRow);      responseSheet.getRange(targetRow, 1, 1, 13).setValues";
const replacement = "ensureRowCapacity_(responseSheet, targetRow);     ensureRowCapacity_(importSheet, targetRow);      responseSheet.getRange(targetRow, 3, 1, 3).setNumberFormat('@');     responseSheet.getRange(targetRow, 7).setNumberFormat('@');     responseSheet.getRange(targetRow, 12).setNumberFormat('@');     importSheet.getRange(targetRow, 2, 1, 3).setNumberFormat('@');     importSheet.getRange(targetRow, 7).setNumberFormat('@');     importSheet.getRange(targetRow, 12).setNumberFormat('@');      responseSheet.getRange(targetRow, 1, 1, 13).setValues";
if (!source.includes(anchor)) throw new Error('Anchor submitData tidak ditemukan.');
const patched = source.replace(anchor, replacement);
if (patched === source) throw new Error('Code.gs tidak berubah.');
fs.writeFileSync(outputPath, patched, 'utf8');
console.log(JSON.stringify({ outputPath, chars: patched.length }));
