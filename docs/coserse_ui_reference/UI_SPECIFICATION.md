# KATALOG LENGKAP ACUAN VISUAL UI COSERSE 1.0 (MODERN AI IDE DESIGN)

Dokumen ini adalah cetak biru visual resmi yang **WAJIB DIIKUTI** oleh Engineer.
Semua screenshot asli aplikasi AI modern (Antigravity IDE) dan tangkapan layar live menu BDB CAS sudah disalin ke folder:
📁 `d:\Prototype CAS\EDIT MASTER MASAL\docs\coserse_ui_reference\`

---

## 0. PERBEDAAN MENDASAR & ALUR SEAMLESS HANDOVER: "OBROLAN CEPAT" ➔ "WORKSPACE COSERSE"

Lihat screenshot live menu Obrolan di: `11_sharese_obrolan_cosersebot_existing.jpg` dan coretan evaluasi di: `12_feedback_coretan_header_sub.jpg`

### 0.1 Perbandingan Peran & Larangan Penulisan Nama (@cosersebot)
- **HAPUS TULISAN `(@cosersebot)` DI HEADER COSERSE 1.0!**
  - Di breadcrumb / title atas: Cukup tulis **`Dashboard › Coserse 1.0`** (JANGAN ada embel-embel `(@cosersebot)` karena `@cosersebot` itu nama bot di menu Obrolan Cepat, bukan nama workspace ini!).
- **SUBTITLE DI BAWAH "Halo, @username."**:
  - Tulis ajakan yang luwes dan beridentitas jelas: **`Mulai chat dengan Copilot Ai untuk anggota Serse kamu`** (menggantikan teks `"Berbasis AI"`).
| Aspek Pembeda | Chat "@cosersebot" di Obrolan Cepat (`/cms/sharese-obrolan`) | Modul Workspace "Coserse 1.0" (`/cms/dashboard/coserse`) |
| :--- | :--- | :--- |
| **Lokasi Menu** | Menu Sosial: **SHARESE ➔ Obrolan** | Sidebar Menu Utama: **DASHBOARD ➔ Coserse (1.0)** |
| **Bentuk Container** | Container chat pesan instan cepat. | Container chat modern bernuansa senada (clean AI canvas) namun berdaya analitik penuh. |
| **Karakter Tugas** | **Quick Chat / Asisten Tanya-Jawab**: Konsultasi regulasi, pasal KUHP baru, tanya alur dinas, perintah ringkas. | **Deep Analytical Workspace**: Eksekusi tugas analitik kompleks, investigasi perkara silang (11,4 jt data), audit LP massal. |
| **Input Berkas** | Murni teks obrolan (tidak menerima file/dokumen). | Lengkap: Upload Mindik PDF/Word (drag-drop), paste screenshot Ctrl+V ke RAM Sandbox. |
| **Output Berkas** | Murni teks balasan di bubble chat. | Review Card persetujuan status LP, ekspor resume intelijen resmi PDF/Word. |

### 0.2 Mekanisme Seamless Smart Handover (Alih Tugas Otomatis)
Jika user memulai obrolan dengan `@cosersebot` di menu Obrolan Cepat dan memberikan tugas yang membutuhkan investigasi mendalam atau olah dokumen:
1. **Deteksi Beban Kerja Kompleks oleh `@cosersebot`**:
   - Contoh kasus: User chat: *"Tolong bantu telusuri seluruh jaringan NIK 3171012345670001 dan berkas perkara terkaitnya"* atau *"Saya mau upload dan validasi dokumen SPDP ini"*.
2. **Respons Pengalihan & Tombol Konfirmasi Pindah Halaman**:
   - `@cosersebot` tidak menolak mentah-mentah, melainkan membalas dengan sopan:
     > *"Siap @username, penelusuran perkara mendalam ini membutuhkan instrumen Workspace Analitik Coserse agar data dapat ditelaah secara komprehensif beserta lampiran berkasnya."*
   - Di bawah teks balasan muncul **Kartu Tautan Konfirmasi Cerdas**:
     ```text
     +-------------------------------------------------------------------------------+
     | 🚀 BUKA RUANG KERJA ANALITIK COSERSE                                          |
     | Melanjutkan tugas: "Investigasi Jaringan & Cross-Profiling NIK 3171..."      |
     | [ Lanjutkan ke Coserse 1.0 ➔ ]                                               |
     +-------------------------------------------------------------------------------+
     ```
3. **Pemberangkatan Konteks (Context Handoff via URL Query / Session Key)**:
   - Saat tombol `[ Lanjutkan ke Coserse 1.0 ➔ ]` diklik oleh user:
     - Browser membuka tab/halaman `/cms/dashboard/coserse?task_ref=<session_id>&init_prompt=Investigasi...`.
     - Halaman Workspace Coserse langsung **otomatis memuat ringkasan obrolan sebelumnya** dari Obrolan Cepat.
     - User tinggal melanjutkan pekerjaan (misal: tinggal drag berkas dokumen atau klik konfirmasi penelusuran) tanpa perlu mengetik ulang permintaannya dari nol!

---

## 1. Daftar Screenshot Acuan Visual (Buka & Teliti Gambarnya)

1. **[01_empty_state_greeting.png](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_ui_reference/01_empty_state_greeting.png)**:
   - **Tampilan Awal Saat Chat Masih Kosong (Empty State)**:
     - Logo monogram minimalis di tengah dengan sapaan hangat: `Hello, @username.` (atau `Halo, AKBP Ako.`).
     - Input kapsul melayang bersih di bagian tengah bawah dengan placeholder: `"Ask anything, @ to mention, / for actions"`.
     - Pill Model di bawah kiri input: `+  Gemini 3.8 Flash Low ^` (pada Coserse: `✦ Coserse 1.0 ^`).
     - Sidebar kiri rapi: tombol `+ New Conversation`, daftar riwayat obrolan, dan tombol `⚙ Settings` di pojok kiri bawah.
2. **[04_chat_thread_with_usage_menu.jpg](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_ui_reference/04_chat_thread_with_usage_menu.jpg)**:
   - **Alur Thread Chat Aktif & Menu Model / Usage Popover**:
     - Layout thread luas dan lapang di tengah (max-width 820px).
     - Bubble pertanyaan pengguna rapi, balasan AI langsung format markdown bersih.
     - **Flyout Menu Model & Usage (Persis seperti ini!)**:
       - Saat pill model diklik, muncul menu: Model pilihan + opsi `View Usage >`.
       - Flyout kanan menampilkan batas kuota secara elegan:
         * `Weekly limit`: XX% left (resets in Xd)
         * `5h limit`: XX% left (resets in Xh)
         * `Session Memory`: X.X MB / 10 MB (Free tier).
3. **[05_settings_modal_details.jpg](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_ui_reference/05_settings_modal_details.jpg)**:
   - **Modal Settings (Pengaturan)**:
     - Bagian Akun **DIBUANG** dari aplikasi chat (karena akun user BDB sudah permanen di header utama CAS).
     - Isi modal settings cukup: General preference, Mode Inferensi (Server vs Local), dan tombol `[Delete All Conversation / Reset Memori]`.
4. **[02_automations_view.png](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_ui_reference/02_automations_view.png)**:
   - Gaya header dan tombol aksi modern: tombol kapsul tipis dengan icon plus `+ Create`.
5. **[03_customizations_marketplace.jpg](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_ui_reference/03_customizations_marketplace.jpg)**:
   - Inspirasi kartu/card modular (dipakai untuk Kartu Konfirmasi Draf Mindik / Human-in-the-Loop) dengan background gelap/terang lembut dan tombol pill modern `[+ Add / Setujui]`.

### D. Standar Iconing Bersih & Profesional (Zero Alay / Minimalist SVG):
- **DILARANG KERAS** menggunakan emoji teks berwarna-warni yang mencolok atau norak (seperti tong sampah emoji 🗑️ merah tebal, robot kartun 🤖, atau icon alay lainnya yang merusak wibawa aplikasi kedinasan).
- **WAJIB MENGGUNAKAN ICON SVG OUTLINE MINIMALIS (Standar Lucide / Heroicons / Feather)**:
  - **New Chat**: Icon pena/tambah clean (`<svg> edit / plus </svg>`).
  - **Hapus Sesi**: Icon trash can outline tipis abu-abu netral (`stroke="#94a3b8"`, hover merah lembut).
  - **Attachment File**: Icon paperclip / plus outline tipis clean.
  - **Kirim**: Icon panah ke atas / panah kanan runcing minimalis (`arrow-up` / `arrow-right` putih di dalam circle biru).
  - **Settings**: Icon gear outline presisi khas sistem modern.
  - **Model Sparkle**: Icon bintang empat sudut minimalis (`✦` atau SVG spark outline tipis).
  - **Menu Hamburger**: Icon 3 garis horizontal tipis (`☰` atau 3 path line clean).

### B. Format Teks Manusiawi & Ramah Personel (Human-Friendly Texting):
Lihat bukti screenshot coretan di: `13_feedback_popover_usage_coretan.jpg`

- **DILARANG MENULIS ISTILAH RUMIT TEKNIS MESIN**:
  - Hapus tulisan rumit: `RAM & Context Window`, `Sliding 0/6`, `Resets 2026-11-16 00:00 WIB`.
  - Cukup tulis judul kelompoknya secara simpel dan manusiawi: **`MEMORI`** (sesuai coretan merah user).
  - Tulis kapasitasnya: `0.001 MB / 10 MB` (atau `0.01 MB terpakai dari 10 MB`).
- **HAPUS EMBEL-EMBEL PROMOSI / JUALAN**:
  - HAPUS tulisan `USAGE (100% LOKAL GRATIS)`! Ganti dengan judul bersih: **`Pemakaian Kuota`** (atau `Informasi Penggunaan`).
  - HAPUS tulisan `100% free`! Tulis langsung statusnya: `100% tersisa` (atau `Lega`).
  - HAPUS duplikasi footer `Powered by Qwen 2.5` di card Usage (cukup satu saja di card Model).
- **FORMAT HITUNG MUNDUR WAKTU ALAMI**:
  - `Weekly limit`: Tulis "Reset dalam 5 Hari lagi".
  - `5h limit`: Tulis "Reset dalam 4 Jam 35 Menit lagi".
  - **Jeda Sesi 5 Jam**: Tuliskan hitung mundur alami: *"Reset dalam 3 Jam 15 Menit lagi"* (atau *"Tersisa 74% • Reset dalam 2 Jam 40 Menit lagi"*).
  - **Batas Mingguan**: Tuliskan hitung mundur hari: *"Reset dalam 4 Hari 6 Jam lagi"* (bukan tanggal dingin).
  - **Memori Sesi**: Tuliskan kapasitas ringkas: *"0.8 MB dari 10 MB terpakai (Aman)"*.
  - **Gaya Percakapan**: Tetap santai kedinasan, luwes, dan menyapa langsung akun `@username` tanpa istilah kode error / istilah teknis database yang bikin bingung staf non-programmer.

### C. Logo Blank Chat / Background Watermark (Lambang Reserse):
- File logo resmi tersimpan di: `d:\Prototype CAS\EDIT MASTER MASAL\docs\coserse_ui_reference\logo_reserse_bareskrim.png`
- **Di Tengah Layar Saat Blank / Empty Chat**:
  - Tampilkan logo Reserse ini di atas teks sapaan *"Halo, @username."*
  - Desain line-art / monochrome halus atau opacity transparan elegan (~`opacity: 0.15 - 0.25` atau grayscale/line art hitam putih bersih) agar tidak mencolok tapi tetap berwibawa khas Bareskrim Polri.
  - Alternatif watermark: Bisa juga ditempelkan sebagai subtle watermark lembut di tengah canvas area chat (`opacity: 0.05`).

### E. Matriks Kuota Bertingkat Berbasis Role (Hierarchical Quota):
- **Superadmin**:
  - Kuota: **Unlimited (Tanpa Batas Token & Memori)**.
  - Tampilan di View Usage: *"Akses Superadmin • Kuota Tanpa Batas"*.
  - Otoritas Tunggal: Berhak mentraining model dan mengubah parameter AI master.
- **Admin Binops**:
  - Kuota Ditingkatkan: **60.000 token per 5 jam** (~3x lipat), **500.000 token mingguan**, dan memori **30 MB – 50 MB**.
  - Wewenang Training: **DIKUNCI (Read-Only AI Model)** untuk mengamankan model agar rekan kerja/staf lain tidak salah training dan merusak bobot AI.
- **Operator / Penyidik**:
  - Kuota Standar: 20.000 token per 5 jam, 100.000 token mingguan, memori 10 MB.
- **Viewer**:
  - Kuota Terbatas untuk tanya jawab dasar.

### F. Menu Opsi Percakapan Sidebar (`⋮`) & Wajib Konfirmasi Hapus:
Lihat screenshot acuan: `17_feedback_sidebar_menu_confirm_delete.jpg`

- **DILARANG** memasang tombol hapus langsung yang sekali klik langsung menghapus percakapan tanpa konfirmasi! Risiko terhapus tidak sengaja sangat tinggi bagi staf yang sedang menganalisis perkara.
- Ganti icon tong sampah tunggal pada item riwayat sidebar menjadi **tombol semat cepat (Pin)** + **tombol titik tiga (`⋮`)** yang membuka menu dropdown bersih:
  1. **Ubah Nama (`Rename`)**: Mengganti judul obrolan agar mudah dicari sesuai nomor LP/kasus.
  2. **Sematkan / Lepas Sematan (`Pin / Unpin`)**: Menaruh percakapan prioritas di kelompok paling atas sidebar (*Disematkan*).
  3. **Salin Ringkasan (`Salin Teks`)**: Menyalin isi obrolan ke clipboard untuk bahan laporan.
  4. **Arsipkan (`Archive`)**: Menyembunyikan obrolan yang sudah selesai dari daftar utama tanpa menghapus datanya (bisa dilihat kembali dari filter *Arsip*).
  5. **Hapus (`Delete`)**: Warna merah halus, jika diklik **WAJIB MEMUNCULKAN DIALOG KONFIRMASI** terlebih dahulu (*"Hapus percakapan ini? Seluruh isi obrolan dan memori di sesi ini akan dihapus permanen."* + tombol **`[Batal]`** dan **`[Ya, Hapus]`**).
- Konfirmasi yang sama juga wajib muncul sebelum mengeksekusi tombol hapus seluruh riwayat di menu Settings.

### G. Baris Aksi & Waktu di Pojok Kanan Bawah Tiap Balasan AI:
Lihat screenshot acuan: `19_feedback_message_actions_copy_like.jpg`

- Setiap balasan Coserse wajib memiliki baris aksi tipis yang sejajar di **pojok kanan bawah balasan** (bukan teks telemetri DB):
  `Baru saja   [📋 Salin]  [👍]  [👎]` *(menggunakan icon SVG outline abu-abu tipis standar Lucide, bukan emoji warna!)*.
- **Waktu Alami**: `Baru saja`, `2 menit lalu`, dst. (menggunakan `createdAt` pesan).
- **Tombol Salin (`Copy`)**: Menyalin teks jawaban Coserse ke clipboard dalam 1 klik untuk ditempel ke Word/laporan dinas, lalu ikon berubah sebentar menjadi centang (`✓`).
- **Tombol Jempol Naik / Jempol Turun**: Menandai apakah jawaban Coserse tepat/membantu atau kurang tepat (hanya sebagai catatan evaluasi kualitas/audit, tidak mengubah bobot model).

---

## 4. Rincian Implementasi CSS & Struktur DOM

```text
+---------------------------------------------------------------------------------------------------------+
| HEADER UTAMA WEB BDB (Sudah memuat Avatar/Profil User BDB di kanan atas - JANGAN DITIRU DI CONTAINER)   |
+----------------------+----------------------------------------------------------------------------------+
| SIDEBAR CHAT (240px) | AREA PERCAKAPAN (Clean Modern AI Canvas)                                         |
|                      |                                                                                  |
| [+ New Conversation] |  [KONDISI A: EMPTY STATE]                                                        |
|                      |            (Logo BDB Monogram)                                                   |
| RIWAYAT CHAT:        |               Halo, @username.                                                   |
| • Profiling NIK...   |                                                                                  |
| • Analisis LP...     |  [KONDISI B: CHAT THREAD BERJALAN]                                               |
| • SPDP Tahap II      |   User Bubble (kanan)                                                            |
|                      |   Coserse Markdown Bubble (kiri, bersih)                                         |
|                      |   [Kartu Konfirmasi Draf Mindik - Modern Card]                                   |
|                      |                                                                                  |
|                      |  -----------------------------------------------------------------------------   |
|                      |  FLOATING INPUT CAPSULE (Di Tengah Bawah):                                       |
|                      |  +-----------------------------------------------------------------------------+ |
|                      |  | (+)  Tanya apa saja ke @cosersebot, drag berkas, atau Ctrl+V...   [ ➔ ]     | |
|                      |  +-----------------------------------------------------------------------------+ |
|                      |     [ ✦ Coserse 1.0 (Qwen 2.5) ▾ ]  <-- KLIK UNTUK FLYOUT USAGE                   |
| [⚙ Settings]         |     (Popup Model + Submenu View Usage 5h/weekly limit + Reset Memori)            |
+----------------------+----------------------------------------------------------------------------------+
```

---

## 3. Catatan Penting: Eliminasi Elemen Berlebihan & Responsivitas Multi-Device

### A. Elemen yang DIBUANG (Jangan Dibuat di Coserse):
1. **Tema / Appearance / Dark-Light Switcher**: **TIDAK PERLU DIBUAT**. Pewarnaan dan tema sudah mewarisi tema global BDB CAS.
2. **Widget Profil Akun User**: **TIDAK PERLU DIBUAT**. Profil akun sudah paten ada di header navigasi utama web BDB CAS.
3. **Menu Browser / Telemetry / Remote Control / Update**: **TIDAK PERLU DIBUAT**. Itu menu khusus IDE desktop, tidak relevan untuk modul asisten BDB.

### B. Modal Settings Bersih dari Bahasa Teknis Programmer (Human-Friendly):
Lihat gambar referensi evaluasi: `16_feedback_settings_jargon_coretan.jpg` serta contoh layout `05_settings_modal_details.jpg` dan `09_settings_models_quota_circles.jpg`.

Prinsip utama: **Pengguna Coserse adalah staf Binops / anggota Polri, bukan programmer.**
- **DILARANG** menampilkan toggle/fitur yang tidak dipahami pengguna atau bersifat otomatis di sistem (seperti `Mode Penelusuran Silang: Otomatis mendeteksi variasi 08xx/628xx`, badge mati `Human-in-the-Loop`, nama endpoint `http://127.0.0.1:11434/api/chat`, `/dev/shm`, `memori volatil`, `Zero Disk Residue`, `disk_writes=0`, `raw buffer`, maupun nama tabel database `bdb_laporan_polisi` / `bdb_dokumen` / `bdb_audit_log`).
- Susun 4 kategori Settings dengan bahasa dinas yang lugas dan langsung bisa dipahami:

1. **Tab 1 — `Umum`**:
   - **Cara Coserse Menjawab**: Pilihan *[Ringkas & Padat]* vs *[Lengkap & Detail]* (mengatur panjang-pendeknya penjelasan jawaban).
   - **Konfirmasi Sebelum Kirim**: Toggle *Tekan Enter untuk kirim pesan* (Aktif/Nonaktif, berguna agar di HP/PC tidak salah pencet kirim).
   - **Tampilkan Saran Pertanyaan Cepat**: Toggle tampilkan/sembunyikan tombol pintasan prompt di atas kolom ketik.
2. **Tab 2 — `Model & Kuota`**:
   - **Status Layanan & Hak Akses**: Cukup tampilkan *Coserse 1.0 (Aktif)* dan hak pengguna (*Hanya Pakai* untuk Admin Binops/Operator, atau *Pelatihan Model Aktif* khusus Superadmin) — **TANPA** URL endpoint `127.0.0.1:11434` dan kata `Loopback Lokal`.
   - **Sisa Kuota Pemakaian**: Indikator lingkaran *Batas Mingguan*, *Batas 5 Jam*, dan *Memori Percakapan* dengan hitung mundur alami (atau *"Kuota Tanpa Batas"* untuk Superadmin).
3. **Tab 3 — `Riwayat & Privasi`**:
   - **Keamanan Berkas**: Penjelasan manusiawi *"Dokumen yang Anda unggah hanya dibaca sementara untuk diperiksa dan langsung dihapus otomatis dari sistem, tidak tersimpan permanen."* (tanpa istilah `/dev/shm` atau `Zero Disk Residue`).
   - **Kelola Riwayat**:
     - Tombol `Bersihkan Memori Percakapan Ini` (mengosongkan ingatan obrolan yang sedang dibuka ke 0 MB).
     - Tombol `Hapus Semua Riwayat Obrolan` (menghapus daftar riwayat obrolan di perangkat ini).
