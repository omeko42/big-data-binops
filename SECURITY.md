# Kebijakan Keamanan & Arsitektur Kriptografi / Security Policy & Cryptographic Architecture

> 🌐 **Daftar Isi / Sections:** [**🇮🇩 Bagian I: Bahasa Indonesia**](#-bagian-i-kebijakan-keamanan--arsitektur-kriptografi-bahasa-indonesia) &nbsp;|&nbsp; [**🇬🇧 Part II: English Version**](#-part-ii-security-policy--cryptographic-architecture-english)

---

## 🇮🇩 Bagian I: Kebijakan Keamanan & Arsitektur Kriptografi (Bahasa Indonesia)

### 1. Kepatuhan Regulasi & Perlindungan Data
Platform **Big Data Binops (BDB)** dan ekosistem **CAS (*Community Anggota Serse*)** dirancang serta dioperasikan sesuai dengan standar kepatuhan:
- **Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**
- **Peraturan Polri Nomor 4 Tahun 2025 & Peraturan Kapolri Nomor 6 Tahun 2019**
- **Standar Keamanan Sistem Elektronik di Lingkungan Bareskrim Polri**

Seluruh rekaman operasional perkara (*Laporan Polisi*) diisolasi secara ketat berdasarkan hierarki kewilayahan (**Mabes Polri $\to$ Polda $\to$ Polres $\to$ Polsek**) dan taksonomi kamar direktorat penyidikan (`INTERNAL_RESERSE` vs `EKSTERNAL_RESERSE`).

### 2. Autentikasi Berlapis & Kontrol *Zero-Trust*
- **Passkey Perangkat Keras FIDO2 / WebAuthn**:
  - Mewajibkan verifikasi biometrik/PIN perangkat (`userVerification: 'required'`) baik pada saat pendaftaran maupun autentikasi masuk.
  - Memvalidasi tantangan kriptografis (*challenge*) yang diekstrak langsung dari `clientDataJSON` terhadap tabel tantangan sekali pakai berbatas waktu di server (`auth_passkey_challenges`).
  - Melacak penghitung tanda tangan kriptografis (*signature counter*) guna mendeteksi upaya penggandaan kunci (*cloned authenticator*).
- **Otorisasi Bertingkat (*Step-Up Multi-Factor Verification*)**:
  - Tindakan sensitif pada akun kedinasan (seperti pencabutan akses gawai terpercaya melalui `DELETE /api/Authentication/passkey/devices/:id` pada fitur **Otorisasi Cabut Akses Gawai**) wajib melalui verifikasi berlapis menggunakan **Kata Sandi Akun**, **PIN Keamanan 6 Digit**, atau **Kode TOTP RFC 6238 (Google Authenticator)**.
- **Pemutusan Sesi Instan Lintas Tab (*Cross-Tab Session Termination*)**:
  - Peristiwa keluar (*logout*) atau pergantian akun langsung disiarkan ke seluruh tab peramban yang terbuka melalui `BroadcastChannel` dan `localStorage`, sekaligus membersihkan penyimpanan lokal `IndexedDB` (`bdb_offline_db`), `sessionStorage`, dan `CacheStorage`.

### 3. Perimeter API & Sanitasi Kerahasiaan Repositori (*Zero-Secret Policy*)
- **Penyandian Identitas Opaque AES-GCM (`id-cipher.util.ts`)**: Kunci primer numerik internal dienkripsi menjadi token *opaque* aman-URL (`pid`) untuk mencegah enumerasi ID berurutan.
- **Pembatasan Laju (*Rate Limiting*) & Daftar Putih IP (*IP Whitelisting*)**: Gateway integrasi eksternal menerapkan batas laju *sliding-window* (120 permintaan/menit) serta penguncian daftar putih IP per klien.
- **Kebersihan Kredensial (*Zero-Secret Repository*)**: Tidak ada satupun kunci rahasia produksi (`JWT_SECRET`), kata sandi basis data, kunci MinIO, kunci privat SSL/TLS, maupun alamat IP internal server yang disimpan di dalam repositori ini. Gunakan [`.env.example`](.env.example) dan [`backend/.env.bdb.example`](backend/.env.bdb.example) sebagai acuan konfigurasi.

---

## 🇬🇧 Part II: Security Policy & Cryptographic Architecture (English)

### 1. Compliance & Data Protection
The **Big Data Binops (BDB)** platform — powered by **CAS (*Community Anggota Serse*)** — is architected in strict compliance with:
- **Indonesian Personal Data Protection Act (UU No. 27 Tahun 2022 / UU PDP)**
- **Polri Regulation No. 4 of 2025 (Perpol 4/2025) & Chief of Police Regulation No. 6 of 2019 (Perkap 6/2019)**
- **Bareskrim Polri Electronic System Security Standards**

All operational case records (*Laporan Polisi*) are strictly isolated by 4-tier territorial hierarchy (**Mabes $\to$ Polda $\to$ Polres $\to$ Polsek**) and functional directorate taxonomy.

### 2. Authentication & Zero-Trust Controls
- **FIDO2 / WebAuthn Hardware Passkeys**:
  - Enforces `userVerification: 'required'` on both registration and authentication ceremonies.
  - Validates exact cryptographic challenges extracted directly from `clientDataJSON` against single-use, time-bounded server challenges (`auth_passkey_challenges`).
  - Tracks authenticator signature counters (`counter`) to detect cloned authenticators.
- **Multi-Factor Step-Up Verification**:
  - Sensitive account operations (such as revoking a trusted device via `DELETE /api/Authentication/passkey/devices/:id`) require explicit step-up verification via **Account Password**, **6-Digit Security PIN**, or **RFC 6238 TOTP (Google Authenticator)**.
- **Cross-Tab Session Termination**:
  - Logout events broadcast immediately across all open browser tabs via `BroadcastChannel` and `localStorage` event listeners, purging local `IndexedDB` (`bdb_offline_db`), `sessionStorage`, and `CacheStorage` artifacts.

### 3. API Perimeter & Zero-Secret Hygiene
- **Opaque Identifier Encryption (`id-cipher.util.ts`)**: Internal numeric primary keys are encrypted into URL-safe opaque tokens (`pid`) to prevent sequential ID enumeration.
- **Rate Limiting & IP Whitelisting**: External integration endpoints enforce sliding-window rate limits (120 requests/minute) and per-client IP whitelist guards.
- **Zero-Secret Hygiene**: No production secrets, database passwords, private keys, or internal server IP addresses are stored in this repository. Copy [`.env.example`](.env.example) to `.env` for local or staging deployments.
