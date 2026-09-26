import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

try {
  new vm.Script(code);
  console.log("Syntax is valid!");
} catch (e) {
  console.log("Error message:", e.message);
  console.log("Stack:", e.stack);
  if (e.lineNumber) console.log("Line:", e.lineNumber);
}
