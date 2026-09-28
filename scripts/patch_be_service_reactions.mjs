import fs from 'fs';
import cp from 'child_process';

let js = fs.readFileSync('backend-patch/jukrah.service.js', 'utf8');

// 1. Update formatCallsign
const oldFormat = `    formatCallsign(rawCallsign, authorId, username) {
        const idStr = String(authorId || '');
        if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
        const c = String(rawCallsign || '').trim().replace(/^@/, '');
        const invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
        if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
            return '@' + c.toLowerCase();
        }
        const seed = idStr || username || 'polri';
        let num = 0;
        for (let i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
        const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
        return '@user_' + code;
    }`;

const newFormat = `    formatCallsign(rawCallsign, authorId, username) {
        const idStr = String(authorId || '');
        if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
        let c = String(rawCallsign || '').trim().replace(/^@/, '');
        if (c.startsWith('pers_') || c.startsWith('user_')) c = '';
        const invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
        if (c && /^[a-zA-Z0-9_.]{3,20}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
            return '@' + c.toLowerCase();
        }
        const seed = idStr || username || 'polri';
        let num = 0;
        for (let i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
        const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
        return '@user_' + code;
    }`;

if (!js.includes(oldFormat)) {
  console.error('oldFormat not found in backend-patch/jukrah.service.js');
  process.exit(1);
}
js = js.replace(oldFormat, newFormat);
console.log('✓ Updated formatCallsign in jukrah.service.js');

// 2. In getFeed: replace @pers_${r.author_id}
const oldHandle = 'const handle = r.author_callsign ? `@${r.author_callsign}` : `@pers_${r.author_id}`;';
const newHandle = 'const handle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username);';
if (!js.includes(oldHandle)) {
  console.error('oldHandle not found');
  process.exit(1);
}
js = js.replace(oldHandle, newHandle);
console.log('✓ Replaced oldHandle with this.formatCallsign in getFeed');

// 3. In getFeed: author_callsign and author_username
const oldAuthorCallsign = 'author_callsign: r.author_callsign || (handle.startsWith(\'@\') ? handle.slice(1) : handle),';
const newAuthorCallsign = 'author_callsign: (handle.startsWith(\'@\') ? handle.slice(1) : handle),';
js = js.replace(oldAuthorCallsign, newAuthorCallsign);

const oldAuthorUsername = 'author_username: r.author_callsign || (handle.startsWith(\'@\') ? handle.slice(1) : handle),';
const newAuthorUsername = 'author_username: (handle.startsWith(\'@\') ? handle.slice(1) : handle),';
js = js.replace(oldAuthorUsername, newAuthorUsername);
console.log('✓ Updated author_callsign & author_username in getFeed');

// 4. In getFeed: total_reactions and user_reaction
const oldReactions = 'reaction_counts: r.reaction_counts || { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 },';
const newReactions = `reaction_counts: r.reaction_counts || { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 },
                total_reactions: Object.values(r.reaction_counts || {}).reduce((s, v) => s + Number(v || 0), 0),`;
js = js.replace(oldReactions, newReactions);

const oldMyReact = 'my_reaction: r.my_reaction || null,';
const newMyReact = `my_reaction: r.my_reaction || null,
                user_reaction: r.my_reaction || null,`;
js = js.replace(oldMyReact, newMyReact);
console.log('✓ Added total_reactions and user_reaction to getFeed');

// 5. In getPersonalFeed:
const oldPersonalHandle = 'author_handle: p.callsign ? `@${p.callsign}` : `@pers_${p.id}`,';
const newPersonalHandle = 'author_handle: this.formatCallsign(p.callsign, p.id, p.username),';
js = js.replace(oldPersonalHandle, newPersonalHandle);

// 6. In getComments:
const oldCommentHandle = 'const handle = r.callsign ? `@${r.callsign}` : `@pers_${r.author_id}`;';
const newCommentHandle = 'const handle = this.formatCallsign(r.callsign, r.author_id, r.username);';
js = js.replace(oldCommentHandle, newCommentHandle);

// 7. In reactPost:
const oldReactReturn = 'return { status: 1, data: { my_reaction: currentReaction, reaction_counts: newCounts } };';
const newReactReturn = `const total = Object.values(newCounts).reduce((s, v) => s + Number(v || 0), 0);
        return { status: 1, data: { my_reaction: currentReaction, user_reaction: currentReaction, reaction_counts: newCounts, total_reactions: total } };`;
js = js.replace(oldReactReturn, newReactReturn);
console.log('✓ Updated reactPost with total_reactions and user_reaction');

fs.writeFileSync('backend-patch/jukrah.service.js', js, 'utf8');
cp.execSync('node -c backend-patch/jukrah.service.js');
console.log('✓ Syntax check backend-patch/jukrah.service.js PASS');
