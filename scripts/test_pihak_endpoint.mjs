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

    // Check where NIK 3404111801740001 is in the database
    const nikCheck = await c.query("select count(*), lp.satker_id, lp.satker_nama, lp.unit_satker_id from bdb_dors_lp_terlibat t join bdb_dors_lp d on d.id=t.lp_id join bdb_laporan_polisi lp on lp.dors_lp_id=d.dors_lp_id where t.nik = \\$1 group by lp.satker_id, lp.satker_nama, lp.unit_satker_id", ["3404111801740001"]);
    console.log("DB check for NIK in bdb_dors_lp_terlibat:", nikCheck.rows);

    // DB query will continue later

    const payload = {
        id: user.id,
        user: { id: user.id, organisasi_id: user.organisasi_id || 1, organisasiRoleId: user.organisasiRoleId || 3, Organisasi: { id: user.organisasi_id || 1 } },
        device_token: d.rows[0].device_token
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    function testReq(path) {
        return new Promise((resolve, reject) => {
            http.get({
                hostname: "localhost",
                port: 3850,
                path: path,
                headers: { "Authorization": "Bearer " + token }
            }, res => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => resolve(JSON.parse(data)));
            }).on("error", reject);
        });
    }

    console.log("--- 1. Summary API (All time) ---");
    const sumRes = await testReq("/api/bdb/pihak-terlibat?search=3404111801740001&summary_only=1");
    console.log("Summary (All time):", sumRes?.meta?.summary);

    console.log("--- 2. Summary API (Tahun 2026) ---");
    const sum2026 = await testReq("/api/bdb/pihak-terlibat?search=3404111801740001&from=2026-01-01&to=2026-12-31&summary_only=1");
    console.log("Summary (Tahun 2026):", sum2026?.meta?.summary);

    console.log("--- 3. List API (Tahun 2026) ---");
    const list2026 = await testReq("/api/bdb/pihak-terlibat?search=3404111801740001&from=2026-01-01&to=2026-12-31&page=1&limit=25");
    console.log("List 2026 data length:", list2026.data?.length);
    console.log("Sample row:", list2026.data?.[0]?.nama, list2026.data?.[0]?.satker_nama, list2026.data?.[0]?.no_laporan);

    console.log("--- 4. Operator Default Browsing (No Search, Regional) ---");
    const opRegional = await testReq("/api/bdb/pihak-terlibat?summary_only=1");
    console.log("Operator Regional Summary:", opRegional?.meta?.summary);

    const uAdmin = await c.query("select * from auth_users where id = 320");
    if (uAdmin.rows[0]) {
        const adminUser = uAdmin.rows[0];
        const adminToken = jwt.sign({
            id: adminUser.id,
            user: { id: adminUser.id, organisasi_id: 1, organisasiRoleId: 1 },
            device_token: d.rows[0].device_token
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        function testAdminReq(path) {
            return new Promise((resolve, reject) => {
                http.get({
                    hostname: "localhost",
                    port: 3850,
                    path: path,
                    headers: { "Authorization": "Bearer " + adminToken }
                }, res => {
                    let data = "";
                    res.on("data", chunk => data += chunk);
                    res.on("end", () => resolve(JSON.parse(data)));
                }).on("error", reject);
            });
        }

        console.log("--- 5. Superadmin Sarjono Summary ---");
        const saSum = await testAdminReq("/api/bdb/pihak-terlibat?search=3404111801740001&from=2026-01-01&to=2026-12-31&summary_only=1");
        console.log("Superadmin Summary 2026:", saSum?.meta?.summary);
    }
    await c.end();
    process.exit(0);
}
run();
'
`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
