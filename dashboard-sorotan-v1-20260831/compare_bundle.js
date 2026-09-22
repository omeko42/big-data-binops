const fs = require("fs");

const [leftPath, rightPath] = process.argv.slice(2);
const left = fs.readFileSync(leftPath, "utf8");
const right = fs.readFileSync(rightPath, "utf8");

let prefix = 0;
while (prefix < left.length && prefix < right.length && left[prefix] === right[prefix]) prefix++;

let leftEnd = left.length - 1;
let rightEnd = right.length - 1;
while (leftEnd >= prefix && rightEnd >= prefix && left[leftEnd] === right[rightEnd]) {
  leftEnd--;
  rightEnd--;
}

console.log(JSON.stringify({
  leftLength: left.length,
  rightLength: right.length,
  commonPrefix: prefix,
  commonSuffix: left.length - 1 - leftEnd,
  leftDifference: left.slice(Math.max(0, prefix - 240), Math.min(left.length, leftEnd + 241)),
  rightDifference: right.slice(Math.max(0, prefix - 240), Math.min(right.length, rightEnd + 241)),
}, null, 2));
