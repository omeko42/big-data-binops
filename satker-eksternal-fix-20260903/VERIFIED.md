# CAS deployment verification — 2026-09-03
## Live changes
- 514 external master names changed from Dinas Lingkungan Hidup dan Kebersihan (DLHK) to Dinas Lingkungan Hidup dan Kehutanan (DLHK). Existing IDs preserved; no related transfer history rows existed.
- External master API supports bounded opt-in pagination (25 default, 100 maximum); existing LP destination picker contract preserved.
- External master UI now uses server pagination and submits searches only with Cari/Enter. Handles stale responses, last-page deletion and row count changes.
- DORS owner reconciliation uses shared unit mapping, validates territorial parent/grandparent, requires unique destination, and protects CAS transfer/override records.
- 136 validated LP records reconciled: 131 actual owner changes plus 5 already-correct owner acknowledgements. LP402704 (LP/B/1541/VIII/2026/SPKT/POLDA JAWA BARAT) now unit19466, DIT RES SIBER JAWA BARAT.
- No formal transfers created, document/status/non-address fields unchanged; 136 snapshot owners verified.

## Verification
- UI behavior harness: PASS (typing no fetch, Enter search, stale response, pagination, last-page clamp).
- Backend tests: 4/4 PASS before deployment and 4/4 PASS against installed service. Database read-only first/second pages each25 distinct rows, search count514, total6514.
- Baseline hash guards passed for six backend files; no running DORS jobs before restart.
- API health200; frontend health200; public new chunkHTTP200.
- Postdeploy: old wrong DLHK names0, corrected names514; LP owners/status/snapshots verified.
- Source/runtime SQL parity and transactional dry-run tested before LP data correction.

## Backups (on CAS servers)
- Backend233: /home/clouduser/codex-backups/bdb-api/address-external-20260903-050653
- Frontend232: /home/clouduser/codex-backups/bdb-web/external-paged-20260903-050729
- DLHK name backup233: /home/clouduser/codex-backups/dlhk-name-20260903/before.json
- LP backup233: /home/clouduser/codex-backups/lp-address-20260903/before.json
- LP validated plan233: /home/clouduser/codex-backups/lp-address-20260903/plan.json

## Pending (not claimed complete)
- RESOLVED: User confirmed all provinces. Added38 DLHK province entries on 2026-09-03; audit1699189. Existing6514 entries unchanged; total6552. Live service verified25+13 search pages and38 picker choices; idempotent check missing0. Backup233: /home/clouduser/codex-backups/dlhk-provinces-20260903/{before,created}.json. Province list includes Papua Selatan/Pegunungan, which are missing from cm_provinsi; that other master was not changed.
- Address audit initial230 candidates:136 uniquely resolved,56 protected,34 territorial/unit resolution failures,4 unsupported source levels. Only validated136 were applied; do not guess other destinations.
- No logged-in browser end-to-end session was used; UI verified with behavior harness and served artifact checks.
- Production runtime has pre-existing hotfixes absent from older TypeScript. Never compile entire older LP TypeScript over production runtime. This patch used exact current runtime and backported only affected methods.
