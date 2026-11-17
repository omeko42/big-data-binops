# MASTER PROMPT & TATA KELOLA PENGERJAAN PROYEK COSERSE 1.0
## Petunjuk Eksekusi Bertahap (Sandbox First - Hemat Token - Zero Production Risk)

> **Dokumen Rujukan Wajib**: Folder `d:\Prototype CAS\EDIT MASTER MASAL\docs\coserse_blueprint\`  
> **Total Tahapan Pengerjaan**: **4 Tahap Terukur**  
> **Komposisi Tim Engineer**: **3 Peran Spesialis (Bisa diemban oleh 1 AI secara bergantian per tahap)**:
> 1. **Backend & Security Engineer**: Menangani API, query SQL, RAM sandbox, dan isolasi izin role.
> 2. **AI & ML Ops Engineer**: Menangani engine lokal Ollama/Llama.cpp, Modelfile Coserse 1.0, dan batasan token/kuota.
> 3. **Frontend & UX Engineer**: Menangani UI Chat di dashboard CAS, drag-and-drop file, clipboard paste Ctrl+V, dan quick pills.

---

## DAFTAR MASTER PROMPT PER TAHAP

---

### 📋 PROMPT TAHAP 1: BACKEND CORE SERVICE & CROSS-PROFILING (Sandbox Localhost)
*(Peran: Backend & Security Engineer)*

```text
Halo Agent, kita mulai pengerjaan Proyek "Coserse 1.0" (AI Asisten Bareskrim Polri).
BACA DAN PATUHI SELURUH ATURAN di folder: `d:\Prototype CAS\EDIT MASTER MASAL\docs\coserse_blueprint\`.

ATURAN WAJIB USER:
1. KERJA MURNI DI SANDBOX / LOCALHOST. DILARANG KERAS menyentuh atau deploy ke server produksi live.
2. KERJA PER TAHAP KECIL demi menghemat limit token. Selesaikan Tahap 1 saja, lalu STOP dan laporkan.
3. Alur: User akan mencoba dulu di localhost sebelum ada proses upload ke server live.

PERAN ANDA SAAT INI: Backend & Security Engineer.

TUGAS TAHAP 1:
1. Buat modul lokal baru di NestJS BDB: `coserse` (controller, service, module).
2. Implementasikan service "Cross-Entity Profiling" sesuai panduan di `03_CROSS_PROFILING_AND_DATA_SPEC.md` yang dapat mencari keterlibatan orang dari NIK, Nama, dan No Handphone pada tabel `bdb_dors_lp_terlibat` (11,4 jt data) dan `bdb_dors_lp_barang_bukti`.
3. Terapkan query yang terindeks dan cepat (target respon < 1.5 detik).
4. Uji endpoint ini di localhost (port lokal) dan tampilkan bukti pengujiannya.

Setelah Tahap 1 selesai di localhost, BERHENTI dan tunggu saya mencoba hasilnya sebelum lanjut ke Tahap 2.
```

---

### 📋 PROMPT TAHAP 2: INTEGRASI ENGINE LOKAL COSERSE 1.0 & KONTROL KUOTA
*(Peran: AI & ML Ops Engineer)*

