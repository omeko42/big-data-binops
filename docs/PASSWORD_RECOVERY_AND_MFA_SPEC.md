# Kajian Keamanan & Spesifikasi Perbaikan: Ubah/Lupa Password, Sinkronisasi Timer OTP, & Passkey (MFA)

Dokumen ini menjadi acuan resmi bagi Engineer Coding untuk membenahi alur **Ubah Password / Lupa Password** serta **Verifikasi Multi-Faktor (OTP Email, PIN, Authenticator TOTP, dan Passkey/WebAuthn)** pada aplikasi **CAS (Big Data Binops)**.

---

## 1. Masalah Operasional & Keamanan yang Ditemukan
1. **User Lupa Password Menyulitkan Operasional:** Selama ini bila user lupa password atau gagal email reset, admin sering terpaksa menghapus akun lama dan membuat akun baru.
2. **Kebutuhan Ubah Password Tanpa Password Lama (Dengan Verifikasi Sekunder):** User yang sudah login (maupun di halaman Lupa Password) membutuhkan opsi mengganti password baru tanpa memasukkan password lama, namun tetap aman apabila perangkat ditinggal terbuka.
3. **Risiko Bug Timer OTP Tidak Sinkron:** Pada banyak implementasi, timer hitung mundur `Kirim Ulang OTP` dan masa berlaku OTP berjalan sendiri-sendiri (misal timer input sudah berkurang sebelum user menekan tombol *Kirim OTP*).
4. **Konsep Biometrik di PC Kantor Tanpa Kamera:** PC Windows/Mac kantor umumnya tidak memiliki kamera IR atau sensor sidik jari. Istilah "Biometrik" di browser modern seharusnya diimplementasikan sebagai **Passkey (WebAuthn / FIDO2)** yang aman di PC tanpa kamera.

---

## 2. Prinsip & Alur Keamanan yang Wajib Diterapkan

### A. Untuk Superadmin (`/cms/master/user`)
- Pastikan tersedia tombol **Reset Password** langsung pada baris pengguna di `/cms/master/user` (hanya untuk role `superadmin`), sehingga admin tidak perlu menghapus akun lama dan membuat akun baru.
- Setiap reset oleh Superadmin wajib tercatat di `bdb_audit_log`.

### B. Ubah Password Tanpa Password Lama (Profil Keamanan & Lupa Password)
**Aturan Mutlak:** Password baru **TIDAK BOLEH** langsung disimpan ke database saat user menekan *Submit/Simpan*. Password baru hanya boleh ditulis ke DB setelah user lolos **minimal 1 metode verifikasi sekunder**.

**Alur 4 Langkah:**
1. **Input Password Baru:** User mengisi *Password Baru* dan *Konfirmasi Password Baru* (memenuhi kebijakan kekuatan password), lalu klik **Lanjut / Simpan**.
2. **Modal Pilih Metode Verifikasi:** Sistem menampilkan pilihan metode verifikasi yang **aktif/terdaftar** pada akun user tersebut:
   - **OTP Email** (Email Dinas `@polri.go.id` / Email Sekunder)
   - **Authenticator App (TOTP 6 digit)** (Google Authenticator / Microsoft Authenticator)
   - **PIN Keamanan (6 digit)**
   - **Passkey / Windows Hello** (WebAuthn / FIDO2)
3. **Eksekusi Verifikasi:** User menyelesaikan verifikasi di modal tersebut.
4. **Commit Perubahan:** Backend memverifikasi token/signature/PIN/TOTP → jika valid, barulah `password_hash` di DB diperbarui, token reset/challenge ditandai terpakai (single-use), dan dicatat ke `bdb_audit_log`.

---

