"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DorsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const typeorm_1 = require("typeorm");
const fs_1 = require("fs");
const path_1 = require("path");
const laporan_polisi_service_1 = require("../laporan-polisi/laporan-polisi.service");
const satker_service_1 = require("../satker/satker.service");
const sync_log_store_1 = require("./sync-log.store");
const DORS_CRON_NAME = 'dors-lp-sync';
const DORS_INTERVAL_NAME = 'dors-lp-sync-interval';
let DorsService = class DorsService {
    static { DorsService_1 = this; }
    dataSource;
    scheduler;
    laporanPolisi;
    satkerService;
    logger = new common_1.Logger('DorsService');
    syncing = false;
    stopRequested = false;
    syncLogStore = null;
    configSchemaCheck = null;
    get syncLogs() {
        return this.syncLogStore ||= new sync_log_store_1.SyncLogStore(this.dataSource, this.logger);
    }
    async onModuleDestroy() {
        if (this.syncLogStore)
            await this.syncLogStore.close();
    }
    nextIntervalRun = null;
    constructor(dataSource, scheduler, laporanPolisi, satkerService) {
        this.dataSource = dataSource;
        this.scheduler = scheduler;
        this.laporanPolisi = laporanPolisi;
        this.satkerService = satkerService;
    }
    async onModuleInit() {
        try {
            await this.ensureNormalizedTables();
        }
        catch (e) {
            this.logger.warn('gagal menyiapkan tabel normalisasi DORS: ' + (e?.message || e));
        }
        try {
            await this.cleanupOrphanedSyncJobs();
        }
        catch (e) {
            this.logger.warn('gagal bersihkan job sync nyangkut: ' + (e?.message || e));
        }
        try {
            await this.reloadSchedule();
        }
        catch (e) {
            this.logger.warn('gagal pasang jadwal DORS saat boot: ' + (e?.message || e));
        }
        this.checkStartupSync().catch((e) => this.logger.error('Startup sync DORS error: ' + (e?.message || e)));
    }
    async checkStartupSync() {
        try {
            const cfg = await this.getConfig();
            if (!cfg.sync_enabled || !cfg.client_id)
                return;
            const lastRows = await this.syncLogs.query(`select started_at, status from bdb_dors_sync_log where status='success' order by started_at desc limit 1`);
            const lastSync = lastRows[0]?.started_at ? new Date(lastRows[0].started_at).getTime() : 0;
            const intervalMs = Math.max(15, cfg.sync_interval_minutes) * 60_000;
            const now = Date.now();
            if (now - lastSync > intervalMs) {
                this.logger.log(`[DorsService] Sync terakhir (${lastRows[0]?.started_at ? new Date(lastRows[0].started_at).toLocaleString() : 'belum ada'}) telah melewati interval (${cfg.sync_interval_minutes}m). Menjadwalkan startup sync dalam 10 detik...`);
                setTimeout(() => {
                    this.runScheduledSync().catch((e) => this.logger.error('Startup DORS sync gagal: ' + (e?.message || e)));
                }, 10_000);
            }
        }
        catch (err) {
            this.logger.warn('Gagal cek status startup sync DORS: ' + (err?.message || err));
        }
    }
    async cleanupOrphanedSyncJobs() {
        await this.ensureConfigTable();
        const rows = await this.syncLogs.query(`update bdb_dors_sync_log set status='error', stopped_reason='Proses terhenti (server restart/mati sebelum selesai). Progres sebagian sudah tersimpan (aman, tidak dobel) -- klik "Tarik Sekarang" lagi dgn rentang yg sama utk melanjutkan.', error='Terputus oleh restart server.', finished_at=now()
             where status='running' returning id`);
        if (rows.length)
            this.logger.warn(`Ditemukan ${rows.length} job sync DORS nyangkut dari sebelum restart, ditandai error.`);
    }
    async ensureConfigTable() {
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
    async ensureConfigTableForMigration() {
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
    envConfig() {
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
    async getConfig() {
        const env = this.envConfig();
        try {
            await this.ensureConfigTable();
            const rows = await this.syncLogs.query('select base_url, client_id, client_header, timeout_ms, sync_enabled, sync_mode, sync_interval_minutes, sync_cron, sync_days_back, data_scope from bdb_dors_config where id = 1');
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
        }
        catch (e) {
            this.logger.warn('baca config DORS gagal, pakai env: ' + (e?.message || e));
        }
        return env;
    }
    async saveConfig(authUser, p) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const cur = await this.getConfig();
        const scope = ['TEST', 'OPERASIONAL', 'ARCHIVE'].includes(String(p.data_scope)) ? String(p.data_scope) : cur.data_scope;
        const next = {
            base_url: (p.base_url ?? cur.base_url).replace(/\/+$/, ''),
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
        await this.dataSource.query(`insert into bdb_dors_config (id, base_url, client_id, client_header, timeout_ms, sync_enabled, sync_mode, sync_interval_minutes, sync_cron, sync_days_back, data_scope, updated_at)
             values (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
             on conflict (id) do update set base_url=$1, client_id=$2, client_header=$3, timeout_ms=$4,
                 sync_enabled=$5, sync_mode=$6, sync_interval_minutes=$7, sync_cron=$8, sync_days_back=$9, data_scope=$10, updated_at=now()`, [next.base_url, next.client_id, next.client_header, next.timeout_ms, next.sync_enabled, next.sync_mode, next.sync_interval_minutes, next.sync_cron, next.sync_days_back, next.data_scope]);
        await this.reloadSchedule();
        return { status: 1, data: this.publicConfig(next), message: 'Konfigurasi DORS disimpan' };
    }
    validCron(expr) {
        if (!expr || typeof expr !== 'string')
            return false;
        try {
            new cron_1.CronJob(expr, () => { });
            return true;
        }
        catch {
            return false;
        }
    }
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
            this.nextIntervalRun = new Date(Date.now() + ms);
            this.logger.log(`Jadwal sync DORS aktif: tiap ${cfg.sync_interval_minutes} menit (mundur ${cfg.sync_days_back} hari, scope ${cfg.data_scope}).`);
        }
        else {
            if (!this.validCron(cfg.sync_cron)) {
                this.logger.warn('Ekspresi cron DORS tidak valid, jadwal tidak dipasang.');
                return;
            }
            const job = new cron_1.CronJob(cfg.sync_cron, () => {
                this.runScheduledSync().catch((e) => this.logger.error('sync terjadwal gagal: ' + (e?.message || e)));
            });
            this.scheduler.addCronJob(DORS_CRON_NAME, job);
            job.start();
            this.logger.log(`Jadwal sync DORS aktif: cron "${cfg.sync_cron}" (mundur ${cfg.sync_days_back} hari, scope ${cfg.data_scope}).`);
        }
    }
    clearSchedule() {
        try {
            this.scheduler.getCronJob(DORS_CRON_NAME).stop();
            this.scheduler.deleteCronJob(DORS_CRON_NAME);
        }
        catch {
        }
        try {
            this.scheduler.deleteInterval(DORS_INTERVAL_NAME);
        }
        catch {
        }
        this.nextIntervalRun = null;
    }
    publicConfig(c) {
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
    nextRun(c) {
        if (!c.sync_enabled)
            return null;
        if (c.sync_mode === 'interval') {
            return this.nextIntervalRun ? this.nextIntervalRun.toISOString() : null;
        }
        if (!this.validCron(c.sync_cron))
            return null;
        try {
            const j = new cron_1.CronJob(c.sync_cron, () => { });
            return j.nextDate().toISO();
        }
        catch {
            return null;
        }
    }
    assertAdmin(authUser) {
        const role = String(authUser?.role_bdb || authUser?.role_name || '').toLowerCase();
        const orgRole = String(authUser?.OrganisasiRole?.role_name || '').toLowerCase();
        if (['superadmin', 'admin_binops', 'operator'].includes(role) ||
            role.includes('admin') ||
            role.includes('super') ||
            orgRole.includes('admin') ||
            orgRole.includes('operator')) {
            return;
        }
        throw new common_1.ForbiddenException('Hanya superadmin/admin/operator yang dapat mengakses Integrasi DORS.');
    }
    async getConfigPublic(authUser) {
        this.assertAdmin(authUser);
        return { status: 1, data: this.publicConfig(await this.getConfig()) };
    }
    async getConfigReveal(authUser) {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        if (role !== 'superadmin') {
            throw new common_1.ForbiddenException('Hanya superadmin yang dapat melihat Client ID asli.');
        }
        const cfg = await this.getConfig();
        return { status: 1, data: { client_id: cfg.client_id } };
    }
    sources() {
        try {
            const p = (0, path_1.join)(process.cwd(), 'config', 'dors-sources.json');
            const raw = JSON.parse((0, fs_1.readFileSync)(p, 'utf8'));
            if (Array.isArray(raw) && raw.length)
                return raw;
        }
        catch (e) {
            this.logger.warn('config/dors-sources.json tidak terbaca, pakai default: ' + (e?.message || e));
        }
        return [
            { key: 'lp_a', label: 'LP Model A', path: 'lp_a', kategori: 'lp_model_a' },
            { key: 'lp_b', label: 'LP Model B', path: 'lp_b', kategori: 'lp_model_b' }
        ];
    }
    getSources(authUser) {
        this.assertAdmin(authUser);
        return { status: 1, data: this.sources().map((s) => ({ key: s.key, label: s.label, path: s.path, kategori: s.kategori })) };
    }
    twoDigit(n) {
        return String(n).padStart(2, '0');
    }
    ymd(d) {
        return `${d.getFullYear()}-${this.twoDigit(d.getMonth() + 1)}-${this.twoDigit(d.getDate())}`;
    }
    async checkOne(cfg, src, from, to) {
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
            let total = null;
            let currentPage = null;
            let lastPage = null;
            let bodyOk = true;
            let msg;
            try {
                const j = await res.json();
                if (j && j.status === false) {
                    bodyOk = false;
                    msg = j.msg || 'ditolak DORS';
                }
                total = typeof j?.total === 'number' ? j.total : Array.isArray(j?.data) ? j.data.length : null;
                currentPage = j?.current_page ?? null;
                lastPage = j?.last_page ?? null;
            }
            catch {
                bodyOk = false;
                msg = 'respons bukan JSON';
            }
            return { key: src.key, label: src.label, path: src.path, url, active: res.ok && bodyOk, http_status: res.status, total, current_page: currentPage, last_page: lastPage, error: bodyOk ? undefined : msg, ms: Date.now() - started, checked_at: new Date().toISOString() };
        }
        catch (e) {
            return { key: src.key, label: src.label, path: src.path, url, active: false, http_status: 0, total: null, error: e?.name === 'AbortError' ? 'timeout' : e?.message || 'tidak terjangkau', ms: Date.now() - started, checked_at: new Date().toISOString() };
        }
    }
    async status(authUser, from, to) {
        this.assertAdmin(authUser);
        const cfg = await this.getConfig();
        const data = await Promise.all(this.sources().map((s) => this.checkOne(cfg, s, from, to)));
        return { status: 1, data, base_url: cfg.base_url, client_configured: !!cfg.client_id };
    }
    daysAgo(n) {
        const d = new Date();
        d.setDate(d.getDate() - Math.max(0, n));
        return this.ymd(d);
    }
    async fetchPage(cfg, src, f, t, page) {
        const url = `${cfg.base_url}/${src.path}?from=${f}&to=${t}&from_hour=00:00:00&to_hour=23:59:59&page=${page}&showby=updated_at&order_by=updated_at`;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), cfg.timeout_ms);
        try {
            const res = await fetch(url, { signal: ctrl.signal, headers: { [cfg.client_header]: cfg.client_id, Accept: 'application/json' } });
            const rawText = await res.text().catch(() => '');
            let j = null;
            try {
                j = rawText ? JSON.parse(rawText) : null;
            }
            catch {
                j = null;
            }
            const snippet = rawText ? rawText.replace(/\s+/g, ' ').trim().slice(0, 200) : '(kosong)';
            if (!res.ok)
                throw new Error(`HTTP ${res.status} halaman ${page}: ${snippet}`);
            if (!j)
                throw new Error(`respons bukan JSON valid (halaman ${page}): ${snippet}`);
            if (j.status === false)
                throw new Error(j?.msg ? `ditolak DORS (halaman ${page}): ${j.msg}` : `ditolak DORS (halaman ${page}), tanpa pesan: ${snippet}`);
            return j;
        }
        catch (e) {
            if (e?.name === 'AbortError')
                throw new Error(`timeout setelah ${cfg.timeout_ms}ms (halaman ${page})`);
            throw e;
        }
        finally {
            clearTimeout(timer);
        }
    }
    async fetchPageWithRetry(cfg, src, f, t, page, retries = 2) {
        let lastErr;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await this.fetchPage(cfg, src, f, t, page);
            }
            catch (e) {
                lastErr = e;
                if (attempt < retries)
                    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
            }
        }
        throw lastErr;
    }
    static MAIN_COLS = [
        'apa_terjadi', 'bagaimana_terjadi', 'dilimpahkan', 'id_emp_modus_operandi', 'id_emp_motif_kejahatan', 'id_emp_sasaran_kejahatan',
        'id_hubungan_korban_pelaku', 'id_kategori_lokasi', 'id_operasi', 'id_pasal_kamtibmas', 'id_polda', 'id_polres', 'id_polsek',
        'id_satuan', 'id_unit_terusan', 'kategori', 'kerugian', 'nama_mengetahui', 'nama_pembuat', 'no_laporan', 'no_sttlp',
        'nrp_mengetahui', 'nrp_pembuat', 'nrp_penerima', 'pangkat_mengetahui', 'pangkat_pembuat', 'pelimpahan', 'perhatian_publik',
        'redaksional_mengetahui_spkt', 'status_aktif', 'tempat_kejadian', 'tgl_laporan', 'tkp_id_desa', 'tkp_id_kecamatan',
        'tkp_id_kota', 'tkp_id_provinsi', 'uraian_kejadian', 'uraian_singkat_kejadian', 'waktu_kejadian', 'waktu_kejadian_faktual', 'zona_waktu'
    ];
    static OBJ_RELS = {
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
    static ARR_RELS = {
        terlibat: ['id', 'id_laporan', 'nama', 'nik', 'jenis_identitas', 'jenis_kelamin', 'gender', 'tempat_lahir', 'tgl_lahir', 'umur', 'agama', 'suku', 'kewarganegaraan', 'pekerjaan', 'pendidikan_terakhir', 'alamat', 'alamat_non_nkri', 'no_hp', 'telphone', 'email', 'sosmed', 'keterlibatan', 'jenis_korban', 'status_korban', 'nomor_visum', 'created_at', 'updated_at'],
        tindak_pidana: ['id', 'id_lp', 'id_kategori_kejahatan', 'nama_kategori_kejahatan', 'id_uu', 'nama_uu', 'pasal', 'pasal_tambahan', 'pasal_mapping', 'juncto', 'subsider', 'updated_at'],
        barang_bukti: ['id', 'id_laporan', 'kode_bb', 'jenis_bb', 'jumlah', 'keterangan', 'ran_jenis', 'ran_merk', 'ran_model', 'ran_type', 'ran_warna', 'ran_warna_tnkb', 'ran_no_registrasi', 'ran_no_rangka', 'ran_no_mesin', 'ran_no_bpkb', 'ran_nama_pemilik', 'ran_alamat', 'ran_thn_pembuatan', 'ran_thn_registrasi', 'ran_isi_silinder', 'ran_bahan_bakar', 'created_at', 'updated_at']
    };
    tableOf(rel) {
        return `bdb_dors_lp_${rel}`;
    }
    dbCol(c) {
        if (c === 'id')
            return 'dors_ref_id';
        if (c === 'created_at')
            return 'source_created_at';
        if (c === 'updated_at')
            return 'source_updated_at';
        return c;
    }
    cell(v) {
        if (v === undefined || v === null || v === '')
            return null;
        if (typeof v === 'object')
            return JSON.stringify(v);
        return String(v);
    }
    normReady = false;
    async ensureNormalizedTables() {
        if (this.normReady)
            return;
        const mainCols = DorsService_1.MAIN_COLS.map((c) => `"${c}" text`).join(', ');
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
        for (const [rel, cols] of Object.entries(DorsService_1.OBJ_RELS)) {
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
        for (const [rel, cols] of Object.entries(DorsService_1.ARR_RELS)) {
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
    async normalizeLp(p, model, scope, batch, rawId) {
        const cols = ['raw_id', 'dors_lp_id', 'model_lp', 'data_scope', 'import_batch', 'source_created_at', 'source_updated_at', ...DorsService_1.MAIN_COLS];
        const vals = [rawId, p.id, model, scope, batch, this.cell(p.created_at), this.cell(p.updated_at), ...DorsService_1.MAIN_COLS.map((c) => this.cell(p[c]))];
        const ph = vals.map((_, i) => `$${i + 1}`).join(',');
        const updSet = cols.filter((c) => c !== 'dors_lp_id' && c !== 'model_lp').map((c) => `"${c}"=excluded."${c}"`).join(', ');
        const ret = await this.dataSource.query(`insert into bdb_dors_lp (${cols.map((c) => `"${c}"`).join(',')}, synced_at)
             values (${ph}, now())
             on conflict (dors_lp_id, model_lp) do update set ${updSet}, synced_at=now()
             returning id`, vals);
        const lpId = ret[0].id;
        for (const [rel, relCols] of Object.entries(DorsService_1.OBJ_RELS)) {
            await this.dataSource.query(`delete from ${this.tableOf(rel)} where lp_id=$1`, [lpId]);
            const o = p[rel];
            if (!o || typeof o !== 'object' || Array.isArray(o))
                continue;
            const c2 = ['lp_id', 'dors_lp_id', 'model_lp', ...relCols.map((c) => this.dbCol(c))];
            const v2 = [lpId, p.id, model, ...relCols.map((c) => this.cell(o[c]))];
            await this.dataSource.query(`insert into ${this.tableOf(rel)} (${c2.map((c) => `"${c}"`).join(',')}) values (${v2.map((_, i) => `$${i + 1}`).join(',')})`, v2);
        }
        for (const [rel, relCols] of Object.entries(DorsService_1.ARR_RELS)) {
            await this.dataSource.query(`delete from ${this.tableOf(rel)} where lp_id=$1`, [lpId]);
            const arr = p[rel];
            if (!Array.isArray(arr) || !arr.length)
                continue;
            const c2 = ['lp_id', 'dors_lp_id', 'model_lp', ...relCols.map((c) => this.dbCol(c))];
            for (const el of arr) {
                if (!el || typeof el !== 'object')
                    continue;
                const v2 = [lpId, p.id, model, ...relCols.map((c) => this.cell(el[c]))];
                await this.dataSource.query(`insert into ${this.tableOf(rel)} (${c2.map((c) => `"${c}"`).join(',')}) values (${v2.map((_, i) => `$${i + 1}`).join(',')})`, v2);
            }
        }
        return lpId;
    }
    async insertNewRows(rows, model, scope, batch) {
        const valid = rows.filter((r) => r && r.id !== undefined && r.id !== null);
        if (!valid.length)
            return 0;
        await this.ensureNormalizedTables();
        const CHUNK = 100;
        let inserted = 0;
        for (let i = 0; i < valid.length; i += CHUNK) {
            const slice = valid.slice(i, i + CHUNK);
            const ids = slice.map((r) => r.id);
            const existRows = await this.dataSource.query(`select id, dors_lp_id,
                    coalesce(payload_json->>'pelimpahan','') as pelimpahan,
                    coalesce(payload_json#>>'{unit,unit}','') as unit_nama,
                    coalesce(payload_json#>>'{unit,level}','') as unit_level,
                    coalesce(payload_json#>>'{polda,kode_pusiknas}','') as polda_kp,
                    coalesce(payload_json#>>'{polres,kode_pusiknas}','') as polres_kp,
                    coalesce(payload_json#>>'{polsek,kode_pusiknas}','') as polsek_kp
                 from bdb_dors_raw_lp where model_lp=$1 and dors_lp_id = any($2)`, [model, ids]);
            const existMap = new Map(existRows.map((r) => [String(r.dors_lp_id), r]));
            const fresh = slice.filter((r) => {
                const ex = existMap.get(String(r.id));
                if (!ex) return true;
                return (
                    String(r.pelimpahan ?? '') !== ex.pelimpahan ||
                    String(r.unit?.unit ?? '') !== ex.unit_nama ||
                    String(r.unit?.level ?? '') !== ex.unit_level ||
                    String(r.polda?.kode_pusiknas ?? '') !== ex.polda_kp ||
                    String(r.polres?.kode_pusiknas ?? '') !== ex.polres_kp ||
                    String(r.polsek?.kode_pusiknas ?? '') !== ex.polsek_kp
                );
            });
            if (!fresh.length)
                continue;
            const params = [];
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
            const ret = await this.dataSource.query(`insert into bdb_dors_raw_lp (dors_lp_id, model_lp, no_laporan, payload_json, source, data_scope, import_batch, synced_at, created_at, updated_at)
                 values ${valuesSql}
                 on conflict (dors_lp_id, model_lp) do update
                    set payload_json = excluded.payload_json,
                        no_laporan = coalesce(excluded.no_laporan, bdb_dors_raw_lp.no_laporan),
                        synced_at = now(),
                        updated_at = now()
                 returning id, dors_lp_id`, params);
            const rawIdByDors = new Map((ret || []).map((x) => [String(x.dors_lp_id), x.id]));
            for (const r of fresh) {
                try {
                    await this.normalizeLp(r, model, scope, batch, rawIdByDors.get(String(r.id)) ?? null);
                    inserted++;
                }
                catch (e) {
                    this.logger.warn(`normalisasi LP ${r.id} (${model}) gagal: ${e?.message || e}`);
                }
            }
        }
        return inserted;
    }
    async backfillNormalization(authUser, limit = 1000) {
        this.assertAdmin(authUser);
        await this.ensureNormalizedTables();
        const cap = Math.max(1, Math.min(5000, Number(limit) || 1000));
        const rows = await this.dataSource.query(`select r.id as raw_id, r.dors_lp_id, r.model_lp, r.data_scope, r.import_batch, r.payload_json
             from bdb_dors_raw_lp r
             left join bdb_dors_lp n on n.dors_lp_id = r.dors_lp_id and n.model_lp = r.model_lp
             where n.id is null
             order by r.id
             limit $1`, [cap]);
        let done = 0;
        let fail = 0;
        for (const r of rows) {
            try {
                await this.normalizeLp(r.payload_json, r.model_lp, r.data_scope || 'OPERASIONAL', r.import_batch || 'backfill', r.raw_id);
                done++;
            }
            catch (e) {
                fail++;
                this.logger.warn(`backfill LP ${r.dors_lp_id} gagal: ${e?.message || e}`);
            }
        }
        const remain = await this.dataSource.query(`select count(*)::int as c from bdb_dors_raw_lp r left join bdb_dors_lp n on n.dors_lp_id=r.dors_lp_id and n.model_lp=r.model_lp where n.id is null`);
        return { status: 1, data: { normalized: done, failed: fail, remaining: remain[0]?.c || 0 }, message: `Backfill: ${done} dinormalisasi, sisa ${remain[0]?.c || 0}.` };
    }
    static MAX_AUTO_ATTEMPTS = 5;
    static RETRY_BACKOFF_MS = [5000, 15000, 30000, 60000, 60000];
    async persistProgress(logId, states, extra) {
        const chunksDone = states.filter((s) => s.status === 'done').length;
        await this.syncLogs.progress(`update bdb_dors_sync_log set sources_json=$2::jsonb, current_source=$3, current_page=$4, current_last_page=$5, current_chunk_from=$6, current_chunk_to=$7, chunks_done=$8, chunks_total=$9, attempt=$10, total_fetched=$11, total_upserted=$12 where id=$1`, [logId, JSON.stringify(states), extra.current_source ?? null, extra.current_page ?? null, extra.current_last_page ?? null, extra.current_chunk_from ?? null, extra.current_chunk_to ?? null, chunksDone, states.length, extra.attempt, states.reduce((n, s) => n + s.fetched, 0), states.reduce((n, s) => n + s.upserted, 0)]);
    }
    splitIntoChunks(from, to, maxDays = 31) {
        const chunks = [];
        const end = new Date(`${to}T00:00:00`);
        let curStart = new Date(`${from}T00:00:00`);
        while (curStart.getTime() <= end.getTime()) {
            const curEnd = new Date(curStart);
            curEnd.setDate(curEnd.getDate() + maxDays - 1);
            if (curEnd.getTime() > end.getTime())
                curEnd.setTime(end.getTime());
            chunks.push({ from: this.ymd(curStart), to: this.ymd(curEnd) });
            curStart = new Date(curEnd);
            curStart.setDate(curStart.getDate() + 1);
        }
        return chunks.length ? chunks : [{ from, to }];
    }
    async runOneSourceAttempt(cfg, src, f, t, scope, batch, state, onPageDone) {
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
                if (this.stopRequested) {
                    state.status = 'error';
                    state.error = 'Sinkronisasi dihentikan manual oleh pengguna.';
                    break;
                }
                const j = await this.fetchPageWithRetry(cfg, src, f, t, p);
                const rows = Array.isArray(j?.data) ? j.data : [];
                state.upserted += await this.insertNewRows(rows, model, scope, batch);
                state.fetched += rows.length;
                state.last_success_page = p;
                await onPageDone();
            }
            state.status = 'done';
        }
        catch (e) {
            state.status = 'error';
            state.error = e?.message || 'gagal';
        }
        finally {
            state.ms += Date.now() - startedAttempt;
        }
    }
    async runSyncJob(logId, cfg, f, t, scope, batch) {
        const chunks = this.splitIntoChunks(f, t);
        const states = [
            ...this.sources().flatMap((s) => chunks.map((c, ci) => ({
                key: s.key, label: s.label, model: s.kategori || s.key,
                chunk_index: ci, chunk_total: chunks.length, chunk_from: c.from, chunk_to: c.to,
                total: null, pages: 0, last_success_page: 0, fetched: 0, upserted: 0,
                status: 'pending', error: null, ms: 0
            }))),
            {
                key: 'history_delete', label: 'Riwayat LP Dihapus', model: 'gk_history_delete',
                chunk_index: 0, chunk_total: 1, chunk_from: f, chunk_to: t,
                total: null, pages: 1, last_success_page: 0, fetched: 0, upserted: 0,
                status: 'pending', error: null, ms: 0
            }
        ];
        let attempt = 0;
        while (attempt < DorsService_1.MAX_AUTO_ATTEMPTS) {
            attempt++;
            const pending = states.filter((s) => s.status !== 'done' && s.key !== 'history_delete');
            if (!pending.length)
                break;
            const bySource = new Map();
            for (const s of pending) {
                if (!bySource.has(s.key))
                    bySource.set(s.key, []);
                bySource.get(s.key).push(s);
            }
            const sourceLists = Array.from(bySource.values());
            const maxRounds = Math.max(0, ...sourceLists.map((list) => list.length));
            for (let roundIndex = 0; roundIndex < maxRounds; roundIndex++) {
                if (this.stopRequested)
                    break;
                const round = sourceLists.map((list) => list[roundIndex]).filter(Boolean);
                await Promise.all(round.map(async (s) => {
                    if (this.stopRequested)
                        return;
                    const src = this.sources().find((x) => x.key === s.key);
                    await this.runOneSourceAttempt(cfg, src, s.chunk_from, s.chunk_to, scope, batch, s, () => this.persistProgress(logId, states, { current_source: s.key, current_page: s.last_success_page, current_last_page: s.pages, current_chunk_from: s.chunk_from, current_chunk_to: s.chunk_to, attempt }));
                }));
                try {
                    const unmapped = await this.laporanPolisi.unmappedCount();
                    if (unmapped > 0) {
                        this.logger.log(`Auto-mapping ${unmapped} LP unmapped setelah ronde chunk ${roundIndex + 1}/${maxRounds}...`);
                        await this.laporanPolisi.mapFromDors();
                    }
                }
                catch (e) {
                    this.logger.warn(`auto-map ronde chunk ${roundIndex + 1} gagal: ` + (e?.message || e));
                }
            }
            if (this.stopRequested)
                break;
            await this.persistProgress(logId, states, { attempt });
            if (states.filter((s) => s.key !== 'history_delete').every((s) => s.status === 'done'))
                break;
            if (attempt < DorsService_1.MAX_AUTO_ATTEMPTS) {
                const wait = DorsService_1.RETRY_BACKOFF_MS[Math.min(attempt - 1, DorsService_1.RETRY_BACKOFF_MS.length - 1)];
                this.logger.warn(`Sync DORS: ${states.filter((s) => s.status === 'error').length} chunk blm selesai di percobaan ${attempt}, coba lagi dlm ${wait / 1000}s...`);
                await new Promise((r) => setTimeout(r, wait));
            }
        }
        // Jalankan penarikan riwayat LP dihapus (gk_history_delete) serentak untuk periode yang sama
        const hdState = states.find((s) => s.key === 'history_delete');
        if (hdState && !this.stopRequested) {
            hdState.status = 'running';
            await this.persistProgress(logId, states, { current_source: 'history_delete', current_page: 1, current_last_page: 1, current_chunk_from: f, current_chunk_to: t, attempt });
            const hdStart = Date.now();
            try {
                this.logger.log(`Menjalankan sinkronisasi otomatis gk_history_delete (${f}..${t})...`);
                const hdRes = await this.syncHistoryDelete({ role_bdb: 'superadmin' }, f, t);
                hdState.total = hdRes?.data?.total_fetched ?? 0;
                hdState.fetched = hdRes?.data?.total_fetched ?? 0;
                hdState.upserted = hdRes?.data?.total_upserted ?? 0;
                hdState.last_success_page = 1;
                hdState.status = hdRes?.status === 1 ? 'done' : 'error';
                hdState.error = hdRes?.status === 1 ? null : (hdRes?.message || 'Gagal sinkron');
                hdState.ms = Date.now() - hdStart;
                this.logger.log(`Auto-sync riwayat hapus DORS (${f}..${t}) selesai: ${hdRes?.data?.total_fetched || 0} riwayat ditarik, ${hdRes?.data?.applied_lp_count || 0} soft-deleted.`);
            } catch (err) {
                hdState.status = 'error';
                hdState.error = err?.message || 'Gagal sinkron';
                hdState.ms = Date.now() - hdStart;
                this.logger.warn(`Auto-sync riwayat hapus DORS (${f}..${t}) gagal: ` + (err?.message || err));
            }
            await this.persistProgress(logId, states, { current_source: 'history_delete', current_page: 1, current_last_page: 1, attempt });
        }

        const allDone = states.every((s) => s.status === 'done');
        const lpStates = states.filter((s) => s.key !== 'history_delete');
        const totalFetched = lpStates.reduce((a, s) => a + s.fetched, 0);
        const totalNew = lpStates.reduce((a, s) => a + s.upserted, 0);
        const failedStates = states.filter((s) => s.status !== 'done');
        const stoppedReason = this.stopRequested
            ? 'Sinkronisasi dihentikan manual oleh pengguna.'
            : failedStates.length
                ? `Berhenti setelah ${attempt} percobaan: ${failedStates.map((s) => `${s.label} macet di periode ${s.chunk_from}..${s.chunk_to} halaman ${s.last_success_page + 1}${s.pages ? '/' + s.pages : ''} (${s.error})`).join('; ')}`
                : null;
        return { states, allDone, totalFetched, totalNew, attempt, stoppedReason };
    }
    async beginSync(from, to, trigger = 'manual') {
        if (this.syncing) {
            return { ok: false, status: 0, message: 'Sinkronisasi lain sedang berjalan, coba lagi sebentar.' };
        }
        this.syncing = true;
        this.stopRequested = false;
        try {
            const cfg = await this.getConfig();
            const today = this.ymd(new Date());
            const t = to || today;
            const f = from || (trigger === 'cron' ? this.daysAgo(cfg.sync_days_back) : today);
            if (!cfg.client_id) {
                this.syncing = false;
                DorsService_1.invalidateCache();
                return { ok: false, status: 0, message: 'Client ID DORS belum dikonfigurasi.' };
            }
            const batch = `${trigger}-${new Date().toISOString()}`;
            const logRow = await this.syncLogs.query(`insert into bdb_dors_sync_log (trigger, from_date, to_date, status, started_at, attempt, max_attempts)
             values ($1,$2,$3,'running', now(), 0, $4) returning id`, [trigger, f, t, DorsService_1.MAX_AUTO_ATTEMPTS], false);
            return { ok: true, logId: logRow[0].id, cfg, f, t, batch, started: Date.now() };
        }
        catch (error) {
            this.syncing = false;
            throw error;
        }
    }
    async finishSyncJob(logId, cfg, f, t, batch, started) {
        try {
            const result = await this.runSyncJob(logId, cfg, f, t, cfg.data_scope, batch);
            const status = result.allDone ? 'success' : result.totalNew > 0 ? 'partial' : 'error';
            await this.syncLogs.terminal(`update bdb_dors_sync_log set status=$2, total_fetched=$3, total_upserted=$4, sources_json=$5::jsonb, error=$6, stopped_reason=$6, finished_at=now(), duration_ms=$7, attempt=$8 where id=$1`, [logId, status, result.totalFetched, result.totalNew, JSON.stringify(result.states), result.stoppedReason, Date.now() - started, result.attempt]);
            this.logger.log(`Sync DORS ${f}..${t}: ${result.totalNew} baru, status=${status}, percobaan=${result.attempt}${result.stoppedReason ? ', ' + result.stoppedReason : ''}`);
            this.syncing = false;
            let mappedBaru = 0;
            try {
                const unmapped = await this.laporanPolisi.unmappedCount();
                if (unmapped > 0) {
                    const mapRes = await this.laporanPolisi.mapFromDors();
                    mappedBaru = mapRes?.data?.mapped_baru || 0;
                } else {
                    await this.laporanPolisi.syncPelimpahanOwnershipFromDors();
                }
            }
            catch (e) {
                this.logger.warn('auto-map ke Laporan Polisi gagal: ' + (e?.message || e));
            }
            try {
                await this.satkerService.syncPopulasiWilayahDariDors();
            }
            catch (e) {
                this.logger.warn('sinkron Jumlah Penduduk dari DORS gagal: ' + (e?.message || e));
            }
            // Pastikan sisa pending history-delete ikut diterapkan setelah mapping LP baru selesai
            try {
                await this.applyPendingHistoryDelete({ role_bdb: 'superadmin' });
            } catch (e) {
                this.logger.warn('apply pending history-delete gagal: ' + (e?.message || e));
            }
            const hdStateFinal = result.states.find((s) => s.key === 'history_delete');
            return {
                status: result.allDone ? 1 : 0,
                data: {
                    log_id: logId,
                    from: f,
                    to: t,
                    total_fetched: result.totalFetched,
                    total_new: result.totalNew,
                    history_delete: hdStateFinal ? { fetched: hdStateFinal.fetched, upserted: hdStateFinal.upserted, status: hdStateFinal.status } : null,
                    mapped_baru: mappedBaru,
                    attempt: result.attempt,
                    stopped_reason: result.stoppedReason,
                    sources: result.states,
                    duration_ms: Date.now() - started
                },
                message: result.allDone
                    ? `Sinkronisasi selesai: ${result.totalNew} data LP baru, ${hdStateFinal?.fetched || 0} riwayat hapus DORS diproses, ${mappedBaru} dipetakan ke Laporan Polisi.`
                    : `Sinkronisasi berhenti setelah ${result.attempt} percobaan. ${result.stoppedReason || ''}`
            };
        }
        catch (e) {
            await this.syncLogs.terminal(`update bdb_dors_sync_log set status='error', error=$2, stopped_reason=$2, finished_at=now(), duration_ms=$3 where id=$1`, [logId, e?.message || 'gagal', Date.now() - started]);
            this.logger.error('Sync DORS gagal total: ' + (e?.message || e));
            return { status: 0, message: 'Sinkronisasi gagal: ' + (e?.message || e) };
        }
        finally {
            this.syncing = false;
        }
    }
    async syncRange(from, to, trigger = 'manual') {
        const begin = await this.beginSync(from, to, trigger);
        if (!begin.ok)
            return begin;
        return this.finishSyncJob(begin.logId, begin.cfg, begin.f, begin.t, begin.batch, begin.started);
    }
    async manualSyncStart(authUser, from, to) {
        this.assertAdmin(authUser);
        const begin = await this.beginSync(from, to, 'manual');
        if (!begin.ok)
            return begin;
        this.finishSyncJob(begin.logId, begin.cfg, begin.f, begin.t, begin.batch, begin.started).catch((e) => {
            this.logger.error('finishSyncJob (manual) tak tertangani: ' + (e?.message || e));
        });
        return { status: 1, data: { log_id: begin.logId }, message: 'Sinkronisasi dimulai di latar belakang. Progres bisa dipantau langsung di bawah.' };
    }
    async getSyncJobStatus(authUser, logId) {
        this.assertAdmin(authUser);
        const rows = await this.syncLogs.query(`select id, trigger, from_date, to_date, status, total_fetched, total_upserted, sources_json, error, stopped_reason,
                    attempt, max_attempts, current_source, current_page, current_last_page, current_chunk_from, current_chunk_to,
                    chunks_done, chunks_total, started_at, finished_at, duration_ms
             from bdb_dors_sync_log where id=$1`, [logId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Log sinkronisasi tidak ditemukan.');
        return { status: 1, data: { ...rows[0], running: this.syncing } };
    }
    async runScheduledSync() {
        const cfg = await this.getConfig();
        if (cfg.sync_mode === 'interval') {
            this.nextIntervalRun = new Date(Date.now() + Math.max(1, cfg.sync_interval_minutes) * 60_000);
        }
        return this.syncRange(undefined, undefined, 'cron');
    }
    async recentLogs(authUser, limit = 20) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        if (!this.syncing) {
            await this.syncLogs.query(
                `update bdb_dors_sync_log set status='error', stopped_reason='Proses terhenti di latar belakang.', error='Terputus.', finished_at=now()
                 where status='running'`
            );
        }
        const rows = await this.syncLogs.query(`select id, trigger, from_date, to_date, status, total_fetched, total_upserted, sources_json, error, stopped_reason,
                    attempt, max_attempts, current_source, current_page, current_last_page, current_chunk_from, current_chunk_to,
                    chunks_done, chunks_total, started_at, finished_at, duration_ms
             from bdb_dors_sync_log order by started_at desc limit $1`, [Math.max(1, Math.min(100, Number(limit) || 20))]);
        const cfg = await this.getConfig();
        return {
            status: 1,
            data: rows,
            running: Boolean(this.syncing && rows?.[0]?.status === 'running'),
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
    static STATS_CACHE = null;
    static COUNT_CACHE = new Map();
    static invalidateCache() {
        DorsService_1.STATS_CACHE = null;
        DorsService_1.COUNT_CACHE.clear();
    }
    async dataStats(authUser, from, to) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const now = Date.now();
        if (!from && !to && DorsService_1.STATS_CACHE && now < DorsService_1.STATS_CACHE.expiresAt) {
            return DorsService_1.STATS_CACHE.data;
        }
        const where = [];
        const params = [];
        if (from) {
            params.push(from);
            where.push(`synced_at >= $${params.length}::timestamp`);
        }
        if (to) {
            params.push(to);
            where.push(`synced_at <= ($${params.length}::date + time '23:59:59')`);
        }
        const whereSql = where.length ? 'where ' + where.join(' and ') : '';
        const perModel = await this.dataSource.query(`select model_lp, count(*)::int as jumlah, max(synced_at) as terakhir_sync
             from bdb_dors_raw_lp ${whereSql} group by model_lp order by model_lp`, params);
        const total = perModel.reduce((acc, r) => acc + (Number(r.jumlah) || 0), 0);
        let maxSync = null;
        for (const r of perModel) {
            if (r.terakhir_sync && (!maxSync || new Date(r.terakhir_sync) > new Date(maxSync))) {
                maxSync = r.terakhir_sync;
            }
        }
        const perLevelRow = await this.dataSource.query(`select
                count(*) filter (where id_polsek is not null and id_polsek != '')::int as polsek,
                count(*) filter (where id_polres is not null and id_polres != '' and (id_polsek is null or id_polsek = ''))::int as polres,
                count(*) filter (where id_polda is not null and id_polda != '' and (id_polres is null or id_polres = '') and (id_polsek is null or id_polsek = ''))::int as polda,
                count(*) filter (where (id_polda is null or id_polda = '') and (id_polres is null or id_polres = '') and (id_polsek is null or id_polsek = ''))::int as mabes
             from bdb_dors_lp ${whereSql}`, params);
        const srcMap = new Map(this.sources().map((s) => [s.kategori || s.key, s.label]));
        const result = {
            status: 1,
            data: {
                total,
                terakhir_sync: maxSync,
                per_model: perModel.map((r) => ({
                    model_lp: r.model_lp,
                    label: srcMap.get(r.model_lp) || r.model_lp,
                    jumlah: r.jumlah,
                    terakhir_sync: r.terakhir_sync
                })),
                per_level: {
                    Mabes: perLevelRow[0]?.mabes || 0,
                    Polda: perLevelRow[0]?.polda || 0,
                    Polres: perLevelRow[0]?.polres || 0,
                    Polsek: perLevelRow[0]?.polsek || 0
                }
            }
        };
        if (!from && !to) {
            DorsService_1.STATS_CACHE = { data: result, expiresAt: now + 10 * 60 * 1000 };
        }
        return result;
    }
    async listData(authUser, opts) {
        this.assertAdmin(authUser);
        await this.ensureConfigTable();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const where = [];
        const params = [];
        if (opts.model) {
            params.push(opts.model);
            where.push(`model_lp = $${params.length}`);
        }
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`no_laporan ilike $${params.length}`);
        }
        if (opts.from) {
            params.push(opts.from);
            where.push(`synced_at >= $${params.length}::timestamp`);
        }
        if (opts.to) {
            params.push(opts.to);
            where.push(`synced_at <= ($${params.length}::date + time '23:59:59')`);
        }
        const hasPolsek = `jsonb_typeof(payload_json->'polsek')='object'`;
        const hasPolres = `jsonb_typeof(payload_json->'polres')='object'`;
        const hasPolda = `jsonb_typeof(payload_json->'polda')='object'`;
        const noPolsek = `jsonb_typeof(payload_json->'polsek') is distinct from 'object'`;
        const noPolres = `jsonb_typeof(payload_json->'polres') is distinct from 'object'`;
        const noPolda = `jsonb_typeof(payload_json->'polda') is distinct from 'object'`;
        const isMabes = `payload_json->'polda'->>'nama' ilike '%mabes%'`;
        const levelCond = {
            Polsek: hasPolsek,
            Polres: `${hasPolres} and ${noPolsek}`,
            Polda: `${hasPolda} and ${noPolres} and ${noPolsek} and (${isMabes}) is not true`,
            Mabes: `(${hasPolda} and ${noPolres} and ${noPolsek} and ${isMabes}) or (${noPolda} and ${noPolres} and ${noPolsek})`
        };
        if (opts.level && levelCond[opts.level]) {
            where.push(`(${levelCond[opts.level]})`);
        }
        const whereSql = where.length ? 'where ' + where.join(' and ') : '';
        const countKey = whereSql + '::' + JSON.stringify(params);
        const cached = DorsService_1.COUNT_CACHE.get(countKey);
        let total = 0;
        if (cached && Date.now() < cached.expiresAt) {
            total = cached.total;
        }
        else {
            const totalRow = await this.dataSource.query(`select count(*)::int as c from bdb_dors_raw_lp ${whereSql}`, params);
            total = totalRow[0]?.c || 0;
            DorsService_1.COUNT_CACHE.set(countKey, { total, expiresAt: Date.now() + 5 * 60 * 1000 });
        }
        params.push(row, offset);
        const rows = await this.dataSource.query(`select id, dors_lp_id, model_lp, no_laporan, data_scope, import_batch, synced_at, payload_json,
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
             limit $${params.length - 1} offset $${params.length}`, params);
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }
    async cancelSync(authUser, logId) {
        this.assertAdmin(authUser);
        this.stopRequested = true;
        this.syncing = false;
        let targetLogId = logId;
        if (!targetLogId) {
            const running = await this.syncLogs.query(`select id from bdb_dors_sync_log where status='running' order by id desc limit 1`);
            if (running.length)
                targetLogId = running[0].id;
        }
        if (targetLogId) {
            await this.syncLogs.terminal(`update bdb_dors_sync_log set status='stopped', stopped_reason='Dibatalkan manual oleh pengguna.', error='Dibatalkan manual.', finished_at=now() where id=$1 and status='running'`, [targetLogId]);
        }
        return { status: 1, message: 'Proses sinkronisasi DORS berhasil dihentikan.' };
    }
    async getDorsMetrics(authUser) {
        this.assertAdmin(authUser);
        const cfg = await this.getConfig();
        const rawRows = await this.dataSource.query(`select model_lp, count(*)::int as count, max(synced_at) as last_sync 
             from bdb_dors_raw_lp group by model_lp order by model_lp`);
        const rawTotal = rawRows.reduce((a, b) => a + (Number(b.count) || 0), 0);
        const lpCountRow = await this.dataSource.query(`select count(*)::int as total,
                    count(*) filter (where deleted_at is null)::int as aktif,
                    count(*) filter (where deleted_at is not null)::int as soft_deleted
             from bdb_laporan_polisi`);
        const unmappedRow = await this.dataSource.query(`select count(*)::int as unmapped
             from bdb_dors_raw_lp r
             where not exists (
                 select 1 from bdb_laporan_polisi lp 
                 where lp.dors_lp_id = r.dors_lp_id and lp.model_lp = r.model_lp
             )`);
        const hdRow = await this.dataSource.query(`select count(*)::int as total,
                    count(*) filter (where applied = true)::int as applied,
                    count(*) filter (where applied = false)::int as pending,
                    max(created_at) as last_fetched
             from bdb_dors_history_delete`);
        const lastLog = await this.syncLogs.query(`select id, trigger, from_date, to_date, status, total_fetched, total_upserted, started_at, finished_at, duration_ms, error, stopped_reason
             from bdb_dors_sync_log 
             order by id desc limit 1`);
        return {
            status: 1,
            data: {
                raw_dors: {
                    total: rawTotal,
                    per_model: rawRows,
                },
                laporan_polisi: {
                    total: lpCountRow[0]?.total || 0,
                    aktif: lpCountRow[0]?.aktif || 0,
                    soft_deleted: lpCountRow[0]?.soft_deleted || 0,
                },
                unmapped_count: unmappedRow[0]?.unmapped || 0,
                history_delete: {
                    total: hdRow[0]?.total || 0,
                    applied: hdRow[0]?.applied || 0,
                    pending: hdRow[0]?.pending || 0,
                    last_fetched: hdRow[0]?.last_fetched || null,
                },
                current_sync: {
                    is_running: this.syncing,
                    last_job: lastLog[0] || null,
                },
                scheduler: {
                    enabled: cfg.sync_enabled,
                    mode: cfg.sync_mode,
                    interval_minutes: cfg.sync_interval_minutes,
                    cron: cfg.sync_cron,
                    days_back: cfg.sync_days_back,
                    data_scope: cfg.data_scope,
                    next_run: this.nextRun(cfg)
                }
            }
        };
    }
    async syncHistoryDelete(authUser, from, to) {
        this.assertAdmin(authUser);
        const cfg = await this.getConfig();
        if (!cfg.client_id) {
            return { status: 0, message: 'Client ID DORS belum dikonfigurasi.' };
        }
        const today = this.ymd(new Date());
        const t = to || today;
        const f = from || this.daysAgo(30);
        this.logger.log(`Memulai penarikan DORS gk_history_delete (${f} s/d ${t})...`);
        let page = 1;
        let lastPage = 1;
        let totalFetched = 0;
        let totalUpserted = 0;
        while (page <= lastPage) {
            const url = `${cfg.base_url}/gk_history_delete?from=${f}&to=${t}&from_hour=00:00:00&to_hour=23:59:59&page=${page}&showby=updated_at&orderbyid=desc`;
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), cfg.timeout_ms);
            let resData = null;
            try {
                const res = await fetch(url, {
                    signal: ctrl.signal,
                    headers: { [cfg.client_header]: cfg.client_id, Accept: 'application/json' }
                });
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} halaman ${page}`);
                }
                resData = await res.json();
            }
            finally {
                clearTimeout(timer);
            }
            if (!resData || resData.status === false) {
                throw new Error(resData?.msg || 'Ditolak oleh server DORS');
            }
            lastPage = Number(resData.last_page) || 1;
            const rows = Array.isArray(resData.data) ? resData.data : [];
            totalFetched += rows.length;
            for (const row of rows) {
                if (!row || !row.id)
                    continue;
                const dorsHistoryId = Number(row.id);
                const idLaporan = row.id_laporan ? Number(row.id_laporan) : null;
                const noLaporan = row.no_laporan ? String(row.no_laporan).trim() : null;
                const tglLaporan = row.tgl_laporan ? String(row.tgl_laporan) : null;
                const kategori = row.kategori ? String(row.kategori) : null;
                const action = row.action ? String(row.action) : null;
                const actionDate = row.action_date ? String(row.action_date) : null;
                const q = await this.dataSource.query(`INSERT INTO bdb_dors_history_delete 
                     (dors_history_id, id_laporan, no_laporan, tgl_laporan, kategori, action, action_date, updated_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
                     ON CONFLICT (dors_history_id) DO UPDATE SET
                       id_laporan = EXCLUDED.id_laporan,
                       no_laporan = EXCLUDED.no_laporan,
                       tgl_laporan = EXCLUDED.tgl_laporan,
                       kategori = EXCLUDED.kategori,
                       action = EXCLUDED.action,
                       action_date = EXCLUDED.action_date,
                       updated_at = now()
                     RETURNING id`, [dorsHistoryId, idLaporan, noLaporan, tglLaporan, kategori, action, actionDate]);
                if (q.length)
                    totalUpserted++;
            }
            page++;
        }
        const appliedResult = await this.applyPendingHistoryDelete(authUser);
        return {
            status: 1,
            data: {
                from: f,
                to: t,
                total_fetched: totalFetched,
                total_upserted: totalUpserted,
                applied_lp_count: appliedResult.data?.applied_count || 0
            },
            message: `Berhasil menarik ${totalFetched} data riwayat hapus DORS (${totalUpserted} baru/diperbarui). ${appliedResult.data?.applied_count || 0} Laporan Polisi disinkronkan ke status terhapus (soft-delete).`
        };
    }
    async applyPendingHistoryDelete(authUser) {
        this.assertAdmin(authUser);
        const countPending = await this.dataSource.query(`SELECT count(*)::int as c FROM bdb_dors_history_delete WHERE applied = false`);
        const totalPending = Number(countPending[0]?.c || 0);
        if (!totalPending) {
            return {
                status: 1,
                data: { pending_checked: 0, applied_count: 0 },
                message: 'Tidak ada data riwayat hapus pending.'
            };
        }
        const resId = await this.dataSource.query(`
            WITH matched AS (
                SELECT hd.id as hd_id, hd.action_date, lp.id as lp_id
                FROM bdb_dors_history_delete hd
                JOIN bdb_laporan_polisi lp ON lp.dors_lp_id = hd.id_laporan
                WHERE hd.applied = false AND hd.id_laporan IS NOT NULL AND lp.deleted_at IS NULL
            ),
            upd_lp AS (
                UPDATE bdb_laporan_polisi lp
                SET deleted_at = COALESCE(nullif(m.action_date,'')::timestamp, now()),
                    delete_reason = 'Dihapus dari DORS (gk_history_delete)',
                    updated_at = now()
                FROM matched m
                WHERE lp.id = m.lp_id
                RETURNING lp.id
            )
            SELECT count(*)::int as c FROM upd_lp`);
        const countById = Number(resId[0]?.c || 0);

        const resNo = await this.dataSource.query(`
            WITH matched AS (
                SELECT hd.id as hd_id, hd.action_date, lp.id as lp_id
                FROM bdb_dors_history_delete hd
                JOIN bdb_laporan_polisi lp ON lower(trim(lp.no_laporan)) = lower(trim(hd.no_laporan))
                WHERE hd.applied = false AND hd.no_laporan IS NOT NULL AND trim(hd.no_laporan) <> '' AND lp.deleted_at IS NULL
            ),
            upd_lp AS (
                UPDATE bdb_laporan_polisi lp
                SET deleted_at = COALESCE(nullif(m.action_date,'')::timestamp, now()),
                    delete_reason = 'Dihapus dari DORS (gk_history_delete)',
                    updated_at = now()
                FROM matched m
                WHERE lp.id = m.lp_id
                RETURNING lp.id
            )
            SELECT count(*)::int as c FROM upd_lp`);
        const countByNo = Number(resNo[0]?.c || 0);
        const appliedCount = countById + countByNo;

        await this.dataSource.query(`
            UPDATE bdb_dors_history_delete 
            SET applied = true, applied_at = now(), updated_at = now() 
            WHERE applied = false`);

        await this.dataSource.query(`
            DELETE FROM bdb_kinerja_perkara_snapshot s
            USING bdb_laporan_polisi lp
            WHERE s.lp_id = lp.id AND lp.deleted_at IS NOT NULL`);

        return {
            status: 1,
            data: {
                pending_checked: totalPending,
                applied_count: appliedCount
            },
            message: `${appliedCount} Laporan Polisi berhasil disinkronkan ke status terhapus (soft-delete).`
        };
    }
    async listHistoryDelete(authUser, opts) {
        this.assertAdmin(authUser);
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(100, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const where = [];
        const params = [];
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`(no_laporan ILIKE $${params.length} OR CAST(id_laporan AS TEXT) ILIKE $${params.length})`);
        }
        if (opts.applied !== undefined && opts.applied !== '' && opts.applied !== 'all') {
            const isApplied = opts.applied === 'true' || opts.applied === '1';
            params.push(isApplied);
            where.push(`applied = $${params.length}`);
        }
        if (opts.from) {
            params.push(opts.from);
            where.push(`created_at >= $${params.length}::timestamp`);
        }
        if (opts.to) {
            params.push(opts.to);
            where.push(`created_at <= ($${params.length}::date + time '23:59:59')`);
        }
        const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
        const countRow = await this.dataSource.query(`SELECT count(*)::int as c FROM bdb_dors_history_delete ${whereSql}`, params);
        const total = countRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(`SELECT id, dors_history_id, id_laporan, no_laporan, tgl_laporan, kategori, action, action_date, applied, applied_at, created_at, updated_at
             FROM bdb_dors_history_delete
             ${whereSql}
             ORDER BY dors_history_id DESC
             LIMIT $${params.length - 1} OFFSET $${params.length}`, params);
        return {
            status: 1,
            data: rows,
            total,
            page,
            row,
            total_page: Math.ceil(total / row)
        };
    }
};
exports.DorsService = DorsService;
exports.DorsService = DorsService = DorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        schedule_1.SchedulerRegistry,
        laporan_polisi_service_1.LaporanPolisiService,
        satker_service_1.SatkerService])
], DorsService);
//# sourceMappingURL=dors.service.js.map