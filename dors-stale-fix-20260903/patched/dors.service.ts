import { ForbiddenException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LaporanPolisiService } from '../laporan-polisi/laporan-polisi.service';
import { SatkerService } from '../satker/satker.service';
import { SyncLogStore } from './sync-log.store';

export type DorsSource = { key: string; label: string; path: string; kategori?: string };
type DorsConfig = {
    base_url: string;
    client_id: string;
    client_header: string;
    timeout_ms: number;
    sync_enabled: boolean;
    sync_mode: 'interval' | 'cron';
    sync_interval_minutes: number;
    sync_cron: string;
    sync_days_back: number;
    data_scope: string;
};

/**
 * Integrasi DORS. Konfigurasi (base url / client id / header / timeout) tersimpan
 * di tabel bdb_dors_config (bisa diubah dari UI), fallback ke ENV DORS_*.
 * Daftar sumber dinamis dari config/dors-sources.json.
 */
const DORS_CRON_NAME = 'dors-lp-sync';
const DORS_INTERVAL_NAME = 'dors-lp-sync-interval';

@Injectable()
export class DorsService implements OnModuleInit {
    private readonly logger = new Logger('DorsService');
    private syncing = false; // guard: cegah dua sync jalan bersamaan
    private syncLogStore: SyncLogStore | null = null;
    private configSchemaCheck: Promise<void> | null = null;

    private get syncLogs(): SyncLogStore {
        return this.syncLogStore ||= new SyncLogStore(this.dataSource, this.logger);
    }

    async onModuleDestroy() {
        if (this.syncLogStore) await this.syncLogStore.close();
    }
    private nextIntervalRun: Date | null = null; // perkiraan waktu jalan berikutnya (mode interval)
    constructor(
        private readonly dataSource: DataSource,
        private readonly scheduler: SchedulerRegistry,
        private readonly laporanPolisi: LaporanPolisiService,
        private readonly satkerService: SatkerService
    ) {}

    /** Saat boot: siapkan tabel normalisasi, bersihkan job sync yg "nyangkut" dari sebelum restart, pasang jadwal. */
    async onModuleInit() {
        try {
            await this.ensureNormalizedTables();
        } catch (e: any) {
            this.logger.warn('gagal menyiapkan tabel normalisasi DORS: ' + (e?.message || e));
        }
        try {
            await this.cleanupOrphanedSyncJobs();
        } catch (e: any) {
            this.logger.warn('gagal bersihkan job sync nyangkut: ' + (e?.message || e));
        }
        try {
            await this.reloadSchedule();
        } catch (e: any) {
            this.logger.warn('gagal pasang jadwal DORS saat boot: ' + (e?.message || e));
        }
    }

    /**
     * Job dgn status='running' yg masih ada saat server BARU nyala pasti sisa dari sebelum restart/crash
     * -- proses aslinya sudah pasti mati (flag `syncing` di memori otomatis reset ke false tiap boot),
     * jadi baris itu cuma nyangkut nampilin "sedang berjalan" padahal tidak. Ditandai jelas supaya admin
     * tahu harus klik "Tarik Sekarang" lagi (aman diulang -- checkpoint per-chunk yg sudah beres tak
     * diulang krn insert idempotent by dors_lp_id), bukan dibiarkan terlihat seperti masih berjalan.
     */
    private async cleanupOrphanedSyncJobs() {
        await this.ensureConfigTable();
        // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount], bukan
        // array baris langsung -- tanpa destructure ini, rows.length SELALU 2 (panjang tuple-nya),
        // jadi warning di bawah selalu bunyi "Ditemukan 2 job..." apapun jumlah sebenarnya.
        const rows = await this.syncLogs.query(
            `update bdb_dors_sync_log set status='error', stopped_reason='Proses terhenti (server restart/mati sebelum selesai). Progres sebagian sudah tersimpan (aman, tidak dobel) -- klik "Tarik Sekarang" lagi dgn rentang yg sama utk melanjutkan.', error='Terputus oleh restart server.', finished_at=now()
             where status='running' returning id`
        );
        if (rows.length) this.logger.warn(`Ditemukan ${rows.length} job sync DORS nyangkut dari sebelum restart, ditandai error.`);
    }

    private async ensureConfigTable() {
        if (!this.configSchemaCheck) {
            this.configSchemaCheck = (async () => {
                await this.syncLogs.query(`select id,base_url,client_id,client_header,timeout_ms,
                    sync_enabled,sync_mode,sync_interval_minutes,sync_cron,sync_days_back,data_scope
                    from bdb_dors_config where false`);
                await this.syncLogs.query(`select id,status,trigger,from_date,to_date,total_fetched,
                    total_upserted,sources_json,error,stopped_reason,started_at,finished_at,duration_ms,
                    attempt,max_attempts,current_source,current_page,current_last_page,
                    current_chunk_from,current_chunk_to,chunks_done,chunks_total
                    from bdb_dors_sync_log where false`);
            })().catch((error) => { this.configSchemaCheck = null; throw error; });
        }
        await this.configSchemaCheck;
    }

    private async ensureConfigTableForMigration() {
        await this.dataSource.query(`
            create table if not exists bdb_dors_config (
                id int primary key default 1,
                base_url text,
                client_id text,
                client_header text,
                timeout_ms integer,
                updated_at timestamp not null default now(),
                constraint bdb_dors_config_single check (id = 1)
            );
        `);
        // kolom penjadwalan (idempotent, selaras migrasi 015)
        await this.dataSource.query(`
            alter table bdb_dors_config add column if not exists sync_enabled          boolean not null default false;
            alter table bdb_dors_config add column if not exists sync_mode             text    not null default 'interval';
            alter table bdb_dors_config add column if not exists sync_interval_minutes integer not null default 30;
            alter table bdb_dors_config add column if not exists sync_cron             text    not null default '0 2 * * *';
            alter table bdb_dors_config add column if not exists sync_days_back        integer not null default 1;
            alter table bdb_dors_config add column if not exists data_scope            text    not null default 'OPERASIONAL';
            create table if not exists bdb_dors_sync_log (
                id bigserial primary key,
                trigger text not null default 'manual',
                from_date date, to_date date,
                status text not null default 'running',
                total_fetched integer not null default 0,
                total_upserted integer not null default 0,
                sources_json jsonb not null default '[]'::jsonb,
                error text,
                started_at timestamp not null default now(),
                finished_at timestamp, duration_ms integer
            );
            -- Progress live + checkpoint per-halaman (idempotent, selaras migrasi lanjutan) --
            -- sources_json diperbarui TIAP HALAMAN selama proses jalan (bukan cuma di akhir), jadi
            -- bisa dipoll dari UI utk lihat "sedang di halaman berapa" tanpa nunggu selesai/gagal.
            alter table bdb_dors_sync_log add column if not exists attempt integer not null default 1;
            alter table bdb_dors_sync_log add column if not exists max_attempts integer not null default 5;
            alter table bdb_dors_sync_log add column if not exists current_source text;
            alter table bdb_dors_sync_log add column if not exists current_page integer;
            alter table bdb_dors_sync_log add column if not exists current_last_page integer;
            alter table bdb_dors_sync_log add column if not exists stopped_reason text;
            -- rentang tanggal DIPECAH jadi beberapa chunk (lihat splitIntoChunks) supaya backfill besar
            -- (mis. 1 tahun) tak jadi satu proses raksasa tak terputus -- tiap chunk checkpoint sendiri.
            alter table bdb_dors_sync_log add column if not exists current_chunk_from date;
            alter table bdb_dors_sync_log add column if not exists current_chunk_to date;
            alter table bdb_dors_sync_log add column if not exists chunks_done integer;
            alter table bdb_dors_sync_log add column if not exists chunks_total integer;
        `);
    }

