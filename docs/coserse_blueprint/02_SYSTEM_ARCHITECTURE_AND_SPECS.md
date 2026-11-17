# ARSITEKTUR SISTEM ON-PREMISE, BENCHMARK HARDWARE & PEMILIHAN MODEL
## Modul Coserse (AI Agent Bareskrim Polri)

> **File**: `docs/coserse_blueprint/02_SYSTEM_ARCHITECTURE_AND_SPECS.md`  
> **Klasifikasi**: TEKNIS / INTERNAL DEVELOPER  
> **Target Node**: Server Produksi Existing CAS/BDB (`127.0.0.1`)  
> **Tanggal**: November 2026  

---

## 1. Penetapan Penempatan Server (Deployment Target Matrix)

Dari klaster 3 server fisik/VM yang kita miliki (`10.200.210.232`, `10.200.210.233`, dan `10.200.210.236`):

| Node Server | IP Address | Peran Eksisting | Status untuk Coserse AI | Keputusan Penempatan |
| :--- | :--- | :--- | :--- | :--- |
| **Server DB** | `10.200.210.236` | PostgreSQL Database (2,9jt LP, 11,4jt pihak, 5,9jt BB) | **DILARANG KERAS** disentuh AI | Murni untuk stabilitas IOPS database & query data. |
| **Server FE** | `10.200.210.232` | Frontend Web Nginx / Web View | **PILIHAN UTAMA (PRIMARY TARGET)** | Beban kerja FE paling santai (idle). Ideal menampung engine AI lokal `Coserse 1.0` agar terpisah total dari database. |
| **Server BE** | `10.200.210.233` | NestJS API, Redis, MinIO, Auth | **TARGET ALTERNATIF (BACKUP PLAN)** | Hanya jika Server FE terkendala akses SSH. Menggunakan isolasi ketat CPU Affinity (Core 8–15 khusus AI, Core 0–7 khusus BE). |

### Arsitektur Aliran Data:
1. Pengguna membuka Web CAS di **Server FE (`.232`)**.
2. Pertanyaan chat diproses langsung oleh engine AI lokal **Coserse 1.0** di Server FE.
3. Jika butuh data profiling LP / NIK / No HP, Server FE memanggil API internal ke **Server BE (`.233`)** lewat jaringan privat super cepat (latensi < 0.2 ms).
4. **Server DB (`.236`)** tetap aman, dingin, dan tidak akan pernah terbebani proses komputasi AI.

| Komponen Hardware | Spesifikasi Riil Server | Kapasitas Terpakai Saat Ini | Kapasitas Tersedia untuk Coserse |
| :--- | :--- | :--- | :--- |
| **Processor (CPU)** | Intel(R) Xeon(R) CPU E5-2699 v3 @ 2.30GHz (16 vCPU) | Load rata-rata ~15% - 25% | **Sangat Cukup** (Dapat dialokasikan 6–8 Core khusus AI worker) |
| **RAM (Memory)** | 32 GB DDR4 ECC Reg | Terpakai: 3.2 GB (Aplikasi + DB) | **Tersedia 28 GB Bebas** (Model 7B Q4 hanya butuh ~5.5 GB) |
| **Storage (Disk)** | 1.000 GB NVMe SSD | Terpakai: 61 GB (7%) | **Tersedia 895 GB Bebas** |
| **GPU (Akselerator)** | *Tidak Tersedia (No Dedicated GPU)* | - | Wajib menggunakan teknik inferensi **CPU Quantized GGUF** |
| **Sistem Operasi** | Linux x86_64 (Enterprise Linux / Ubuntu Server) | Kernel modern | Mendukung AVX2 / FMA instruction set |

### Kesimpulan Kelayakan Hardware:
Server eksisting **sangat layak** menjalankan model berskala 7 Miliar Parameter (7B) dengan teknik kuantisasi Q4/Q5 pada CPU murni tanpa mengorbankan performa aplikasi web utama BDB.

---

## 2. Pemilihan Model Bahasa (LLM Selection)

