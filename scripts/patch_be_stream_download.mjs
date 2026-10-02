import { runBE } from './be_exec.mjs';

const script = `
const fs = require('fs');

const srvPath = '/usr/src/app/dist/bdb/jukrah/jukrah.service.js';
let srv = fs.readFileSync(srvPath, 'utf8');

const streamStart = 'async streamMedia(token, res) {';
const streamEnd = 'stream.pipe(res);\\n        }';
const altStreamEnd = 'stream.pipe(res);\\r\\n        }';

let p1 = srv.indexOf(streamStart);
let p2 = srv.indexOf(streamEnd, p1);
let endLen = streamEnd.length;
if (p2 === -1) {
  p2 = srv.indexOf(altStreamEnd, p1);
  endLen = altStreamEnd.length;
}

if (p1 !== -1 && p2 !== -1) {
  const replacement = \`async streamMedia(token, res) {
        const verified = this.verifyStreamToken(token);
        if (!verified) {
            throw new common_1.ForbiddenException('Tautan media kadaluwarsa atau tidak sah (Akses Ditolak).');
        }
        try {
            const stream = await this.minio.getObjectStream(verified.key);
            res.setHeader('Content-Type', verified.mime || 'application/octet-stream');
            res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            const reqUrl = res.req ? (res.req.originalUrl || res.req.url || '') : '';
            const isDownload = /[?&]download=(1|true)/i.test(reqUrl);
            let dlName = verified.key.split('/').pop() || 'berkas';
            const fnMatch = reqUrl.match(/[?&]filename=([^&]+)/);
            if (fnMatch && fnMatch[1]) {
                try { dlName = decodeURIComponent(fnMatch[1]); } catch(e) { dlName = fnMatch[1]; }
            }
            if (isDownload) {
                res.setHeader('Content-Disposition', \\\`attachment; filename="\\\${encodeURIComponent(dlName)}"\\\`);
            } else {
                res.setHeader('Content-Disposition', 'inline');
            }
            stream.pipe(res);
        }\`;
  srv = srv.slice(0, p1) + replacement + srv.slice(p2 + endLen);
  fs.writeFileSync(srvPath, srv, 'utf8');
  console.log('✓ Successfully patched streamMedia with URL query parsing!');
} else {
  console.error('Could not find streamMedia markers:', p1, p2);
}
`;

const b64 = Buffer.from(script).toString('base64');
console.log(runBE(`docker exec bdb-api node -e "$(echo '${b64}' | base64 -d)"`));
