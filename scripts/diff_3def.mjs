import fs from 'fs';

const orig = fs.readFileSync('clean_live_3def.js', 'utf8');
const patched = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');

console.log('Orig length:', orig.length);
console.log('Patched length:', patched.length);

// Compare in chunks to find all differences
let diffs = [];
let i = 0, j = 0;
while (i < orig.length && j < patched.length) {
  if (orig[i] !== patched[j]) {
    let origSnippet = orig.substring(i, i + 100);
    let patchedSnippet = patched.substring(j, j + 100);
    diffs.push({ i, j, origSnippet, patchedSnippet });
    // advance to next matching 30 chars
    let matchIdx = -1;
    for (let k = 10; k < 200; k++) {
      let probe = orig.substring(i + k, i + k + 30);
      let foundInPatched = patched.indexOf(probe, j);
      if (foundInPatched !== -1) {
        i += k;
        j = foundInPatched;
        matchIdx = 1;
        break;
      }
    }
    if (matchIdx === -1) {
      console.log('Could not re-align');
      break;
    }
  } else {
    i++;
    j++;
  }
}

console.log('Total diff sections:', diffs.length);
diffs.forEach((d, idx) => {
  console.log(`\n--- Diff ${idx + 1} at orig:${d.i}, patched:${d.j} ---`);
  console.log('ORIG   :', d.origSnippet);
  console.log('PATCHED:', d.patchedSnippet);
});
