import { runBE } from './fe_inspect.mjs';

const cmd = `
docker exec bdb-api node -e '
const http = require("http");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");

async function run() {
    const c = new Client("postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops");
    await c.connect();
    const d = await c.query("select * from auth_devices order by id desc limit 1");
    const u = await c.query("select * from auth_users where id = 122");
    const user = u.rows[0];
    await c.end();

    const payload = {
        id: user.id,
        user: { id: user.id, organisasi_id: user.organisasi_id || 1, organisasiRoleId: user.organisasiRoleId || 3, Organisasi: { id: user.organisasi_id || 1 } },
        device_token: d.rows[0].device_token
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const req = http.get({
        hostname: "localhost",
        port: 3850,
        path: "/api/bdb/anev/dashboard?year=2026&force=1",
        headers: { "Authorization": "Bearer " + token }
    }, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
            const parsed = JSON.parse(data);
            console.log("SCOPED:", parsed.data.scoped);
            console.log("REGIONAL_NAMA:", parsed.data.regional_nama);
            console.log("REGIONAL_CT:", parsed.data.regional_ct);
            console.log("TOP_KEJAHATAN (length " + parsed.data.top_kejahatan?.length + "):", parsed.data.top_kejahatan);
            console.log("TOP_KEJAHATAN_REGIONAL (length " + parsed.data.top_kejahatan_regional?.length + "):", parsed.data.top_kejahatan_regional);
            console.log("TOP_SATKER_CT (length " + parsed.data.top_satker_ct?.length + "):", parsed.data.top_satker_ct);
            console.log("TOP_SATKER_CC (length " + parsed.data.top_satker_cc?.length + "):", parsed.data.top_satker_cc);
            console.log("POLDA in payload (length " + parsed.data.polda?.length + "):", parsed.data.polda?.slice(0, 3));
        });
    });
}
run();
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
