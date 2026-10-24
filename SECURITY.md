# Security Policy & Cryptographic Architecture

## 1. Compliance & Data Protection
The **Crime Analytic System (CAS) & Big Data Binops (BDB)** platform is architected in compliance with:
- **Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**
- **Standar Keamanan Sistem Elektronik Bareskrim Polri**

All operational case records (*Laporan Polisi*) are strictly isolated by territorial hierarchy (**Mabes $\to$ Polda $\to$ Polres $\to$ Polsek**) and functional directorate taxonomy.

---

## 2. Authentication & Zero-Trust Controls
- **FIDO2 / WebAuthn Hardware Passkeys**:
  - Enforces `userVerification: 'required'` on both registration and authentication ceremonies.
  - Validates exact cryptographic challenges extracted directly from `clientDataJSON` against single-use, time-bounded server challenges (`auth_passkey_challenges`).
  - Tracks authenticator signature counters (`counter`) to detect cloned authenticators.
- **Multi-Factor Step-Up Verification**:
  - Sensitive account operations (such as revoking a trusted device via `DELETE /api/Authentication/passkey/devices/:id`) require explicit step-up verification via **Account Password**, **6-Digit Security PIN**, or **RFC 6238 TOTP (Google Authenticator)**.
- **Cross-Tab Session Termination**:
  - Logout events broadcast immediately across all open browser tabs via `BroadcastChannel` and `localStorage` event listeners, purging local `IndexedDB` (`bdb_offline_db`), `sessionStorage`, and `CacheStorage` artifacts.

---

## 3. API Perimeter & Data Obfuscation
- **Opaque Identifier Encryption (`id-cipher.util.js`)**: Internal numeric primary keys are encrypted into URL-safe opaque tokens (`pid`) to prevent sequential ID enumeration.
- **Rate Limiting & IP Whitelisting**: External integration endpoints enforce sliding-window rate limits (120 requests/minute) and per-client IP whitelist guards.
- **Secret Hygiene**: No production secrets, database passwords, or private keys are stored in this repository. Copy [`.env.example`](.env.example) to `.env` for local or staging deployments.