4. **Tab 4 — `Panduan & Ketentuan`**:
   - **Aturan Pemakaian Internal** (bahasa operasional Polri, tanpa nama tabel DB):
     - Pemeriksaan dokumen perkara (SPDP, Tahap I, Tahap II) bersifat sementara dan aman.
     - Perubahan data perkara tidak dilakukan otomatis oleh AI; operator wajib memeriksa dan menekan tombol setuju sebelum disimpan.
     - Pencarian data hanya berlaku sesuai kewenangan wilayah satker masing-masing dan seluruh aktivitas tercatat dalam sistem pengawasan internal.
   - **Penafian Resmi**: *"Coserse dapat melakukan kesalahan. Hanya untuk internal dan tolong periksa ulang hasil pekerjaan."*

### C. Struktur Menu Model & Flyout Sub-Tier (PERSIS 1:1 CONTOH GAMBAR 15!):
Lihat screenshot asli di: `15_exact_model_tier_flyout_example.png`

Struktur popover model memiliki flyout tingkat kedua yang sangat presisi:

```text
+------------------------------------+      +---------------+
| Model                              |      |               |
|                                    |      | ● Low       ✓ |
| Coserse 1.0  Low               >   | ---> |   Medium      |
|                                    |      |   High        |
|                                    |      +---------------+
| ---------------------------------- |
| 📊 View Usage                  >   | ---> (Flyout Kuota Lingkaran)
|                                    |
| Powered by Qwen 2.5                |
+------------------------------------+
```

