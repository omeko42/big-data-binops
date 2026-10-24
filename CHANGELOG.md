# Changelog — Big Data Binops (BDB) & Community Anggota Serse (CAS)

All notable architectural milestones, feature releases, and production engineering improvements for **Big Data Binops (BDB)** and the **CAS (*Community Anggota Serse*)** platform are documented in this file.

---

## [v2.5.0] — 2026-10 (Current Production Release — Tahap 4: Pendataan Kompleks BDB)

### Added
- **Complete Multi-Node Production Architecture Sync**:
  - Full NestJS 11 backend (`bareskrim_nest_v11`, PM2 32-worker cluster) with `app_core` and all **26 `bdb` operational submodules**.
  - Next.js `16.2.10` + React `19.2.4` standalone frontend portal (`bdb-web`) covering **73 App Router pages** and **21 modular feature bundles**.
  - Dedicated Python 3 **Jukminu Polri & ONLYOFFICE Integration Microservice** (`cas_doc_service.py` on port `3860` + `onlyoffice-ds` on port `8088`) with dynamic Satker/Fungsi *Kop Surat*, `a.n. Pimpinan` signature blocks, NRP/NIP watermarks, and real-time CT/CC sync.
  - Complete live PostgreSQL production schema DDL ([`000_live_production_schema.sql`](database/schema/000_live_production_schema.sql)) covering **171 active tables**, **7 custom PL/pgSQL functions**, **433 indexes**, **5 triggers**, and **90 sequential SQL migrations** (`000`–`089`).
- **FIDO2 / WebAuthn Hardware Passkey & Trusted Device Suite**:
  - Passwordless biometric/hardware key authentication (`@simplewebauthn/server`, `auth_passkeys`, `auth_passkey_challenges`) alongside TOTP 2FA, 6-Digit PIN, Email OTP, and self-service device revocation (*Otorisasi Cabut Akses Gawai*).
- **SOTK Perpol 4/2025 & 4 Bagian Robinopsnal Integration**:
  - Full operational modules for **Bagrenopsnal** (*Operasi Satgas & Sprin/Renops MinIO S3*), **Bagkerma** (*Bank Data MoU/PKS with H-180..H-30 expiration alarms*), **Baganev** (*CT/CP/CC/CR, Perkap 6/2019 SLA Engine, Kasus Menonjol/Atensi, & 5,828 Cross-Province Syndicate Ranking*), and **Bagyanmas** (*Dumas Non-LP & SP2HP*).
  - Support for newly established **Ditres PPA-PPO** (Polda) and **Satres PPA-PPO** (Polres) alongside crime group mappings for conventional TPPO (`782`) and People Smuggling (`783`).

### Fixed & Optimized
- **Nationwide Polsek $\leftrightarrow$ Unit Reskrim Scope Unification**:
  - Unified parent `POLSEK` and child `UNIT RESKRIM POLSEK` access and snapshot rollups across `laporan-polisi.service.ts`, `kinerja-perkara.service.ts`, and `lp-monitoring-access.service.ts`, resolving CT/Sisa discrepancies and operator visibility gaps discovered via **Community Anggota Serse (CAS)** field reports.
- **Non-Blocking Container Startup (`onModuleInit`)**:
  - Decoupled `KinerjaPerkaraService.onModuleInit()` snapshot initialization using `setImmediate()` + PostgreSQL Advisory Locks so `bdb-api` binds port `3850` in $<2\text{ seconds}$ without triggering Nginx 502 Bad Gateway timeouts.
- **Reserse vs. Non-Reserse Snapshot Purity**:
  - Excluded pure traffic offenses (`jenis_kejahatan_id IN (516, 741)`) and non-Reserse units (*Sabhara/Samapta, Polairud, Lantas*) from `bdb_kinerja_perkara_snapshot`, achieving `0` unmapped/review anomalies across Period I & Period II.
- **Chrome Preload Lifecycle Optimization**:
  - Added automated `<link rel="preload">` cleanup observer in the root layout bundle, eliminating 58 browser console warnings on `/cms/*` routes.

---

## [v2.0.0] — 2026-07 to 2026-09 (4-Tier DORS Ingestion & Snapshot Engine)
- Introduced automated 4-Tier DORS Stamaops Polri ingestion (`bdb_dors_raw_lp` $\to$ `bdb_laporan_polisi`) with NBSP `chr(160)` code normalization and `bdb_dors_satker_map` alias resolution.
- Built `bdb_kinerja_perkara_snapshot`, `bdb_anev_rekap_snapshot`, `bdb_pihak_terlibat_ranking_snapshot`, and `bdb_barang_bukti_summary_snapshot` to cut national query execution from $>10\text{ s}$ to $<100\text{ ms}$.
- Launched **SHARESE** internal tactical broadcaster (`/cms/broadcaster`) and leadership **Jukrah** dissemination with read-receipt tracking.

---

## [v1.0.0 — Legacy Phases 1–3] — Pre-2023 to 2025 (Historical Baseline)
- **Phase 1 (Pre-2023)**: Regional Excel templates distributed via email across 34 Polda.
- **Phase 2 (2023–2025)**: Shared cloud spreadsheets (retired after hitting the 15.02 GB quota lockout and 150+ sheet formula collisions).
- **Phase 3 (2024–2025)**: Initial single-door static CT/CC platform (replaced by the self-hosted, multi-node **Big Data Binops [BDB]** cluster).
