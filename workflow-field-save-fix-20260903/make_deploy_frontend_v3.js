const fs = require('fs');

const input = process.argv[2];
const output = process.argv[3];
let source = fs.readFileSync(input, 'utf8');
const before = `page="$(curl -fsS http://127.0.0.1:3000/cms/master/alur-dokumen)"
case "$page" in *"$NEW_NAME"*) ;; *) echo 'Route belum menunjuk chunk baru' >&2; false;; esac`;
const after = `test -z "$(docker exec "$CONTAINER" grep -RIl "$OLD_NAME" "$ROUTE_ROOT" || true)"
test -n "$(docker exec "$CONTAINER" grep -RIl "$NEW_NAME" "$ROUTE_ROOT")"`;
const first = source.indexOf(before);
if (first < 0 || source.indexOf(before, first + before.length) >= 0) throw new Error('Target health check route tidak ditemukan atau tidak unik');
source = source.slice(0, first) + after + source.slice(first + before.length);
fs.writeFileSync(output, source);
console.log('DEPLOY_FRONTEND_V3_BUILT=1');
