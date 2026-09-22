const fs = require('fs');

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error('Usage: node patch-register-pihak.js <input.js> <output.js>');
}

let source = fs.readFileSync(inputPath, 'utf8');

function replaceExactlyOnce(from, to, label) {
  const count = source.split(from).length - 1;
  if (count !== 1) {
    throw new Error(`${label}: expected exactly 1 anchor, found ${count}`);
  }
  source = source.replace(from, to);
}

replaceExactlyOnce(
  ')).data;e||j(a?.meta?.summary||{})',
  ')).data,r=a?.meta?.summary??a?.data?.summary??a?.summary??a?.data??a?.meta??{};e||j(Array.isArray(r)?r[0]||{}:r)',
  'summary response normalization'
);

replaceExactlyOnce(
  'stripedRows:!0,size:"small",emptyMessage:"Tidak ada data."',
  'stripedRows:!0,size:"small",scrollable:!0,tableStyle:{minWidth:"112rem"},emptyMessage:"Tidak ada data."',
  'horizontal table scrolling'
);

fs.writeFileSync(outputPath, source);
console.log(JSON.stringify({ outputPath, bytes: Buffer.byteLength(source) }));
