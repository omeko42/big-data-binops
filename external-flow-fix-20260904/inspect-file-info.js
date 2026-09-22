const fs = require('fs');

for (const file of process.argv.slice(2)) {
  const source = fs.readFileSync(file, 'utf8');
  console.log(JSON.stringify({ file, bytes: Buffer.byteLength(source), head: source.slice(0, 320) }));
}
