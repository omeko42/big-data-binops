import subprocess, base64

def run_fe(cmd):
    b64 = base64.b64encode(cmd.encode()).decode()
    remote = f"echo '{b64}' | base64 -d | bash"
    args = [
        r'D:\Putty\plink.exe', '-batch', '-ssh',
        '-hostkey', 'ssh-ed25519 255 SHA256:zAYHmppgblxgqRQp+jYN9Gs3sNIt2LQ91UJO5I1J2WI',
        '-pw', 'or@eK2q5',
        'clouduser@10.0.0.x',
        remote
    ]
    res = subprocess.run(args, capture_output=True, text=True)
    return res.stdout, res.stderr

script = '''
docker exec bdb-web node -e '
const fs = require("fs");
const s = fs.readFileSync("/usr/src/app/.next/static/chunks/dashboard-perma-318125d33290.js", "utf8");
for (const key of ["top_kejahatan", "top_kejahatan_regional", "top_satker_ct", "top_satker_cc", "regional_nama", "regional_ct", "bdb-dashboard-"]) {
    let idx = 0;
    while ((idx = s.indexOf(key, idx)) !== -1) {
        console.log("=== FOUND " + key + " @ " + idx + " ===");
        console.log(s.slice(Math.max(0, idx - 100), Math.min(s.length, idx + 200)));
        idx += key.length;
    }
}
'
'''

out, err = run_fe(script)
print("STDOUT:\n", out)
if err:
    print("STDERR:\n", err)