    private envConfig(): DorsConfig {
        return {
            base_url: (process.env.DORS_BASE_URL || 'https://dors.stamaops.polri.go.id/api/v1').replace(/\/+$/, ''),
            client_id: process.env.DORS_CLIENT_ID || '',
            client_header: process.env.DORS_CLIENT_HEADER || 'CLIENTID',
            timeout_ms: parseInt(process.env.DORS_TIMEOUT_MS || '20000', 10),
            sync_enabled: false,
            sync_mode: 'interval',
            sync_interval_minutes: 30,
            sync_cron: '0 2 * * *',
            sync_days_back: 1,
            data_scope: 'OPERASIONAL'
        };
    }

    /** Config efektif: DB (jika ada) menimpa ENV. */
    async getConfig(): Promise<DorsConfig> {
        const env = this.envConfig();
        try {
            await this.ensureConfigTable();
            const rows = await this.syncLogs.query(
                'select base_url, client_id, client_header, timeout_ms, sync_enabled, sync_mode, sync_interval_minutes, sync_cron, sync_days_back, data_scope from bdb_dors_config where id = 1'
            );
            if (rows.length) {
                const r = rows[0];
                return {
                    base_url: (r.base_url || env.base_url).replace(/\/+$/, ''),
                    client_id: r.client_id ?? env.client_id,
                    client_header: r.client_header || env.client_header,
                    timeout_ms: r.timeout_ms || env.timeout_ms,
                    sync_enabled: r.sync_enabled ?? env.sync_enabled,
                    sync_mode: r.sync_mode === 'cron' ? 'cron' : 'interval',
                    sync_interval_minutes: r.sync_interval_minutes ?? env.sync_interval_minutes,
                    sync_cron: r.sync_cron || env.sync_cron,
                    sync_days_back: r.sync_days_back ?? env.sync_days_back,
                    data_scope: r.data_scope || env.data_scope
                };
            }
        } catch (e: any) {
            this.logger.warn('baca config DORS gagal, pakai env: ' + (e?.message || e));
        }
        return env;
    }

