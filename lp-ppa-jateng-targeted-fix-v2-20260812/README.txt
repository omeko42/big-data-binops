PATCH V2 TERKUNCI - 2 LP DIT PPA DAN PPO JAWA TENGAH

Paket ini menggantikan seluruh paket tanpa akhiran v2.
JANGAN jalankan paket lama lp-ppa-jateng-targeted-fix-20260812.

Target yang diizinkan:
- id 123529 / dors_lp_id 2155911 / LP/B/208/XI/2023/SPKT/POLDA JAWA TENGAH
- id 123539 / dors_lp_id 3345420 / LP/B/49/III/2025/SPKT/POLDA JAWA TENGAH

ID 123339 (LP POLSEK LENGKITI) secara eksplisit bukan target.

Urutan wajib:
1. 19_v2_ppa_jateng_preflight.sql
2. 20_v2_ppa_jateng_dry_run.sql
3. Periksa hasil: target=2, eligible=2, dry-run update=2, lalu ROLLBACK.
4. 21_v2_ppa_jateng_apply.sql
5. 22_v2_ppa_jateng_rollback.sql hanya bila rollback diperlukan.

Backup persisten saat apply:
public.bdb_lp_backup_ppa_jateng_v2_20260812

