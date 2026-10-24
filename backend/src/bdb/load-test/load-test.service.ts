import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { resolveScope } from '../common/scope.util';
import { AuditService } from '../audit/audit.service';
// require() biasa, BUKAN `import autocannon from 'autocannon'` -- paket ini CommonJS murni
// (module.exports = autocannon), sintaks default-import TS mengharap properti `.default` yg tak
// ada di runtime (lempar "autocannon_1.default is not a function"), require() cocok persis dgn
// bentuk exports aslinya.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const autocannon = require('autocannon');

// Daftar endpoint yang BOLEH diuji beban -- SENGAJA dikunci (allowlist), bukan bebas isi URL apa
// pun. Semua baca-saja (GET), tak pernah mengubah/menghapus data -- aman diulang-ulang tanpa efek
// samping ke data.
//  - laporan_polisi_list: tabel tersibuk (bdb_laporan_polisi, 31rb+ baris & terus tumbuh),
//    representasi beban baca operator sungguhan.
//  - kinerja_perkara_rekap: dipanggil user sbg kandidat "proses paling berat" -- rekap CT/CP/CC/CR
//    ini AGREGAT (group by + banyak count(*) filter, lihat buildTree() di kinerja-perkara.service.ts)
//    dari bdb_kinerja_perkara_snapshot, beda karakter dari laporan_polisi_list yg cuma list+paginasi
//    biasa -- endpoint inilah yg dipanggil dashboard tiap operator buka halaman utama. Tanpa query
//    param = pakai periode default service (persis spt dashboard tanpa filter eksplisit).
const TARGET_ALLOWLIST: Record<string, string> = {
    laporan_polisi_list: '/api/bdb/laporan-polisi?row=25&page=1',
    kinerja_perkara_rekap: '/api/bdb/kinerja-perkara/rekap'
};

export type KoneksiInfo = {
    // Dari sisi Postgres (pg_stat_activity) -- ini yg SUNGGUHAN dibatasi max_connections, gabungan
    // dari SEMUA proses PM2 (di prod: 32 worker), bukan cuma proses yg jawab request ini.
    db_koneksi_ke_aplikasi_ini: number;
    db_koneksi_total_server: number;
    db_max_connections: number;
    // Dari sisi pool lokal proses Node INI SAJA (node-postgres Pool) -- brp dari poolSize=8 yg
    // lagi kepakai/nganggur/ngantre DI PROSES YG MENANGANI REQUEST INI. Kalau di prod cluster, tiap
    // worker punya pool sendiri2 -- angka ini TIDAK mewakili total 32 worker, cuma satu.
    pool_lokal_proses_ini: { total: number; sedang_dipakai: number; nganggur: number; antre: number };
};

export type LoadTestResult = {
    target: string;
    path: string;
    concurrency: number;
    duration_detik: number;
    requests_per_detik: { rata2: number; min: number; max: number };
    latency_ms: { rata2: number; p50: number; p90: number; p99: number; max: number };
    total_request: number;
    non2xx: number;
    error: number;
    timeout: number;
};

@Injectable()
export class LoadTestService {
    // Pagar keras -- BUKAN sekadar default, tak bisa dilewati lewat parameter berapa pun yg diisi
    // user (lihat clamp di run()). Alasan lihat catatan panjang di load-test.controller.ts.
    private static readonly MAX_CONCURRENCY = 1000;
    private static readonly MAX_DURATION_DETIK = 60;