    async saveConfig(authUser: any, p: Partial<DorsConfig>) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const cur = await this.getConfig();
        const scope = ['TEST', 'OPERASIONAL', 'ARCHIVE'].includes(String(p.data_scope)) ? String(p.data_scope) : cur.data_scope;
        const next: DorsConfig = {
            base_url: (p.base_url ?? cur.base_url).replace(/\/+$/, ''),
            // client_id hanya ditimpa bila diisi (biar tidak terhapus saat kosong)
            client_id: p.client_id !== undefined && p.client_id !== '' ? p.client_id : cur.client_id,
            client_header: p.client_header ?? cur.client_header,
            timeout_ms: Number(p.timeout_ms ?? cur.timeout_ms) || 20000,
            sync_enabled: p.sync_enabled ?? cur.sync_enabled,
            sync_mode: p.sync_mode === 'cron' || p.sync_mode === 'interval' ? p.sync_mode : cur.sync_mode,
            sync_interval_minutes: Math.max(1, Math.min(1440, Number(p.sync_interval_minutes ?? cur.sync_interval_minutes) || 30)),
            sync_cron: this.validCron(p.sync_cron) ? String(p.sync_cron) : cur.sync_cron,
            sync_days_back: Math.max(0, Math.min(365, Number(p.sync_days_back ?? cur.sync_days_back) || 0)),
            data_scope: scope
        };
        await this.dataSource.query(
            `insert into bdb_dors_config (id, base_url, client_id, client_header, timeout_ms, sync_enabled, sync_mode, sync_interval_minutes, sync_cron, sync_days_back, data_scope, updated_at)
             values (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
             on conflict (id) do update set base_url=$1, client_id=$2, client_header=$3, timeout_ms=$4,
                 sync_enabled=$5, sync_mode=$6, sync_interval_minutes=$7, sync_cron=$8, sync_days_back=$9, data_scope=$10, updated_at=now()`,
            [next.base_url, next.client_id, next.client_header, next.timeout_ms, next.sync_enabled, next.sync_mode, next.sync_interval_minutes, next.sync_cron, next.sync_days_back, next.data_scope]
        );
        await this.reloadSchedule(); // terapkan jadwal baru langsung
        return { status: 1, data: this.publicConfig(next), message: 'Konfigurasi DORS disimpan' };
    }

    private validCron(expr?: string): boolean {
        if (!expr || typeof expr !== 'string') return false;
        try {
            // CronJob melempar bila ekspresi tidak valid
            new CronJob(expr, () => {});
            return true;
        } catch {
            return false;
        }
    }

    /** Pasang / lepas jadwal sesuai config (dipanggil saat boot & tiap simpan config). */
    async reloadSchedule() {
        const cfg = await this.getConfig();
        this.clearSchedule();
        if (!cfg.sync_enabled) {
            this.logger.log('Jadwal sync DORS non-aktif.');
            return;
        }
        if (cfg.sync_mode === 'interval') {
            const ms = Math.max(1, cfg.sync_interval_minutes) * 60_000;
            const handle = setInterval(() => {
                this.runScheduledSync().catch((e) => this.logger.error('sync terjadwal gagal: ' + (e?.message || e)));
            }, ms);
            this.scheduler.addInterval(DORS_INTERVAL_NAME, handle);
            this.nextIntervalRun = new Date(Date.now() + ms); // perkiraan jalan berikutnya
            this.logger.log(`Jadwal sync DORS aktif: tiap ${cfg.sync_interval_minutes} menit (mundur ${cfg.sync_days_back} hari, scope ${cfg.data_scope}).`);
        } else {
            if (!this.validCron(cfg.sync_cron)) {
                this.logger.warn('Ekspresi cron DORS tidak valid, jadwal tidak dipasang.');
                return;
            }
            const job = new CronJob(cfg.sync_cron, () => {
                this.runScheduledSync().catch((e) => this.logger.error('sync terjadwal gagal: ' + (e?.message || e)));
            });
            this.scheduler.addCronJob(DORS_CRON_NAME, job as any);
            job.start();
            this.logger.log(`Jadwal sync DORS aktif: cron "${cfg.sync_cron}" (mundur ${cfg.sync_days_back} hari, scope ${cfg.data_scope}).`);
        }
    }

    private clearSchedule() {
        try {
            this.scheduler.getCronJob(DORS_CRON_NAME).stop();
            this.scheduler.deleteCronJob(DORS_CRON_NAME);
        } catch {
            /* belum ada */
        }
        try {
            this.scheduler.deleteInterval(DORS_INTERVAL_NAME);
        } catch {
            /* belum ada */
        }
        this.nextIntervalRun = null;
    }

    private publicConfig(c: DorsConfig) {
        return {
            base_url: c.base_url,
            client_header: c.client_header,
            timeout_ms: c.timeout_ms,
            client_configured: !!c.client_id,
            client_id_masked: c.client_id ? `${c.client_id.slice(0, 4)}••••${c.client_id.slice(-4)}` : '',
            sync_enabled: c.sync_enabled,
            sync_mode: c.sync_mode,
            sync_interval_minutes: c.sync_interval_minutes,
            sync_cron: c.sync_cron,
            sync_days_back: c.sync_days_back,
            data_scope: c.data_scope,
            next_run: this.nextRun(c)
        };
    }

    private nextRun(c: DorsConfig): string | null {
        if (!c.sync_enabled) return null;
        if (c.sync_mode === 'interval') {
            return this.nextIntervalRun ? this.nextIntervalRun.toISOString() : null;
        }
        if (!this.validCron(c.sync_cron)) return null;
        try {
            const j = new CronJob(c.sync_cron, () => {});
            return j.nextDate().toISO();
        } catch {
            return null;
        }
    }

    /** Semua endpoint DORS (monitor/config/data) dibatasi superadmin+admin_binops, sama seperti gate menu "Integrasi" di frontend. */
    private assertAdmin(authUser: any) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(role)) {
            throw new ForbiddenException('Hanya superadmin/admin binops yang dapat mengakses Integrasi DORS.');
        }
    }

    async getConfigPublic(authUser: any) {
        this.assertAdmin(authUser);
        return { status: 1, data: this.publicConfig(await this.getConfig()) };
    }

    /** Client ID asli (tak di-mask) -- superadmin-only, dipakai utk verifikasi konfigurasi saat troubleshoot. */
    async getConfigReveal(authUser: any) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (role !== 'superadmin') {
            throw new ForbiddenException('Hanya superadmin yang dapat melihat Client ID asli.');
        }
        const cfg = await this.getConfig();
        return { status: 1, data: { client_id: cfg.client_id } };
    }

    sources(): DorsSource[] {
        try {
            const p = join(process.cwd(), 'config', 'dors-sources.json');
            const raw = JSON.parse(readFileSync(p, 'utf8'));
            if (Array.isArray(raw) && raw.length) return raw;
        } catch (e: any) {
            this.logger.warn('config/dors-sources.json tidak terbaca, pakai default: ' + (e?.message || e));
        }
        return [
            { key: 'lp_a', label: 'LP Model A', path: 'lp_a', kategori: 'lp_model_a' },
            { key: 'lp_b', label: 'LP Model B', path: 'lp_b', kategori: 'lp_model_b' }
        ];
    }

    getSources(authUser: any) {
        this.assertAdmin(authUser);
        return { status: 1, data: this.sources().map((s) => ({ key: s.key, label: s.label, path: s.path, kategori: s.kategori })) };
    }

    private twoDigit(n: number) {
        return String(n).padStart(2, '0');
    }
    private ymd(d: Date) {
        return `${d.getFullYear()}-${this.twoDigit(d.getMonth() + 1)}-${this.twoDigit(d.getDate())}`;
    }

    private async checkOne(cfg: DorsConfig, src: DorsSource, from?: string, to?: string) {
        const today = this.ymd(new Date());
        const f = from || today;
        const t = to || today;
        const url = `${cfg.base_url}/${src.path}?from=${f}&to=${t}&from_hour=00:00:00&to_hour=23:59:59&page=1&showby=updated_at&order_by=updated_at`;
        const started = Date.now();
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), cfg.timeout_ms);
            const res = await fetch(url, { signal: ctrl.signal, headers: { [cfg.client_header]: cfg.client_id, Accept: 'application/json' } });
            clearTimeout(timer);
            let total: number | null = null;
            let currentPage: number | null = null;
            let lastPage: number | null = null;
            let bodyOk = true;
            let msg: string | undefined;
            try {
                const j: any = await res.json();
                if (j && j.status === false) {
                    bodyOk = false;
                    msg = j.msg || 'ditolak DORS';
                }
                total = typeof j?.total === 'number' ? j.total : Array.isArray(j?.data) ? j.data.length : null;
                currentPage = j?.current_page ?? null;
                lastPage = j?.last_page ?? null;
            } catch {
                bodyOk = false;
                msg = 'respons bukan JSON';
            }
            return { key: src.key, label: src.label, path: src.path, url, active: res.ok && bodyOk, http_status: res.status, total, current_page: currentPage, last_page: lastPage, error: bodyOk ? undefined : msg, ms: Date.now() - started, checked_at: new Date().toISOString() };
        } catch (e: any) {
            return { key: src.key, label: src.label, path: src.path, url, active: false, http_status: 0, total: null, error: e?.name === 'AbortError' ? 'timeout' : e?.message || 'tidak terjangkau', ms: Date.now() - started, checked_at: new Date().toISOString() };
        }
    }

    async status(authUser: any, from?: string, to?: string) {
        this.assertAdmin(authUser);
        const cfg = await this.getConfig();
        const data = await Promise.all(this.sources().map((s) => this.checkOne(cfg, s, from, to)));
        return { status: 1, data, base_url: cfg.base_url, client_configured: !!cfg.client_id };
    }

    // ==================== SINKRONISASI DATA LP ====================

    private daysAgo(n: number): string {
        const d = new Date();
        d.setDate(d.getDate() - Math.max(0, n));
        return this.ymd(d);
    }

    /**
     * Ambil satu halaman DORS. Melempar bila ditolak / bukan JSON -- pesannya selalu disertai
     * status HTTP + cuplikan mentah respons, supaya kalau gagal lagi penyebabnya langsung
     * kelihatan di Riwayat Penarikan (bukan cuma "respons DORS tidak valid" generik).
     */
    private async fetchPage(cfg: DorsConfig, src: DorsSource, f: string, t: string, page: number): Promise<any> {
        const url = `${cfg.base_url}/${src.path}?from=${f}&to=${t}&from_hour=00:00:00&to_hour=23:59:59&page=${page}&showby=updated_at&order_by=updated_at`;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), cfg.timeout_ms);
        try {
            const res = await fetch(url, { signal: ctrl.signal, headers: { [cfg.client_header]: cfg.client_id, Accept: 'application/json' } });
            const rawText = await res.text().catch(() => '');
            let j: any = null;
            try {
                j = rawText ? JSON.parse(rawText) : null;
            } catch {
                j = null;
            }
            const snippet = rawText ? rawText.replace(/\s+/g, ' ').trim().slice(0, 200) : '(kosong)';
            if (!res.ok) throw new Error(`HTTP ${res.status} halaman ${page}: ${snippet}`);
            if (!j) throw new Error(`respons bukan JSON valid (halaman ${page}): ${snippet}`);
            if (j.status === false) throw new Error(j?.msg ? `ditolak DORS (halaman ${page}): ${j.msg}` : `ditolak DORS (halaman ${page}), tanpa pesan: ${snippet}`);
            return j;
        } catch (e: any) {
            if (e?.name === 'AbortError') throw new Error(`timeout setelah ${cfg.timeout_ms}ms (halaman ${page})`);
            throw e;
        } finally {
            clearTimeout(timer);
        }
    }

    /**
     * Sama seperti fetchPage, tapi coba ulang beberapa kali dengan jeda kalau gagal transient
     * (server DORS kadang sesaat balas kosong/timeout, terutama setelah sumber lain baru saja
     * menghajarnya ratusan halaman berturut-turut) -- supaya satu hiccup sesaat tidak
     * menggagalkan seluruh sumber.
     */
    private async fetchPageWithRetry(cfg: DorsConfig, src: DorsSource, f: string, t: string, page: number, retries = 2): Promise<any> {
        let lastErr: any;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await this.fetchPage(cfg, src, f, t, page);
            } catch (e: any) {
                lastErr = e;
                if (attempt < retries) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
            }
        }
        throw lastErr;
    }

    // ============ NORMALISASI RELASI (tabel masing-masing, saat tarik) ============
    // Kolom skalar top-level LP (obj/array dipetakan ke tabel relasi tersendiri).
    private static readonly MAIN_COLS = [
        'apa_terjadi', 'bagaimana_terjadi', 'dilimpahkan', 'id_emp_modus_operandi', 'id_emp_motif_kejahatan', 'id_emp_sasaran_kejahatan',
        'id_hubungan_korban_pelaku', 'id_kategori_lokasi', 'id_operasi', 'id_pasal_kamtibmas', 'id_polda', 'id_polres', 'id_polsek',
        'id_satuan', 'id_unit_terusan', 'kategori', 'kerugian', 'nama_mengetahui', 'nama_pembuat', 'no_laporan', 'no_sttlp',
        'nrp_mengetahui', 'nrp_pembuat', 'nrp_penerima', 'pangkat_mengetahui', 'pangkat_pembuat', 'pelimpahan', 'perhatian_publik',
        'redaksional_mengetahui_spkt', 'status_aktif', 'tempat_kejadian', 'tgl_laporan', 'tkp_id_desa', 'tkp_id_kecamatan',
        'tkp_id_kota', 'tkp_id_provinsi', 'uraian_kejadian', 'uraian_singkat_kejadian', 'waktu_kejadian', 'waktu_kejadian_faktual', 'zona_waktu'
    ];
    // Relasi objek 1:1 -> satu tabel per relasi (satu baris per LP).
    private static readonly OBJ_RELS: Record<string, string[]> = {
        polda: ['id', 'kode', 'nama', 'alamat', 'kode_pusiknas', 'jml_desa', 'jml_kel', 'jml_penduduk', 'jml_pers_dsp', 'jml_pers_riil', 'luas_wilayah'],
        polres: ['id', 'kode', 'nama', 'alamat', 'kode_polda', 'kode_pusiknas', 'jml_desa', 'jml_kel', 'jml_penduduk', 'jml_pers_dsp', 'jml_pers_riil', 'luas_wilayah'],
        polsek: ['id', 'kode', 'nama', 'alamat', 'alamat_web', 'kode_polda', 'kode_polres', 'kode_pusiknas', 'jml_desa', 'jml_kel', 'jml_penduduk', 'jml_pers_dsp', 'jml_pers_riil', 'luas_wilayah'],
        unit: ['id', 'unit', 'level', 'id_emp'],
        tkp_provinsi: ['kode_provinsi', 'provinsi', 'singkatan'],
        tkp_kota: ['kode_provinsi', 'kode_kabupaten', 'kabupaten', 'ibukota', 'singkatan'],
        tkp_kecamatan: ['kode_provinsi', 'kode_kabupaten', 'kode_kecamatan', 'kecamatan', 'singkatan'],
        tkp_desa: ['kode_provinsi', 'kode_kabupaten', 'kode_kecamatan', 'kode_desa', 'desa', 'singkatan'],
        hubungan_korban_pelaku: ['id', 'nama'],
        kategori_gk: ['id', 'id_emp', 'id_sub_golongan', 'id_uu', 'pasal', 'pasal_mapping', 'keterangan', 'kasus_menonjol', 'atensi_pimpinan'],
        kategori_lokasi: ['id', 'id_emp', 'lokasi'],
        petugas_penerima: ['nrp_admin', 'username', 'nama', 'pangkat', 'email', 'no_telpon']
    };
    // Relasi array 1:N -> satu tabel per relasi (banyak baris per LP).
    private static readonly ARR_RELS: Record<string, string[]> = {
        terlibat: ['id', 'id_laporan', 'nama', 'nik', 'jenis_identitas', 'jenis_kelamin', 'gender', 'tempat_lahir', 'tgl_lahir', 'umur', 'agama', 'suku', 'kewarganegaraan', 'pekerjaan', 'pendidikan_terakhir', 'alamat', 'alamat_non_nkri', 'no_hp', 'telphone', 'email', 'sosmed', 'keterlibatan', 'jenis_korban', 'status_korban', 'nomor_visum', 'created_at', 'updated_at'],
        tindak_pidana: ['id', 'id_lp', 'id_kategori_kejahatan', 'nama_kategori_kejahatan', 'id_uu', 'nama_uu', 'pasal', 'pasal_tambahan', 'pasal_mapping', 'juncto', 'subsider', 'updated_at'],
        barang_bukti: ['id', 'id_laporan', 'kode_bb', 'jenis_bb', 'jumlah', 'keterangan', 'ran_jenis', 'ran_merk', 'ran_model', 'ran_type', 'ran_warna', 'ran_warna_tnkb', 'ran_no_registrasi', 'ran_no_rangka', 'ran_no_mesin', 'ran_no_bpkb', 'ran_nama_pemilik', 'ran_alamat', 'ran_thn_pembuatan', 'ran_thn_registrasi', 'ran_isi_silinder', 'ran_bahan_bakar', 'created_at', 'updated_at']
    };

    private tableOf(rel: string) {
        return `bdb_dors_lp_${rel}`;
    }
    // rename kolom yang bentrok dgn kolom teknis tabel
    private dbCol(c: string): string {
        if (c === 'id') return 'dors_ref_id';
        if (c === 'created_at') return 'source_created_at';
        if (c === 'updated_at') return 'source_updated_at';
        return c;
    }
    // nilai sel -> text (objek/array kompleks di-serialize, sisanya as-is)
    private cell(v: any): string | null {
        if (v === undefined || v === null || v === '') return null;
        if (typeof v === 'object') return JSON.stringify(v);
        return String(v);
    }

    private normReady = false;
    /** Buat tabel-tabel normalisasi (idempotent). */
    async ensureNormalizedTables() {
        if (this.normReady) return;
        const mainCols = DorsService.MAIN_COLS.map((c) => `"${c}" text`).join(', ');
        await this.dataSource.query(`
            create table if not exists bdb_dors_lp (
                id bigserial primary key,
                raw_id bigint references bdb_dors_raw_lp(id) on delete set null,
                dors_lp_id bigint not null,
                model_lp text not null,
                data_scope text,
                import_batch text,
                source_created_at text,
                source_updated_at text,
                synced_at timestamp not null default now(),
                ${mainCols},
                unique (dors_lp_id, model_lp)
            );
        `);
        for (const [rel, cols] of Object.entries(DorsService.OBJ_RELS)) {
            const colDefs = cols.map((c) => `"${this.dbCol(c)}" text`).join(', ');
            await this.dataSource.query(`
                create table if not exists ${this.tableOf(rel)} (
                    id bigserial primary key,
                    lp_id bigint not null references bdb_dors_lp(id) on delete cascade,
                    dors_lp_id bigint,
                    model_lp text,
                    ${colDefs},
                    unique (lp_id)
                );
            `);
        }
        for (const [rel, cols] of Object.entries(DorsService.ARR_RELS)) {
            const colDefs = cols.map((c) => `"${this.dbCol(c)}" text`).join(', ');
            await this.dataSource.query(`
                create table if not exists ${this.tableOf(rel)} (
                    id bigserial primary key,
                    lp_id bigint not null references bdb_dors_lp(id) on delete cascade,
                    dors_lp_id bigint,
                    model_lp text,
                    ${colDefs}
                );
            `);
            await this.dataSource.query(`create index if not exists ${this.tableOf(rel)}_lp_idx on ${this.tableOf(rel)} (lp_id);`);
        }
        this.normReady = true;
    }

    /** Normalisasi satu LP: pecah objek & array ke tabel masing-masing (tak ada obj/array tersisa). */
    private async normalizeLp(p: any, model: string, scope: string, batch: string, rawId: number | null) {
        // 1) baris utama (skalar) -> bdb_dors_lp
        const cols = ['raw_id', 'dors_lp_id', 'model_lp', 'data_scope', 'import_batch', 'source_created_at', 'source_updated_at', ...DorsService.MAIN_COLS];
        const vals = [rawId, p.id, model, scope, batch, this.cell(p.created_at), this.cell(p.updated_at), ...DorsService.MAIN_COLS.map((c) => this.cell(p[c]))];
        const ph = vals.map((_, i) => `$${i + 1}`).join(',');
        const updSet = cols.filter((c) => c !== 'dors_lp_id' && c !== 'model_lp').map((c) => `"${c}"=excluded."${c}"`).join(', ');
        const ret = await this.dataSource.query(
            `insert into bdb_dors_lp (${cols.map((c) => `"${c}"`).join(',')}, synced_at)
             values (${ph}, now())
             on conflict (dors_lp_id, model_lp) do update set ${updSet}, synced_at=now()
             returning id`,
            vals
        );
        const lpId = ret[0].id;

        // 2) relasi objek 1:1 -> hapus lama lalu insert
        for (const [rel, relCols] of Object.entries(DorsService.OBJ_RELS)) {
            await this.dataSource.query(`delete from ${this.tableOf(rel)} where lp_id=$1`, [lpId]);
            const o = p[rel];
            if (!o || typeof o !== 'object' || Array.isArray(o)) continue;
            const c2 = ['lp_id', 'dors_lp_id', 'model_lp', ...relCols.map((c) => this.dbCol(c))];
            const v2 = [lpId, p.id, model, ...relCols.map((c) => this.cell(o[c]))];
            await this.dataSource.query(
                `insert into ${this.tableOf(rel)} (${c2.map((c) => `"${c}"`).join(',')}) values (${v2.map((_, i) => `$${i + 1}`).join(',')})`,
                v2
            );
        }

        // 3) relasi array 1:N -> hapus lama lalu insert tiap elemen
        for (const [rel, relCols] of Object.entries(DorsService.ARR_RELS)) {
            await this.dataSource.query(`delete from ${this.tableOf(rel)} where lp_id=$1`, [lpId]);
            const arr = p[rel];
            if (!Array.isArray(arr) || !arr.length) continue;
            const c2 = ['lp_id', 'dors_lp_id', 'model_lp', ...relCols.map((c) => this.dbCol(c))];
            for (const el of arr) {
                if (!el || typeof el !== 'object') continue;
                const v2 = [lpId, p.id, model, ...relCols.map((c) => this.cell(el[c]))];
                await this.dataSource.query(
                    `insert into ${this.tableOf(rel)} (${c2.map((c) => `"${c}"`).join(',')}) values (${v2.map((_, i) => `$${i + 1}`).join(',')})`,
                    v2
                );
            }
        }
        return lpId;
    }

    /**
     * Simpan baris LP BARU (dedup by dors_lp_id+model_lp): ke bdb_dors_raw_lp (payload utuh)
     * lalu dinormalisasi ke tabel-tabel relasi. ID yang sudah pernah ditarik DILEWATI.
     * Mengembalikan jumlah baris baru.
     */
    private async insertNewRows(rows: any[], model: string, scope: string, batch: string): Promise<number> {
        const valid = rows.filter((r) => r && r.id !== undefined && r.id !== null);
        if (!valid.length) return 0;
        await this.ensureNormalizedTables();
        const CHUNK = 100;
        let inserted = 0;
        for (let i = 0; i < valid.length; i += CHUNK) {
            const slice = valid.slice(i, i + CHUNK);
            // baris yang benar-benar baru (belum ada di raw untuk model ini)
            const ids = slice.map((r) => r.id);
            const existRows = await this.dataSource.query(`select dors_lp_id from bdb_dors_raw_lp where model_lp=$1 and dors_lp_id = any($2)`, [model, ids]);
            const existing = new Set(existRows.map((r: any) => String(r.dors_lp_id)));
            const fresh = slice.filter((r) => !existing.has(String(r.id)));
            if (!fresh.length) continue;

            // insert raw (payload utuh) untuk yang baru
            const params: any[] = [];
            const scopeIdx = fresh.length * 4 + 1;
            const batchIdx = fresh.length * 4 + 2;
            const valuesSql = fresh
                .map((r, idx) => {
                    const b = idx * 4;
                    params.push(r.id, model, r.no_laporan ?? null, JSON.stringify(r));
                    return `($${b + 1},$${b + 2},$${b + 3},$${b + 4}::jsonb,'DORS',$${scopeIdx},$${batchIdx}, now(), now(), now())`;
                })
                .join(',');
            params.push(scope, batch);
            const ret = await this.dataSource.query(
                `insert into bdb_dors_raw_lp (dors_lp_id, model_lp, no_laporan, payload_json, source, data_scope, import_batch, synced_at, created_at, updated_at)
                 values ${valuesSql}
                 on conflict (dors_lp_id, model_lp) do nothing
                 returning id, dors_lp_id`,
                params
            );
            const rawIdByDors = new Map<string, number>((ret || []).map((x: any) => [String(x.dors_lp_id), x.id]));

            // normalisasi tiap baris baru -> tabel relasi masing-masing
            for (const r of fresh) {
                try {
                    await this.normalizeLp(r, model, scope, batch, rawIdByDors.get(String(r.id)) ?? null);
                    inserted++;
                } catch (e: any) {
                    this.logger.warn(`normalisasi LP ${r.id} (${model}) gagal: ${e?.message || e}`);
                }
            }
        }
        return inserted;
    }

    /**
     * Normalisasi ulang baris raw yang BELUM ternormalisasi (mis. data lama sebelum
     * tabel relasi ada). Dipanggil manual via endpoint. Aman diulang.
     */
    async backfillNormalization(authUser: any, limit = 1000) {
        this.assertAdmin(authUser);
        await this.ensureNormalizedTables();
        const cap = Math.max(1, Math.min(5000, Number(limit) || 1000));
        const rows = await this.dataSource.query(
            `select r.id as raw_id, r.dors_lp_id, r.model_lp, r.data_scope, r.import_batch, r.payload_json
             from bdb_dors_raw_lp r
             left join bdb_dors_lp n on n.dors_lp_id = r.dors_lp_id and n.model_lp = r.model_lp
             where n.id is null
             order by r.id
             limit $1`,
            [cap]
        );
        let done = 0;
        let fail = 0;
        for (const r of rows) {
            try {
                await this.normalizeLp(r.payload_json, r.model_lp, r.data_scope || 'OPERASIONAL', r.import_batch || 'backfill', r.raw_id);
                done++;
            } catch (e: any) {
                fail++;
                this.logger.warn(`backfill LP ${r.dors_lp_id} gagal: ${e?.message || e}`);
            }
        }
        const remain = await this.dataSource.query(
            `select count(*)::int as c from bdb_dors_raw_lp r left join bdb_dors_lp n on n.dors_lp_id=r.dors_lp_id and n.model_lp=r.model_lp where n.id is null`
        );
        return { status: 1, data: { normalized: done, failed: fail, remaining: remain[0]?.c || 0 }, message: `Backfill: ${done} dinormalisasi, sisa ${remain[0]?.c || 0}.` };
    }

    private static readonly MAX_AUTO_ATTEMPTS = 5;
    // jeda antar percobaan otomatis (naik bertahap) -- kasih server DORS waktu pulih dari hiccup
    // sesaat (rate limit / server lagi sibuk) sebelum dicoba lagi, bukan langsung digempur ulang.
    private static readonly RETRY_BACKOFF_MS = [5000, 15000, 30000, 60000, 60000];

    /** Progress hidup 1 sumber dlm 1 job sync -- disimpan di sources_json, dibaca ulang tiap percobaan
     *  otomatis berikutnya supaya TIDAK mulai dari halaman 1 lagi kalau sebelumnya sudah sampai halaman N. */
    private async persistProgress(
        logId: number,
        states: any[],
        extra: { current_source?: string | null; current_page?: number | null; current_last_page?: number | null; current_chunk_from?: string | null; current_chunk_to?: string | null; attempt: number }
    ) {
        const chunksDone = states.filter((s) => s.status === 'done').length;
        await this.syncLogs.progress(
            `update bdb_dors_sync_log set sources_json=$2::jsonb, current_source=$3, current_page=$4, current_last_page=$5, current_chunk_from=$6, current_chunk_to=$7, chunks_done=$8, chunks_total=$9, attempt=$10, total_fetched=$11, total_upserted=$12 where id=$1`,
            [logId, JSON.stringify(states), extra.current_source ?? null, extra.current_page ?? null, extra.current_last_page ?? null, extra.current_chunk_from ?? null, extra.current_chunk_to ?? null, chunksDone, states.length, extra.attempt, states.reduce((n, s) => n + s.fetched, 0), states.reduce((n, s) => n + s.upserted, 0)]
        );
    }

    /**
     * Pecah [from,to] jadi beberapa sub-rentang (default per 31 hari) -- backfill besar (mis. 1 tahun)
     * jadi banyak unit KECIL yg checkpoint & retry SENDIRI-SENDIRI, bukan 1 pull raksasa tak terputus.
     * Kalau chunk ke-7 dari 12 macet terus, chunk 1-6 yg sudah beres TIDAK diulang -- hanya chunk 7 dst.
     * Urutan antar-chunk tidak penting (tiap chunk independen, insert idempotent by dors_lp_id).
     */
    private splitIntoChunks(from: string, to: string, maxDays = 31): { from: string; to: string }[] {
        const chunks: { from: string; to: string }[] = [];
        const end = new Date(`${to}T00:00:00`);
        let curStart = new Date(`${from}T00:00:00`);
        while (curStart.getTime() <= end.getTime()) {
            const curEnd = new Date(curStart);
            curEnd.setDate(curEnd.getDate() + maxDays - 1);
            if (curEnd.getTime() > end.getTime()) curEnd.setTime(end.getTime());
            chunks.push({ from: this.ymd(curStart), to: this.ymd(curEnd) });
            curStart = new Date(curEnd);
            curStart.setDate(curStart.getDate() + 1);
        }
        return chunks.length ? chunks : [{ from, to }];
    }

    /**
     * Jalankan SATU percobaan utk satu sumber, MULAI dari checkpoint terakhir (state.last_success_page)
     * -- bukan selalu dari halaman 1 -- supaya percobaan otomatis berikutnya melanjutkan, bukan mengulang.
     * onPageDone dipanggil TIAP HALAMAN berhasil (bukan cuma di akhir) utk update progress live yg dipoll UI.
     */
    private async runOneSourceAttempt(cfg: DorsConfig, src: DorsSource, f: string, t: string, scope: string, batch: string, state: any, onPageDone: () => Promise<void>): Promise<void> {
        const model = state.model;
        state.status = 'running';
        state.error = null;
        const startedAttempt = Date.now();
        try {
            let startPage = state.last_success_page + 1;
            if (state.last_success_page === 0) {
                const first = await this.fetchPageWithRetry(cfg, src, f, t, 1);
                state.pages = Number(first?.last_page) || 1;
                state.total = typeof first?.total === 'number' ? first.total : null;
                const rows = first?.data || [];
                state.upserted += await this.insertNewRows(rows, model, scope, batch);
                state.fetched += rows.length;
                state.last_success_page = 1;
                await onPageDone();
                startPage = 2;
            }
            for (let p = startPage; p <= state.pages; p++) {
                const j = await this.fetchPageWithRetry(cfg, src, f, t, p);
                const rows = Array.isArray(j?.data) ? j.data : [];
                state.upserted += await this.insertNewRows(rows, model, scope, batch);
                state.fetched += rows.length;
                state.last_success_page = p;
                await onPageDone();
            }
            state.status = 'done';
        } catch (e: any) {
            // checkpoint (last_success_page) TETAP tersimpan apa adanya -- percobaan berikutnya
            // (atau klik "Tarik Sekarang" ulang) lanjut dari sini, bukan dari halaman 1.
            state.status = 'error';
            state.error = e?.message || 'gagal';
        } finally {
            state.ms += Date.now() - startedAttempt;
        }
    }

    /**
     * Jalankan job sync SAMPAI SELESAI atau habis percobaan (MAX_AUTO_ATTEMPTS) -- rentang [f,t] dipecah
     * jadi chunk (splitIntoChunks) x sumber, tiap kombinasi checkpoint & retry SENDIRI. Chunk yg masih
     * 'error'/'pending' dicoba lagi otomatis dari checkpoint halamannya, dgn jeda naik bertahap. Baru
     * benar-benar berhenti & lapor jelas ("macet di periode X halaman Y") setelah percobaan habis.
     */
    private async runSyncJob(logId: number, cfg: DorsConfig, f: string, t: string, scope: string, batch: string) {
        const chunks = this.splitIntoChunks(f, t);
        const states = this.sources().flatMap((s) =>
            chunks.map((c, ci) => ({
                key: s.key, label: s.label, model: s.kategori || s.key,
                chunk_index: ci, chunk_total: chunks.length, chunk_from: c.from, chunk_to: c.to,
                total: null as number | null, pages: 0, last_success_page: 0, fetched: 0, upserted: 0,
                status: 'pending' as 'pending' | 'running' | 'done' | 'error', error: null as string | null, ms: 0
            }))
        );
        let attempt = 0;
        while (attempt < DorsService.MAX_AUTO_ATTEMPTS) {
            attempt++;
            const pending = states.filter((s) => s.status !== 'done');
            if (!pending.length) break;
            // Sumber (LP Model A/B) jalan PARALEL -- tak ada state/tabel yg dishare antar sumber
            // (insertNewRows beda model_lp, tiap state chunk independen), jadi aman. Chunk dalam
            // SATU sumber tetap berurutan (checkpoint per-chunk lebih simpel, & tak menghajar DORS
            // dgn >2 koneksi bersamaan sekaligus).
            const bySource = new Map<string, typeof pending>();
            for (const s of pending) {
                if (!bySource.has(s.key)) bySource.set(s.key, []);
                bySource.get(s.key)!.push(s);
            }
            // Tarik A/B tetap paralel, tetapi selesaikan per ronde chunk. Mapping global
            // hanya dipanggil SEKALI setelah pasangan chunk A/B selesai. Sebelumnya tiap
            // sumber memanggil mapFromDors() sendiri dari Promise.all sehingga dua scan
            // berat bisa bertabrakan dan menghabiskan pool koneksi DB.
            const sourceLists = Array.from(bySource.values());
            const maxRounds = Math.max(0, ...sourceLists.map((list) => list.length));
            for (let roundIndex = 0; roundIndex < maxRounds; roundIndex++) {
                const round = sourceLists.map((list) => list[roundIndex]).filter(Boolean);
                await Promise.all(round.map(async (s) => {
                    const src = this.sources().find((x) => x.key === s.key)!;
                    await this.runOneSourceAttempt(cfg, src, s.chunk_from, s.chunk_to, scope, batch, s, () =>
                        this.persistProgress(logId, states, { current_source: s.key, current_page: s.last_success_page, current_last_page: s.pages, current_chunk_from: s.chunk_from, current_chunk_to: s.chunk_to, attempt })
                    );
                }));
                if (round.some((s) => s.status === 'done')) {
                    try {
                        await this.laporanPolisi.mapFromDors();
                    } catch (e: any) {
                        const labels = round.map((s) => `${s.key}:${s.chunk_from}..${s.chunk_to}`).join(', ');
                        this.logger.warn(`Gagal mapping incremental sesudah ronde chunk ${labels}: ` + (e?.message || e));
                    }
                }
            }
            await this.persistProgress(logId, states, { attempt });
            if (states.every((s) => s.status === 'done')) break;
            if (attempt < DorsService.MAX_AUTO_ATTEMPTS) {
                const wait = DorsService.RETRY_BACKOFF_MS[Math.min(attempt - 1, DorsService.RETRY_BACKOFF_MS.length - 1)];
                this.logger.warn(`Sync DORS: ${states.filter((s) => s.status === 'error').length} chunk blm selesai di percobaan ${attempt}, coba lagi dlm ${wait / 1000}s...`);
                await new Promise((r) => setTimeout(r, wait));
            }
        }
        const allDone = states.every((s) => s.status === 'done');
        const totalFetched = states.reduce((a, s) => a + s.fetched, 0);
        const totalNew = states.reduce((a, s) => a + s.upserted, 0);
        const failedStates = states.filter((s) => s.status !== 'done');
        const stoppedReason = failedStates.length
            ? `Berhenti setelah ${attempt} percobaan: ${failedStates.map((s) => `${s.label} macet di periode ${s.chunk_from}..${s.chunk_to} halaman ${s.last_success_page + 1}${s.pages ? '/' + s.pages : ''} (${s.error})`).join('; ')}`
            : null;
        return { states, allDone, totalFetched, totalNew, attempt, stoppedReason };
    }

    /** Bagian CEPAT (validasi + buat baris log + kunci flag syncing) -- dipisah dari eksekusi lambatnya. */
    private async beginSync(from?: string, to?: string, trigger: 'manual' | 'cron' = 'manual') {
        if (this.syncing) {
            return { ok: false as const, status: 0, message: 'Sinkronisasi lain sedang berjalan, coba lagi sebentar.' };
        }
        // Claim before the first await so concurrent requests cannot start two jobs.
        this.syncing = true;
        try {
        const cfg = await this.getConfig();
        const today = this.ymd(new Date());
        const t = to || today;
        // manual: default hari ini; cron/terjadwal: mundur N hari s/d hari ini
        const f = from || (trigger === 'cron' ? this.daysAgo(cfg.sync_days_back) : today);
        if (!cfg.client_id) {
            this.syncing = false;
            return { ok: false as const, status: 0, message: 'Client ID DORS belum dikonfigurasi.' };
        }
        const batch = `${trigger}-${new Date().toISOString()}`;
        const logRow = await this.syncLogs.query(
            `insert into bdb_dors_sync_log (trigger, from_date, to_date, status, started_at, attempt, max_attempts)
             values ($1,$2,$3,'running', now(), 0, $4) returning id`,
            [trigger, f, t, DorsService.MAX_AUTO_ATTEMPTS], false
        );
        return { ok: true as const, logId: logRow[0].id as number, cfg, f, t, batch, started: Date.now() };
        } catch (error) {
            this.syncing = false;
            throw error;
        }
    }

    /** Jalankan job penuh (semua percobaan) sampai selesai, lalu tutup log & lepas flag syncing. */
    private async finishSyncJob(logId: number, cfg: DorsConfig, f: string, t: string, batch: string, started: number) {
        try {
            const result = await this.runSyncJob(logId, cfg, f, t, cfg.data_scope, batch);
            const status = result.allDone ? 'success' : result.totalNew > 0 ? 'partial' : 'error';
            await this.syncLogs.terminal(
                `update bdb_dors_sync_log set status=$2, total_fetched=$3, total_upserted=$4, sources_json=$5::jsonb, error=$6, stopped_reason=$6, finished_at=now(), duration_ms=$7, attempt=$8 where id=$1`,
                [logId, status, result.totalFetched, result.totalNew, JSON.stringify(result.states), result.stoppedReason, Date.now() - started, result.attempt]
            );
            this.logger.log(`Sync DORS ${f}..${t}: ${result.totalNew} baru, status=${status}, percobaan=${result.attempt}${result.stoppedReason ? ', ' + result.stoppedReason : ''}`);
            // Setelah sinkron, petakan LP baru ke Laporan Polisi (yang kode_pusiknas cocok satker)
            let mappedBaru = 0;
            try {
                const mapRes = await this.laporanPolisi.mapFromDors();
                mappedBaru = mapRes?.data?.mapped_baru || 0;
            } catch (e: any) {
                this.logger.warn('auto-map ke Laporan Polisi gagal: ' + (e?.message || e));
            }
            // Jumlah Penduduk satker WILAYAH (Polda/Polres/Polsek) ikut disinkron dari data DORS yg
            // baru masuk -- sekali per job (bukan per-chunk spt mapFromDors di atas) krn ini scan
            // seluruh bdb_laporan_polisi, cukup jalan di ujung.
            try {
                await this.satkerService.syncPopulasiWilayahDariDors();
            } catch (e: any) {
                this.logger.warn('sinkron Jumlah Penduduk dari DORS gagal: ' + (e?.message || e));
            }
            return {
                status: result.allDone ? 1 : 0,
                data: { log_id: logId, from: f, to: t, total_fetched: result.totalFetched, total_new: result.totalNew, mapped_baru: mappedBaru, attempt: result.attempt, stopped_reason: result.stoppedReason, sources: result.states, duration_ms: Date.now() - started },
                message: result.allDone ? `Sinkronisasi selesai: ${result.totalNew} data baru, ${mappedBaru} dipetakan ke Laporan Polisi.` : `Sinkronisasi berhenti setelah ${result.attempt} percobaan. ${result.stoppedReason || ''}`
            };
        } catch (e: any) {
            await this.syncLogs.terminal(`update bdb_dors_sync_log set status='error', error=$2, stopped_reason=$2, finished_at=now(), duration_ms=$3 where id=$1`, [logId, e?.message || 'gagal', Date.now() - started]);
            this.logger.error('Sync DORS gagal total: ' + (e?.message || e));
            return { status: 0, message: 'Sinkronisasi gagal: ' + (e?.message || e) };
        } finally {
            this.syncing = false;
        }
    }

    /**
     * Tarik data LP dari semua sumber untuk rentang tanggal, simpan ke DB -- MENUNGGU sampai selesai
     * (dipakai jadwal/cron, yg memang tidak terikat 1 respons HTTP jadi aman menunggu lama).
     */
    async syncRange(from?: string, to?: string, trigger: 'manual' | 'cron' = 'manual') {
        const begin = await this.beginSync(from, to, trigger);
        if (!begin.ok) return begin;
        return this.finishSyncJob(begin.logId, begin.cfg, begin.f, begin.t, begin.batch, begin.started);
    }

    /**
     * Dipicu tombol "Tarik Sekarang" di UI -- balas CEPAT dgn log_id (bagian beginSync saja),
     * proses sesungguhnya (bisa berjam-jam utk backfill besar) jalan di LATAR BELAKANG supaya tak
     * menggantungkan 1 request HTTP berjam-jam (rawan kena timeout browser/proxy). Progress dipoll
     * lewat getSyncJobStatus(). Kalau koneksi klien putus di tengah, proses TETAP lanjut di server.
     */
    async manualSyncStart(authUser: any, from?: string, to?: string) {
        this.assertAdmin(authUser);
        const begin = await this.beginSync(from, to, 'manual');
        if (!begin.ok) return begin;
        this.finishSyncJob(begin.logId, begin.cfg, begin.f, begin.t, begin.batch, begin.started).catch((e: any) => {
            this.logger.error('finishSyncJob (manual) tak tertangani: ' + (e?.message || e));
        });
        return { status: 1, data: { log_id: begin.logId }, message: 'Sinkronisasi dimulai di latar belakang. Progres bisa dipantau langsung di bawah.' };
    }

    /** Status live 1 job sync (dipoll dari UI tiap beberapa detik selama status='running'). */
    async getSyncJobStatus(authUser: any, logId: number) {
        this.assertAdmin(authUser);
        const rows = await this.syncLogs.query(
            `select id, trigger, from_date, to_date, status, total_fetched, total_upserted, sources_json, error, stopped_reason,
                    attempt, max_attempts, current_source, current_page, current_last_page, current_chunk_from, current_chunk_to,
                    chunks_done, chunks_total, started_at, finished_at, duration_ms
             from bdb_dors_sync_log where id=$1`,
            [logId]
        );
        if (!rows.length) throw new NotFoundException('Log sinkronisasi tidak ditemukan.');
        return { status: 1, data: { ...rows[0], running: this.syncing } };
    }

    /** Dipanggil oleh jadwal: rentang otomatis dari config (mundur N hari s/d hari ini). */
    async runScheduledSync() {
        const cfg = await this.getConfig();
        // perbarui perkiraan jalan berikutnya (mode interval)
        if (cfg.sync_mode === 'interval') {
            this.nextIntervalRun = new Date(Date.now() + Math.max(1, cfg.sync_interval_minutes) * 60_000);
        }
        return this.syncRange(undefined, undefined, 'cron');
    }

    /** Riwayat eksekusi sync terbaru. */
    async recentLogs(authUser: any, limit = 20) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const rows = await this.syncLogs.query(
            `select id, trigger, from_date, to_date, status, total_fetched, total_upserted, sources_json, error, stopped_reason,
                    attempt, max_attempts, current_source, current_page, current_last_page, current_chunk_from, current_chunk_to,
                    chunks_done, chunks_total, started_at, finished_at, duration_ms
             from bdb_dors_sync_log order by started_at desc limit $1`,
            [Math.max(1, Math.min(100, Number(limit) || 20))]
        );
        const cfg = await this.getConfig();
        return {
            status: 1,
            data: rows,
            running: this.syncing,
            schedule: {
                enabled: cfg.sync_enabled,
                mode: cfg.sync_mode,
                interval_minutes: cfg.sync_interval_minutes,
                cron: cfg.sync_cron,
                days_back: cfg.sync_days_back,
                data_scope: cfg.data_scope,
                next_run: this.nextRun(cfg)
            }
        };
    }

    // ============ DATA HASIL TARIKAN (menu terpisah) ============

    /** Ringkasan jumlah data tersimpan per model + waktu sync terakhir. */
    async dataStats(authUser: any) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const perModel = await this.dataSource.query(
            `select model_lp, count(*)::int as jumlah, max(synced_at) as terakhir_sync
             from bdb_dors_raw_lp group by model_lp order by model_lp`
        );
        const totalRow = await this.dataSource.query('select count(*)::int as total, max(synced_at) as terakhir from bdb_dors_raw_lp');
        // jumlah per level penanganan (terdalam yang terisi)
        const perLevelRow = await this.dataSource.query(
            `select
                count(*) filter (where jsonb_typeof(payload_json->'polsek')='object')::int as polsek,
                count(*) filter (where jsonb_typeof(payload_json->'polres')='object' and jsonb_typeof(payload_json->'polsek') is distinct from 'object')::int as polres,
                count(*) filter (where jsonb_typeof(payload_json->'polda')='object' and jsonb_typeof(payload_json->'polres') is distinct from 'object' and jsonb_typeof(payload_json->'polsek') is distinct from 'object' and (payload_json->'polda'->>'nama' ilike '%mabes%') is not true)::int as polda,
                count(*) filter (where (jsonb_typeof(payload_json->'polda')='object' and jsonb_typeof(payload_json->'polres') is distinct from 'object' and jsonb_typeof(payload_json->'polsek') is distinct from 'object' and payload_json->'polda'->>'nama' ilike '%mabes%') or (jsonb_typeof(payload_json->'polda') is distinct from 'object' and jsonb_typeof(payload_json->'polres') is distinct from 'object' and jsonb_typeof(payload_json->'polsek') is distinct from 'object'))::int as mabes
             from bdb_dors_raw_lp`
        );
        const srcMap = new Map(this.sources().map((s) => [s.kategori || s.key, s.label]));
        return {
            status: 1,
            data: {
                total: totalRow[0]?.total || 0,
                terakhir_sync: totalRow[0]?.terakhir || null,
                per_model: perModel.map((r: any) => ({ model_lp: r.model_lp, label: srcMap.get(r.model_lp) || r.model_lp, jumlah: r.jumlah, terakhir_sync: r.terakhir_sync })),
                per_level: {
                    Mabes: perLevelRow[0]?.mabes || 0,
                    Polda: perLevelRow[0]?.polda || 0,
                    Polres: perLevelRow[0]?.polres || 0,
                    Polsek: perLevelRow[0]?.polsek || 0
                }
            }
        };
    }

    /** Daftar data LP hasil tarikan (paginasi + filter model & pencarian no laporan). */
    async listData(authUser: any, opts: { model?: string; search?: string; level?: string; page?: number; row?: number }) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const where: string[] = [];
        const params: any[] = [];
        if (opts.model) {
            params.push(opts.model);
            where.push(`model_lp = $${params.length}`);
        }
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`no_laporan ilike $${params.length}`);
        }
        // filter level satker penanganan (terdalam yang terisi)
        const hasPolsek = `jsonb_typeof(payload_json->'polsek')='object'`;
        const hasPolres = `jsonb_typeof(payload_json->'polres')='object'`;
        const hasPolda = `jsonb_typeof(payload_json->'polda')='object'`;
        const noPolsek = `jsonb_typeof(payload_json->'polsek') is distinct from 'object'`;
        const noPolres = `jsonb_typeof(payload_json->'polres') is distinct from 'object'`;
        const noPolda = `jsonb_typeof(payload_json->'polda') is distinct from 'object'`;
        const isMabes = `payload_json->'polda'->>'nama' ilike '%mabes%'`;
        const levelCond: Record<string, string> = {
            Polsek: hasPolsek,
            Polres: `${hasPolres} and ${noPolsek}`,
            Polda: `${hasPolda} and ${noPolres} and ${noPolsek} and (${isMabes}) is not true`,
            Mabes: `(${hasPolda} and ${noPolres} and ${noPolsek} and ${isMabes}) or (${noPolda} and ${noPolres} and ${noPolsek})`
        };
        if (opts.level && levelCond[opts.level]) {
            where.push(`(${levelCond[opts.level]})`);
        }
        const whereSql = where.length ? 'where ' + where.join(' and ') : '';
        const totalRow = await this.dataSource.query(`select count(*)::int as c from bdb_dors_raw_lp ${whereSql}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(
            `select id, dors_lp_id, model_lp, no_laporan, data_scope, import_batch, synced_at, payload_json,
                -- Satker penanganan = terdalam yang terisi (polsek > polres > polda)
                case
                    when jsonb_typeof(payload_json->'polsek')='object' then 'Polsek'
                    when jsonb_typeof(payload_json->'polres')='object' then 'Polres'
                    when jsonb_typeof(payload_json->'polda')='object' and payload_json->'polda'->>'nama' ilike '%mabes%' then 'Mabes'
                    when jsonb_typeof(payload_json->'polda')='object' then 'Polda'
                    else 'Mabes'
                end as penanganan_level,
                case
                    when jsonb_typeof(payload_json->'polsek')='object' then payload_json->'polsek'->>'nama'
                    when jsonb_typeof(payload_json->'polres')='object' then payload_json->'polres'->>'nama'
                    when jsonb_typeof(payload_json->'polda')='object' then payload_json->'polda'->>'nama'
                end as penanganan_nama,
                case
                    when jsonb_typeof(payload_json->'polsek')='object' then payload_json->'polsek'->>'kode_pusiknas'
                    when jsonb_typeof(payload_json->'polres')='object' then payload_json->'polres'->>'kode_pusiknas'
                    when jsonb_typeof(payload_json->'polda')='object' then payload_json->'polda'->>'kode_pusiknas'
                end as penanganan_kode_pusiknas,
                payload_json->'polda'->>'nama' as polda_nama,
                payload_json->'polres'->>'nama' as polres_nama,
                payload_json->'polsek'->>'nama' as polsek_nama,
                payload_json->'unit'->>'unit' as unit_nama,
                payload_json->'unit'->>'level' as unit_level,
                (select string_agg(x.txt, '; ') from (
                    select distinct coalesce(nullif(tp->>'nama_kategori_kejahatan',''),'(tanpa kategori)')
                        || case when coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) is not null
                                then ' — ' || coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal','')) else '' end as txt
                    from jsonb_array_elements(case when jsonb_typeof(payload_json->'tindak_pidana')='array' then payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                ) x) as dugaan_tindak_pidana
             from bdb_dors_raw_lp ${whereSql}
             order by synced_at desc, id desc
             limit $${params.length - 1} offset $${params.length}`,
            params
        );
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }
}
