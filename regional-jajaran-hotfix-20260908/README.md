# Regional/Jajaran hotfix — 8 September 2026

This package applies the handover SOP to the issues reported on 8 September 2026. The handover's old task list was not executed.

## Production changes completed

1. Payung account scope
   - Root cause: account `auth_users.id=14657` pointed to the duplicate-named Unit Reskrim Polsek Payung under Bangka Selatan (`3673`) instead of Tanah Karo (`1180`).
   - Applied by `35_payung_scope_apply.sql` after `32_payung_scope_dry_run.sql` passed.
   - Backup: `codex_backup.regional_payung_20260908_auth_user`.
   - Postflight: `35b_payung_postflight_readonly.sql`.
   - Rollback: `35c_payung_scope_rollback.sql`.

2. Pidie Jaya hierarchy
   - Root cause: seven Polsek nodes still had `POLRES PIDIE (143)` as parent although their reported jurisdiction and DORS parent belong to `POLRES PIDIE JAYA (895)`.
   - Applied by `36_pidie_jaya_hierarchy_apply.sql` after `33_pidie_jaya_hierarchy_dry_run.sql` passed.
   - Backup: `codex_backup.regional_pidie_jaya_20260908_satker` (7 full rows).
   - Postflight: `36b_pidie_jaya_postflight_readonly.sql`.
   - Rollback: `36c_pidie_jaya_hierarchy_rollback.sql`.

3. Ratatotok LP 380025
   - Root cause: a historical mapping outlier placed a Polsek Ratatotok/RESKRIM raw DORS LP under Satreskrim Polres. The current raw route and 168 healthy template rows agree on Polsek/Unit Reskrim Ratatotok.
   - Applied by `37_ratatotok_lp_apply.sql` after `34_ratatotok_lp_dry_run.sql` passed.
   - Backup: `codex_backup.regional_ratatotok_20260908_lp`.
   - Postflight: `37b_ratatotok_postflight_readonly.sql`.
   - Rollback: `37d_ratatotok_lp_rollback.sql`.

## No-change findings

- Semarang LP `LP/B/75/VIII/2026/SPKT/POLRES SEMARANG/POLDA JAWA TENGAH` is currently correct in the database (`SAT RESKRIM RES SEMARANG`) and the active Daftar LP renderer prioritizes `unit_satker_nama`. No new patch was applied.

## Register Pihak code hotfix completed

- Root cause: the list rendered raw `unit_nama` (receiving/reporting unit such as SAMAPTA/SABHARA) while the authoritative mapped owner is `unit_satker_nama` (for the reported case, Unit Reskrim Polsek Singkawang Utara). This was a display/projection issue, not an unauthorized generated account.
- Backend source and dist now include `unit_satker_nama` in all six list projections. Runtime SHA-256: SRC `0200f02760c96fc5fe2fb1bde126feb937e12359c424dadbbfb7187c9df1335b`; DIST `4411afbd8cd25b5bd0e801ba4d8e1ee950750e1e9351472dec8b17a59e248fe2`.
- Frontend now prefers `unit_satker_nama` and falls back to the prior label only when absent. Cache prefix was bumped from v1 to v2. Runtime/HTTP SHA-256: `1e46fef222d4984ee92153e671266ebf4f586592139ebe004788536bca57a89e`.
- Controlled restart completed backend first, then frontend. Backend startup, route mapping, local HTTP response, frontend Ready state, Register Pihak HTTP 200, and served-asset hash all passed without browser control.
- Exact backport diffs: `63_register_pihak_be_runtime_exact.diff` and `64_register_pihak_fe_runtime_exact.diff`. Runtime backups are recorded in `47_be_register_pihak_patch.txt` and `49_fe_register_pihak_patch.txt`.

## Versioning warning

The workspace and both runtime containers have no `.git` metadata. Container edits survive `docker restart` but are lost when the container is removed/recreated from the current image. Backport the exact runtime diffs and this evidence package into the official source repository, build a tagged image, and deploy that image before treating the code hotfix as durable.
