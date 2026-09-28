import { runFE } from './fe_exec.mjs';

const cmd = `
echo "=== PUBLIC DOMAIN SSL VERIFICATION ==="
echo -n "Tentang Saya count: "
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "Tentang Saya" | wc -l

echo -n "Setup Google Authenticator count: "
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "Setup Google Authenticator" | wc -l

echo -n "isReadOnlyMode count: "
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "isReadOnlyMode" | wc -l

echo -n "BIG DATA BINOPS count: "
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "BIG DATA BINOPS" | wc -l

echo -n "Community Anak Serse count: "
curl -k -s https://cas.bareskrim.polri.go.id/_next/static/chunks/3def3ti6rk0vr.js | grep -o "Community Anak Serse" | wc -l

echo -n "Profile HTTP status: "
curl -k -s -o /dev/null -w "%{http_code}\n" https://cas.bareskrim.polri.go.id/cms/profile
`;

console.log(runFE(cmd));