    // Wajib alasan tertulis (bukan sekadar tombol) -- pakai jumlah KATA, bukan karakter, spy tak
    // bisa dilewati dgn mengetik 1 kata panjang/spasi berulang.
    private static readonly MIN_ALASAN_KATA = 10;

    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService
    ) {}

    /** Info koneksi DB saat ini -- dipanggil UI berulang (polling) sebelum/saat/sesudah uji beban
     *  jalan, supaya kelihatan LANGSUNG pengaruh concurrency ke jumlah koneksi terpakai (bukan cuma
     *  angka request/detik & latency). Superadmin-only, sama spt run(). */
    async koneksiInfo(userId: number | undefined): Promise<KoneksiInfo> {
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Info koneksi hanya bisa dilihat superadmin.');
        }
        const [dbRows, maxRows] = await Promise.all([
            this.dataSource.query(`
                select
                    count(*) filter (where datname = current_database())::int as ke_aplikasi_ini,
                    count(*)::int as total_server
                from pg_stat_activity
            `),
            this.dataSource.query(`show max_connections`)
        ]);
        const pool = (this.dataSource.driver as any)?.master;
        return {
            db_koneksi_ke_aplikasi_ini: Number(dbRows[0]?.ke_aplikasi_ini || 0),
            db_koneksi_total_server: Number(dbRows[0]?.total_server || 0),
            db_max_connections: Number(maxRows[0]?.max_connections || 0),
            pool_lokal_proses_ini: {
                total: pool?.totalCount ?? 0,
                sedang_dipakai: pool ? pool.totalCount - pool.idleCount : 0,
                nganggur: pool?.idleCount ?? 0,
                antre: pool?.waitingCount ?? 0
            }
        };
    }

    async run(userId: number | undefined, userName: string | undefined, targetKey: string, concurrencyIn: number, durationIn: number, alasanIn: string, passwordIn: string, bearerToken: string): Promise<LoadTestResult> {
        const scope = await resolveScope(this.dataSource, userId);
        if (!scope.isSuper) {
            throw new ForbiddenException('Uji beban hanya bisa dijalankan superadmin.');
        }
        // Lapis ke-3 -- verifikasi ULANG password akun saat ini (BUKAN cuma andalkan token sesi yg
        // sudah login). Alasan: kalau sesi browser superadmin tertinggal terbuka & diakses orang
        // lain, token JWT-nya tetap valid & lolos AuthGuard -- tanpa langkah ini, siapa pun yg
        // duduk di depan sesi terbuka itu bisa langsung picu beban ke prod tanpa tahu password
        // sungguhan. Gagal di sini = ForbiddenException, TAK jalan sama sekali (dicek SEBELUM
        // audit.log/autocannon, fail-fast).
        const passRows = await this.dataSource.query('select password from auth_users where id=$1', [userId || 0]);
        const hash = passRows[0]?.password;
        if (!hash || !(await bcrypt.compare(String(passwordIn || ''), hash))) {
            throw new ForbiddenException('Password salah -- verifikasi ulang password akun Anda untuk menjalankan uji beban.');
        }
        const path = TARGET_ALLOWLIST[targetKey];
        if (!path) {
            throw new BadRequestException(`Target uji beban tidak dikenal. Pilihan: ${Object.keys(TARGET_ALLOWLIST).join(', ')}.`);
        }
        const alasan = String(alasanIn || '').trim();
        const jumlahKata = alasan.length ? alasan.split(/\s+/).filter(Boolean).length : 0;
        if (jumlahKata < LoadTestService.MIN_ALASAN_KATA) {
            throw new BadRequestException(`Alasan wajib diisi minimal ${LoadTestService.MIN_ALASAN_KATA} kata (baru ${jumlahKata} kata) -- jelaskan kenapa uji beban ini perlu dijalankan sekarang, ini menembak beban nyata ke server produksi.`);
        }
        const concurrency = Math.max(1, Math.min(LoadTestService.MAX_CONCURRENCY, Math.round(Number(concurrencyIn) || 1)));
        const durationDetik = Math.max(1, Math.min(LoadTestService.MAX_DURATION_DETIK, Math.round(Number(durationIn) || 10)));
        if (!bearerToken) {
            throw new BadRequestException('Token tidak ditemukan -- uji beban dijalankan pakai token sesi Anda sendiri (biar lewat AuthGuard sungguhan, bukan bypass).');
        }

        // Nembak ke diri sendiri (localhost) -- bukan domain publik: menghindari masalah hairpin
        // NAT/firewall server nembak IP publiknya sendiri, dan tujuan utama uji ini VALIDASI
        // kapasitas DB pool + query (lihat audit performa 2026-08-05), bukan jalur reverse-proxy.
        const port = process.env.PORT || 3850;
        const url = `http://127.0.0.1:${port}${path}`;

        // Audit DIMULAI sebelum jalan (bukan cuma sesudah) -- kalau autocannon sendiri crash/gagal
        // total, tetap ada jejak bahwa ini PERNAH dipicu dgn parameter apa oleh siapa.
        await this.audit.log({
            userId,
            userName,
            action: 'RUN_LOAD_TEST',
            entity: 'load_test',
            meta: { target: targetKey, path, concurrency, duration_detik: durationDetik, alasan },
            outcome: 'SUCCESS'
        });

        const result = await autocannon({
            url,
            connections: concurrency,
            duration: durationDetik,
            headers: { Authorization: `Bearer ${bearerToken}` }
        });

        return {
            target: targetKey,
            path,
            concurrency,
            duration_detik: durationDetik,
            requests_per_detik: {
                rata2: Math.round(result.requests.average),
                min: result.requests.min,
                max: result.requests.max
            },
            latency_ms: {
                rata2: result.latency.average,
                p50: result.latency.p50,
                p90: result.latency.p90,
                p99: result.latency.p99,
                max: result.latency.max
            },
            total_request: result.requests.total,
            non2xx: result.non2xx,
            error: result.errors,
            timeout: result.timeouts
        };
    }
}
