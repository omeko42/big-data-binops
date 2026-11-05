# Kebijakan Keamanan & Sanitasi Data / Security & Data Sanitization Policy — Big Data Binops (BDB)

> 🌐 **Sections:** [**🇮🇩 Bahasa Indonesia**](#-bagian-i-kebijakan-keamanan--sanitasi-data-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 English Version**](#-part-ii-security--data-sanitization-policy-english)

---

## 🇮🇩 Bagian I: Kebijakan Keamanan & Sanitasi Data (Bahasa Indonesia)

Repositori **`Big Data Binops (BDB) — Powered by CAS (Community Anggota Serse)`** menerapkan standar **Zero-Secret Repository** dan kepatuhan ketat terhadap **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**:

1. **Tanpa Data Perkara atau Identitas Pribadi (0% PII)**:
   - Repositori ini hanya memuat kerangka arsitektur aplikasi, skema DDL kosong (`database/schema/000_live_production_schema.sql`), migrasi struktural, dan dokumentasi teknis umum.
   - Tidak ada data Laporan Polisi nyata, NIK, NRP personel riil, maupun dokumen perkara yang disertakan di dalam repositori.
2. **Tanpa Kredensial & Topologi Privat (0% Secrets)**:
   - Seluruh kata sandi basis data, kunci `JWT_SECRET`, kunci API, sertifikat privat TLS, serta alamat IP/domain internal produksi dikecualikan dari repositori dan hanya dikonfigurasi melalui *Environment Variables* (`.env`) di server internal.
3. **Arsitektur Keamanan Berlapis (*Defense-in-Depth*)**:
   - Autentikasi perangkat keras **FIDO2 / WebAuthn Passkey**, **TOTP 2FA (RFC 6238)**, **PIN 6 Digit**, **OTP Email Multi-SMTP**, serta **Captcha Hybrid (Proof-of-Work + SVG)**.
   - Enkripsi ID buram (**AES-GCM Opaque ID Cipher**) pada endpoint eksternal dan pencatatan jejak audit permanen di `bdb_audit_log`.
   - Isolasi hak akses berbasis peran (`superadmin`, `admin`, `operator`, `sharese`, dan mode *Read-Only* `testing`).

### Pelaporan Kerentanan (*Vulnerability Disclosure*)
Apabila Anda menemukan potensi celah keamanan pada arsitektur atau kode sumber di repositori ini, mohon laporkan secara bertanggung jawab melalui kanal resmi **Tim Pokja Big Data Binops (BDB) Robinopsnal Bareskrim Polri** atau fitur **Lapor Bug & Kendala Sistem** di dalam aplikasi (jangan membuka *public issue* yang memuat detail eksploitasi).

---

## 🇬🇧 Part II: Security & Data Sanitization Policy (English)

The **`Big Data Binops (BDB) — Powered by CAS (Community Anggota Serse)`** repository strictly enforces a **Zero-Secret Repository** policy and full compliance with **Indonesian Personal Data Protection Law (Law No. 27/2022 — UU PDP)**:

1. **Zero Live Case Data or Citizen PII (0% PII)**:
   - This repository contains only application architecture, empty relational DDL schemas (`database/schema/000_live_production_schema.sql`), structural SQL migrations, and general technical documentation.
   - No live Police Reports, citizen NIKs, real personnel NRPs, or investigation dossiers are stored in this repository.
2. **Zero Hardcoded Credentials or Internal Topology (0% Secrets)**:
   - All database passwords, `JWT_SECRET` keys, API secrets, TLS private keys, and internal production IPs/domains are excluded from version control and injected exclusively via isolated environment variables (`.env`).
3. **Defense-in-Depth Security Controls**:
   - **FIDO2 / WebAuthn Hardware Passkeys**, **RFC 6238 TOTP 2FA**, **6-Digit Security PIN**, **Multi-SMTP Email OTP**, and **Hybrid Proof-of-Work + SVG Captcha**.
   - **AES-GCM Opaque ID Ciphers** on external URLs and immutable forensic logging in `bdb_audit_log`.
   - Strict Role-Based Access Control (`superadmin`, `admin`, `operator`, `sharese`, and read-only `testing`).

### Responsible Disclosure
To report a security finding or architectural vulnerability, please contact the **Bareskrim Polri Big Data Binops (BDB) Working Group** directly or use the in-app **Bug Report** channel rather than opening a public GitHub issue.
