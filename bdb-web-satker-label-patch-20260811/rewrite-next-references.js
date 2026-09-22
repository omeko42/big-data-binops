const fs = require('fs');
const path = require('path');

const nextRoot = '/usr/src/app/.next';
const oldName = '144-jsrepw95l.js';
const newName = '144-jsrepw95l-satker-fix-20260812.js';
const textExtensions = new Set(['.js', '.json', '.html', '.rsc', '.txt', '.meta']);
let changedFiles = 0;
let changedReferences = 0;

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(file);
            continue;
        }
        if (!textExtensions.has(path.extname(entry.name))) continue;
        const source = fs.readFileSync(file, 'utf8');
        const count = source.split(oldName).length - 1;
        if (!count) continue;
        fs.writeFileSync(file, source.split(oldName).join(newName));
        changedFiles += 1;
        changedReferences += count;
    }
}

walk(nextRoot);
if (!changedReferences) throw new Error(`No references to ${oldName} were found`);

let remaining = 0;
function verify(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            verify(file);
            continue;
        }
        if (!textExtensions.has(path.extname(entry.name))) continue;
        remaining += fs.readFileSync(file, 'utf8').split(oldName).length - 1;
    }
}
verify(nextRoot);
if (remaining) throw new Error(`${remaining} stale references to ${oldName} remain`);
console.log(`rewrote ${changedReferences} references across ${changedFiles} files`);
