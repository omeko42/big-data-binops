# System Architecture & Engineering Decision Records (ADR) — Big Data Binops (BDB) & CAS

> **Platform:** Big Data Binops (BDB) — Biro Pembinaan dan Operasional (Robinopsnal) Bareskrim Polri  
> **Operational Ecosystem:** CAS (*Community Anggota Serse* — 1,024+ Active Reserse Personnel & KBOs Nationwide)

This document summarizes the core architectural patterns and key engineering decisions (**ADRs**) that enable **Big Data Binops (BDB)** to process **~68.89 million live database rows** (**2.84M+ Police Reports**, **11.16M+ Involved Parties**, **5.84M+ Evidence Items**, and **5.46M+ Forensic Audit Logs**) with sub-100ms analytical latency.

---

## 1. Key Engineering Decisions (ADRs)

### ADR-001: Decoupled JSONB Staging vs. Normalized Core (`bdb_dors_raw_lp` $\to$ `bdb_laporan_polisi`)
- **Context**: Upstream payloads from **DORS Stamaops Polri** arrive with heterogeneous regional formatting, non-breaking spaces (`chr(160)` / NBSP) in Pusiknas Satker codes, and evolving nested arrays (`tindak_pidana`, `terlibat`, `barang_bukti`).
- **Decision**: Implement a two-stage ingestion pipeline:
  1. **Immutable Raw Staging (`bdb_dors_raw_lp` & `bdb_dors_lp`)**: Stores the exact upstream JSONB payload keyed by `raw_lp_id` without destructive transformation.
  2. **Normalized Relational Core (`bdb_laporan_polisi`, `bdb_lp_tindak_pidana_dors`, `bdb_dokumen`)**: Applies `REGEXP_REPLACE` NBSP sanitization, 4-tier Satker placement resolution (`Mabes` $\to$ `Polda` $\to$ `Polres` $\to$ `Polsek`), and fallback crime-category linking (`coalesce(kategori_gk, tindak_pidana[0].id_kategori_kejahatan)`).
- **Impact**: Zero upstream data loss and 100% mathematical reconciliation accuracy across all 36 Polda and Bareskrim Polri.

### ADR-002: Pre-Computed Materialized Snapshot Engine (`bdb_kinerja_perkara_snapshot`)
- **Context**: Live national and regional aggregations of **Crime Total (CT)**, **Crime Process (CP Aktual & Tunggakan)**, **Crime Clearance (CC Aktual & Tunggakan)**, **Clearance Rate (Rumus Lama & Baru)**, and **5-Level Composite Index** across 2.84M+ LPs and 14,217 Satker nodes previously took $>10\text{ seconds}$ and caused CPU spikes during peak command Anev sessions.
- **Decision**: Introduce `bdb_kinerja_perkara_snapshot` (**2.11M+ active Reserse rows**) maintained via:
  - Real-time row-level PostgreSQL trigger (`bdb_trg_sync_kinerja_snapshot_from_lp`) on LP status/unit updates.
  - Non-blocking background orchestration (`setImmediate()` on module init + PostgreSQL Advisory Lock `pg_try_advisory_lock`) so the 32 PM2 worker instances never block HTTP port `3850` or collide during full snapshot refreshes.
- **Impact**: Analytical query latency reduced from **$>10\text{ s}$ to $<100\text{ ms}$** with zero 502 Bad Gateway downtime during container restarts.

### ADR-003: Strict Juridical & SOTK Separation (`Perkap 6/2017 jo. Perpol 4/2025` & KUHAP)
- **Context**: Mixing non-Reserse police units (*Baharkam, Polairud, Sabhara/Samapta, Lantas, Intelkam*) or premature prosecution statuses into Reserse Clearance Rates distorts national law enforcement metrics.
- **Decision**:
  1. **Reserse vs. Non-Reserse Isolation (`bdb_satker_taxonomy_r11`)**: Strictly separates `INTERNAL_RESERSE` (Bareskrim 6 Directorates, 5 Polda Ditres including the new *Ditres PPA-PPO*, Polres *Satreskrim / Satresnarkoba / Satres PPA-PPO*, and *Unit Reskrim Polsek*) from `EKSTERNAL_RESERSE` and deactivates pure traffic offenses (`jenis_kejahatan_id IN (516, 741)`) from Reserse snapshots.
  2. **KUHAP P-21 vs. Tahap II Doctrine**: A case declared complete by the prosecutor (**P-21**) remains counted as active workload (**CT / CP**) until physical handover of the suspect and evidence (**Tahap II**) is verified.
  3. **Unified Polsek & Unit Reskrim Scope**: Automatically unifies parent `POLSEK` and child `UNIT RESKRIM POLSEK` scopes so Kanit Reskrim and Polsek operators experience zero visibility gaps regardless of whether an LP landed on the parent Polsek or child Unit Reskrim node.

### ADR-004: Dual-Client MinIO S3 Object Storage Pattern
- **Context**: Storing thousands of PDF attachments (*Sprin Operasi Satgas, Renops, Naskah Kerma MoU/PKS, Lampiran Kasus Menonjol/Atensi, Berkas Pelimpahan*) as database blobs causes severe PostgreSQL table bloat.
- **Decision**: Offload all binary documents to a dedicated **MinIO S3 cluster (`bdb-attachments`)** using a **Dual-Client Pattern** in `minio.service.ts` — an internal high-speed client (`<BACKEND_PRIVATE_IP>:9100`) for server-side streaming/ingestion and a public-facing presigned/proxied route (`/bdb-attachments/`) via Nginx.

### ADR-005: Dual Document Engine (13-Sheet Perkap Polri WYSIWYG + Python Jukminu ONLYOFFICE Service)
- **Context**: Executive law enforcement reporting requires both rapid interactive browser editing of the **13 Official Perkap Polri Anev Sheets** and formal `.docx`/`.pdf` correspondence compliant with **Jukminu Polri** (Polri Administrative Correspondence Standards).
- **Decision**: Combine an in-browser 13-sheet WYSIWYG telemetry engine (`anev.service.ts`) with a dedicated Python microservice (`cas_doc_service.py` on port `3860`) integrated with **ONLYOFFICE Document Server (`onlyoffice-ds` on port `8088`)** featuring dynamic Satker/Fungsi *Kop Surat*, `a.n. Pimpinan` signature blocks, per-user NRP/NIP watermarks, centered page numbering from Page 2, and Jukminu *Catchwords* (*Kata Penghubung*).

---

## 2. Detailed Reference Documentation

- [**`docs/STRATEGIC_GOVERNANCE_AND_EVOLUTION.md`**](docs/STRATEGIC_GOVERNANCE_AND_EVOLUTION.md) — Strategic Context, 4-Stage Evolution, SOTK Perpol 4/2025 Alignment & 6-Pillar Blueprint
- [**`docs/SERVER_ARCHITECTURE_AND_INVENTORY.md`**](docs/SERVER_ARCHITECTURE_AND_INVENTORY.md) — Complete Dual-Node Server Topology, Containers, Ports & 26 NestJS Submodules
- [**`database/schema/DATABASE_INVENTORY.md`**](database/schema/DATABASE_INVENTORY.md) — 171 Active Production Tables & ~68.89M Row Functional Inventory
- [**`frontend/FRONTEND_ROUTES_AND_MODULES.md`**](frontend/FRONTEND_ROUTES_AND_MODULES.md) — Complete 73 Next.js App Router Pages & 21 Feature Bundles Mapping
