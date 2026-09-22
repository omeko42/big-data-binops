const fs = require('fs');

const file = process.argv[2];
const needles = process.argv.slice(3);
const source = fs.readFileSync(file, 'utf8');

for (const needle of needles) {
  let index = 0;
  let occurrence = 0;
  while ((index = source.indexOf(needle, index)) !== -1 && occurrence < 8) {
    occurrence += 1;
    const start = Math.max(0, index - 900);
    const end = Math.min(source.length, index + needle.length + 1400);
    console.log(`\n=== ${needle} #${occurrence} @${index} ===\n`);
    console.log(source.slice(start, end));
    index += needle.length;
  }
}
