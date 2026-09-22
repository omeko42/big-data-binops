/**
 * True kalau proses ini SATU-SATUNYA yang boleh menjalankan tugas boot-time/terjadwal yang
 * menyentuh DB secara eksklusif (rebuild hierarki satker, refresh snapshot, cron reconcile, dst).
 *
 * PM2 cluster mode (ecosystem.config.js, instances:32) menjalankan aplikasi N kali paralel dalam
 * proses terpisah -- NestJS @Cron/@Interval/OnModuleInit TIDAK cluster-aware bawaan, jadi tanpa
 * guard ini tugas yang sama akan jalan bersamaan di 32 proses sekaligus (lihat insiden 5 Agu 2026:
 * SatkerService.rebuildHierarchy() deadlock, KinerjaPerkaraService refresh snapshot bentrok
 * duplicate key -- keduanya asumsi single-process yang dilanggar begitu cluster-mode diaktifkan).
 *
 * PM2 set `NODE_APP_INSTANCE='0'` untuk worker PERTAMA saja -- proses lain diberi '1'..'31'.
 * Kalau app jalan TANPA PM2 (dev lokal, atau fallback 1-proses), env ini tidak diset sama sekali
 * (undefined) -- tetap dianggap "satu-satunya proses" (benar, karena memang cuma 1). Pola
 * `NODE_APP_INSTANCE === '0'` saja (tanpa cek undefined, dipakai di summary-view.service.ts
 * sebelum util ini ada) SALAH untuk mode 1-proses -- tugas jadi tidak pernah jalan sama sekali.
 */
export function isPrimaryClusterInstance(): boolean {
    const idx = process.env.NODE_APP_INSTANCE;
    return idx === undefined || idx === '0';
}
