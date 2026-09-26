import { runFE, copyFileToFE } from './fe_exec.mjs';

console.log("Copying 0-gigr76s0g8t.patched.js to remote /tmp...");
copyFileToFE('0-gigr76s0g8t.patched.js', '/tmp/0-gigr76s0g8t.js');

console.log("Copying 0w77m6y2tq5qr.patched.js to remote /tmp...");
copyFileToFE('0w77m6y2tq5qr.patched.js', '/tmp/0w77m6y2tq5qr.js');

console.log("Copying files into bdb-web container...");
const res = runFE(`
docker cp /tmp/0-gigr76s0g8t.js bdb-web:/usr/src/app/.next/static/chunks/0-gigr76s0g8t.js &&
docker cp /tmp/0w77m6y2tq5qr.js bdb-web:/usr/src/app/.next/static/chunks/0w77m6y2tq5qr.js &&
echo "DEPLOY SUCCESS"
`);

console.log("Result:\n", res);
