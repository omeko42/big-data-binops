const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        if (file === 'node_modules' || file === '.git') continue;
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            results = results.concat(walk(full));
        } else if (file.includes('satker') || file.includes('legacy') || file.includes('reconcil')) {
            results.push(full);
        }
    }
    return results;
}

console.log(walk('/usr/src/app'));
