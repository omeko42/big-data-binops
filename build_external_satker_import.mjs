import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile } from "@oai/artifact-tool";

const root = "D:/Prototype CAS/EDIT MASTER MASAL";
const sourceTemplate = "C:/Users/KOKO98/Downloads/template-import-satker-eksternal.xlsx";
const wilayahPath = path.join(root, "wilayah_indonesia_2025.json");
const outputDir = path.join(root, "outputs", "019fe01d-d395-7bd1-91da-86a66500c3bd");
const previewDir = path.join(outputDir, "preview_external_generated");
const outputPath = path.join(outputDir, "template-import-satker-eksternal_V2_ojk_dan_organisasi_penyidik.xlsx");
await fs.mkdir(previewDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(new Uint8Array(await fs.readFile(sourceTemplate)));
const dataSheet = workbook.worksheets.getItem("Data Satker Eksternal");
const instructionSheet = workbook.worksheets.getItem("Petunjuk");

// Baseline render sebelum template diubah.
const baseline = await workbook.render({ sheetName: "Data Satker Eksternal", range: "A1:D2", scale: 1.5, format: "png" });
await fs.writeFile(path.join(previewDir, "before_template.png"), new Uint8Array(await baseline.arrayBuffer()));

const wilayah = JSON.parse((await fs.readFile(wilayahPath, "utf8")).replace(/^\uFEFF/, ""));
const provinces = [...wilayah.provinces]
  .map((item) => ({ code: String(item.code), name: String(item.name).trim() }))
  .sort((a, b) => a.code.localeCompare(b.code));
const regencies = [...wilayah.regencies]
  .map((item) => ({
    provinceCode: String(item.province_code),
    provinceName: String(item.province_name).trim(),
    code: String(item.regency_code),
    name: String(item.regency_name).trim(),
  }))
  .sort((a, b) => a.code.localeCompare(b.code));

if (provinces.length !== 38 || regencies.length !== 514) {
  throw new Error(`Jumlah wilayah tidak sesuai: provinsi=${provinces.length}, kabupaten/kota=${regencies.length}`);
}

const rows = [];
const counts = {};
const add = (name, description, address = "") => rows.push(["", name, address, description]);

const centralAgencies = [
  "POM TNI",
  "POM TNI-AD",
  "POM TNI-AL",
  "POM TNI-AU",
  "Kejaksaan Agung Republik Indonesia",
  "Badan Narkotika Nasional Republik Indonesia (BNN RI)",
  "Komisi Pemberantasan Korupsi (KPK)",
  "Pusat Pelaporan dan Analisis Transaksi Keuangan (PPATK)",
  "Direktorat Jenderal Bea dan Cukai (DJBC)",
  "Direktorat Jenderal Imigrasi",
  "Badan Nasional Penanggulangan Terorisme (BNPT)",
  "Badan Intelijen Negara (BIN)",
  "Badan Keamanan Laut Republik Indonesia (Bakamla RI)",
  "Kementerian Lingkungan Hidup/Badan Pengendalian Lingkungan Hidup",
  "Kementerian Kehutanan",
  "Kementerian Kelautan dan Perikanan (KKP)",
  "Badan Pengawas Obat dan Makanan (BPOM)",
];
for (const agency of centralAgencies) add(agency, "Kelompok: Instansi pusat");
counts.pusat = centralAgencies.length;

// Organisasi (bukan nama orang/PPNS) yang memiliki fungsi penyidikan sektoral.
// Unit yang sudah ada dalam centralAgencies tidak diulang di sini.
const investigativeCentralAgencies = [
  "Otoritas Jasa Keuangan (OJK)",
  "Direktorat Jenderal Pajak (DJP)",
  "Direktorat Penegakan Hukum - Direktorat Jenderal Pajak",
  "Direktorat Jenderal Penegakan Hukum Kehutanan - Kementerian Kehutanan",
  "Deputi Bidang Penegakan Hukum Lingkungan Hidup - Kementerian Lingkungan Hidup",
  "Direktorat Jenderal Pengawasan Sumber Daya Kelautan dan Perikanan (PSDKP)",
  "Direktorat Penyidikan Obat dan Makanan - Badan POM",
  "Direktorat Jenderal Pembinaan Pengawasan Ketenagakerjaan dan Keselamatan dan Kesehatan Kerja",
  "Direktorat Jenderal Perhubungan Laut",
  "Direktorat Jenderal Perhubungan Udara",
  "Direktorat Jenderal Perhubungan Darat",
  "Direktorat Jenderal Perkeretaapian",
  "Direktorat Jenderal Sumber Daya Air - Kementerian Pekerjaan Umum",
  "Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga - Kementerian Perdagangan",
  "Direktorat Jenderal Kekayaan Intelektual - Kementerian Hukum",
  "Direktorat Jenderal Pengendalian Penyakit - Kementerian Kesehatan",
  "Badan Karantina Indonesia (Barantin)",
  "Kementerian Pelindungan Pekerja Migran Indonesia/BP2MI",
  "Kementerian Perindustrian Republik Indonesia",
  "Kementerian Komunikasi dan Digital Republik Indonesia",
  "Kementerian Kebudayaan Republik Indonesia",
  "Kementerian Pertanian Republik Indonesia",
  "Direktorat Jenderal Mineral dan Batubara - Kementerian ESDM",
  "Direktorat Jenderal Minyak dan Gas Bumi - Kementerian ESDM",
  "Badan Pengatur Hilir Minyak dan Gas Bumi (BPH Migas)",
  "Badan Pengawas Perdagangan Berjangka Komoditi (Bappebti)",
  "Badan Pangan Nasional",
  "Direktorat Jenderal Pengendalian dan Penertiban Tanah dan Ruang - Kementerian ATR/BPN",
];
for (const agency of investigativeCentralAgencies) {
  add(agency, "Kelompok: Organisasi pusat dengan fungsi penyidikan sektoral");
}
counts.organisasi_penyidikan_pusat_tambahan = investigativeCentralAgencies.length;

// Kantor organisasi OJK yang benar-benar tercantum pada direktori kontak OJK,
// bukan hasil penggandaan ke seluruh kabupaten/kota.
const ojkOffices = [
  ["Kantor OJK Jabodebek", "Gedung Soemitro Djojohadikusumo, Jalan Lapangan Banteng Timur No. 2-4, Jakarta Pusat 10710"],
  ["Kantor OJK Provinsi Nusa Tenggara Barat", "Jl. Yos Sudarso No. 4, Ampenan, Mataram"],
  ["Kantor OJK Provinsi Bali", "Jl. W. R. Supratman No. 1, Desa Dangin Puri Kangin, Denpasar Utara"],
  ["Kantor OJK Provinsi Nusa Tenggara Timur", "Jl. Tom Pello No. 2, Fontein, Kota Raja, Kupang"],
  ["Kantor OJK Provinsi Banten", "Jalan Letnan Djidun No. 35, Lontar Baru, Serang"],
  ["Kantor OJK Provinsi Jawa Barat", "Jl. Ir. H. Djuanda No. 152, Bandung"],
  ["Kantor OJK Cirebon", "Jl. Dr. Cipto Mangunkusumo No. 133, Kesambi, Cirebon"],
  ["Kantor OJK Tasikmalaya", "Jl. K. H. Z. Mustofa No. 339A, Tasikmalaya"],
  ["Kantor OJK Provinsi Jawa Tengah", "Jl. Kyai Saleh No. 12-14, Mugassari, Semarang Selatan"],
  ["Kantor OJK Solo", "Jl. Slamet Riyadi No. 328, Sriwedari, Laweyan, Solo"],
  ["Kantor OJK Purwokerto", "Jl. Jend. Gatot Subroto No. 46, Purwokerto"],
  ["Kantor OJK Provinsi Daerah Istimewa Yogyakarta", "Jl. Jend. Sudirman No. 22, Yogyakarta"],
  ["Kantor OJK Tegal", "Jl. Jend. Sudirman No. 2, Tegal"],
  ["Kantor OJK Malang", "Jl. Letjen Sutoyo No. 109-111, Malang"],
  ["Kantor OJK Kediri", "Jl. Brawijaya No. 3, Pakelan, Kediri"],
  ["Kantor OJK Jember", "Jl. Hayam Wuruk No. 41, Kaliwates, Jember"],
  ["Kantor OJK Provinsi Jawa Timur", "Jl. Gubernur Suryo No. 28-30, Surabaya"],
  ["Kantor OJK Provinsi Kalimantan Timur dan Kalimantan Utara", "Jl. H.A.M. Rifaddin, Harapan Baru, Loa Janan Ilir, Samarinda"],
  ["Kantor OJK Provinsi Kalimantan Barat", "Jl. Ahmad Yani No. 62, Pontianak"],
  ["Kantor OJK Provinsi Kalimantan Tengah", "Jl. RTA Milono No. 7, Palangka Raya"],
  ["Kantor OJK Provinsi Kalimantan Selatan", "Jl. Ahmad Yani Km. 8,9, Kertak Hanyar, Banjar"],
  ["Kantor OJK Provinsi Kepulauan Bangka Belitung", "The City Hall Blok A1-A3, Jl. Pulau Bangka, Ait Itam, Pangkal Pinang"],
  ["Kantor OJK Provinsi Maluku Utara", "Jalan Jati Besar, Jati, Ternate Selatan, Kota Ternate"],
  ["Kantor OJK Provinsi Papua", "Jl. Prof. M. Yamin SH III No. 1A, Angkasapura, Jayapura Utara"],
  ["Kantor OJK Provinsi Papua Barat dan Papua Barat Daya", "Jl. Trikora Sowi 2, Sowi, Manokwari Selatan"],
  ["Kantor OJK Provinsi Sulawesi Selatan dan Sulawesi Barat", "Jl. Sultan Hasanuddin No. 3-5, Makassar"],
  ["Kantor OJK Provinsi Sulawesi Utara dan Gorontalo", "Jl. Diponegoro No. 51, Mahakeret Timur, Wenang, Manado"],
  ["Kantor OJK Provinsi Sulawesi Tengah", "Jl. Kartini No. 19, Lolu Utara, Palu Selatan"],
  ["Kantor OJK Provinsi Sulawesi Tenggara", "Jl. Abdullah Silondae No. 95A, Kendari"],
  ["Kantor OJK Provinsi Maluku", "Jl. R. A. Kartini No. 17, Amantelu, Sirimau, Ambon"],
  ["Kantor OJK Provinsi Lampung", "Jl. Way Sekampung No. 9, Bandar Lampung"],
  ["Kantor OJK Provinsi Jambi", "Jl. Prof. Dr. Soemantri Brojonegoro No. 12A, Danau Sipin, Jambi"],
  ["Kantor OJK Provinsi Bengkulu", "Jl. Pembangunan No. 4, Jembatan Kecil, Singaran Pati, Bengkulu"],
  ["Kantor OJK Provinsi Sumatera Selatan", "Jl. Jend. Sudirman No. 1025, Palembang"],
  ["Kantor OJK Provinsi Sumatera Utara", "Jl. Jend. Gatot Subroto No. 180, Medan Helvetia"],
  ["Kantor OJK Provinsi Aceh", "Jl. Tgk. Moh. Daud Beureueh, Kuta Alam, Banda Aceh"],
  ["Kantor OJK Provinsi Sumatera Barat", "Jl. Khatib Sulaiman No. 68, Padang Utara"],
  ["Kantor OJK Provinsi Riau", "Jl. Jend. Ahmad Yani No. 83, Pekanbaru Kota"],
  ["Kantor OJK Provinsi Kepulauan Riau", "Komplek Kara Junction Blok C No. 1-2, Batam Center"],
];
for (const [name, address] of ojkOffices) {
  add(name, "Kelompok: Kantor OJK | Organisasi berwenang melakukan penyidikan sektor jasa keuangan", address);
}
counts.kantor_ojk = ojkOffices.length;

// Penyidikan perpajakan dilaksanakan pada unit penegakan hukum DJP; pada tingkat
// kewilayahan administrasi penyidikan berada di Kantor Wilayah DJP.
const djpRegionalOffices = [
  "Kanwil DJP Aceh",
  "Kanwil DJP Sumatera Utara I",
  "Kanwil DJP Sumatera Utara II",
  "Kanwil DJP Riau",
  "Kanwil DJP Sumatera Barat dan Jambi",
  "Kanwil DJP Sumatera Selatan dan Kepulauan Bangka Belitung",
  "Kanwil DJP Bengkulu dan Lampung",
  "Kanwil DJP Jakarta Pusat",
  "Kanwil DJP Jakarta Barat",
  "Kanwil DJP Jakarta Selatan I",
  "Kanwil DJP Jakarta Selatan II",
  "Kanwil DJP Jakarta Timur",
  "Kanwil DJP Jakarta Utara",
  "Kanwil DJP Jakarta Khusus",
  "Kanwil DJP Banten",
  "Kanwil DJP Jawa Barat I",
  "Kanwil DJP Jawa Barat II",
  "Kanwil DJP Jawa Barat III",
  "Kanwil DJP Jawa Tengah I",
  "Kanwil DJP Jawa Tengah II",
  "Kanwil DJP Daerah Istimewa Yogyakarta",
  "Kanwil DJP Jawa Timur I",
  "Kanwil DJP Jawa Timur II",
  "Kanwil DJP Jawa Timur III",
  "Kanwil DJP Kalimantan Barat",
  "Kanwil DJP Kalimantan Selatan dan Tengah",
  "Kanwil DJP Kalimantan Timur dan Utara",
  "Kanwil DJP Sulawesi Selatan, Barat, dan Tenggara",
  "Kanwil DJP Sulawesi Utara, Tengah, Gorontalo, dan Maluku Utara",
  "Kanwil DJP Bali",
  "Kanwil DJP Nusa Tenggara",
  "Kanwil DJP Papua, Papua Barat, dan Maluku",
  "Kanwil DJP Wajib Pajak Besar",
  "Kanwil DJP Kepulauan Riau",
];
for (const name of djpRegionalOffices) {
  add(name, "Kelompok: Kantor Wilayah DJP | Organisasi pelaksana penegakan hukum pidana perpajakan");
}
counts.kanwil_djp = djpRegionalOffices.length;

const provinceAgencies = [
  ["Badan Narkotika Nasional Provinsi (BNNP)", "BNNP"],
  ["Kejaksaan Tinggi (Kejati)", "Kejaksaan Tinggi/Kejati"],
  ["Pengadilan Tinggi", "Pengadilan Tinggi"],
  ["Badan Intelijen Negara Daerah (BINDA)", "BINDA"],
  ["BPKP Perwakilan", "BPKP Perwakilan"],
  ["Ombudsman Republik Indonesia Perwakilan", "Ombudsman Perwakilan"],
  ["Balai Karantina Hewan, Ikan, dan Tumbuhan (BKHIT)", "Balai Karantina/BKHIT"],
  ["Balai Konservasi Sumber Daya Alam (BKSDA)", "BKSDA"],
  ["Balai Besar / Balai Pengawas Obat dan Makanan (BBPOM)", "Balai POM/BBPOM"],
];
for (const [agency, key] of provinceAgencies) {
  counts[key] = 0;
  for (const province of provinces) {
    add(
      `${agency} - ${province.name}`,
      `Kelompok: ${key} | Tingkat provinsi | Kode wilayah ${province.code}`,
    );
    counts[key] += 1;
  }
}

const existingDlhk = "Dinas Lingkungan Hidup dan Kebersihan (DLHK) - Kabupaten Sidoarjo";
const localAgencies = [
  ["Dinas Lingkungan Hidup dan Kebersihan (DLHK)", "DLHK"],
  ["Kejaksaan Negeri (Kejari)", "Kejaksaan Negeri/Kejari"],
  ["Badan Narkotika Nasional Kabupaten/Kota (BNNK)", "BNNK"],
  ["Pengadilan Negeri", "Pengadilan Negeri"],
  ["Kantor Pengawasan dan Pelayanan Bea dan Cukai (KPPBC)", "Bea dan Cukai/KPPBC"],
  ["Kantor Imigrasi", "Kantor Imigrasi"],
  ["Satuan Polisi Pamong Praja (Satpol PP)", "Satpol PP"],
  ["Dinas Perhubungan (Dishub)", "Dinas Perhubungan"],
  ["Badan Penanggulangan Bencana Daerah (BPBD)", "BPBD"],
  ["Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil)", "Disdukcapil"],
  ["Badan Kesatuan Bangsa dan Politik (Bakesbangpol)", "Bakesbangpol"],
  ["Kantor Pertanahan (BPN)", "Kantor Pertanahan/BPN"],
];
for (const [agency, key] of localAgencies) {
  counts[key] = 0;
  for (const regency of regencies) {
    const name = `${agency} - ${regency.name}`;
    if (name === existingDlhk) continue;
    add(
      name,
      `Kelompok: ${key} | ${regency.provinceName} | Kode wilayah ${regency.code}`,
    );
    counts[key] += 1;
  }
}

const expectedRows = 6412 + investigativeCentralAgencies.length + ojkOffices.length + djpRegionalOffices.length;
if (rows.length !== expectedRows) throw new Error(`Jumlah hasil generator tidak sesuai: ${rows.length}; ekspektasi=${expectedRows}`);
const names = rows.map((row) => row[1]);
if (new Set(names).size !== names.length) throw new Error("Terdapat nama satker eksternal duplikat");
if (names.includes(existingDlhk)) throw new Error("DLHK Kabupaten Sidoarjo seharusnya dikecualikan");

const previousTable = dataSheet.tables.items[0];
const tableStyle = previousTable?.style || "TableStyleMedium2";
if (previousTable) previousTable.delete();
dataSheet.getRange("A2:D2").clear({ applyTo: "contents" });
dataSheet.getRange("A2").write(rows);
const lastRow = rows.length + 1;
const table = dataSheet.tables.add(`A1:D${lastRow}`, true, "SatkerEksternalImportTable");
table.style = tableStyle;

// Pastikan tabel Petunjuk memiliki nama unik dan tetap ikut saat diekspor.
const previousInstructionTable = instructionSheet.tables.items[0];
const instructionStyle = previousInstructionTable?.style || "TableStyleMedium2";
if (previousInstructionTable) previousInstructionTable.delete();
const instructionTable = instructionSheet.tables.add("A1:B7", true, "PetunjukSatkerEksternalTable");
instructionTable.style = instructionStyle;

dataSheet.showGridLines = false;
dataSheet.freezePanes.freezeRows(1);
dataSheet.getRange(`A1:A${lastRow}`).format.columnWidth = 24;
dataSheet.getRange(`B1:B${lastRow}`).format.columnWidth = 68;
dataSheet.getRange(`C1:C${lastRow}`).format.columnWidth = 72;
dataSheet.getRange(`D1:D${lastRow}`).format.columnWidth = 78;
dataSheet.getRange(`A2:A${lastRow}`).format.numberFormat = "@";
dataSheet.getRange(`A2:D${lastRow}`).format.font = {
  name: "Aptos",
  size: 10,
  color: "#17212B",
  italic: false,
};
dataSheet.getRange(`A1:D${lastRow}`).format.verticalAlignment = "center";

const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 6000,
  tableMaxRows: 12,
  tableMaxCols: 4,
});
await fs.writeFile(path.join(outputDir, "external_generated_inspect.ndjson"), inspect.ndjson ?? String(inspect), "utf8");
const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "External import formula error scan",
});
await fs.writeFile(path.join(outputDir, "external_generated_error_scan.ndjson"), errors.ndjson ?? String(errors), "utf8");

