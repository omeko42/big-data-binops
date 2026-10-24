# Lisensi Kedinasan, Perjanjian Kerahasiaan (NDA) & Standar Layanan (SLA) / Institutional License, NDA & SLA — Big Data Binops (BDB) — Powered by CAS (*Community Anggota Serse*)

> 🌐 ** Pilih Bahasa / Select Language:** [**🇮🇩 Bagian I: Bahasa Indonesia (Lengkap)**](#-bagian-i-lisensi-kedinasan-nda--sla-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version (Complete)**](#-part-ii-institutional-license-nda--sla-english)

---

## 🇮🇩 Bagian I: Lisensi Kedinasan, NDA & SLA (Bahasa Indonesia)

**Hak Cipta © 2024–2026 Eko Agung (`@omeko42`)**  
**Biro Pembinaan dan Operasional (Robinopsnal) Bareskrim Polri & Komunitas Operasional CAS (*Community Anggota Serse*)**  
*Seluruh Hak Dilindungi Undang-Undang (All Rights Reserved).*

---

### 1. Hak Cipta Rekayasa & Kepemilikan Arsitektur
Kode sumber, rancangan skema basis data (*171 tabel produksi*), algoritma rekonsiliasi 4 tingkat kewilayahan, mesin *snapshot* analitik berkecepatan tinggi, layanan mikro otomatisasi dokumen Jukminu Polri, serta seluruh dokumentasi teknis pada repositori **`Big Data Binops (BDB) — Powered by CAS (Community Anggota Serse)`** ini dirancang dan dibangun oleh **Eko Agung (`@omeko42`)** dalam rangka modernisasi dan kedaulatan tata kelola data operasional di lingkungan **Biro Pembinaan dan Operasional (Robinopsnal) Bareskrim Polri**.

### 2. Hak Penggunaan Kedinasan Resmi (Polri)
**Kepolisian Negara Republik Indonesia (Polri)** — khususnya **Badan Reserse Kriminal (Bareskrim Polri)** beserta seluruh jajaran Direktorat Reserse Polda, Satuan Reserse Polres, dan Unit Reskrim Polsek yang tergabung dalam ekosistem **CAS (*Community Anggota Serse*)** — memiliki hak penuh dan tidak terbatas untuk menggunakan, mengoperasikan, mengaudit, dan mengembangkan sistem ini bagi kepentingan resmi penegakan hukum, pembinaan operasional, dan pelayanan masyarakat.

### 3. Perjanjian Kerahasiaan & Kepatuhan Sanitasi Data (*Non-Disclosure Agreement / NDA*)
Seluruh pengelolaan sistem produksi maupun publikasi referensi arsitektur pada repositori ini tunduk secara ketat pada ketentuan **Perjanjian Kerahasiaan (*Non-Disclosure Agreement / NDA*)** dan peraturan perundang-undangan Republik Indonesia (**UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi / UU PDP**, **UU ITE**, serta **Perpol No. 4 Tahun 2025**):

| Kategori Objek | Status Kerahasiaan (NDA) | Ketentuan Hukum & Teknis |
| :--- | :--- | :--- |
| **Data Operasional & Perkara Nyata** (*Isi Laporan Polisi, BAP, Identitas NIK/NRP Pelapor, Saksi, & Tersangka*) | 🔒 **RAHASIA PENUH (*Strictly Confidential under NDA*)** | **Dilarang keras** disalin, dibocorkan, atau dipublikasikan ke luar jaringan internal Polri.Repositori GitHub ini **0% memuat data perkara atau PII masyarakat**. |
| **Kredensial, Kunci Kriptografi & Topologi Jaringan** (*Password DB, JWT Secret, API Key, Alamat IP Privat `10.200.x.x`*) | 🔒 **RAHASIA INFRASTRUKTUR (*Strictly Confidential under NDA*)** | Dilindungi oleh kebijakan *Zero-Secret Commit*. Seluruh kredensial produksi disuntikkan melalui *Environment Variables* terisolasi di server internal. |
| **Akses Mitra Integrasi Eksternal (`/api/external/v1/*`)** | 🛡️ **TERIKAT NDA & PKS RESMI** | Kementerian/Lembaga atau mitra yang mengakses API Keluar wajib menandatangani Perjanjian Kerja Sama (PKS) dan NDA resmi serta menggunakan kunci `X-API-Key` ber-kuota dan ber-audit. |
| **Kerangka Arsitektur, Skema DDL Kosong & Dokumentasi Rekayasa** *(Isi Repositori Ini)* | 📖 **PUBLIKASI PORTOFOLIO TERBATAS (*Sanitized Portfolio Reference*)** | Diizinkan untuk ditinjau secara terbuka sebagai bukti portofolio rekayasa perangkat lunak (*Full-Stack Engineering & System Architecture*) dengan tetap menghormati hak cipta. |

### 4. Standar Tingkat Layanan Operasional (*Service Level Agreement / SLA*)
Dalam operasional produksi di lingkungan klaster server internal (**Dual-Node Production Cluster**), platform **Big Data Binops (BDB)** menerapkan target **Standar Tingkat Layanan (SLA)** berikut:

| Parameter Layanan (SLA) | Target Metrik Produksi | Mekanisme Rekayasa Pendukung |
| :--- | :--- | :--- |
| **Ketersediaan Layanan (*System Uptime SLA*)** | **`99,9%` (*High Availability*)** | Arsitektur **32 Worker PM2 Cluster (`bdb-api`)** tanpa henti (*zero-downtime reload*) di server 32-core dengan isolasi beban antara Node 1 (Web/Docs) dan Node 2 (API/DB). |
| **Kecepatan Analitik Nasional (*Analytical Latency SLA*)** | **`< 100 milidetik`** | Mesin tabel *Pre-Computed Snapshot* (`bdb_kinerja_perkara_snapshot` — 2,11+ juta baris) dengan sinkronisasi *trigger* PL/pgSQL dan *PostgreSQL Advisory Locks*. |
| **Kecepatan Pencarian Lintas Jutaan LP (*Search Latency SLA*)** | **`< 500 milidetik`** | Indeks komposit `B-Tree` dan indeks *trigram* `GIN (pg_trgm)` pada **433 indeks aktif** di PostgreSQL. |
| **Pemulihan & Ketahanan Data (*RPO & RTO SLA*)** | **RPO ≈ `0 detik` \| RTO `< 15 menit`** | Penyimpanan *staging* JSONB *immutable* (`bdb_dors_raw_lp`) yang menjamin *Zero Data Loss*, ditambah *cron* rekonsiliasi otomatis harian (`00:05 WIB`). |
| **Respons Insiden & Dukungan Komunitas CAS (*Support SLA*)** | **Kritis `< 1 Jam` \| Taktis `< 24 Jam`** | Pemantauan langsung melalui lingkar komunikasi taktis **CAS (*Community Anggota Serse* — 1.024+ anggota)** dan kanal internal **SHARESE**. |

### 5. Pembatasan & Larangan Keras (*Strict Prohibitions*)
Perangkat lunak ini **BUKAN** perangkat lunak bebas komersial (*bukan MIT / Apache Open-Source*). Tanpa izin tertulis dari Pemegang Hak Cipta dan/atau otoritas resmi Bareskrim Polri, pihak mana pun di luar ketentuan Pasal 2 **DILARANG KERAS**:
1. **Memperjualbelikan (*Commercialization Prohibited*)**: Menyalin, mengemas ulang, menyewakan, atau menjual kode sumber, skema basis data, maupun layanan mikro dokumen di dalam repositori ini untuk keuntungan komersial atau proyek vendor pihak ketiga.
2. **Memalsukan Atribut Institusi (*Impersonation Prohibited*)**: Menggunakan nama, lambang, kop surat, atau nomenklatur **Bareskrim Polri**, **Robinopsnal**, **Big Data Binops (BDB)**, maupun **CAS (*Community Anggota Serse*)** untuk membuat aplikasi tiruan yang menyesatkan publik.
3. **Klaim Kepemilikan Tanpa Atribusi (*Plagiarism Prohibited*)**: Menghapus atribusi hak cipta atau mengklaim arsitektur sistem ini sebagai karya pihak lain.

---

## 🇬🇧 Part II: Institutional License, NDA & SLA (English)

**Copyright © 2024–2026 Eko Agung (`@omeko42`)**  
**Bureau of Operational Management (Robinopsnal) — Criminal Investigation Agency of the Indonesian National Police (Bareskrim Polri) & CAS (*Community Anggota Serse*)**  
*All Rights Reserved.*

---

### 1. Engineering Copyright & Architectural Ownership
The source code, relational database DDL schema (*171 active production tables*), 4-tier territorial reconciliation algorithms, high-speed analytical snapshot engine, Python Jukminu document automation microservice, and technical documentation contained in this **`Big Data Binops (BDB) — Powered by CAS (Community Anggota Serse)`** repository were architected and engineered by **Eko Agung (`@omeko42`)** to establish sovereign operational data governance within **Biro Pembinaan dan Operasional (Robinopsnal) Bareskrim Polri**.

### 2. Official Institutional Usage Rights (Polri)
The **Indonesian National Police (Polri)** — specifically the **Criminal Investigation Agency (Bareskrim Polri)** and all Regional (`Polda`), Municipal (`Polres`), and Sectoral (`Polsek`) criminal investigation units operating within the **CAS (*Community Anggota Serse*)** ecosystem — holds full, unrestricted rights to deploy, operate, audit, and extend this platform for official law enforcement, operational supervision, and public service missions.

### 3. Non-Disclosure Agreement (NDA) & Data Sanitization Covenant
Both production operations and the publication of sanitized architectural artifacts in this repository are governed by strict **Non-Disclosure Agreement (NDA)** covenants and Indonesian statutory regulations (**Law No. 27/2022 on Personal Data Protection / UU PDP**, **Electronic Information and Transactions Law / UU ITE**, and **Police Regulation No. 4/2025**):

| Asset Category | Confidentiality Classification (NDA) | Legal & Technical Enforcement |
| :--- | :--- | :--- |
| **Live Operational & Case Records** (*Police Reports, Investigation Dossiers, Citizen NIK/NRP, Suspects & Witnesses*) | 🔒 **STRICTLY CONFIDENTIAL (*Protected under NDA*)** | **Strictly prohibited** from unauthorized extraction or public disclosure. This GitHub repository contains **0% live case data or citizen PII**. |
| **Credentials, Cryptographic Keys & Network Topology** (*DB Passwords, JWT Secrets, API Keys, Private IPs `10.200.x.x`*) | 🔒 **INFRASTRUCTURE SECRET (*Protected under NDA*)** | Enforced via our *Zero-Secret Commit Policy*. All live credentials are injected exclusively via isolated environment variables on internal servers. |
| **External Partner API Access (`/api/external/v1/*`)** | 🛡️ **GOVERNED BY FORMAL NDA & MoU** | External ministries, agencies, or integration partners must execute a formal MoU and NDA prior to receiving rate-limited, audited `X-API-Key` credentials. |
| **Sanitized System Architecture, Empty DDL Schema & Engineering Docs** *(This Repository)* | 📖 **AUTHORIZED PORTFOLIO REFERENCE** | Publicly viewable strictly for software engineering portfolio evaluation, architectural peer review, and academic citation with proper attribution. |

### 4. Operational Service Level Agreement (SLA) Standards
In live production across the internal **Dual-Node Production Cluster**, the **Big Data Binops (BDB)** platform is engineered to meet and sustain the following **Service Level Agreement (SLA)** benchmarks:

| SLA Dimension | Production Target | Underlying Architectural Guarantee |
| :--- | :--- | :--- |
| **System Availability (*Uptime SLA*)** | **`99.9%` High Availability** | **32 PM2 Cluster Workers (`bdb-api`)** on a 32-core server with zero-downtime reload and strict workload isolation between Node 1 (Edge/Docs) and Node 2 (Core API/DB). |
| **National Analytical Latency (*Query SLA*)** | **`< 100 ms`** | Pre-computed snapshot tables (`bdb_kinerja_perkara_snapshot` — 2.11M+ rows) maintained via real-time PL/pgSQL triggers and PostgreSQL Advisory Locks. |
| **Multi-Million Row Search Latency** | **`< 500 ms`** | Composite `B-Tree` and trigram `GIN (pg_trgm)` indexing across **433 active PostgreSQL indexes**. |
| **Data Durability & Recovery (*RPO & RTO SLA*)** | **RPO ≈ `0s` \| RTO `< 15 min`** | Immutable JSONB raw staging (`bdb_dors_raw_lp`) guaranteeing *Zero Data Loss*, paired with automated daily reconciliation crons (`00:05 WIB`). |
| **Incident Response & CAS Field Support SLA** | **Critical `< 1 hr` \| Tactical `< 24 hrs`** | Direct real-time reporting and triage through the **1,024+ member CAS (*Community Anggota Serse*)** operational loop and in-app **SHARESE** channel. |

### 5. Strict Prohibitions & Disclaimer
This software is **NOT** licensed under a permissive commercial open-source license (*not MIT / Apache*). Without prior written authorization from the Copyright Holder and/or official **Bareskrim Polri** leadership, any party outside Article 2 is **STRICTLY PROHIBITED** from:
1. **Commercial Redistribution**: Copying, repackaging, sublicensing, or selling the source code, database schema, or document automation microservices for commercial gain or third-party vendor contracts.
2. **Institutional Impersonation**: Using the names, insignia, letterheads, or nomenclature of **Bareskrim Polri**, **Robinopsnal**, **Big Data Binops (BDB)**, or **CAS (*Community Anggota Serse*)** to misrepresent unauthorized software.
3. **Unattributed Misappropriation**: Removing copyright notices or claiming ownership over this system architecture.

*This architectural reference is provided "AS IS" without warranty of any kind, express or implied.*
