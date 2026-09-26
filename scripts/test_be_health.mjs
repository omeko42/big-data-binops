import { runBE } from './be_exec.mjs';

function main() {
    const res = runBE(`
docker exec bdb-api node -e '
  const http = require("http");
  // Test internal health
  const req = http.request("http://127.0.0.1:3850/api/Authentication/maintenance-status", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => console.log("Health check status:", res.statusCode, data));
  });
  req.on("error", console.error);
  req.end();
'
    `);
    console.log(res);
}

main();
