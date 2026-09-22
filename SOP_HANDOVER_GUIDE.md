# 📋 SOP & PANDUAN KERJA AMAN (SAFETY FIRST) SISTEM BDB / CAS

> **Tujuan Panduan**: Sebagai instruksi acuan saat membuka chat/sesi kerja baru agar setiap perbaikan bug, penyelarasan data, maupun penambahan fitur dilakukan secara **surgical (presisi tinggi)** tanpa merusak fitur lain, tanpa menyebabkan *downtime*, dan tanpa menghilangkan integritas data.

---

## 1. Topologi Lingkungan Server & Akses
Aplikasi berjalan pada klaster multi-server dengan konfigurasi berikut (kredensial lokal tersimpan di CAS_SSH_LOCAL.env):

| Node / Host | IP Address | Peran & Lingkungan | Container Utama |
|---|---|---|---|
| **Frontend (FE)** | 10.0.0.x | Web App (Next.js Production Build) | db-web (port 3000 / 80) |
| **Backend (BE)** | 10.0.0.x | API Service (NestJS Framework) | db-api (port 3850) |
| **Database (DB)** | 10.0.0.x | PostgreSQL DB Produksi | Database: ig_data_binops |

*Tooling eksekusi dari lokal*:
- Skrip backend dijalankan lewat bridge PuTTY/SSH via:  
  
ode "d:\Prototype CAS\EDIT MASTER MASAL\scratch\run_be.js" <nama_skrip.js>
- File scratch disimpan di folder scratch/.

---

## 2. Aturan Emas Keselamatan (Golden Rules)

### ⚠️ A. Database Safety (Zero Data Loss)
1. **Dilarang Keras DELETE Permanen**:
   - Jangan pernah menjalankan DELETE FROM bdb_laporan_polisi atau tabel master lainnya.
   - Status hapus wajib menggunakan soft-delete (deleted_at = NOW()).
2. **Wajib Backup Sebelum Mengubah Data**:
   - Jika mengubah struktur atau nilai snapshot/tabel konfigurasi, buat tabel backup bertanggal terlebih dahulu:
     `sql
     CREATE TABLE IF NOT EXISTS bdb_backup_<nama_tabel>_YYYYMMDD AS SELECT * FROM <nama_tabel>;
     `
3. **Wajib Pasang statement_timeout**:
   - Setiap koneksi skrip ke PostgreSQL produksi **harus** menyertakan statement_timeout: 5000 (atau 10000 ms) agar query yang terkunci tidak menggantung (*hang*) dan mengganggu traffic aplikasi live.
4. **Hindari SELECT * Tanpa Batas**:
   - Tabel db_laporan_polisi memiliki ratusan ribu baris data. Selalu gunakan filter tanggal/satker dan LIMIT.

### ⚠️ B. Backend Service Safety (NestJS)
1. **Backup File JS/TS Sebelum Patch**:
   - Backup file sebelum ditimpa:  
     cp kinerja-perkara.service.js kinerja-perkara.service.js.bak-<keterangan>-YYYYMMDD
2. **Perhatikan Cache In-Memory & Snapshot**:
   - Backend memiliki cache memory (TTL) dan snapshot cache table (db_kinerja_perkara_summary_snapshot).
   - Jika mengubah snapshot DB atau kode logic, lakukan restart aman container:
     `ash
     docker restart bdb-api
     `

### ⚠️ C. Frontend Safety (Next.js Chunks)
1. **FE Berjalan dari Production Chunks**:
   - Frontend tidak memakai compiler dev-server, melainkan membaca build chunks di /usr/src/app/.next/static/chunks/.
   - Patch dilakukan secara *surgical* pada chunk terkait (misal manifest atau logic display tertentu) dan selalu simpan salinan .bak.

---

## 3. Aturan Bisnis & Logika Perkara (Domain Knowledge)

1. **Definisi LP Internal Polri**:
   - **LP Aktif**: lp.deleted_at IS NULL.
   - **Pelimpahan Eksternal**: Perkara yang dilimpahkan ke instansi eksternal (coalesce(lp.dilimpahkan_eksternal, false) = true) **TIDAK BOLEH dihitung sebagai beban/tunggakan LP internal Polri** pada Kinerja Perkara & Dashboard.
   - **Satker Pelapor**: Selalu prioritaskan unit satker jika ada: coalesce(lp.unit_satker_id, lp.satker_id).
2. **Format Tanggal LP (	gl_laporan)**:
   - Kolom 	gl_laporan berupa teks string berformat DD-MM-YYYY HH:MI:SS. Gunakan formula SQL standar:
     `sql
     (case when lp.tgl_laporan ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}' 
           then to_date(substring(lp.tgl_laporan from 1 for 10), 'DD-MM-YYYY') 
           else lp.synced_at::date end)
     `
3. **Penyelarasan Kinerja Perkara vs Daftar LP**:
   - Angka di **Daftar LP**, **Dashboard Ringkasan**, dan **Kinerja Perkara** harus sinkron 100%.
   - Tabel db_kinerja_perkara_summary_snapshot (ID 14 untuk tahun berjalan) memiliki 3 bagian yang wajib selaras:
     1. summary_data (untuk kartu ringkasan Dashboard).
     2. ekap_totals (untuk header/total Kinerja Perkara).
     3. ekap_data (memuat oot.totals dan pohon children untuk rincian Polda/Polres/Polsek).

---

## 4. Alur Kerja Standar (Workflow 5 Langkah)

Saat membetulkan bug atau memodifikasi fitur, jalankan tahapan ini secara berurutan:

`mermaid
flowchart LR
    A[1. Investigasi & Verifikasi] --> B[2. Backup Database & Code]
    B --> C[3. Surgical Patching]
    C --> D[4. Restart & Invalidation]
    D --> E[5. Multi-Level Testing]
`

1. **Investigasi & Verifikasi Fakta**:
   - Query langsung ke DB atau respons endpoint API untuk mendapatkan angka/kondisi riil saat ini. Jangan berasumsi.
2. **Backup Sebelum Bertindak**:
   - Buat backup tabel DB (db_backup_...) atau backup file source code (.bak-...).
3. **Surgical Patching**:
   - Ubah sesedikit mungkin baris kode yang hanya menjadi akar masalah. Pertahankan struktur dan helper lain yang tidak terkait.
4. **Restart & Invalidation**:
   - Restart container terkait (db-api atau db-web) agar memori dan cache bersih.
5. **Multi-Level Testing**:
   - Verifikasi data DB -> Verifikasi respons JSON API -> Verifikasi tampilan UI di browser.
