# BUKU PANDUAN UTAMA ARSITEKTUR & IMPLEMENTASI COSERSE (AI AGENT CAS)
## Modul AI Agent Asisten Pintar Penyidik & Analitik Terpadu Reserse Polri

> **Klasifikasi**: RAHASIA / TERBATAS (Untuk Lingkungan Internal Polri)  
> **Sistem Induk**: Big Data Binops (BDB) / Community Anggota Serse (CAS) &mdash; Bareskrim Polri  
> **Prinsip Utama**: Zero Data Leakage, 100% On-Premise, Safe Sandbox, Ephemeral Memory, Human-in-the-Loop  
> **Versi Cetak**: 1.0-PROD  
> **Tanggal**: November 2026  

---

## 1. Daftar Dokumen Panduan (Folder Blueprint)
Seluruh spesifikasi teknis dan panduan deployment telah dikompulir secara modular di dalam folder ini:

1. [01_SECURITY_AND_GOVERNANCE_SPEC.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/01_SECURITY_AND_GOVERNANCE_SPEC.md)  
   *Standar Keamanan Siber, Proteksi Upload (Magic Byte & Sandbox), Sanitasi Anti-Prompt Injection, Ephemeral Memory (TTL & Purge).*
2. [02_SYSTEM_ARCHITECTURE_AND_SPECS.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/02_SYSTEM_ARCHITECTURE_AND_SPECS.md)  
   *Arsitektur Sistem On-Premise, Benchmark Spek Server Existing (Xeon 16-Core, 32GB RAM), Pemilihan Model (Qwen 2.5 7B Q4 GGUF), dan Topologi Jaringan Lokal.*
3. [03_CROSS_PROFILING_AND_DATA_SPEC.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/03_CROSS_PROFILING_AND_DATA_SPEC.md)  
   *Spesifikasi Multi-Entity Profiling (Korelasi NIK, No HP, Akun Medsos, Rekening Bank, Plat Nomor pada 11,4 Juta Data Pihak Terlibat & 5,9 Juta Barang Bukti).*
4. [04_DOCUMENT_PARSING_AND_HUMAN_IN_THE_LOOP.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/04_DOCUMENT_PARSING_AND_HUMAN_IN_THE_LOOP.md)  
   *Alur Pembacaan Dokumen Mindik (SPDP, Tahap I, Tahap II dsb.), Ekstraksi Entitas Otomatis, dan Mekanisme Konfirmasi Interaktif (Human-in-the-Loop).*
5. [05_DEPLOYMENT_AND_REPOS_REFERENCE.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/05_DEPLOYMENT_AND_REPOS_REFERENCE.md)  
   *Panduan Langkah-demi-Langkah Deployment untuk AI/Engineer (Ollama, Systemd, Reverse Proxy, NestJS Integration), beserta Kurasi Repositori Open-Source Resmi & Aman.*
6. [06_AIOPS_AND_RESOURCE_GOVERNOR.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/06_AIOPS_AND_RESOURCE_GOVERNOR.md)  
   *Spesifikasi Modul AIOps: Penjadwalan Adaptif Berbasis Beban CPU, Smart Chunking Agregasi 11,4 Juta Data, dan Early Warning / Self-Healing Anti-Hang ke Superadmin via Chat.*
7. [MASTER_PROMPTS_AND_PHASES.md](file:///d:/Prototype%20CAS/EDIT%20MASTER%20MASAL/docs/coserse_blueprint/MASTER_PROMPTS_AND_PHASES.md)  
   *Panduan Master Prompt Siap Pakai per Tahap, Komposisi 3 Peran Engineer, dan Alur Kerja Eksekusi Sandbox-First yang Hemat Token.*

---

## 2. Ringkasan Eksekutif & Roadmap Implementasi

```
                    +------------------------------------------+
                    |          COSERSE BLUEPRINT ARCH          |
                    +------------------------------------------+
                                         |
     +-------------------+---------------+-------------------+
     |                   |                                   |
     v                   v                                   v
[1. KEAMANAN]     [2. CORE ENGINE]                  [3. WORKFLOW ACTION]
- Memory Purge    - Qwen 2.5 7B Q4 GGUF             - Profiling 11.4jt Orang
- Magic Byte      - CPU 16-Core (RAM 5.8GB)         - Ekspor Anev Otomatis
- Anti-Injection  - Llama.cpp / Ollama Local        - Mindik Parser + Approval
- Zero Disk Leak  - No External Internet            - Human Confirmation Card
```

---

## 3. Alur Kerja Pengerjaan Proyek (Project Delivery Workflow - BUKAN Alur AI)

Untuk menjaga stabilitas server produksi dan menghemat limit token, pengerjaan proyek oleh developer / AI Agent **WAJIB** mengikuti tata kelola bertahap berikut:

```
[TAHAP 1: LOKAL / SANDBOX]
  • Kerjakan modul backend & query service murni di direktori lokal / branch sandbox.
  • Uji coba endpoint via Postman / curl di localhost (port lokal).
  • TIDAK MENYENTUH container / database produksi.
           |
           v (Lolos Uji & Disetujui User)
[TAHAP 2: TESTING LOKAL OLEH USER]
  • User mencoba langsung fitur di localhost browser (nyeret file, nanya chat, profiling).
  • Memastikan gaya bahasa @username dan batas kuota 10-50 MB berfungsi.
           |
           v (User Mengatakan "Oke, Siap Deploy")
[TAHAP 3: STAGED DEPLOYMENT KE SERVER PRODUKSI]
  • Build dan deploy service ke server target (sesuai isolasi beban).
  • Sakelar Fitur (Feature Toggle) diaktifkan HANYA untuk role Superadmin.
  • Evaluasi beban CPU 16-Core & telemetri (anti-hang).
           |
           v (Server Stabil & Dingin)
[TAHAP 4: ROLLOUT BERTAPAP]
  • Buka sakelar untuk role Admin Binops & Operator Wilayah.
```

Aturan Pengerjaan:
1. **Kerja Per Tahap Kecil**: Selesaikan satu modul sampai tuntas dan teruji di localhost sebelum meminta izin lanjut ke modul berikutnya.
2. **Zero Production Risk**: Dilarang langsung mengubah file di server live tanpa melalui tahap verifikasi lokal terlebih dahulu.
