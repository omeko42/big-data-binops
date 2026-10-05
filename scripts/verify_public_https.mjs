import { runFE } from './fe_exec.mjs';

const cmd = `
echo "=== 1. CSS 20sy5p32bn-wu.css ==="
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/20sy5p32bn-wu.css | grep -c "z-index: 99999 !important"

echo "=== 2. CSS 34oh417k1w4ti.css ==="
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/34oh417k1w4ti.css | grep -c "z-index: 99999 !important"

echo "=== 3. JS Chunk ==="
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/laporan-filter-perma-a15e28ec2e81.js | grep -c "appendTo:typeof"

echo "=== 4. Laporan Polisi Page Status ==="
curl -k -s -I https://cas.bareskrim.polri.go.id/cms/laporan-polisi | head -n 1
`;

console.log(runFE(cmd));
