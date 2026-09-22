import fs from 'node:fs';

const source = fs.readFileSync('D:/Prototype CAS/EDIT MASTER MASAL/current_Code.gs', 'utf8');
for (const name of process.argv.slice(2)) {
  const marker = `function ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) {
    console.log(`NOT FOUND: ${name}`);
    continue;
  }
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;
  let end = braceStart;
  for (; end < source.length; end++) {
    const ch = source[end];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) { end++; break; }
    }
  }
  console.log(`\n===== ${name} =====\n${source.slice(start, end)}\n`);
}
