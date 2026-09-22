# Master Data Pengguna hotfix — 8 September 2026

## Production changes completed

### Search and pagination

- Root cause 1: the frontend sent a legacy pair of array parameters (`searchOrWhereBy` + `searchOrwhere`) and had no stale-response guard. A slower older request could overwrite a newer search result and make the table appear to return to its initial state.
- Root cause 2: satker names were enriched only after pagination, so the database filter could not search by satker.
- Frontend now sends one committed `searchAll` keyword, resets the paginator to page 1, ignores stale responses, and labels the input `Cari nama / email / satker…`.
- Backend applies a case-insensitive OR search across name, email fields, username, role/status, and authoritative `bdb_satker.deskripsi` / `bdb_satker.kode`, while preserving the existing role/scope restrictions.
- Read-only database tests found the expected row by name, email, and satker. Combined count test completed in about 205 ms; sample page query completed in about 38 ms.

Runtime SHA-256 after patch:

- Backend source: `46c912acfa78dc82260cb1fc1089d50dee2517a9a6408fc9defdc3ec8e36d628`
- Backend dist: `6cd46f489de5f3eb006c7dc5af436cc8730932f35a5e89301859fffef7bdf44e`
- Frontend v9 chunk / served HTTP asset: `user-page-pagination-v9-dfbc949b.js`, SHA-256 `dfbc949b35d4521db30eb76033a9e66efb14f69fc4e6aacecb42eafd65aaad15`

Runtime backups:

- `src/app_core/auth/user/user.service.ts.bak-master-user-search-2026-09-08T03-17-20-695Z`
- `dist/app_core/auth/user/user.service.js.bak-master-user-search-2026-09-08T03-17-20-695Z`
- `.next/static/chunks/user-page-pagination-v8-454119d3.js.bak-master-user-search-2026-09-08T03-18-02-136Z`
- Five active route artifacts also have `.bak-master-user-cache-bust-2026-09-08T03-35-24-949Z` backups.

Exact backport diffs:

- `22_be_master_user_runtime_exact.diff`
- `23_fe_master_user_runtime_exact.diff`
- `33_fe_cache_bust_runtime_exact.diff`

Because Next serves static chunks with `Cache-Control: immutable`, the patched content was copied to a new v9 URL and all five active route references were updated. HTTP verification showed v9 referenced and v8 absent, preventing previously cached browsers from continuing to load the old search code.

### Login identifier for account 14503

- Account: `87090777@polri.go.id` / YOKIY SUGITO.
- Root cause: the Polri-domain address existed in `email`, but `email_polri` was empty. Current password login intentionally searches only `email_polri` or `username`, so the account lookup returned no row and emitted generic `invalid credentials` before password verification.
- Applied only `email_polri='87090777@polri.go.id'`. Password/hash, username, role, status, approval, scope, login method, and lockout state were not changed.
- Full-row backup: `codex_backup.master_user_87090777_20260908_auth_user`.
- Audit: `bdb_audit_log.id=2138590`, action `CORRECT_LOGIN_IDENTIFIER`, outcome `SUCCESS`.
- Rollback: `12_account_87090777_rollback.sql`.
- Postflight: account remains `AKTIF`, `APPROVED`, local password enabled, zero failed attempts, no active lock, and one complete backup row.

The identifier issue is fixed. The actual password was not viewed, tested, or reset; the user must retry with their existing correct password.

## Runtime verification

- Backend restarted first and returned HTTP 200 locally; patched source/dist hashes and dist syntax passed after restart.
- Frontend restarted second with restart count 0; `/cms/master/user` returned HTTP 200.
- The Master Pengguna asset served over HTTP matched the patched runtime SHA-256 exactly.
- Register BB and Register Pihak hashes remained unchanged after this hotfix.
- No browser control was used.

## Durability warning

Runtime containers do not contain Git metadata. These changes survive `docker restart`, but not container recreation from the older image. Backport the exact diffs and SQL evidence into the official repository/release process and build a tagged image.