### 2.1 Perbandingan Kandidat Model Terbuka (Open Weights)

| Model | Parameter | Kuantisasi | Ukuran File | Kebutuhan RAM | Karakteristik & Kelayakan di Bareskrim |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Qwen 2.5 Instruct** ⭐ *(Pilihan Terpilih)* | **7.6B** | **Q4_K_M** | **4.68 GB** | **~5.8 GB** | • **Skor Bahasa Indonesia Tertinggi** di antara model open-source.<br>• **Kemampuan Function Calling / JSON Formatting Terbaik** (Akurasi 94%+).<br>• Kecepatan di CPU 16-Core: **12–18 token/detik** (Cepat untuk respon chat). |
| **Llama 3.1 Instruct** | 8.0B | Q4_K_M | 4.92 GB | ~6.2 GB | Bagus untuk penalaran logika umum, namun kemampuan pemahaman istilah hukum/akronim Indonesia masih di bawah Qwen 2.5. |
| **Mistral Instruct v0.3** | 7.2B | Q4_K_M | 4.37 GB | ~5.5 GB | Cepat, namun kurang stabil dalam mengekstrak format JSON bertingkat (*nested schema*). |
| **DeepSeek-R1-Distill-Qwen** | 7B / 8B | Q4_K_M | 4.7 GB | ~6.0 GB | Bagus untuk penalaran matematis, namun cenderung menghasilkan tag `<think>` panjang yang memperlambat respon penyidik. |

### 2.2 Spesifikasi Model Terpilih (Standardized Asset)
- **Nama Resmi Model Lokal (Internal Polri)**: **`Coserse 1.0`** (Branding resmi di UI Dashboard CAS dan API lokal).
- **Mesin Dasar (Base Engine)**: `Qwen 2.5 Instruct 7B` (GGUF Quantization `Q4_K_M`).
- **File Asset di Server**: `coserse-1.0-q4_k_m.gguf` (Alias dari `qwen2.5-7b-instruct-q4_k_m.gguf`).
- **Context Length**: 8.192 tokens (Dikonfigurasi 4.096 tokens untuk menghemat alokasi memori CPU cache).
- **Format Prompt**: ChatML (`<|im_start|>system...<|im_end|>`)
- **Gaya Komunikasi & Persona (Natural Human-Like Police Tone)**:
  - **Persona**: Mitra/rekan kerja serse senior yang ramah, taktis, cerdas, solutif, dan luwes (tidak kaku seperti mesin penjawab otomatis/IVR).
  - **Prinsip Tutur Kata**:
    - **Panggilan Spesifik & Personal**: Selalu sebut nama atau handle akun pengguna secara dinamis (misal: `@om.eko_42`, `@ahmad_reskrim`, atau nama depannya). Hindari tebakan kaku seperti "Bro/Ndan/Bapak/Ibu" agar terasa nyata dan akrab di platform CAS.
    - Jika menolak atau membatasi akses karena wewenang role, sampaikan secara cair dan bersahabat:
      > *"Waduh mohon izin nih @om.eko_42, untuk data perkara satker sebelah itu akun kamu belum punya izin aksesnya. Coba minta tolong atau calling Admin Binops dulu biar dibukain pintunya ya! Ada hal lain yang mau kita cek bareng?"*
    - Mengalir natural, tidak bertele-tele, tidak mengulang template salam berkali-kali di setiap balon chat.
    - Menghindari kalimat template birokratis kaku seperti *"Sistem mendeteksi bahwa otorisasi Anda tidak mencukupi."* atau *"Saya adalah program komputer."*

---

## 3. Arsitektur Topologi Internal & Isolasi Layanan

