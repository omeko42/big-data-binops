# DORS satker priority fix — 2026-08-30

Runtime hotfix package for the production DORS-to-satker resolver.

Status: deployed to production.

- Existing master satker is resolved by exact DORS code and full hierarchy before the legacy Pusiknas code fallback.
- A DORS satker that is genuinely absent from the active master remains unmapped for manual master generation.
- Group aliases remain disabled; no fuzzy auto-mapping was enabled.
- Production cutover keeps `bdb-api-pre-dors-satker-priority-fix-20260830` as the stopped rollback container.