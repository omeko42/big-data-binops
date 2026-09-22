import { Controller, Get, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { Worker } from 'worker_threads';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { KinerjaPerkaraService } from './kinerja-perkara.service';

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
const pct = (v: any) => `${(Number(v) || 0).toFixed(4)}%`;
const EXPORT_COLS: ExportCol[] = [
    { key: 'kode', group: 'Kode', sub: '', width: 14, render: (r) => r.kode },
    { key: 'satker', group: 'Satker', sub: '', width: 40, render: (r) => r.satker },
    { key: 'ct', group: 'CT (Crime Total)', sub: 'Total', width: 9, render: (r) => num(r.ct) },
    { key: 'ct_model_a', group: 'CT (Crime Total)', sub: 'LP Model A', width: 10, render: (r) => num(r.ct_model_a) },
    { key: 'ct_model_b', group: 'CT (Crime Total)', sub: 'LP Model B', width: 10, render: (r) => num(r.ct_model_b) },
    { key: 'cp', group: 'CP (Crime Processed)', sub: '', width: 9, render: (r) => num((r.cp_berjalan || 0) + (r.cp_tunggakan || 0)) },
    { key: 'cp_berjalan', group: 'CP Aktual', sub: 'Total', width: 9, render: (r) => num(r.cp_berjalan) },
    { key: 'cp_berjalan_lidik', group: 'CP Aktual', sub: 'Lidik', width: 8, render: (r) => num(r.cp_berjalan_lidik) },
    { key: 'cp_berjalan_sidik', group: 'CP Aktual', sub: 'Sidik', width: 8, render: (r) => num(r.cp_berjalan_sidik) },
    { key: 'cp_berjalan_spdp', group: 'CP Aktual', sub: 'Kirim SPDP', width: 10, render: (r) => num(r.cp_berjalan_spdp) },
    { key: 'cp_berjalan_thp1', group: 'CP Aktual', sub: 'THP-1', width: 8, render: (r) => num(r.cp_berjalan_thp1) },
    { key: 'cp_berjalan_p19', group: 'CP Aktual', sub: 'P-19', width: 8, render: (r) => num(r.cp_berjalan_p19) },
    { key: 'cp_berjalan_p21', group: 'CP Aktual', sub: 'P-21', width: 8, render: (r) => num(r.cp_berjalan_p21) },
    { key: 'cp_tunggakan', group: 'CP Tunggakan', sub: 'Total', width: 9, render: (r) => num(r.cp_tunggakan) },
    { key: 'cp_tunggakan_lidik', group: 'CP Tunggakan', sub: 'Lidik', width: 8, render: (r) => num(r.cp_tunggakan_lidik) },
    { key: 'cp_tunggakan_sidik', group: 'CP Tunggakan', sub: 'Sidik', width: 8, render: (r) => num(r.cp_tunggakan_sidik) },
    { key: 'cp_tunggakan_spdp', group: 'CP Tunggakan', sub: 'Kirim SPDP', width: 10, render: (r) => num(r.cp_tunggakan_spdp) },
    { key: 'cp_tunggakan_thp1', group: 'CP Tunggakan', sub: 'THP-1', width: 8, render: (r) => num(r.cp_tunggakan_thp1) },
    { key: 'cp_tunggakan_p19', group: 'CP Tunggakan', sub: 'P-19', width: 8, render: (r) => num(r.cp_tunggakan_p19) },
    { key: 'cp_tunggakan_p21', group: 'CP Tunggakan', sub: 'P-21', width: 8, render: (r) => num(r.cp_tunggakan_p21) },
    { key: 'pr', group: 'PR (Processed Rate)', sub: '(Rumus Baru)', width: 11, render: (r) => pct(r.pr) },
    { key: 'pr_lama', group: 'PR (Processed Rate)', sub: '(Rumus Lama)', width: 11, render: (r) => pct(r.pr_lama) },
    { key: 'cc', group: 'CC (Crime Clearance)', sub: '', width: 9, render: (r) => num((r.cc_aktual || 0) + (r.cc_tunggakan || 0)) },
    { key: 'cc_aktual', group: 'CC Aktual', sub: 'Total', width: 9, render: (r) => num(r.cc_aktual) },
    { key: 'cc_aktual_sp2lid', group: 'CC Aktual', sub: 'SP2LID', width: 9, render: (r) => num(r.cc_aktual_sp2lid) },
    { key: 'cc_aktual_sp3', group: 'CC Aktual', sub: 'SP3', width: 8, render: (r) => num(r.cc_aktual_sp3) },
    { key: 'cc_aktual_rj_sp2lid', group: 'CC Aktual', sub: 'RJ SP2LID', width: 10, render: (r) => num(r.cc_aktual_rj_sp2lid) },
    { key: 'cc_aktual_rj_sp3', group: 'CC Aktual', sub: 'RJ SP3', width: 9, render: (r) => num(r.cc_aktual_rj_sp3) },
    { key: 'cc_aktual_thp2', group: 'CC Aktual', sub: 'THP-2', width: 8, render: (r) => num(r.cc_aktual_thp2) },
    { key: 'cc_tunggakan', group: 'CC Tunggakan', sub: 'Total', width: 9, render: (r) => num(r.cc_tunggakan) },
    { key: 'cc_tunggakan_sp2lid', group: 'CC Tunggakan', sub: 'SP2LID', width: 9, render: (r) => num(r.cc_tunggakan_sp2lid) },
    { key: 'cc_tunggakan_sp3', group: 'CC Tunggakan', sub: 'SP3', width: 8, render: (r) => num(r.cc_tunggakan_sp3) },
    { key: 'cc_tunggakan_rj_sp2lid', group: 'CC Tunggakan', sub: 'RJ SP2LID', width: 10, render: (r) => num(r.cc_tunggakan_rj_sp2lid) },
    { key: 'cc_tunggakan_rj_sp3', group: 'CC Tunggakan', sub: 'RJ SP3', width: 9, render: (r) => num(r.cc_tunggakan_rj_sp3) },
    { key: 'cc_tunggakan_thp2', group: 'CC Tunggakan', sub: 'THP-2', width: 8, render: (r) => num(r.cc_tunggakan_thp2) },
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

    /** "207,225,61" -> [207,225,61] -- dikirim frontend sbg satu string koma-separated (bukan format array axios). */
    private jk(v: string | undefined): number[] | undefined {
        if (!v) return undefined;
        const ids = String(v)
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n) && n > 0);
        return ids.length ? ids : undefined;
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
        @Req() req: any
    ) {
        return this.service.rekap(this.uid(req), from, to, parent, mode, this.jk(jk), this.jk(golongan), this.jk(iccs));
    }

    @Get('summary')
    summary(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Req() req: any
    ) {
        return this.service.summary(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs));
    }

    @Get('status')
    async status() {
        return { status: 1, data: { last_refreshed_at: await this.service.lastRefreshedAt() } };
    }

    @Get('meta/jenis-kejahatan')
    jenisKejahatan() {
        return this.service.jenisKejahatanOptions();
    }

    /** Refresh manual (dipicu tombol "Refresh Sekarang" di frontend, sudah lewat confirm dialog). */
    @Post('refresh')
    async refresh() {
        const lastRefreshedAt = await this.service.refreshSnapshot();
        return { status: 1, data: { last_refreshed_at: lastRefreshedAt }, message: 'Data kinerja perkara diperbarui.' };
    }

    @Get('rekap/export.xlsx')
    async exportXlsx(
        @Query('from') from: string | undefined,
        @Query('to') to: string | undefined,
        @Query('mode') mode: string | undefined,
        @Query('jenis_kejahatan_id') jk: string | undefined,
        @Query('golongan_id') golongan: string | undefined,
        @Query('iccs_kategori_id') iccs: string | undefined,
        @Req() req: any,
        @Res() res: Response
    ) {
        const { rows, from: f, to: t } = await this.service.exportRows(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs));

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
        @Req() req: any,
        @Res() res: Response
    ) {
        const { rows, from: f, to: t, mode: m } = await this.service.exportRows(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs));

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
