import fs from 'fs';
import vm from 'vm';

const originalChunk = fs.readFileSync('live-3def3ti6rk0vr.js', 'utf8');
const targetToReplace = fs.readFileSync('scratch/exact_header_block.js', 'utf8');
const replacement = fs.readFileSync('scratch/replacement_header_block.js', 'utf8');

if (!originalChunk.includes(targetToReplace)) {
    console.error("ERROR: Target block to replace NOT found in live-3def3ti6rk0vr.js!");
    process.exit(1);
}

const patched = originalChunk.replace(targetToReplace, replacement);
console.log("Replaced successfully! Old length:", originalChunk.length, "New length:", patched.length);

fs.writeFileSync('3def3ti6rk0vr.patched.js', patched);

// Validate JS syntax with vm.Script
try {
    new vm.Script(patched);
    console.log("JS syntax check PASSED! 3def3ti6rk0vr.patched.js is valid JavaScript.");
} catch (err) {
    console.error("JS syntax validation FAILED:", err);
    process.exit(1);
}
