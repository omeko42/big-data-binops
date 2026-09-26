import { runFE } from './fe_exec.mjs';

const script = `
endpoints=(
  "/api/bdb/menu-access"
  "/api/user/me/profile"
  "/api/Authentication/user"
  "/api/bdb/notifications/summary"
  "/api/bdb/dors/sync/logs?limit=1"
)
for ep in "\${endpoints[@]}"; do
  code=$(curl -k -s -o /dev/null -w "%{http_code}" "https://api-cas.bareskrim.polri.go.id$ep")
  cors=$(curl -k -s -I "https://api-cas.bareskrim.polri.go.id$ep" | grep -i "access-control-allow-origin" || echo "none")
  echo "$ep => HTTP $code (CORS: $cors)"
done
`;

console.log(runFE(script));