## 3. Aturan Wajib Sinkronisasi Timer OTP (120 Detik / 2 Menit)
1. **Timer Tidak Boleh Jalan Sebelum OTP Dikirim:** Saat user baru memilih metode *OTP Email*, timer masih diam (`00:00` / belum aktif) sampai user menekan tombol **Kirim OTP**.
2. **Mulai Bersamaan Saat Server Merespons Sukses:**
   - Begitu endpoint `Kirim OTP` mengembalikan `200 OK` beserta timestamp `expires_at` (misal `+120 detik`) dan `resend_available_at` (`+120 detik`), frontend memulai **1 timer terpadu** (`remainingSeconds` dihitung dari `expires_at` server).
   - Selama `remainingSeconds > 0`:
     - Kolom **Input OTP** aktif dengan label sisa waktu berlaku (`Berlaku 01:45`).
     - Tombol **Kirim Ulang OTP** dalam keadaan `disabled` dengan hitung mundur yang sama (`Kirim ulang dalam 01:45`).
3. **Setelah Timer Habis (`00:00`):**
   - OTP lama otomatis tidak berlaku, dan tombol **Kirim Ulang OTP** kembali aktif.
4. **Rate Limit Backend:** Tolak spam `Kirim OTP` di backend sebelum `resend_available_at` tercapai (`429 Too Many Requests`), dan batasi percobaan salah input OTP (misal maks 5x).

---

## 4. Kajian Teknis: Biometrik PC = Passkey (WebAuthn / FIDO2)
- **Mengapa Passkey, Bukan Kamera Webcam:** Di web browser modern (Chrome, Edge, Safari), standar keamanan perangkat adalah **WebAuthn / FIDO2 (Passkey)**.
- **Bagaimana di PC Tanpa Kamera/Fingerprint:**
  - Di Windows 11/10, `Windows Hello` otomatis menyesuaikan kemampuan perangkat: jika ada sidik jari/kamera IR memakai biometrik; jika tidak ada kamera, otomatis memakai **PIN Perangkat Windows**, **Security Key USB**, atau **Passkey HP via scan QR (Bluetooth)**.
- **Keamanan:**
  - Private key tersimpan aman di chip keamanan perangkat (TPM / Secure Enclave) dan **tidak pernah dikirim ke server**.
  - Terikat ke domain resmi `cas.bareskrim.polri.go.id` (*anti-phishing*).
  - Challenge dari server wajib bersifat acak, ber-TTL singkat (mis. 120 detik), dan sekali pakai (*single-use*).

---

## 5. Instruksi Implementasi untuk Engineer Coding

1. **Backend (`bdb-api` — Modul Auth & Profile Security):**
   - Pastikan endpoint **Ubah/Reset Password tanpa password lama** menggunakan alur 2-tahap:
     - Simpan *pending password change* sementara di Redis (`TTL 180s`) atau minta `verification_token` hasil verifikasi MFA terlebih dahulu sebelum `UPDATE password_hash`.
   - Sediakan/rapikan verifikasi untuk seluruh metode yang didukung (`otp_email`, `totp_authenticator`, `pin`, `passkey_webauthn`).
   - Pada endpoint `Kirim OTP`, kembalikan `expires_at` dan `cooldown_seconds` (`120`) dari server agar frontend selalu sinkron.
   - Pastikan tombol **Reset Password** oleh `superadmin` di `/cms/master/user` tersedia dan tercatat di `bdb_audit_log`.

2. **Frontend (`profile-security.bundle.js`, `login-otp.bundle.js`, `master-user.bundle.js`):**
   - Tambahkan alur input *Password Baru* (tanpa password lama) -> modal **Pilih Metode Verifikasi** (hanya menampilkan metode yang aktif di akun, dengan label jelas **"Passkey / Windows Hello"** untuk opsi biometrik PC).
   - Sinkronkan timer hitung mundur **120 detik** agar **baru berjalan setelah API `Kirim OTP` sukses**, mengunci tombol `Kirim Ulang` sekaligus menampilkan sisa waktu berlaku input OTP secara bersamaan.

3. **Verifikasi Wajib:**
   - Uji ubah password tanpa password lama memakai **OTP Email**: pastikan timer 120 detik baru jalan setelah klik *Kirim OTP* dan input + tombol kirim ulang berjalan bersamaan.
   - Uji ubah password memakai **PIN**, **Authenticator TOTP**, dan **Passkey / Windows Hello** di PC tanpa kamera.
   - Pastikan password di DB tidak berubah jika modal verifikasi ditutup/dibatalkan sebelum verifikasi sukses.
