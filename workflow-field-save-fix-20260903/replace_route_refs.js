const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const oldName = process.argv[3];
const newName = process.argv[4];
let replacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const text = fs.readFileSync(full).toString('utf8');
      const count = text.split(oldName).length - 1;
      if (count > 0) {
        fs.writeFileSync(full, text.split(oldName).join(newName));
        replacements += count;
      }
    }
  }
}

walk(root);
if (replacements < 1) throw new Error('Referensi chunk lama tidak ditemukan');
console.log(`ROUTE_REFS_REPLACED=${replacements}`);
