import { runFE } from './fe_exec.mjs';

const cmd = `
echo "=== Check 3def3ti6rk0vr.js ==="
curl -sk https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "globalThis.maskEmail=maskEmail"

echo "=== Check 0-gigr76s0g8t.js ==="
curl -sk https://cas.bareskrim.polri.go.id/_next/static/chunks/0-gigr76s0g8t.js | grep -o "/cms/profile" | head -n 1

echo "=== Check 0w77m6y2tq5qr.js ==="
curl -sk https://cas.bareskrim.polri.go.id/_next/static/chunks/0w77m6y2tq5qr.js | grep -o "Nasional" | head -n 1
`;

console.log(runFE(cmd));