1. **Card Menu Kiri**:
   - Judul atas: `Model`
   - Baris item aktif: **`Coserse 1.0   Low   >`** (ada tanda panah `>` ke kanan).
   - Garis pembatas tipis (`divider`).
   - Baris item: **`📊 View Usage   >`** (membuka sub-menu flyout kuota).
   - Footer halus: *"Powered by Qwen 2.5 (Model LLM AI aktif saat ini)"*.
2. **Flyout Sub-Tier & Multiplier Konsumsi Token**:
   - Pemilihan tier mempengaruhi bobot analisis dan jumlah token yang dipotong dari kuota user:
     * **`● Low`** (Hemat Token / Pengali 1x):
       - Jawaban taktis, cepat kilat, memotong token paling sedikit (cocok untuk tanya jawab singkat/cek status perkara).
     * **`○ Medium`** (Mode Seimbang / Pengali 1.5x):
       - Keseimbangan antara kecepatan dan kedalaman telaah pasal.
     * **`○ High`** (Deep Reasoning / Pengali 2x):
       - Analisis mendalam, penalaran silang komprehensif, memakan token 2x lebih besar (cocok untuk investigasi perkara rumit dan gelar perkara).
   - *Catatan Otoritas*: Khusus Superadmin (`@om.eko_42`), tier High bebas dipakai kapan saja tanpa khawatir kehabisan kuota karena status kuotanya **Unlimited**.
   - DILARANG menaruh kata teknis Qwen atau ukuran gigabyte di dalam menu ini.

