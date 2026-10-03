import { runBE } from './be_exec.mjs';

const script = `docker exec bdb-api node -e '
const http = require("http");
console.log("Checking endpoint registered in nest...");
http.get("http://localhost:3850/api/bdb/laporan-polisi/bulk-import/template", (res) => {
  console.log("HTTP Status Code:", res.statusCode, res.statusMessage);
  let data = "";
  res.on("data", c => data += c);
  res.on("end", () => console.log("Body:", data.slice(0, 300)));
});
'`;

console.log(runBE(script));
