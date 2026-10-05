import fs from 'fs';
import { runBE } from './be_exec.mjs';

function parseCSVLine(text) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            res.push(cur.trim());
            cur = '';
        } else {
            cur += ch;
        }
    }
    res.push(cur.trim());
    return res;
}

function cleanLpNumber(raw) {
    if (!raw) return '';
    let s = raw.trim();
    // remove surrounding quotes
    s = s.replace(/^["']|["']$/g, '');
    // remove trailing commas, periods
    s = s.replace(/[,.]+$/, '').trim();
    // collapse multiple spaces
    s = s.replace(/\s+/g, ' ');
    // remove space around slashes
    s = s.replace(/\s*\/\s*/g, '/');
    return s.toUpperCase();
}

async function main() {
    const rawContent = fs.readFileSync('scripts/input_dittipidum_raw.txt', 'utf8');
    const lines = rawContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    const lpsMap = new Map();

    for (const line of lines) {
        if (line.startsWith('NO,') || line.startsWith(',,,,')) continue;
        const parts = parseCSVLine(line);
        if (parts.length < 4) continue;

        // Try to identify which column has the LP number
        let noLp = '';
        let tglLp = '';
        let jenisDok = '';
        let tglDok = '';
        let alasan = '';

        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            if (p.toUpperCase().startsWith('LP/') || p.toUpperCase().startsWith('LPB/')) {
                noLp = p;
                tglLp = parts[i + 1] || '';
                jenisDok = parts[i + 2] || '';
                tglDok = parts[i + 3] || '';
                if (parts.length > i + 5) {
                    alasan = parts[i + 5] || parts[parts.length - 1] || '';
                }
                break;
            }
        }

        if (!noLp) continue;

        const cleanNo = cleanLpNumber(noLp);
        if (!lpsMap.has(cleanNo)) {
            lpsMap.set(cleanNo, {
                rawNo: noLp,
                cleanNo: cleanNo,
                tglLp,
                jenisDok,
                tglDok,
                alasan,
                allOccurrences: [line]
            });
        } else {
            const existing = lpsMap.get(cleanNo);
            existing.allOccurrences.push(line);
            if (alasan && !existing.alasan) existing.alasan = alasan;
            if (jenisDok && (!existing.jenisDok || existing.jenisDok.includes('-'))) existing.jenisDok = jenisDok;
            if (tglDok && (!existing.tglDok || existing.tglDok === '-')) existing.tglDok = tglDok;
        }
    }

    console.log(`Parsed ${lpsMap.size} unique LPs from user input.`);

    const uniqueCleanLps = Array.from(lpsMap.keys());

    const query = `
    WITH input_lps AS (
      SELECT unnest($1::text[]) AS input_lp
    )
    SELECT 
      i.input_lp,
      l.id,
      l.no_laporan,
      l.tgl_laporan,
      l.satker_id,
      s.deskripsi as satker_nama,
      l.status_id,
      sm.nama as status_nama,
      sm.kategori as status_kategori,
      l.tanggal_selesai
    FROM input_lps i
    LEFT JOIN bdb_laporan_polisi l 
      ON UPPER(REPLACE(REPLACE(l.no_laporan, ' ', ''), '.', '')) = UPPER(REPLACE(REPLACE(i.input_lp, ' ', ''), '.', ''))
    LEFT JOIN bdb_satker s ON s.id = l.satker_id
    LEFT JOIN bdb_status_master sm ON sm.id = l.status_id
    ORDER BY i.input_lp;
    `;

    const qB64 = Buffer.from(query).toString('base64');
    const pB64 = Buffer.from(JSON.stringify([uniqueCleanLps])).toString('base64');

    const dbCheckScript = `
docker exec bdb-api node -e '
const { DataSource } = require("typeorm");
const ds = new DataSource({
  type: "postgres",
  host: "10.0.0.x",
  port: 5432,
  username: process.env.DB_USERNAME || "bdb_app",
  password: process.env.DB_PASSWORD || "Bareskrim2026",
  database: "big_data_binops"
});

ds.initialize().then(async () => {
  const sql = Buffer.from(process.argv[1], "base64").toString("utf8");
  const params = JSON.parse(Buffer.from(process.argv[2], "base64").toString("utf8"));
  const rows = await ds.query(sql, params);
  console.log(JSON.stringify(rows));
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
' "${qB64}" "${pB64}"
`;

    console.log('Querying DB for matches...');
    const dbRaw = runBE(dbCheckScript);
    const dbRows = JSON.parse(dbRaw);

    const found = [];
    const notFound = [];
    const duplicates = [];

    const grouped = {};
    for (const r of dbRows) {
        if (!grouped[r.input_lp]) grouped[r.input_lp] = [];
        grouped[r.input_lp].push(r);
    }

    for (const [cleanNo, rList] of Object.entries(grouped)) {
        const item = lpsMap.get(cleanNo);
        const validMatches = rList.filter(r => r.id !== null);
        if (validMatches.length === 0) {
            notFound.push({ cleanNo, item });
        } else if (validMatches.length === 1) {
            found.push({ cleanNo, item, db: validMatches[0] });
        } else {
            duplicates.push({ cleanNo, item, matches: validMatches });
        }
    }

    console.log('\n================ SUMMARY HASIL PEMERIKSAAN ================');
    console.log(`Total LP Unik di Input : ${uniqueCleanLps.length}`);
    console.log(`Ditemukan di Database  : ${found.length + duplicates.length}`);
    console.log(`- Match Tunggal (1 to 1): ${found.length}`);
    console.log(`- Match Duplikat di DB  : ${duplicates.length}`);
    console.log(`Tidak Ditemukan di DB  : ${notFound.length}`);
    console.log('===========================================================');

    fs.writeFileSync('scripts/parsed_lps_analysis.json', JSON.stringify({
        totalInput: uniqueCleanLps.length,
        foundCount: found.length,
        duplicateCount: duplicates.length,
        notFoundCount: notFound.length,
        found,
        duplicates,
        notFound
    }, null, 2), 'utf8');

    console.log('Full analysis saved to scripts/parsed_lps_analysis.json');
}

main().catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
});
