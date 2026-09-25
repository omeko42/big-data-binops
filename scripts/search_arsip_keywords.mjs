import fs from 'fs';
import path from 'path';

const workspace = 'd:/Prototype CAS/EDIT MASTER MASAL';
const keywords = ['tap tersangka', 'arsip tap', 'gagal upload', 'upload arsip', 'arsip_tap', 'tap_tsk', 'penetapan tersangka'];

const matches = [];

function walk(dir) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const ent of entries) {
        if (ent.name === '.git' || ent.name === 'node_modules' || ent.name === '.next') continue;
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            walk(full);
        } else if (ent.isFile() && /\.(ts|js|tsx|jsx|json|sql|txt)$/i.test(ent.name)) {
            try {
                const content = fs.readFileSync(full, 'utf8').toLowerCase();
                for (const kw of keywords) {
                    if (content.includes(kw)) {
                        matches.push({ kw, file: full });
                    }
                }
            } catch {}
        }
    }
}

walk(workspace);
console.log(`Total matches: ${matches.length}`);
for (const m of matches.slice(0, 30)) {
    console.log(` - [${m.kw}] ${m.file}`);
}
