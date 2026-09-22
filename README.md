# Crime Analytic System (CAS) & Big Data Binops (BDB)

[![Language](https://img.shields.io/badge/language-TypeScript%20%7C%20Node.js-blue.svg)](https://www.typescriptlang.org/)
[![Backend](https://img.shields.io/badge/framework-NestJS-red.svg)](https://nestjs.com/)
[![Frontend](https://img.shields.io/badge/framework-Next.js%20%7C%20React-black.svg)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791.svg)](https://www.postgresql.org/)
[![Security](https://img.shields.io/badge/security-IP%20Whitelist%20%7C%20Rate%20Limit%20%7C%20AES%20Tokens-success.svg)](#security--governance)
[![Status](https://img.shields.io/badge/environment-Production%20Live-brightgreen.svg)](#)

Enterprise-grade criminal intelligence and law enforcement analytics platform for **Bareskrim Polri**. The system aggregates, standardizes, enriches, and tracks nationwide Police Reports (Laporan Polisi / LP) from Mabes, Polda, Polres, down to Polsek jurisdictions across Indonesia.

---

## 🏛️ System Architecture & Engineering Highlights

```
  ┌───────────────────────────────────────────────────────────┐
  │         DORS Mabes Polri (Daily Operation Report)         │
  └─────────────────────────────┬─────────────────────────────┘
                                │ Real-time Ingestion & Normalization
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                 CAS / BDB Core Engine                     │
  │  - Master Satker Hierarchy Mapping (Mabes → Polsek)       │
  │  - Crime Clearance Tracking (CC vs CT, SP3, RJ, Tipiring) │
  │  - Full-Text & Geospatial Crime Mapping Engine            │
  └──────────────┬─────────────────────────────┬──────────────┘
                 │                             │
                 ▼                             ▼
  ┌──────────────────────────────┐ ┌──────────────────────────┐
  │  CAS Command Center Portal   │ │ Managed External Gateway │
  │  (Next.js / PrimeReact / SSR)│ │ (REST API / 9 Scopes)    │
  └──────────────────────────────┘ └───────────┬──────────────┘
                                               │ Secure Ingestion
                                               ▼
                                   ┌──────────────────────────┐
                                   │ AI / Analytics Partners  │
                                   │ (LLM, RAG, Ingestion)    │
                                   └──────────────────────────┘
```

### 1. Ingestion Pipeline & DORS Reconciliation
- **High-Volume Sync**: Continuous bidirectional ingestion from upstream **DORS (Daily Operation Report System) Mabes Polri**.
- **Data Normalization**: Cleanses and maps unstructured case records into relational structures (`bdb_dors_raw_lp` $\to$ `bdb_dors_lp` $\to$ relations for suspects, victims, evidence, and criminal statutes).
- **Hierarchical Placement**: Automated satker placement algorithm classifying cases into national, regional, and municipal jurisdictions.

### 2. Crime Clearance (CC / CT) Engine
- Tracks full criminal case lifecycles: **Penyelidikan (Lidik)**, **Penyidikan (Sidik)**, **SPDP**, **Tahap I**, **P21**, **Tahap II**, **SP3 (Restorative Justice / Diversi)**, and **PERMA Tipiring**.
- Real-time aggregation of **Crime Total (CT)**, **Crime Clearance (CC)**, **Crime Process (CP)**, and **Clearance Rate (CR)** metrics.

### 3. Managed External Integration Gateway
- High-performance RESTful API distributing verified operational records to downstream systems (Generative AI, LLM RAG pipelines, inter-agency dashboards).
- **Granular Scopes**: 9 distinct authorization scopes (`laporan_polisi.read`, `klasifikasi`, `status`, `penanganan`, `tkp`, `kronologi`, `kerugian`, `pihak_terlibat`, `barang_bukti`).
- **Security Protocols**:
  - Sliding-window in-memory Rate Limiting (120 req/min).
  - Dynamic IP Whitelisting firewall guard per client.
  - AES-encrypted opaque ID tokens preventing ID enumeration attacks.
  - Strict data isolation: only `OPERASIONAL` records exposed.

---

## 🛠️ Technology Stack

- **Backend**: NestJS, TypeScript, TypeORM, Express, Bcrypt, Puppeteer, Node.js
- **Frontend**: Next.js (App Router, Server-Side Rendering, TurboPack), React, PrimeReact, Lucide Icons, Chart.js
- **Database**: PostgreSQL with multi-index partitioning and audit trail triggers
- **Security & Infrastructure**: Docker containerization, Linux multi-node deployment (FE: `10.0.0.x`, BE: `10.0.0.x`, DB: `10.0.0.x`)

---

## 🔒 Security & Governance

- Built under strict compliance with **UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP)**.
- Sensitive environment files and server credentials are never tracked in version control.

---

## 👨‍💻 Maintainer & Lead Architect

- **Eko Agung** ([@omeko11](https://github.com/omeko11))  
  *Senior Full-Stack Engineer / Lead System Architect*