const rowOf = (exactName) => names.indexOf(exactName) + 2;
for (const [name, range] of [
  ["generated_awal", "A1:D25"],
  ["generated_organisasi_penyidikan", `A${rowOf("Otoritas Jasa Keuangan (OJK)")}:D${rowOf("Otoritas Jasa Keuangan (OJK)") + 22}`],
  ["generated_kantor_ojk", `A${rowOf("Kantor OJK Jabodebek")}:D${rowOf("Kantor OJK Jabodebek") + 20}`],
  ["generated_kanwil_djp", `A${rowOf("Kanwil DJP Aceh")}:D${rowOf("Kanwil DJP Aceh") + 18}`],
  ["generated_provinsi", `A${rowOf("Badan Narkotika Nasional Provinsi (BNNP) - Aceh")}:D${rowOf("Badan Narkotika Nasional Provinsi (BNNP) - Aceh") + 19}`],
  ["generated_kejati", `A${rowOf("Kejaksaan Tinggi (Kejati) - Aceh")}:D${rowOf("Kejaksaan Tinggi (Kejati) - Aceh") + 15}`],
  ["generated_kabupaten_kota", `A${rowOf("Dinas Lingkungan Hidup dan Kebersihan (DLHK) - Kabupaten Aceh Selatan")}:D${rowOf("Dinas Lingkungan Hidup dan Kebersihan (DLHK) - Kabupaten Aceh Selatan") + 20}`],
  ["generated_kejari", `A${rowOf("Kejaksaan Negeri (Kejari) - Kabupaten Aceh Selatan")}:D${rowOf("Kejaksaan Negeri (Kejari) - Kabupaten Aceh Selatan") + 17}`],
  ["generated_akhir", `A${lastRow - 18}:D${lastRow}`],
]) {
  const preview = await workbook.render({ sheetName: "Data Satker Eksternal", range, scale: 1.25, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}
const petunjukPreview = await workbook.render({ sheetName: "Petunjuk", range: "A1:B7", scale: 1.25, format: "png" });
await fs.writeFile(path.join(previewDir, "petunjuk.png"), new Uint8Array(await petunjukPreview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

console.log(JSON.stringify({
  outputPath,
  generatedRows: rows.length,
  provinces: provinces.length,
  regencies: regencies.length,
  counts,
  excluded: [existingDlhk],
  sheets: workbook.worksheets.items.map((sheet) => sheet.name),
}, null, 2));
