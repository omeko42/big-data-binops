import fs from 'fs';
import { runBE, copyFileToBE } from './be_exec.mjs';

async function main() {
    console.log('=== STEP 1: COPYING FILES TO REMOTE BE HOST ===');
    console.log('Uploading payload_84.json...');
    copyFileToBE('scripts/payload_84.json', '/tmp/payload_84.json');
    
    console.log('Uploading run_remote_update_84.js...');
    copyFileToBE('scripts/run_remote_update_84.js', '/tmp/run_remote_update_84.js');
    console.log('Uploads complete.');

    console.log('\n=== STEP 2: COPYING INTO BDB-API CONTAINER & EXECUTING ===');
    const execCmd = `
        docker cp /tmp/payload_84.json bdb-api:/tmp/payload_84.json
        docker cp /tmp/run_remote_update_84.js bdb-api:/tmp/run_remote_update_84.js
        docker exec -w /usr/src/app bdb-api node /tmp/run_remote_update_84.js
    `;
    const res = runBE(execCmd);
    console.log('Execution Output:\n' + res.trim());

    console.log('\n=== STEP 3: CLEANING UP TEMPORARY FILES ===');
    runBE(`
        rm -f /tmp/payload_84.json /tmp/run_remote_update_84.js
        docker exec bdb-api rm -f /tmp/payload_84.json /tmp/run_remote_update_84.js
    `);
    console.log('Cleanup complete.');

    console.log('\n=== STEP 4: VERIFYING 84 LPs IN DATABASE ===');
    const items = JSON.parse(fs.readFileSync('scripts/payload_84.json', 'utf8'));
    const ids = items.map(x => x.lpId);
    
    const verifyScript = `
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
  const ids = ${JSON.stringify(ids)};
  const q = \`
    SELECT 
      l.id,
      l.no_laporan,
      l.satker_id,
      s.deskripsi as satker_nama,
      l.status_id,
      sm.nama as status_nama,
      sm.kategori as status_kategori,
      l.tanggal_selesai,
      (SELECT count(*) FROM bdb_dokumen WHERE lp_id = l.id) as doc_count,
      (SELECT u.name FROM bdb_dokumen d LEFT JOIN auth_users u ON u.id = d.created_by WHERE d.lp_id = l.id ORDER BY d.id DESC LIMIT 1) as last_doc_creator
    FROM bdb_laporan_polisi l
    LEFT JOIN bdb_satker s ON s.id = l.satker_id
    LEFT JOIN bdb_status_master sm ON sm.id = l.status_id
    WHERE l.id = ANY($1::bigint[])
    ORDER BY l.id;
  \`;
  const rows = await ds.query(q, [ids]);
  
  const statusSummary = {};
  const creatorSummary = {};
  const satkerSummary = {};
  for (const r of rows) {
    statusSummary[r.status_nama] = (statusSummary[r.status_nama] || 0) + 1;
    creatorSummary[r.last_doc_creator || "NONE"] = (creatorSummary[r.last_doc_creator || "NONE"] || 0) + 1;
    satkerSummary[r.satker_nama || "NONE"] = (satkerSummary[r.satker_nama || "NONE"] || 0) + 1;
  }
  
  console.log("=== FINAL VERIFICATION SUMMARY ===");
  console.log("Total Verified LPs:", rows.length);
  console.log("Satker Breakdown:", JSON.stringify(satkerSummary, null, 2));
  console.log("Status Breakdown:", JSON.stringify(statusSummary, null, 2));
  console.log("Creator Breakdown:", JSON.stringify(creatorSummary, null, 2));
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
`;

    const vB64 = Buffer.from(verifyScript).toString('base64');
    const vRes = runBE(`docker exec bdb-api node -e 'eval(Buffer.from("${vB64}", "base64").toString("utf8"))'`);
    console.log(vRes.trim());
}

main().catch(err => {
    console.error('FATAL ERROR:', err);
    process.exit(1);
});
