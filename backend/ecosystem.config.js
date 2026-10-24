module.exports = {
  apps: [
    {
      name: 'api.cas.v1.2.0',
      script: './dist/main.js',
      exec_mode: 'cluster',
      // Sengaja angka tetap (32, sesuai core CPU server prod), BUKAN 'max' -- dgn 'max' PM2 pakai
      // os.cpus().length otomatis, dan tiap proses buka poolSize koneksi DB sendiri2 (lihat
      // src/app_core/database/dataSource.ts & database.module.ts) -- 32 proses x poolSize 14 =
      // 448 potensi koneksi, jauh lewat max_connections Postgres (default 100, direkomendasikan
      // naik ke 300 utk server DB terpisah 32 core/64GB -- lihat catatan di dataSource.ts). Angka
      // tetap di sini supaya jumlah proses x poolSize selalu bisa dihitung pasti & tak diam2
      // berubah kalau server di-resize/dipindah ke mesin beda jumlah core-nya.
      instances: 32,
      env: {
        NODE_ENV: 'production',
        PORT: 3850,
        TZ: 'Asia/Jakarta'
      }
    }
  ]
};