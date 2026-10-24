import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { types as pgTypes, defaults as pgDefaults } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

// Kolom `timestamp` (TANPA time zone -- dipakai luas di seluruh skema, mis. created_at/started_at)
// disimpan Postgres sbg wall-clock UTC murni (session TimeZone server = UTC), TAPI driver `pg`
// bawaan menafsirkan string itu berdasar TZ *proses Node* (container ini TZ=Asia/Jakarta) --
// mengira "05:07" itu sudah WIB, padahal itu UTC, menggeser tiap timestamp mundur 7 jam secara
// SENYAP (Waktu di UI Riwayat Sync DORS, Log Audit, dll jadi salah). OID 1114 = timestamp without
// time zone (lihat pg_type). Paksa selalu diparse sbg UTC, cocok dgn cara Postgres benar2 menyimpannya
// -- TIDAK bergantung TZ proses (yg tetap Asia/Jakarta utk keperluan lain, mis. jadwal cron).
pgTypes.setTypeParser(1114, (str: string) => new Date(str + 'Z'));

// Pasangan fix di atas (SISI BACA) -- ini SISI TULIS, bug BEDA yg baru ketemu 5 Agu 2026 (akun
// auth_users.locked_until kekunci 7 jam lebih lama dari 30 menit yg seharusnya). Root cause:
// saat JS Date dikirim sbg parameter ke kolom `timestamp` (tanpa tz), `pg` default memformat pakai
// getter LOKAL (getHours() dst -- ikut TZ proses Asia/Jakarta) lalu menambahkan offset "+07:00" di
// akhir string (mis. "2026-08-05T17:32:30+07:00" utk instant yg SEBENARNYA "10:32:30 UTC") --
// TAPI Postgres, utk kolom `timestamp without time zone`, MENGABAIKAN offset itu sepenuhnya &
// cuma ambil angka wall-clock apa adanya ("17:32:30"), jadi TERSIMPAN sbg 10:32:30 + 7 jam = salah,
// bukan usaha konversi yg gagal. `parseInputDatesAsUTC=true` paksa `pg` format pakai getter UTC
// (getUTCHours() dst) supaya wall-clock yg tertulis SUDAH BENAR UTC sejak awal -- simetris dgn fix
// baca di atas, keduanya sama-sama perlu supaya kolom timestamp-tanpa-tz konsisten UTC end-to-end.
pgDefaults.parseInputDatesAsUTC = true;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: (process.env.DB_TYPE as any) || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_DATABASE || 'test',
            synchronize: false,
            dropSchema: false,
            logging: false,
            logger: 'file',
            // Kapasitas 100 concurrent -- audit performa 2026-08-05: PM2 ecosystem.config.js pakai
            // instances TETAP (bukan 'max') supaya total koneksi selalu bisa dihitung pasti = jumlah
            // proses x poolSize di sini. Server prod: API 32 core (32 proses PM2), DB server terpisah
            // 32 core/64GB dgn max_connections dinaikkan ke 300 (lihat postgresql.conf server DB) --
            // 32 proses x max:8 = 256 koneksi, sisa headroom 44 utk migration/monitoring/psql manual.
            // connectionTimeoutMillis: WAJIB diisi -- default pg Pool (0 = tunggu tanpa batas) bikin
            // request "menggantung" diam2 kalau pool penuh, bukan gagal cepat dgn pesan jelas.
            extra: {
                max: 25,
                connectionTimeoutMillis: 5000,
                idleTimeoutMillis: 30000
            },
            poolSize: 25,
            entities: ['dist/**/*.entity{.ts,.js}'],
            migrations: ['dist/app_core/migrations/**/*.ts'],
            subscribers: ['dist/subscriber/**/*.ts']
        })
    ]
})
export class DatabaseModule {}
