import { runBE } from './fe_inspect.mjs';

const cmd = `docker exec bdb-api node -e '
const { Client } = require("pg");
async function run() {
    const c = new Client("postgresql://bdb_app:Bareskrim2026@10.0.0.x:5432/big_data_binops");
    await c.connect();

    console.log("=== CHECK CORPORATE NAMES IN bdb_dors_lp_terlibat ===");
    const res = await c.query("select nama, nik, keterlibatan, jenis_identitas, pekerjaan from bdb_dors_lp_terlibat where (nama ilike \\x27PT %\\x27 or nama ilike \\x27PT.%\\x27 or nama ilike \\x27CV %\\x27 or nama ilike \\x27CV.%\\x27 or nama ilike \\x27YAYASAN %\\x27 or nama ilike \\x27KOPERASI %\\x27 or nama ilike \\x27BANK %\\x27 or nama ilike \\x27PERUM %\\x27) limit 15");
    console.log("Sample corporate rows:", res.rows);

    const countRes = await c.query("select count(*) from bdb_dors_lp_terlibat where (nama ilike \\x27PT %\\x27 or nama ilike \\x27PT.%\\x27 or nama ilike \\x27CV %\\x27 or nama ilike \\x27CV.%\\x27 or nama ilike \\x27YAYASAN %\\x27 or nama ilike \\x27KOPERASI %\\x27 or nama ilike \\x27BANK %\\x27 or nama ilike \\x27PERUM %\\x27)");
    console.log("Total corporate rows in bdb_dors_lp_terlibat:", countRes.rows[0]?.count);

    console.log("=== NIK DISTRIBUTION FOR CORPORATE ENTITIES ===");
    const nikDist = await c.query("select count(case when nik is null or trim(nik) = \\x27\\x27 or nik = \\x27-\\x27 or nik = \\x270\\x27 then 1 end) as no_nik, count(case when nik ~ \\x27^[1-9][0-9]{15}$\\x27 then 1 end) as valid_nik, count(case when nik is not null and not (nik ~ \\x27^[1-9][0-9]{15}$\\x27) and trim(nik) not in (\\x27\\x27,\\x27-\\x27,\\x270\\x27) then 1 end) as other_nik from bdb_dors_lp_terlibat where (nama ilike \\x27PT %\\x27 or nama ilike \\x27PT.%\\x27 or nama ilike \\x27CV %\\x27 or nama ilike \\x27CV.%\\x27 or nama ilike \\x27YAYASAN %\\x27 or nama ilike \\x27KOPERASI %\\x27 or nama ilike \\x27BANK %\\x27 or nama ilike \\x27PERUM %\\x27)");
    console.log("NIK dist for corporate:", nikDist.rows[0]);

    await c.end();
}
run();
'`;

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}

try {
    console.log(runBE(cmd));
} catch (e) {
    console.error(e.message);
}
