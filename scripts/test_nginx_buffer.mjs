import { runFE } from './fe_exec.mjs';

const pyScript = `
import urllib.request, ssl
ctx = ssl._create_unverified_context()
req = urllib.request.Request("https://api-cas.bareskrim.polri.go.id/test")
req.add_header("X-Large", "A" * 38000)
try:
    res = urllib.request.urlopen(req, context=ctx)
    print("STATUS WITH 38KB HEADER:", res.status)
except urllib.error.HTTPError as e:
    print("FAILED WITH HTTP ERROR:", e.code, e.reason)
`;

const b64 = Buffer.from(pyScript).toString('base64');
const out = runFE(`
python3 -c "$(echo '${b64}' | base64 -d)"
`);
console.log(out);