### C. Responsivitas & UI/UX Scaling (Wajib Ramah PC, Tablet, dan HP):
Pengguna aplikasi BDB di lapangan juga membuka lewat **Tablet dinas dan Smartphone (HP)**:
1. **Layar Desktop (PC - lebar > 992px)**:
   - Sidebar chat history terbuka di sisi kiri (240px).
   - Area thread tengah maksimal `800px` agar nyaman dibaca.
2. **Layar Tablet (lebar 768px – 992px)**:
   - Sidebar chat otomatis tersembunyi (*collapsed*). Muncul tombol hamburger icon `☰` di pojok kiri atas untuk membuka sidebar secara overlay (drawer).
   - Floating input bar melebar menyesuaikan lebar tablet dengan padding yang pas.
3. **Layar Smartphone / HP (lebar < 768px)**:
   - Sidebar chat 100% overlay saat dibuka via tombol `☰`.
   - Area thread pesan rapat ke tepi (padding 12px) agar teks terbaca lega.
   - Floating input capsule menempel di bawah (bottom: 8px) dengan tombol attachment `(+)` dan tombol kirim `(➔)` yang proporsional untuk jari sentuh (*touch-friendly* minimal 40x40px).
   - Popover *View Usage* tampil sebagai bottom sheet atau popup tengah agar tidak terpotong tepi layar HP.
