import fs from 'fs';

const content = fs.readFileSync('satker.service.ts', 'utf8');

console.log('satker.service.ts length:', content.length);
let keywords = ['roots', 'children', 'path', 'getChildren', 'getRoots', 'getPath'];
for (let kw of keywords) {
  let idx = content.indexOf(kw);
  console.log(`Keyword "${kw}":`, idx !== -1 ? `found at ${idx}` : 'not found');
  if (idx !== -1) {
    console.log(content.substring(idx - 50, idx + 400));
    console.log('----------------');
  }
}
