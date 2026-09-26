import { runFE } from './fe_exec.mjs';

const cmd = `
echo "=== 0-gigr76s0g8t.js ==="
curl -sI http://127.0.0.1:3000/_next/static/chunks/0-gigr76s0g8t.js | head -n 6
curl -s http://127.0.0.1:3000/_next/static/chunks/0-gigr76s0g8t.js | grep -o "/cms/profile" | head -n 2
curl -s http://127.0.0.1:3000/_next/static/chunks/0-gigr76s0g8t.js | grep -o "cms-bc-back"

echo "=== 0w77m6y2tq5qr.js ==="
curl -sI http://127.0.0.1:3000/_next/static/chunks/0w77m6y2tq5qr.js | head -n 6
curl -s http://127.0.0.1:3000/_next/static/chunks/0w77m6y2tq5qr.js | grep -o "Nasional" | head -n 2
`;

console.log(runFE(cmd));
