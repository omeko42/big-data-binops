# Kinerja Perkara V2 — live 2026-08-30

Status: deployed and verified on production.

## Baseline discipline

- Backend candidate was derived from the exact live source hash
  `bc53f3619c665ccbf885493a8a29135997cd4fa9a330110a3b3a6f5e5d934caf`.
- Frontend candidate was derived from the exact route chunk hash
  `a9c2b282031d8137ae3287f5fdc42b6045bcf2111b7e2f564e938e06a0bf8faa`.
- Older local source/chunk copies were not used for production activation.

## Live changes

- PR old: CP total / CT.
- PR new: CP total / (CT + CP tunggakan).
- CR old: CC total / CT.
- CR new: CC total / (CT + CC tunggakan).
- PR/CR are returned and displayed with four decimal places.
- All-access accounts request national scope.
- Regional function accounts are rooted at their Polda and load only their function group plus the regional structural tree.
- Table palette follows the navy/blue application theme.
- PR RMS LAMA and RMS BARU use the same subheader color; the detail toggle and table structure are unchanged.

## Production verification

- Papua Barat Daya CT 2,453; Polresta Sorong Kota CT 1,784.
- Papua Tengah CT 1,974; Polres Mimika CT 1,173; Polres Nabire CT 611.
- DIT Krimum Lampung account resolves to POLDA LAMPUNG and excludes Krimsus/Narkoba function nodes.
- Read-only sample: national 1,479 ms; regional 188 ms.
- Backend and frontend containers were healthy with restart count 0 after activation.

## Rollback backups

- Backend: `/home/clouduser/codex-backups/bdb-api/kinerja-v2-20260830-182219`
- Frontend: `/home/clouduser/codex-backups/bdb-web/kinerja-v2-20260830-182346`

## Activated hashes

- Backend source: `7a8f781ade7e3b551f99a4feffe93b4596cde9cbd17dc173450992b3a3430d9d`
- Backend dist: `9209f30ec7a0c643ba9f8fc84264296dcc6f6a60e17c6b0a6ab863386a0079e3`
- Frontend chunk: `d10c864ed8a5a651daaed15be2b345648135674f6ad08951899917efc3fc376b`
