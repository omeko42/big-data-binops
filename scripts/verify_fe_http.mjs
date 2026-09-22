import { runFE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-web node -e '
const http = require("http");
setTimeout(() => {
    http.get("http://127.0.0.1:3000/cms/dashboard/main", res => {
        console.log("CMS DASHBOARD MAIN HTTP STATUS:", res.statusCode);
        res.resume();
    }).on("error", err => console.error("HTTP error:", err.message));
}, 2000);
'
`;

try {
    console.log(runFE(cmd));
} catch (e) {
    console.error(e.message);
}
