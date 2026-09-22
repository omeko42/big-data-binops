const fs = require('fs');

const oldName = 'kinerja-v6-20260830.js';
const newName = 'kinerja-external-20260904.js';
const files = process.argv.slice(2);

if (!files.length) throw new Error('No prerender files supplied');

for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  const oldCount = source.split(oldName).length - 1;
  const newCount = source.split(newName).length - 1;
  if (oldCount < 1 || newCount > 0) {
    throw new Error(`Unexpected prerender state ${file}: old=${oldCount}, new=${newCount}`);
  }
  source = source.split(oldName).join(newName);
  fs.writeFileSync(`${file}.next`, source);
  console.log(JSON.stringify({ file, referencesUpdated: oldCount }));
}
