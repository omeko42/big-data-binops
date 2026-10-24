import { buildLpDataFlags } from './scopes';

// Contoh data LP -- SEMUA NILAI PLACEHOLDER ("X" berulang), BUKAN data kasus asli. Dokumen ini
// dibuat utk dibagikan ke pihak luar (mitra integrasi), jadi tidak boleh memuat data sungguhan
// atau bahkan nama/NIK karangan yg mirip data asli -- hanya nilai enum/konstanta sistem yg tetap
// ditampilkan apa adanya (mis. model_lp, status_code, peran, keterlibatan) krn itu bagian dari
// skema API, bukan data personal/kasus.
const EXAMPLE_LP = {
    id: 'xxxxxxxxxxxxxxxxxxxxxx',
    dors_lp_id: 'xxxxxxx',
    no_laporan: 'LP/X/XX/XX/XXXX/XXX.XXXXXXXXXX/XXXXXXXXXXXXXXXXXXX/XXXXXXXXXXXXXXXXXXX',
    tgl_laporan: 'XX-XX-XXXX XX:XX:XX',
    model_lp: 'lp_model_a',
    status: 'BARU',
    updated_at: 'XXXX-XX-XXTXX:XX:XX.XXXZ',
    golongan_kejahatan: 'Kejahatan Konvensional',
    jenis_kejahatan: 'XXXXXXXXXXXXXXXX',
    tindak_pidana: [{ kategori: 'XXXXXXXXXXXXXXXX', pasal: 'XXX ayat (X)' }],
    status_code: 'LP',
    status_nama: 'Laporan Polisi',
    status_kategori: 'CT',
    is_selesai: false,
    tanggal_selesai: null as null | string,
    status_pelimpahan: 'TIDAK',
    keterangan_penghentian: null as null | Record<string, unknown>,
    satker_penanganan: 'POLRES XXXXXXXXX',
    unit_penanganan: 'Unit Subdit X XXXXXXXXX',
    personel_penanganan: [
        { peran: 'Pembuat', nama: 'XXXXXXXXXXXXXXXX', nrp: 'XXXXXXXX', pangkat: 'XXXXXXX' },
        { peran: 'Penerima', nama: 'XXXXXXXXXXXXXXXX', nrp: 'XXXXXXXX', pangkat: 'XXXXXXX' },
        { peran: 'Mengetahui', nama: 'XXXXXXXXXXXXXXXX', nrp: 'XXXXXXXX', pangkat: 'XXXXXXX' }
    ],
    waktu_kejadian: 'XXXX-XX-XX XX:XX:XX',
    tempat_kejadian: 'JL XXXXXXXXX NO XX, RT XX RW XX',
    kategori_lokasi: 'Jalan Umum',
    tkp_provinsi: 'XXXXXXXXX',
    tkp_kabupaten: 'KABUPATEN XXXXXXXXX',
    tkp_kecamatan: 'KECAMATAN XXXXXXXXX',
    tkp_desa: 'DESA XXXXXXXXX',
    lat: '-X.XXXXXX',
    lon: 'XXX.XXXXXX',
    uraian_kejadian: 'Telah terjadi tindak pidana XXXXXXXXX pada hari X tanggal XX-XX-XXXX...',
    apa_terjadi: 'Tindak Pidana XXXXXXXXX',
    bagaimana_terjadi: 'Pelaku melakukan aksi dengan cara XXXXXXXXX...',
    kerugian: 'Rp XX.XXX.XXX,-',
    pihak_terlibat: [
        { nama: 'XXXXXXXXXXXXXXXX', nik: null as string | null, keterlibatan: 'SAKSI' },
        { nama: 'XXXXXXXXXXXXXXXX', nik: 'XXXXXXXXXXXXXXXX', keterlibatan: 'TERLAPOR' }
    ],
    barang_bukti: [{ jenis: 'XXXXXXXXXXXXXXXX', jumlah: 'X', status: 'MASUK', keterangan: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' }]
};

const EXAMPLE_LP_SP3 = {
    status_code: 'SP3',
    status_nama: 'Henti Sidik / SP3',
    status_kategori: 'CC',
    is_selesai: true,
    tanggal_selesai: 'XXXX-XX-XX',
    status_pelimpahan: 'TIDAK',
    keterangan_penghentian: {
        jenis_dokumen: 'SP3',
        nomor_dokumen: 'SP3/XX/X/XXXX/Reskrim',
        tanggal_dokumen: 'XXXX-XX-XX',
        alasan_penghentian: 'Penyelesaian luar proses peradilan / Restorative Justice',
        alasan_demi_hukum: null,
        keterangan: 'Perkara diselesaikan melalui mekanisme Restorative Justice atas kesepakatan kedua belah pihak.'
    }
};

const EXAMPLE_LP_PERMA = {
    status_code: 'PERMA',
    status_nama: 'Perma',
    status_kategori: 'CC',
    is_selesai: true,
    tanggal_selesai: 'XXXX-XX-XX',
    status_pelimpahan: 'TIDAK',
    keterangan_penghentian: {
        jenis_dokumen: 'PERMA',
        nomor_dokumen: 'XX/Pid.C/XXXX/PN Xxx',
        tanggal_dokumen: 'XXXX-XX-XX',
        kategori_perma: 'Tipiring',
        pengadilan: 'PENGADILAN NEGERI XXXXXXXXX',
        amar_ringkas: 'Menyatakan Terdakwa terbukti secara sah melakukan tindak pidana tipiring dan dipidana denda RpXXXXXX.'
    }
};

/** Susun contoh respons sesuai scope yg BENAR-BENAR dimiliki klien -- field di luar scope-nya tidak ditampilkan. */
function buildFilteredExample(scopes: string[]): Record<string, unknown> {
    const flags = buildLpDataFlags(scopes);
    const hasBase = scopes.includes('laporan_polisi.read');
    if (!hasBase) return {};

    const out: Record<string, unknown> = {
        id: EXAMPLE_LP.id,
        dors_lp_id: EXAMPLE_LP.dors_lp_id,
        no_laporan: EXAMPLE_LP.no_laporan,
        tgl_laporan: EXAMPLE_LP.tgl_laporan,
        model_lp: EXAMPLE_LP.model_lp,
        status: EXAMPLE_LP.status,
        updated_at: EXAMPLE_LP.updated_at
    };
    if (flags.klasifikasi) {
        out.golongan_kejahatan = EXAMPLE_LP.golongan_kejahatan;
        out.jenis_kejahatan = EXAMPLE_LP.jenis_kejahatan;
        out.tindak_pidana = EXAMPLE_LP.tindak_pidana;
    }
    if (flags.status) {
        out.status_code = EXAMPLE_LP.status_code;
        out.status_nama = EXAMPLE_LP.status_nama;
        out.status_kategori = EXAMPLE_LP.status_kategori;
        out.is_selesai = EXAMPLE_LP.is_selesai;
        out.tanggal_selesai = EXAMPLE_LP.tanggal_selesai;
        out.status_pelimpahan = EXAMPLE_LP.status_pelimpahan;
        out.keterangan_penghentian = EXAMPLE_LP.keterangan_penghentian;
    }
    if (flags.penanganan) {
        out.satker_penanganan = EXAMPLE_LP.satker_penanganan;
        out.unit_penanganan = EXAMPLE_LP.unit_penanganan;
        out.personel_penanganan = EXAMPLE_LP.personel_penanganan;
    }
    if (flags.tkp) {
        out.waktu_kejadian = EXAMPLE_LP.waktu_kejadian;
        out.tempat_kejadian = EXAMPLE_LP.tempat_kejadian;
        out.kategori_lokasi = EXAMPLE_LP.kategori_lokasi;
        out.tkp_provinsi = EXAMPLE_LP.tkp_provinsi;
        out.tkp_kabupaten = EXAMPLE_LP.tkp_kabupaten;
        out.tkp_kecamatan = EXAMPLE_LP.tkp_kecamatan;
        out.tkp_desa = EXAMPLE_LP.tkp_desa;
        out.lat = EXAMPLE_LP.lat;
        out.lon = EXAMPLE_LP.lon;
    }
    if (flags.kronologi) {
        out.uraian_kejadian = EXAMPLE_LP.uraian_kejadian;
        out.apa_terjadi = EXAMPLE_LP.apa_terjadi;
        out.bagaimana_terjadi = EXAMPLE_LP.bagaimana_terjadi;
    }
    if (flags.kerugian) {
        out.kerugian = EXAMPLE_LP.kerugian;
    }
    if (flags.pihakTerlibat) out.pihak_terlibat = EXAMPLE_LP.pihak_terlibat;
    if (flags.barangBukti) out.barang_bukti = EXAMPLE_LP.barang_bukti;
    return out;
}

function esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const CSS = `
  @page { size: A4; margin: 20mm 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #1e293b; font-size: 10.5pt; line-height: 1.5; margin: 0; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-32deg); font-size: 130pt; font-weight: 800; color: rgba(37, 99, 235, 0.07); letter-spacing: 10pt; z-index: -1; white-space: nowrap; pointer-events: none; }
  .cover { height: 240mm; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; page-break-after: always; }
  .cover .logo { font-size: 15pt; font-weight: 800; color: #dc2626; letter-spacing: 2pt; margin-bottom: 4mm; }
  .cover h1 { font-size: 26pt; margin: 0 0 6mm; color: #0f172a; }
  .cover .sub { font-size: 12pt; color: #475569; max-width: 130mm; }
  .cover .client { margin-top: 8mm; font-size: 11pt; color: #0f172a; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3mm 8mm; }
  .cover .meta { margin-top: 10mm; font-size: 9.5pt; color: #94a3b8; }
  .cover .badge { margin-top: 6mm; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 6px; padding: 3mm 6mm; font-size: 9pt; font-weight: 700; letter-spacing: 0.5pt; }
  h2 { font-size: 15pt; color: #0f172a; border-bottom: 2px solid #dc2626; padding-bottom: 2mm; margin-top: 12mm; margin-bottom: 5mm; page-break-after: avoid; }
  h3 { font-size: 12pt; color: #1e293b; margin-top: 8mm; margin-bottom: 3mm; page-break-after: avoid; }
  p { margin: 2mm 0; }
  code { background: #f1f5f9; color: #be123c; padding: 0.5pt 3pt; border-radius: 3pt; font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 9pt; }
  pre { background: #0f172a; color: #e2e8f0; padding: 4mm 5mm; border-radius: 5pt; font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 8.3pt; line-height: 1.5; overflow-x: auto; white-space: pre-wrap; word-break: break-word; page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; margin: 3mm 0 5mm; font-size: 9.3pt; page-break-inside: avoid; }
  th, td { border: 1px solid #e2e8f0; padding: 2mm 3mm; text-align: left; vertical-align: top; }
  th { background: #f8fafc; color: #334155; font-weight: 700; }
  tr:nth-child(even) td { background: #fafafa; }
  .tag { display: inline-block; padding: 0.5pt 5pt; border-radius: 4pt; font-size: 8pt; font-weight: 700; color: #fff; }
  .tag-get { background: #16a34a; }
  .tag-req { background: #dc2626; }
  .ok { color: #16a34a; font-weight: 700; }
  .no { color: #cbd5e1; }
  .callout { background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 4pt; padding: 3mm 4mm; margin: 3mm 0; font-size: 9.3pt; color: #1e3a5f; }
  .callout.warn { background: #fffbeb; border-color: #fde68a; border-left-color: #d97706; color: #78350f; }
  .callout.danger { background: #fef2f2; border-color: #fecaca; border-left-color: #dc2626; color: #7f1d1d; }
  ul { margin: 2mm 0; padding-left: 6mm; }
  li { margin: 1mm 0; }
  .footer-note { font-size: 8pt; color: #94a3b8; text-align: center; margin-top: 10mm; }
`;

export function buildApiDocHtml(opts: { namaKlien: string; username: string; scopes: string[]; generatedAt: Date; apiPassword?: string }): string {
    const scopeSet = new Set(opts.scopes);
    const hasBase = scopeSet.has('laporan_polisi.read');
    const example = buildFilteredExample(opts.scopes);
    const exampleJson = esc(JSON.stringify({ status: 1, data: [example], meta: { page: 1, limit: 20, total: 214 } }, null, 2));
    const detailJson = esc(JSON.stringify({ status: 1, data: example }, null, 2));
    const tanggal = opts.generatedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const passwordForCurl = opts.apiPassword ? esc(opts.apiPassword) : '&lt;password&gt;';

    return `<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8" /><title>Dokumentasi API — ${esc(opts.namaKlien)}</title>
<style>${CSS}</style></head>
<body>
<div class="watermark">BDB&nbsp;&nbsp;&nbsp;BDB&nbsp;&nbsp;&nbsp;BDB</div>

<div class="cover">
  <div class="logo">BIG DATA BINOPS (BDB)</div>
  <h1>Dokumentasi API<br/>Portal Integrasi Keluar</h1>
  <div class="sub">Panduan teknis untuk menarik data Laporan Polisi dari sistem BDB, disusun khusus sesuai hak akses klien berikut.</div>
  <div class="client"><strong>Klien:</strong> ${esc(opts.namaKlien)} &nbsp;&middot;&nbsp; <strong>Username:</strong> <code>${esc(opts.username)}</code></div>
  <div class="badge">DOKUMEN RAHASIA — KHUSUS UNTUK KLIEN DI ATAS, JANGAN DISEBARLUASKAN</div>
  <div class="meta">Diterbitkan ${tanggal}</div>
</div>

<h2>1. Pendahuluan</h2>
<p>Dokumen ini menjelaskan cara memanggil API Portal Integrasi Keluar BDB memakai kredensial milik <strong>${esc(opts.namaKlien)}</strong>. Contoh respons pada dokumen ini <strong>hanya menampilkan field yang benar-benar menjadi hak akses klien ini</strong> — bukan seluruh field yang tersedia di sistem.</p>
${!hasBase ? '<div class="callout danger"><strong>Perhatian:</strong> klien ini BELUM memiliki scope <code>laporan_polisi.read</code>, sehingga saat ini belum bisa memanggil endpoint apa pun. Hubungi Superadmin BDB untuk mengaktifkannya.</div>' : ''}
<h3>1.1 Base URL</h3>
<pre>https://&lt;domain-bdb&gt;/api/external/v1</pre>
<h3>1.2 Data yang keluar</h3>
<p>Hanya Laporan Polisi dengan <code>data_scope = OPERASIONAL</code> yang pernah keluar lewat jalur ini — data uji coba/pengembangan (TEST) tidak pernah dapat diakses klien integrasi.</p>

<h2>2. Autentikasi</h2>
<p>API ini memakai <strong>HTTP Basic Authentication</strong> — bukan token login CMS.</p>
<pre>Authorization: Basic base64(username:password)</pre>
<h3>Contoh dengan curl</h3>
<pre>curl -u ${esc(opts.username)}:${passwordForCurl} \\
  "https://bdb.contoh.polri.go.id/api/external/v1/laporan-polisi?limit=20&amp;page=1"</pre>
${opts.apiPassword ? '<div class="callout danger"><strong>Password di atas adalah password API asli Anda</strong> — simpan dokumen ini di tempat aman, jangan sebarluaskan.</div>' : '<div class="callout warn"><strong>Password hanya ditampilkan satu kali</strong> saat klien dibuat/dibuat ulang oleh Superadmin BDB.</div>'}

<h2>3. <span class="tag tag-get">GET</span> /laporan-polisi</h2>
<p>Daftar Laporan Polisi (dipaginasi), diurutkan dari yang terbaru diperbarui.</p>
<table>
  <tr><th style="width:22%">Parameter</th><th style="width:16%">Tipe</th><th>Keterangan</th></tr>
  <tr><td><code>page</code></td><td>integer</td><td>Halaman, mulai dari 1. Default 1.</td></tr>
  <tr><td><code>limit</code></td><td>integer</td><td>Jumlah baris per halaman, maks 100. Default 20.</td></tr>
  <tr><td><code>no_laporan</code></td><td>string</td><td>Pencarian nomor LP spesifik (pencarian parsial, case-insensitive).</td></tr>
  <tr><td><code>status</code></td><td>string</td><td>Filter tahapan perkara riil (misal: <code>SP3</code>, <code>TAHAP_II</code>, <code>PENYIDIKAN</code>, <code>PENYELIDIKAN</code>, <code>PERMA</code>, <code>P21</code>).</td></tr>
  <tr><td><code>status_kategori</code></td><td>string</td><td>Filter kategori penyelesaian: <code>CC</code> (Crime Clearance / Selesai) atau <code>CT</code> (Crime Total / Proses).</td></tr>
  <tr><td><code>satker</code></td><td>string</td><td>Filter nama satker atau subsatker penanganan (misal: <code>POLRES MALANG</code>, <code>TIPIDTER</code>).</td></tr>
  <tr><td><code>updated_from</code></td><td>date <code>YYYY-MM-DD</code></td><td>Hanya LP yang diperbarui pada/setelah tanggal ini.</td></tr>
  <tr><td><code>updated_to</code></td><td>date <code>YYYY-MM-DD</code></td><td>Hanya LP yang diperbarui sebelum tanggal+1 ini.</td></tr>
</table>
<h3>Contoh respons — 200 OK</h3>
<pre>${exampleJson}</pre>
<div class="callout"><strong>Catatan Status &amp; Crime Clearance (CC):</strong> field <code>status</code> adalah penanda sistem lama. Tahapan penanganan LP yang sesungguhnya ada pada <code>status_code</code> dan <code>status_nama</code> (Lidik, Sidik, SPDP, Tahap I, Tahap II, SP3, SP2Lidik, PERMA/Tipiring). Kategori penyelesaian ditandai oleh <code>status_kategori = "CC"</code> (Crime Clearance / Tuntas) atau <code>"CT"</code> (Crime Total / Proses), serta flag <code>is_selesai</code> dan <code>tanggal_selesai</code>.</div>
${example.status_code ? `<h3>Contoh respons — LP berstatus SP3 (Restorative Justice / Penghentian)</h3><p style="font-size:8.6pt;color:#64748b;">Bila LP diselesaikan lewat SP3 / SP2Lidik (termasuk Restorative Justice &amp; Diversi):</p><pre>${esc(JSON.stringify(EXAMPLE_LP_SP3, null, 2))}</pre><h3>Contoh respons — LP berstatus PERMA (Putusan Pengadilan / Tipiring)</h3><p style="font-size:8.6pt;color:#64748b;">Bila LP diselesaikan melalui sidang Tindak Pidana Ringan (Tipiring):</p><pre>${esc(JSON.stringify(EXAMPLE_LP_PERMA, null, 2))}</pre>` : ''}

<h2>4. <span class="tag tag-get">GET</span> /laporan-polisi/:id</h2>
<p>Detail satu Laporan Polisi. Parameter <code>id</code> adalah token opaque, diambil dari field <code>id</code> pada respons List.</p>
<h3>Contoh respons — 200 OK</h3>
<pre>${detailJson}</pre>

<h2>5. Respons Kesalahan</h2>
<table>
  <tr><th style="width:12%">HTTP</th><th style="width:30%">Penyebab</th><th>Contoh respons</th></tr>
  <tr><td>400</td><td>Parameter tidak valid</td><td><code>{"status":0,"statusCode":400,"message":"updated_from harus format YYYY-MM-DD."}</code></td></tr>
  <tr><td>401</td><td>Basic Auth salah/tidak ada</td><td><code>{"status":0,"statusCode":401,"message":"Kredensial tidak dikenali."}</code></td></tr>
  <tr><td>403</td><td>Nonaktif / scope / IP tidak terdaftar</td><td><code>{"status":0,"statusCode":403,"message":"Akses ditolak: IP Anda tidak terdaftar dalam IP whitelist klien ini."}</code></td></tr>
  <tr><td>404</td><td>ID LP tidak ditemukan</td><td><code>{"status":0,"statusCode":404,"message":"Laporan Polisi tidak ditemukan."}</code></td></tr>
  <tr><td>429</td><td>Rate limit terlampaui</td><td><code>{"status":0,"statusCode":429,"message":"Terlalu banyak permintaan (rate limit terlampaui). Batas maksimal 120 request per menit."}</code></td></tr>
</table>

<h2>6. Praktik Baik</h2>
<ul>
  <li>Simpan password di tempat aman (secret manager/env terenkripsi) — jangan hardcode di kode sumber.</li>
  <li>Gunakan <code>updated_from</code>/<code>updated_to</code> untuk sinkronisasi incremental.</li>
  <li>Field di luar scope Anda tidak akan muncul di JSON sama sekali — periksa keberadaan field, jangan asumsikan selalu ada.</li>
  <li>Setiap pemanggilan (berhasil/gagal) tercatat di Log Akses API BDB.</li>
</ul>

<h2>7. Bantuan</h2>
<p>Untuk perubahan scope atau kendala teknis, hubungi Superadmin BDB melalui jalur internal instansi Anda.</p>

<div class="footer-note">Dokumen ini dibuat otomatis untuk klien <strong>${esc(opts.namaKlien)}</strong> (${esc(opts.username)}) per ${tanggal}. Berlaku sesuai scope klien saat dokumen ini dibuat — regenerasi ulang jika scope berubah.</div>
</body></html>`;
}
