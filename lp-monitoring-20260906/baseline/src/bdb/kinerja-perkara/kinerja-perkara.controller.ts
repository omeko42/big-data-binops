import { BadRequestException, Controller, ForbiddenException, Get, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { Worker } from 'worker_threads';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import {
    KinerjaBucketMode,
    KinerjaClosureReasonFilter,
    KinerjaCountingGroup,
    KinerjaFunctionDomain,
    KinerjaModelFilter,
    KinerjaOrganizationDomain,
    KinerjaPerkaraService,
    KinerjaReadVisibility,
    KinerjaTaxonomyFilter
} from './kinerja-perkara.service';

const MODE_LABEL: Record<string, string> = { both: 'Keduanya (CT saat mulai, CC saat selesai)', mulai: 'Tanggal Mulai Penanganan (LP)', selesai: 'Tanggal Selesai (CC)' };

/** "Format Tabel Kinerja" resmi (grup + rincian) -- dipakai sbg satu sumber kebenaran utk header
 *  export XLSX & PDF, sinkron dgn kolom yg ditampilkan di layar (mode detail selalu penuh, krn
 *  file diunduh statis, tak ada toggle spt di UI). Angka desimal (%, indeks) diformat 2 digit;
 *  kosong/null (blm ada data penduduk dsb) tampil '-'.
 */
type ExportCol = { key: string; group: string; sub: string; width: number; render: (r: any) => string | number };
// Instance Intl.NumberFormat di-cache (bukan .toLocaleString('id-ID') per panggilan) -- yg terakhir
// membangun formatter Intl baru tiap kali dipanggil, ~28x lebih lambat saat dipanggil ratusan ribu
// kali (semua kolom angka x ribuan baris export), jadi kontributor utama lambatnya export xlsx/pdf.
const idNumberFormat = new Intl.NumberFormat('id-ID');
const num = (v: any) => idNumberFormat.format(v == null ? 0 : Number(v));
const pct = (v: any) => `${(Number(v) || 0).toFixed(2)}%`;
const EXPORT_COLS: ExportCol[] = [
    { key: 'no', group: 'No', sub: '', width: 10, render: (r) => r.no },
    { key: 'satker', group: 'Satker', sub: '', width: 40, render: (r) => r.satker },
    { key: 'ct', group: 'CT (Crime Total)', sub: 'Total', width: 9, render: (r) => num(r.ct) },
    { key: 'belum_update', group: 'Belum Update', sub: 'Total', width: 11, render: (r) => num((r.cp_berjalan_belum_update || 0) + (r.cp_tunggakan_belum_update || 0)) },
    { key: 'belum_update_aktual', group: 'Belum Update', sub: 'Belum Update Aktual', width: 16, render: (r) => num(r.cp_berjalan_belum_update) },
    { key: 'belum_update_tunggakan', group: 'Belum Update', sub: 'Belum Update Tunggakan', width: 18, render: (r) => num(r.cp_tunggakan_belum_update) },
    { key: 'limpah_eksternal', group: 'Limpah Eksternal', sub: 'Total', width: 14, render: (r) => num(r.limpah_eksternal) },
    { key: 'cp', group: 'CP (Crime Processed)', sub: 'Total', width: 9, render: (r) => num((r.cp_berjalan || 0) + (r.cp_tunggakan || 0)) },
    { key: 'cp_berjalan', group: 'CP (Crime Processed)', sub: 'Sub Total CP Akt', width: 13, render: (r) => num(r.cp_berjalan) },
    { key: 'cp_berjalan_lidik', group: 'CP (Crime Processed)', sub: 'Lidik', width: 8, render: (r) => num(r.cp_berjalan_lidik) },
    { key: 'cp_berjalan_sidik', group: 'CP (Crime Processed)', sub: 'Sidik', width: 8, render: (r) => num(r.cp_berjalan_sidik) },
    { key: 'cp_berjalan_spdp', group: 'CP (Crime Processed)', sub: 'Kirim SPDP', width: 10, render: (r) => num(r.cp_berjalan_spdp) },
    { key: 'cp_berjalan_thp1', group: 'CP (Crime Processed)', sub: 'THP-1', width: 8, render: (r) => num(r.cp_berjalan_thp1) },
    { key: 'cp_berjalan_p19', group: 'CP (Crime Processed)', sub: 'P-19', width: 8, render: (r) => num(r.cp_berjalan_p19) },
    { key: 'cp_berjalan_p21', group: 'CP (Crime Processed)', sub: 'P-21', width: 8, render: (r) => num(r.cp_berjalan_p21) },
    { key: 'cp_tunggakan', group: 'CP (Crime Processed)', sub: 'Sub Total CP Tgk', width: 13, render: (r) => num(r.cp_tunggakan) },
    { key: 'cp_tunggakan_lidik', group: 'CP (Crime Processed)', sub: 'Lidik', width: 8, render: (r) => num(r.cp_tunggakan_lidik) },
    { key: 'cp_tunggakan_sidik', group: 'CP (Crime Processed)', sub: 'Sidik', width: 8, render: (r) => num(r.cp_tunggakan_sidik) },
    { key: 'cp_tunggakan_spdp', group: 'CP (Crime Processed)', sub: 'Kirim SPDP', width: 10, render: (r) => num(r.cp_tunggakan_spdp) },
    { key: 'cp_tunggakan_thp1', group: 'CP (Crime Processed)', sub: 'THP-1', width: 8, render: (r) => num(r.cp_tunggakan_thp1) },
    { key: 'cp_tunggakan_p19', group: 'CP (Crime Processed)', sub: 'P-19', width: 8, render: (r) => num(r.cp_tunggakan_p19) },
    { key: 'cp_tunggakan_p21', group: 'CP (Crime Processed)', sub: 'P-21', width: 8, render: (r) => num(r.cp_tunggakan_p21) },
    { key: 'pr_lama', group: 'PR (Processed Rate)', sub: '(Rumus Lama)', width: 11, render: (r) => pct(r.pr_lama) },
    { key: 'pr', group: 'PR (Processed Rate)', sub: '(Rumus Baru)', width: 11, render: (r) => pct(r.pr) },
    { key: 'cc', group: 'CC (Crime Clearance)', sub: 'Total', width: 9, render: (r) => num((r.cc_aktual || 0) + (r.cc_tunggakan || 0)) },
    { key: 'cc_aktual', group: 'CC (Crime Clearance)', sub: 'Sub Total CC Akt', width: 13, render: (r) => num(r.cc_aktual) },
    { key: 'cc_aktual_sp2lid', group: 'CC (Crime Clearance)', sub: 'SP2LID', width: 9, render: (r) => num(r.cc_aktual_sp2lid) },
    { key: 'cc_aktual_sp3', group: 'CC (Crime Clearance)', sub: 'SP3', width: 8, render: (r) => num(r.cc_aktual_sp3) },
    { key: 'cc_aktual_tipiring', group: 'CC (Crime Clearance)', sub: 'Putusan Tipiring', width: 13, render: (r) => num(r.cc_aktual_tipiring) },
    { key: 'cc_aktual_thp2', group: 'CC (Crime Clearance)', sub: 'THP-2', width: 8, render: (r) => num(r.cc_aktual_thp2) },
    { key: 'cc_tunggakan', group: 'CC (Crime Clearance)', sub: 'Sub Total CC Tgk', width: 13, render: (r) => num(r.cc_tunggakan) },
    { key: 'cc_tunggakan_sp2lid', group: 'CC (Crime Clearance)', sub: 'SP2LID', width: 9, render: (r) => num(r.cc_tunggakan_sp2lid) },
    { key: 'cc_tunggakan_sp3', group: 'CC (Crime Clearance)', sub: 'SP3', width: 8, render: (r) => num(r.cc_tunggakan_sp3) },
    { key: 'cc_tunggakan_tipiring', group: 'CC (Crime Clearance)', sub: 'Putusan Tipiring', width: 13, render: (r) => num(r.cc_tunggakan_tipiring) },
    { key: 'cc_tunggakan_thp2', group: 'CC (Crime Clearance)', sub: 'THP-2', width: 8, render: (r) => num(r.cc_tunggakan_thp2) },
    { key: 'cr_lama', group: 'CR (Clearance Rate)', sub: '(Rumus Lama)', width: 11, render: (r) => pct(r.cr_lama) },
    { key: 'cr', group: 'CR (Clearance Rate)', sub: '(Rumus Baru)', width: 11, render: (r) => pct(r.cr) },
    { key: 'indeks', group: 'Indeks Kinerja', sub: '', width: 9, render: (r) => (Number(r.indeks) || 0).toFixed(2) },
    { key: 'level', group: 'Level Kinerja', sub: '', width: 8, render: (r) => String(r.level) },
    { key: 'jumlah_penduduk', group: 'Jumlah Penduduk', sub: '', width: 14, render: (r) => (r.jumlah_penduduk != null ? num(r.jumlah_penduduk) : '-') },
    { key: 'crime_rate', group: 'Crime Rate', sub: '', width: 10, render: (r) => (r.crime_rate != null ? num(r.crime_rate) : '-') },
    { key: 'crime_clock', group: 'Crime Clock', sub: '', width: 20, render: (r) => r.crime_clock || '-' }
];

/** Jalankan layout PDF (pdfmake.getBuffer, CPU-bound sinkron & bisa >10 detik utk export penuh)
 *  di worker thread terpisah supaya tidak memblok event loop utama & membekukan seluruh aplikasi
 *  (semua request user lain) selama proses generate berlangsung. */
function renderPdfInWorker(docDefinition: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, 'pdf-render.worker.js');
        const worker = new Worker(workerPath, { workerData: { docDefinition } });
        worker.once('message', (msg: { buf?: Buffer; error?: string }) => {
            worker.terminate();
            if (msg.error) reject(new Error(msg.error));
            else resolve(Buffer.from(msg.buf as any));
        });
        worker.once('error', (err) => {
            worker.terminate();
            reject(err);
        });
    });
}