```text
Tahap 1 sudah saya uji di localhost dan hasilnya oke. Sekarang lanjut ke TAHAP 2.
Tetap patuhi aturan: MURNI DI LOKAL / SANDBOX, jangan sentuh server produksi.

PERAN ANDA SAAT INI: AI & ML Ops Engineer.

TUGAS TAHAP 2:
1. Konfigurasi runtime lokal Ollama / Llama.cpp di localhost dengan model Qwen 2.5 7B Instruct (Q4_K_M).
2. Buat Modelfile resmi lokal dengan nama: `coserse:1.0` sesuai panduan di `02_SYSTEM_ARCHITECTURE_AND_SPECS.md` dan `05_DEPLOYMENT_AND_REPOS_REFERENCE.md`.
3. Tanamkan gaya bahasa manusiawi (tidak kaku seperti robot) yang memanggil langsung `@username` pengguna.
4. Terapkan kontrol kuota memori (10 MB – 50 MB per user) dan sliding context window (maksimal 6 turns) serta batasan token 5 jam & mingguan (100% gratis).
5. Hubungkan hasil profiling Tahap 1 ke Coserse 1.0 agar bisa merangkum keterlibatan LP menjadi teks intelijen yang luwes.
6. Tambahkan disclaimer wajib di akhir respon: "Coserse dapat melakukan kesalahan. Hanya untuk internal dan tolong periksa ulang hasil pekerjaan."

Uji coba di localhost, tampilkan contoh responnya, lalu STOP dan tunggu saya mencobanya.
```

---

### 📋 PROMPT TAHAP 3: PARSER DOKUMEN MINDIK & UI CHAT DI DASHBOARD CAS
*(Peran: Frontend & UX Engineer + Security Engineer)*

```text
Tahap 2 sudah saya uji di localhost dan hasilnya oke. Sekarang lanjut ke TAHAP 3.
Tetap patuhi aturan: MURNI DI LOKAL / SANDBOX.

PERAN ANDA SAAT INI: Frontend & UX Engineer.

TUGAS TAHAP 3:
1. Buat antarmuka UI Chat di menu Dashboard CAS (`/cms/dashboard/coserse`) dan hubungkan ke `@cosersebot`.
2. Pasang fitur input dokumen serbaguna sesuai `04_DOCUMENT_PARSING_AND_HUMAN_IN_THE_LOOP.md`:
   - Seret & lepas file (Drag and Drop Word .docx / PDF).
   - Tombol klip attachment.
   - Paste gambar screenshot langsung (Ctrl+V) dari clipboard.
3. Terapkan RAM sandbox (`/dev/shm`) untuk membaca teks dokumen (SPDP, Tahap I, Tahap II) dan pastikan file biner mentah langsung dimusnahkan seketika (zero disk residue).
4. Tampilkan KARTU KONFIRMASI DRAF (Review Card) di chat: AI tidak boleh menulis langsung ke database, melainkan wajib meminta klik tombol konfirmasi fisik operator.
5. Tambahkan Quick Prompt Pills di atas chat dan tombol [🗑️ Hapus Memori Sesi] yang mengosongkan kuota kembali ke 0 MB.

Jalankan dan pastikan frontend dan backend bisa saya coba langsung di browser localhost saya. Setelah siap dites, STOP dan laporkan.
```

---

### 📋 PROMPT TAHAP 4: DEPLOYMENT TERPANDU KE SERVER DENGAN FEATURE TOGGLE
*(Peran: Lead DevOps & Release Engineer)*

```text
Semua fitur sudah saya coba langsung di localhost dan berfungsi sempurna tanpa kendala.
Sekarang kita masuk ke TAHAP 4: PERSIAPAN DEPLOYMENT PRODUKSI.

PERAN ANDA SAAT INI: Lead DevOps & Release Engineer.

TUGAS TAHAP 4:
1. Buat script deployment bersih sesuai panduan di `05_DEPLOYMENT_AND_REPOS_REFERENCE.md` dan isolasi beban di `06_AIOPS_AND_RESOURCE_GOVERNOR.md`.
2. Pastikan port engine AI lokal (11434) terikat HANYA ke 127.0.0.1 (tertutup total dari akses luar).
3. Pasang sakelar fitur (Feature Toggle) di sistem sehingga saat pertama kali live di server, fitur Coserse HANYA AKTIF untuk role Superadmin.
4. Siapkan langkah-langkah deployment terpandu agar saya bisa mengeksekusinya dengan aman satu per satu tanpa mengganggu operasional server live.
Laporkan ringkasan panduan rilisnya.
```