```
+--------------------------------------------------------------------------------------------------+
|                                    INTERNAL SERVER ENVIRONMENT                                   |
|                                                                                                  |
|   [ Internet / WAN ]  <--- DIBLOKIR TOTAL UNTUK MODEL RUNTIME (AIR-GAPPED COMPLIANT)             |
|                                                                                                  |
|   +--------------------------+          +-------------------------+                              |
|   |   BDB Web & API Server   |          |  PostgreSQL Database    |                              |
|   |   (NestJS Port 3000)     | <----->  |  (big_data_binops:5432) |                              |
|   +--------------------------+          +-------------------------+                              |
|                |                                                                                 |
|                | (HTTP Localhost Only / IPC)                                                     |
|                v                                                                                 |
|   +-------------------------------------------------------------+                                |
|   |            COSERSE INFERENCE RUNTIME (127.0.0.1:11434)      |                                |
|   |  - Engine: Ollama / Llama.cpp CPU Runner                    |                                |
|   |  - Thread Pool: 8 Core Allocated                            |                                |
|   |  - Bind Address: 127.0.0.1 (Tidak dapat diakses dari luar)  |                                |
|   |  - Model Loaded: Qwen 2.5 7B Q4_K_M in RAM (Zero Cloud)     |                                |
|   +-------------------------------------------------------------+                                |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Konfigurasi Threading CPU
- Total CPU: 16 Core.
- Alokasi untuk Web Service & PostgreSQL: **8 Core**.
- Alokasi untuk Coserse LLM Runner: **8 Core** (`OLLAMA_NUM_PARALLEL=2`, `NUM_THREADS=8`).
- Dengan konfigurasi ini, saat model berpikir keras memproses dokumen panjang, performa input LP atau dashboard pimpinan BDB tidak akan mengalami penurunan (*no bottleneck*).

---

## 4. Simulasi Skalabilitas & Efisiensi Penyimpanan (50.000 Pengguna)

### 4.1 Penetapan Kuota Realistis (10 MB – 50 MB per User)
Secara teknis, teks percakapan dan ekstraksi dokumen hukum berukuran sangat ringkas (1 halaman teks ~2 KB). Penetapan kuota **10 MB hingga 50 MB per pengguna** adalah angka yang sangat ideal dan realistis:

- **Alokasi per User**: **10 MB (Standar) – 50 MB (Maksimal)**.
- **Kebutuhan Nyata untuk 50.000 Pengguna**:
  - Jika rata-rata 10 MB: $50.000 \times 10\text{ MB} = \mathbf{500\text{ GB (Hanya 0,5 TB)}}$.
  - Jika batas maksimal 50 MB: $50.000 \times 50\text{ MB} = \mathbf{2,5\text{ TB (Hanya 2,5% dari 100 TB)}}$.

### 4.2 Keuntungan Arsitektur Storage Ringan Ini:
1. **Penyimpanan Server Sangat Lega**: 97,5 TB (97,5%) tetap bebas untuk data utama LP, barang bukti, foto tersangka, dan backup database Bareskrim.
2. **Kinerja Redis & Query Super Kencang**: Ukuran memori chat yang kecil (10–50 MB) disimpan di **Redis RAM In-Memory Store** (bukan PostgreSQL DB), membuat pemanggilan riwayat sesi berlangsung dalam hitungan mikrodetik (*sub-millisecond latency*).
3. **Pembersihan Instan**: Sekali klik tombol `[🗑️ Hapus Memori]`, eksekusi `DEL` langsung mengosongkan beban 10–50 MB kembali ke 0 MB seketika tanpa meninggalkan fragmentasi tabel di database.
4. **Pencatatan Tingkah Laku Aman**: Setiap interaksi tetap terpantau melalui integrasi **Audit Log Backend** (`bdb_audit_log`) tanpa membebani disk IOPS.
5. **Batas Token Sesi (Model Jeda 5 Jam & Mingguan - 100% Gratis)**:
   - Diterapkan pembatasan ritme kerja ala platform AI modern (jendela **kuota per 5 jam** dan **reset mingguan setiap Senin**).
   - Menjaga antrean komputasi CPU 16-Core server tetap dingin dan memproteksi kesehatan penyidik agar tidak bekerja non-stop di depan layar (mencegah kelelahan dan kesalahan penanganan perkara).
   - Tombol *Emergency Token Override* hanya bisa dibuka oleh Superadmin/Admin Binops jika ada kasus atensi pimpinan mendesak.