/** Sama spt renderPdfInWorker -- workbook ExcelJS dibangun & di-serialize di worker thread supaya
 *  tidak memblok event loop utama. */
function renderXlsxInWorker(headerPlan: { key: string; group: string; sub: string; width: number }[], valueRows: Record<string, string | number>[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, 'xlsx-render.worker.js');
        const worker = new Worker(workerPath, { workerData: { headerPlan, valueRows } });
        worker.once('message', (msg: { buf?: Buffer; error?: string }) => {
            worker.terminate();
            if (msg.error) reject(new Error(msg.error));
            else resolve(Buffer.from(msg.buf as any));
        });
        worker.once('error', (err) => {
            worker.terminate();
            reject(err);
        });
    });
}

@Controller('bdb/kinerja-perkara')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class KinerjaPerkaraController {
    constructor(private readonly service: KinerjaPerkaraService) {}

    private uid(req: any): number | undefined {
        return req?.user?.id ? Number(req.user.id) : undefined;
    }

    /** GET tanpa parameter tetap scoped. Nilai asing ditolak agar kesalahan kontrak FE tidak diam-diam melebar. */
    private visibility(value: string | undefined): KinerjaReadVisibility {
        if (value === undefined || value === '') return 'scoped';
        const normalized = String(value).trim().toLowerCase();
        if (normalized === 'national') return 'national';
        if (normalized === 'scoped' || normalized === 'regional') return 'scoped';
        throw new BadRequestException('visibility harus bernilai national atau scoped.');
    }

    private scopeSatkerId(value: string | undefined): number | undefined {
        if (value === undefined || value === '') return undefined;
        const parsed = Number(value);
        if (!Number.isSafeInteger(parsed) || parsed <= 0) {
            throw new BadRequestException('scope_satker_id harus ID satker yang valid.');
        }
        return parsed;
    }

    private taxonomy(functionDomain?: string, organizationDomain?: string): KinerjaTaxonomyFilter {
        const functionAliases: Record<string, KinerjaFunctionDomain> = {
            RESERSE: 'INTERNAL_RESERSE',
            INTERNAL_RESERSE: 'INTERNAL_RESERSE',
            NON_RESERSE: 'EKSTERNAL_RESERSE',
            EKSTERNAL_RESERSE: 'EKSTERNAL_RESERSE',
            STRUCTURAL: 'STRUCTURAL',
            NOT_APPLICABLE: 'NOT_APPLICABLE',
            UNCLASSIFIED: 'STRUCTURAL'
        };
        const organizationAliases: Record<string, KinerjaOrganizationDomain> = {
            INTERNAL_POLRI: 'INTERNAL_POLRI',
            EKSTERNAL_POLRI: 'EKSTERNAL_POLRI',
            EXTERNAL_POLRI: 'EKSTERNAL_POLRI',
            NOT_APPLICABLE: 'NOT_APPLICABLE',
            UNCLASSIFIED: 'NOT_APPLICABLE'
        };
        const functionValue = functionAliases[String(functionDomain || 'INTERNAL_RESERSE').trim().toUpperCase()];
        const organizationValue = organizationAliases[String(organizationDomain || 'INTERNAL_POLRI').trim().toUpperCase()];
        if (!functionValue) {
            throw new BadRequestException('functionDomain harus INTERNAL_RESERSE, EKSTERNAL_RESERSE, STRUCTURAL, atau NOT_APPLICABLE (alias RESERSE/NON_RESERSE tetap didukung).');
        }
        if (!organizationValue) {
            throw new BadRequestException('organizationDomain harus INTERNAL_POLRI, EKSTERNAL_POLRI, atau NOT_APPLICABLE.');
        }
        return { functionDomain: functionValue, organizationDomain: organizationValue };
    }

    private positiveInt(value: string | undefined, field: 'page' | 'limit'): number | undefined {
        if (value === undefined || value === '') return undefined;
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new BadRequestException(`${field} harus bilangan bulat positif.`);
        }
        if (field === 'limit' && parsed > 200) {
            throw new BadRequestException('limit maksimal 200.');
        }
        return parsed;
    }

    /** Refresh menghapus lalu membangun ulang snapshot; hanya role administrasi yang boleh menjalankannya. */
    private assertCanRefresh(req: any): void {
        const role = String(req?.user?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(role)) {
            throw new ForbiddenException('Hanya superadmin/admin binops yang dapat memperbarui snapshot Kinerja Perkara.');
        }
    }

    /** "207,225,61" -> [207,225,61] -- dikirim frontend sbg satu string koma-separated (bukan format array axios). */
    private jk(v: string | undefined): number[] | undefined {
        if (!v) return undefined;
        const ids = String(v)
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n) && n > 0);
        return ids.length ? ids : undefined;
    }

    private model(value?: string): KinerjaModelFilter | undefined {
        if (value === undefined || value === '') return undefined;
        const normalized = String(value).trim().toUpperCase();
        if (normalized === 'A' || normalized === 'LP_MODEL_A') return 'lp_model_a';
        if (normalized === 'B' || normalized === 'LP_MODEL_B') return 'lp_model_b';
        throw new BadRequestException('modelLp harus A atau B.');
    }

    private closureReason(value?: string): KinerjaClosureReasonFilter | undefined {
        if (value === undefined || value === '') return undefined;
        const normalized = String(value).trim().toUpperCase();
        if (normalized === 'RJ' || normalized === 'NON_RJ') return normalized;
        throw new BadRequestException('closureReason harus RJ atau NON_RJ.');
    }

    private bucketMode(value?: string): KinerjaBucketMode {
        if (value === undefined || value === '') return 'age';
        const normalized = String(value).trim().toLowerCase();
        if (normalized === 'age' || normalized === 'difficulty') return normalized;
        throw new BadRequestException('bucketMode harus age atau difficulty.');
    }

    private groups(value?: string): KinerjaCountingGroup[] {
        if (value === undefined || value === '') return [];
        const allowed = new Set<KinerjaCountingGroup>(['KRIMUM', 'KRIMSUS', 'NARKOBA', 'REVIEW']);
        const parsed = [...new Set(String(value).split(',').map((v) => v.trim().toUpperCase()).filter(Boolean))];
        const invalid = parsed.filter((v) => !allowed.has(v as KinerjaCountingGroup));
        if (invalid.length) {
            throw new BadRequestException(`kelompok_hitung tidak dikenal: ${invalid.join(', ')}.`);
        }
        return parsed as KinerjaCountingGroup[];
    }

    @Get('rekap')
    rekap(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('parent') parent: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Query('visibility') visibility: string | undefined,
        @Query('functionDomain') functionDomain: string | undefined,
        @Query('organizationDomain') organizationDomain: string | undefined,
        @Query('page') page: string | undefined,
        @Query('limit') limit: string | undefined,
        @Query('modelLp') modelLp: string | undefined,
        @Query('closureReason') closureReason: string | undefined,
        @Query('bucketMode') bucketMode: string | undefined,
        @Query('kelompok_hitung') kelompokHitung: string | undefined,
        @Query('scope_satker_id') scopeSatkerId: string | undefined,
        @Req() req: any
    ) {
        return this.service.rekap(
            this.uid(req),
            from,
            to,
            parent,
            mode,
            this.jk(jk),
            this.jk(golongan),
            this.jk(iccs),
            this.visibility(visibility),
            this.taxonomy(functionDomain, organizationDomain),
            this.positiveInt(page, 'page'),
            this.positiveInt(limit, 'limit'),
            this.model(modelLp),
            this.closureReason(closureReason),
            this.bucketMode(bucketMode),
            this.groups(kelompokHitung),
            this.scopeSatkerId(scopeSatkerId)
        );
    }

    @Get('summary')
    summary(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Query('visibility') visibility: string | undefined,
        @Query('functionDomain') functionDomain: string | undefined,
        @Query('organizationDomain') organizationDomain: string | undefined,
        @Query('modelLp') modelLp: string | undefined,
        @Query('closureReason') closureReason: string | undefined,
        @Query('bucketMode') bucketMode: string | undefined,
        @Query('kelompok_hitung') kelompokHitung: string | undefined,
        @Query('scope_satker_id') scopeSatkerId: string | undefined,
        @Req() req: any
    ) {
        return this.service.summary(
            this.uid(req),
            from,
            to,
            mode,
            this.jk(jk),
            this.jk(golongan),
            this.jk(iccs),
            this.visibility(visibility),
            this.taxonomy(functionDomain, organizationDomain),
            this.model(modelLp),
            this.closureReason(closureReason),
            this.bucketMode(bucketMode),
            this.groups(kelompokHitung),
            this.scopeSatkerId(scopeSatkerId)
        );
    }

    @Get('status')
    async status() {
        return { status: 1, data: { last_refreshed_at: await this.service.lastRefreshedAt() } };
    }

    @Get('meta/jenis-kejahatan')
    jenisKejahatan() {
        return this.service.jenisKejahatanOptions();
    }

    @Get('meta/scope-options')
    scopeOptions(@Req() req: any) {
        return this.service.scopeOptions(this.uid(req));
    }

    /** Refresh manual (dipicu tombol "Refresh Sekarang" di frontend, sudah lewat confirm dialog). */
    @Post('refresh')
    async refresh(@Req() req: any) {
        this.assertCanRefresh(req);
        const lastRefreshedAt = await this.service.refreshSnapshot();
        return { status: 1, data: { last_refreshed_at: lastRefreshedAt }, message: 'Data kinerja perkara diperbarui.' };
    }

    @Get('rekap/export.csv')
    async exportCsv(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Query('visibility') visibility: string | undefined,
        @Query('functionDomain') functionDomain: string | undefined,
        @Query('organizationDomain') organizationDomain: string | undefined,
        @Query('modelLp') modelLp: string | undefined,
        @Query('closureReason') closureReason: string | undefined,
        @Query('bucketMode') bucketMode: string | undefined,
        @Query('kelompok_hitung') kelompokHitung: string | undefined,
        @Query('scope_satker_id') scopeSatkerId: string | undefined,
        @Req() req: any,
        @Res() res: Response
    ) {
        const { rows, from: f, to: t } = await this.service.exportRows(
            this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs),
            this.visibility(visibility), this.taxonomy(functionDomain, organizationDomain),
            this.model(modelLp), this.closureReason(closureReason), this.bucketMode(bucketMode),
            this.groups(kelompokHitung),
            this.scopeSatkerId(scopeSatkerId)
        );
        const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const header = EXPORT_COLS.map((c) => quote(c.sub ? `${c.group} - ${c.sub}` : c.group)).join(',');
        const lines = rows.map((row: any) => EXPORT_COLS.map((c) => quote(c.render(row))).join(','));
        const csv = Buffer.from(`\uFEFF${[header, ...lines].join('\r\n')}`, 'utf8');
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="kinerja-perkara-${f}_${t}-${stamp}.csv"`);
        return res.send(csv);
    }
    @Get('rekap/export.xlsx')
    async exportXlsx(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Query('visibility') visibility: string | undefined,
        @Query('functionDomain') functionDomain: string | undefined,
        @Query('organizationDomain') organizationDomain: string | undefined,
        @Query('modelLp') modelLp: string | undefined,
        @Query('closureReason') closureReason: string | undefined,
        @Query('bucketMode') bucketMode: string | undefined,
        @Query('kelompok_hitung') kelompokHitung: string | undefined,
        @Query('scope_satker_id') scopeSatkerId: string | undefined,
        @Req() req: any,
        @Res() res: Response
    ) {
        const { rows, from: f, to: t } = await this.service.exportRows(
            this.uid(req),
            from,
            to,
            mode,
            this.jk(jk),
            this.jk(golongan),
            this.jk(iccs),
            this.visibility(visibility),
            this.taxonomy(functionDomain, organizationDomain),
            this.model(modelLp),
            this.closureReason(closureReason),
            this.bucketMode(bucketMode),
            this.groups(kelompokHitung),
            this.scopeSatkerId(scopeSatkerId)
        );

        const headerPlan = EXPORT_COLS.map((c) => ({ key: c.key, group: c.group, sub: c.sub, width: c.width }));
        const valueRows = rows.map((r: any) => {
            const values: Record<string, string | number> = {};
            for (const c of EXPORT_COLS) values[c.key] = c.render(r);
            return values;
        });

        const buf = await renderXlsxInWorker(headerPlan, valueRows);
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="kinerja-perkara-${f}_${t}-${stamp}.xlsx"`);
        return res.send(buf);
    }

    @Get('rekap/export.pdf')
    async exportPdf(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Query('visibility') visibility: string | undefined,
        @Query('functionDomain') functionDomain: string | undefined,
        @Query('organizationDomain') organizationDomain: string | undefined,
        @Query('modelLp') modelLp: string | undefined,
        @Query('closureReason') closureReason: string | undefined,
        @Query('bucketMode') bucketMode: string | undefined,
        @Query('kelompok_hitung') kelompokHitung: string | undefined,
        @Query('scope_satker_id') scopeSatkerId: string | undefined,
        @Req() req: any,
        @Res() res: Response
    ) {
        const { rows, from: f, to: t, mode: m } = await this.service.exportRows(
            this.uid(req),
            from,
            to,
            mode,
            this.jk(jk),
            this.jk(golongan),
            this.jk(iccs),
            this.visibility(visibility),
            this.taxonomy(functionDomain, organizationDomain),
            this.model(modelLp),
            this.closureReason(closureReason),
            this.bucketMode(bucketMode),
            this.groups(kelompokHitung),
            this.scopeSatkerId(scopeSatkerId)
        );

        // Header 2 baris (grup + rincian), colSpan/rowSpan sesuai jumlah kolom per grup -- sel yg
        // "tertutup" oleh span (baik horizontal maupun vertikal) WAJIB placeholder {} bagi pdfmake.
        // fillColor taruh LANGSUNG per-sel (bukan lewat `layout.fillColor` callback) krn docDefinition
        // dikirim ke worker thread via structured clone, yg tak bisa membawa function.
        const HEAD_FILL = '#E8935C';
        const headRow1: any[] = [];
        const headRow2: any[] = [];
        for (let i = 0; i < EXPORT_COLS.length; ) {
            const c = EXPORT_COLS[i];
            let span = 1;
            while (i + span < EXPORT_COLS.length && EXPORT_COLS[i + span].group === c.group) span++;
            if (span > 1) {
                headRow1.push({ text: c.group, colSpan: span, style: 'th', fillColor: HEAD_FILL });
                for (let k = 1; k < span; k++) headRow1.push({ text: '', fillColor: HEAD_FILL });
                for (let k = 0; k < span; k++) headRow2.push({ text: EXPORT_COLS[i + k].sub, style: 'th', fillColor: HEAD_FILL });
            } else {
                headRow1.push({ text: c.group, rowSpan: 2, style: 'th', fillColor: HEAD_FILL });
                headRow2.push({ text: '', fillColor: HEAD_FILL });
            }
            i += span;
        }
        const body = rows.map((r: any) => EXPORT_COLS.map((c) => String(c.render(r))));

        const docDefinition = {
            pageOrientation: 'landscape' as const,
            pageMargins: [24, 40, 24, 30] as [number, number, number, number],
            content: [
                { text: 'Kinerja Perkara (CT/CP/CC/CR/Indeks)', style: 'title' },
                { text: `Periode: ${f} s/d ${t}  |  Acuan: ${MODE_LABEL[m || 'both']}`, style: 'sub' },
                {
                    style: 'table',
                    // Lebar kolom FIXED (bukan 'auto') -- 'auto' memaksa pdfmake mengukur lebar teks
                    // tiap sel di seluruh baris utk menghitung lebar optimal, sangat mahal utk ribuan
                    // baris x puluhan kolom (terukur >15 detik). Angka di sini konversi dari width
                    // "karakter" (satuan yg sama dipakai sheet.columns di exportXlsx) ke poin pdfmake.
                    table: { headerRows: 2, widths: EXPORT_COLS.map((c) => Math.round(c.width * 5.5)), body: [headRow1, headRow2, ...body] }
                }
            ],
            styles: {
                title: { fontSize: 14, bold: true, margin: [0, 0, 0, 2] },
                sub: { fontSize: 8, color: '#64748b', margin: [0, 0, 0, 8] },
                table: { fontSize: 6 },
                th: { bold: true, fontSize: 6, alignment: 'center' as const }
            },
            defaultStyle: { font: 'Roboto', fontSize: 6 }
        };

        const buf = await renderPdfInWorker(docDefinition);
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="kinerja-perkara-${f}_${t}-${stamp}.pdf"`);
        return res.send(buf);
    }
}
