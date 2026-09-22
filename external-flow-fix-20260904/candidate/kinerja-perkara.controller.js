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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinerjaPerkaraController = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const worker_threads_1 = require("worker_threads");
const auth_guard_1 = require("../../app_core/auth/auth.guard");
const current_user_interceptor_1 = require("../../app_core/helper/interceptor/current-user.interceptor");
const kinerja_perkara_service_1 = require("./kinerja-perkara.service");
const MODE_LABEL = { both: 'Keduanya (CT saat mulai, CC saat selesai)', mulai: 'Tanggal Mulai Penanganan (LP)', selesai: 'Tanggal Selesai (CC)' };
const idNumberFormat = new Intl.NumberFormat('id-ID');
const num = (v) => idNumberFormat.format(v == null ? 0 : Number(v));
const pct = (v) => `${(Number(v) || 0).toFixed(2)}%`;
const EXPORT_COLS = [
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
function renderPdfInWorker(docDefinition) {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, 'pdf-render.worker.js');
        const worker = new worker_threads_1.Worker(workerPath, { workerData: { docDefinition } });
        worker.once('message', (msg) => {
            worker.terminate();
            if (msg.error)
                reject(new Error(msg.error));
            else
                resolve(Buffer.from(msg.buf));
        });
        worker.once('error', (err) => {
            worker.terminate();
            reject(err);
        });
    });
}
function renderXlsxInWorker(headerPlan, valueRows) {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, 'xlsx-render.worker.js');
        const worker = new worker_threads_1.Worker(workerPath, { workerData: { headerPlan, valueRows } });
        worker.once('message', (msg) => {
            worker.terminate();
            if (msg.error)
                reject(new Error(msg.error));
            else
                resolve(Buffer.from(msg.buf));
        });
        worker.once('error', (err) => {
            worker.terminate();
            reject(err);
        });
    });
}
let KinerjaPerkaraController = class KinerjaPerkaraController {
    service;
    constructor(service) {
        this.service = service;
    }
    uid(req) {
        return req?.user?.id ? Number(req.user.id) : undefined;
    }
    visibility(value) {
        if (value === undefined || value === '')
            return 'scoped';
        const normalized = String(value).trim().toLowerCase();
        if (normalized === 'national')
            return 'national';
        if (normalized === 'scoped' || normalized === 'regional')
            return 'scoped';
        throw new common_1.BadRequestException('visibility harus bernilai national atau scoped.');
    }
    scopeSatkerId(value) {
        if (value === undefined || value === '')
            return undefined;
        const parsed = Number(value);
        if (!Number.isSafeInteger(parsed) || parsed <= 0) {
            throw new common_1.BadRequestException('scope_satker_id harus ID satker yang valid.');
        }
        return parsed;
    }
    taxonomy(functionDomain, organizationDomain) {
        const functionAliases = {
            RESERSE: 'INTERNAL_RESERSE',
            INTERNAL_RESERSE: 'INTERNAL_RESERSE',
            NON_RESERSE: 'EKSTERNAL_RESERSE',
            EKSTERNAL_RESERSE: 'EKSTERNAL_RESERSE',
            STRUCTURAL: 'STRUCTURAL',
            NOT_APPLICABLE: 'NOT_APPLICABLE',
            UNCLASSIFIED: 'STRUCTURAL'
        };
        const organizationAliases = {
            INTERNAL_POLRI: 'INTERNAL_POLRI',
            EKSTERNAL_POLRI: 'EKSTERNAL_POLRI',
            EXTERNAL_POLRI: 'EKSTERNAL_POLRI',
            NOT_APPLICABLE: 'NOT_APPLICABLE',
            UNCLASSIFIED: 'NOT_APPLICABLE'
        };
        const functionValue = functionAliases[String(functionDomain || 'INTERNAL_RESERSE').trim().toUpperCase()];
        const organizationValue = organizationAliases[String(organizationDomain || 'INTERNAL_POLRI').trim().toUpperCase()];
        if (!functionValue) {
            throw new common_1.BadRequestException('functionDomain harus INTERNAL_RESERSE, EKSTERNAL_RESERSE, STRUCTURAL, atau NOT_APPLICABLE (alias RESERSE/NON_RESERSE tetap didukung).');
        }
        if (!organizationValue) {
            throw new common_1.BadRequestException('organizationDomain harus INTERNAL_POLRI, EKSTERNAL_POLRI, atau NOT_APPLICABLE.');
        }
        return { functionDomain: functionValue, organizationDomain: organizationValue };
    }
    positiveInt(value, field) {
        if (value === undefined || value === '')
            return undefined;
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new common_1.BadRequestException(`${field} harus bilangan bulat positif.`);
        }
        if (field === 'limit' && parsed > 200) {
            throw new common_1.BadRequestException('limit maksimal 200.');
        }
        return parsed;
    }
    assertCanRefresh(req) {
        const role = String(req?.user?.role_bdb || '').toLowerCase();
        if (!['superadmin', 'admin_binops'].includes(role)) {
            throw new common_1.ForbiddenException('Hanya superadmin/admin binops yang dapat memperbarui snapshot Kinerja Perkara.');
        }
    }
    jk(v) {
        if (!v)
            return undefined;
        const ids = String(v)
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n) && n > 0);
        return ids.length ? ids : undefined;
    }
    model(value) {
        if (value === undefined || value === '')
            return undefined;
        const normalized = String(value).trim().toUpperCase();
        if (normalized === 'A' || normalized === 'LP_MODEL_A')
            return 'lp_model_a';
        if (normalized === 'B' || normalized === 'LP_MODEL_B')
            return 'lp_model_b';
        throw new common_1.BadRequestException('modelLp harus A atau B.');
    }
    closureReason(value) {
        if (value === undefined || value === '')
            return undefined;
        const normalized = String(value).trim().toUpperCase();
        if (normalized === 'RJ' || normalized === 'NON_RJ')
            return normalized;
        throw new common_1.BadRequestException('closureReason harus RJ atau NON_RJ.');
    }
    bucketMode(value) {
        if (value === undefined || value === '')
            return 'age';
        const normalized = String(value).trim().toLowerCase();
        if (normalized === 'age' || normalized === 'difficulty')
            return normalized;
        throw new common_1.BadRequestException('bucketMode harus age atau difficulty.');
    }
    groups(value) {
        if (value === undefined || value === '')
            return [];
        const allowed = new Set(['KRIMUM', 'KRIMSUS', 'NARKOBA', 'REVIEW']);
        const parsed = [...new Set(String(value).split(',').map((v) => v.trim().toUpperCase()).filter(Boolean))];
        const invalid = parsed.filter((v) => !allowed.has(v));
        if (invalid.length) {
            throw new common_1.BadRequestException(`kelompok_hitung tidak dikenal: ${invalid.join(', ')}.`);
        }
        return parsed;
    }
    rekap(from, to, parent, mode, jk, golongan, iccs, visibility, functionDomain, organizationDomain, page, limit, modelLp, closureReason, bucketMode, kelompokHitung, scopeSatkerId, req) {
        return this.service.rekap(this.uid(req), from, to, parent, mode, this.jk(jk), this.jk(golongan), this.jk(iccs), this.visibility(visibility), this.taxonomy(functionDomain, organizationDomain), this.positiveInt(page, 'page'), this.positiveInt(limit, 'limit'), this.model(modelLp), this.closureReason(closureReason), this.bucketMode(bucketMode), this.groups(kelompokHitung), this.scopeSatkerId(scopeSatkerId));
    }
    summary(from, to, mode, jk, golongan, iccs, visibility, functionDomain, organizationDomain, modelLp, closureReason, bucketMode, kelompokHitung, scopeSatkerId, req) {
        return this.service.summary(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs), this.visibility(visibility), this.taxonomy(functionDomain, organizationDomain), this.model(modelLp), this.closureReason(closureReason), this.bucketMode(bucketMode), this.groups(kelompokHitung), this.scopeSatkerId(scopeSatkerId));
    }
    async status() {
        return { status: 1, data: { last_refreshed_at: await this.service.lastRefreshedAt() } };
    }
    jenisKejahatan() {
        return this.service.jenisKejahatanOptions();
    }
    scopeOptions(req) {
        return this.service.scopeOptions(this.uid(req));
    }
    async refresh(req) {
        this.assertCanRefresh(req);
        const lastRefreshedAt = await this.service.refreshSnapshot();
        return { status: 1, data: { last_refreshed_at: lastRefreshedAt }, message: 'Data kinerja perkara diperbarui.' };
    }
    async exportCsv(from, to, mode, jk, golongan, iccs, visibility, functionDomain, organizationDomain, modelLp, closureReason, bucketMode, kelompokHitung, scopeSatkerId, req, res) {
        const { rows, from: f, to: t } = await this.service.exportRows(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs), this.visibility(visibility), this.taxonomy(functionDomain, organizationDomain), this.model(modelLp), this.closureReason(closureReason), this.bucketMode(bucketMode), this.groups(kelompokHitung), this.scopeSatkerId(scopeSatkerId));
        const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const header = EXPORT_COLS.map((c) => quote(c.sub ? `${c.group} - ${c.sub}` : c.group)).join(',');
        const lines = rows.map((row) => EXPORT_COLS.map((c) => quote(c.render(row))).join(','));
        const csv = Buffer.from(`\uFEFF${[header, ...lines].join('\r\n')}`, 'utf8');
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="kinerja-perkara-${f}_${t}-${stamp}.csv"`);
        return res.send(csv);
    }
    async exportXlsx(from, to, mode, jk, golongan, iccs, visibility, functionDomain, organizationDomain, modelLp, closureReason, bucketMode, kelompokHitung, scopeSatkerId, req, res) {
        const { rows, from: f, to: t } = await this.service.exportRows(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs), this.visibility(visibility), this.taxonomy(functionDomain, organizationDomain), this.model(modelLp), this.closureReason(closureReason), this.bucketMode(bucketMode), this.groups(kelompokHitung), this.scopeSatkerId(scopeSatkerId));
        const headerPlan = EXPORT_COLS.map((c) => ({ key: c.key, group: c.group, sub: c.sub, width: c.width }));
        const valueRows = rows.map((r) => {
            const values = {};
            for (const c of EXPORT_COLS)
                values[c.key] = c.render(r);
            return values;
        });
        const buf = await renderXlsxInWorker(headerPlan, valueRows);
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="kinerja-perkara-${f}_${t}-${stamp}.xlsx"`);
        return res.send(buf);
    }
    async exportPdf(from, to, mode, jk, golongan, iccs, visibility, functionDomain, organizationDomain, modelLp, closureReason, bucketMode, kelompokHitung, scopeSatkerId, req, res) {
        const { rows, from: f, to: t, mode: m } = await this.service.exportRows(this.uid(req), from, to, mode, this.jk(jk), this.jk(golongan), this.jk(iccs), this.visibility(visibility), this.taxonomy(functionDomain, organizationDomain), this.model(modelLp), this.closureReason(closureReason), this.bucketMode(bucketMode), this.groups(kelompokHitung), this.scopeSatkerId(scopeSatkerId));
        const HEAD_FILL = '#E8935C';
        const headRow1 = [];
        const headRow2 = [];
        for (let i = 0; i < EXPORT_COLS.length;) {
            const c = EXPORT_COLS[i];
            let span = 1;
            while (i + span < EXPORT_COLS.length && EXPORT_COLS[i + span].group === c.group)
                span++;
            if (span > 1) {
                headRow1.push({ text: c.group, colSpan: span, style: 'th', fillColor: HEAD_FILL });
                for (let k = 1; k < span; k++)
                    headRow1.push({ text: '', fillColor: HEAD_FILL });
                for (let k = 0; k < span; k++)
                    headRow2.push({ text: EXPORT_COLS[i + k].sub, style: 'th', fillColor: HEAD_FILL });
            }
            else {
                headRow1.push({ text: c.group, rowSpan: 2, style: 'th', fillColor: HEAD_FILL });
                headRow2.push({ text: '', fillColor: HEAD_FILL });
            }
            i += span;
        }
        const body = rows.map((r) => EXPORT_COLS.map((c) => String(c.render(r))));
        const docDefinition = {
            pageOrientation: 'landscape',
            pageMargins: [24, 40, 24, 30],
            content: [
                { text: 'Kinerja Perkara (CT/CP/CC/CR/Indeks)', style: 'title' },
                { text: `Periode: ${f} s/d ${t}  |  Acuan: ${MODE_LABEL[m || 'both']}`, style: 'sub' },
                {
                    style: 'table',
                    table: { headerRows: 2, widths: EXPORT_COLS.map((c) => Math.round(c.width * 5.5)), body: [headRow1, headRow2, ...body] }
                }
            ],
            styles: {
                title: { fontSize: 14, bold: true, margin: [0, 0, 0, 2] },
                sub: { fontSize: 8, color: '#64748b', margin: [0, 0, 0, 8] },
                table: { fontSize: 6 },
                th: { bold: true, fontSize: 6, alignment: 'center' }
            },
            defaultStyle: { font: 'Roboto', fontSize: 6 }
        };
        const buf = await renderPdfInWorker(docDefinition);
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="kinerja-perkara-${f}_${t}-${stamp}.pdf"`);
        return res.send(buf);
    }
};
exports.KinerjaPerkaraController = KinerjaPerkaraController;
__decorate([
    (0, common_1.Get)('rekap'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('parent')),
    __param(3, (0, common_1.Query)('mode')),
    __param(4, (0, common_1.Query)('jenis_kejahatan_id')),
    __param(5, (0, common_1.Query)('golongan_id')),
    __param(6, (0, common_1.Query)('iccs_kategori_id')),
    __param(7, (0, common_1.Query)('visibility')),
    __param(8, (0, common_1.Query)('functionDomain')),
    __param(9, (0, common_1.Query)('organizationDomain')),
    __param(10, (0, common_1.Query)('page')),
    __param(11, (0, common_1.Query)('limit')),
    __param(12, (0, common_1.Query)('modelLp')),
    __param(13, (0, common_1.Query)('closureReason')),
    __param(14, (0, common_1.Query)('bucketMode')),
    __param(15, (0, common_1.Query)('kelompok_hitung')),
    __param(16, (0, common_1.Query)('scope_satker_id')),
    __param(17, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], KinerjaPerkaraController.prototype, "rekap", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('mode')),
    __param(3, (0, common_1.Query)('jenis_kejahatan_id')),
    __param(4, (0, common_1.Query)('golongan_id')),
    __param(5, (0, common_1.Query)('iccs_kategori_id')),
    __param(6, (0, common_1.Query)('visibility')),
    __param(7, (0, common_1.Query)('functionDomain')),
    __param(8, (0, common_1.Query)('organizationDomain')),
    __param(9, (0, common_1.Query)('modelLp')),
    __param(10, (0, common_1.Query)('closureReason')),
    __param(11, (0, common_1.Query)('bucketMode')),
    __param(12, (0, common_1.Query)('kelompok_hitung')),
    __param(13, (0, common_1.Query)('scope_satker_id')),
    __param(14, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], KinerjaPerkaraController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KinerjaPerkaraController.prototype, "status", null);
__decorate([
    (0, common_1.Get)('meta/jenis-kejahatan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KinerjaPerkaraController.prototype, "jenisKejahatan", null);
__decorate([
    (0, common_1.Get)('meta/scope-options'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KinerjaPerkaraController.prototype, "scopeOptions", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KinerjaPerkaraController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('rekap/export.csv'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('mode')),
    __param(3, (0, common_1.Query)('jenis_kejahatan_id')),
    __param(4, (0, common_1.Query)('golongan_id')),
    __param(5, (0, common_1.Query)('iccs_kategori_id')),
    __param(6, (0, common_1.Query)('visibility')),
    __param(7, (0, common_1.Query)('functionDomain')),
    __param(8, (0, common_1.Query)('organizationDomain')),
    __param(9, (0, common_1.Query)('modelLp')),
    __param(10, (0, common_1.Query)('closureReason')),
    __param(11, (0, common_1.Query)('bucketMode')),
    __param(12, (0, common_1.Query)('kelompok_hitung')),
    __param(13, (0, common_1.Query)('scope_satker_id')),
    __param(14, (0, common_1.Req)()),
    __param(15, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], KinerjaPerkaraController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('rekap/export.xlsx'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('mode')),
    __param(3, (0, common_1.Query)('jenis_kejahatan_id')),
    __param(4, (0, common_1.Query)('golongan_id')),
    __param(5, (0, common_1.Query)('iccs_kategori_id')),
    __param(6, (0, common_1.Query)('visibility')),
    __param(7, (0, common_1.Query)('functionDomain')),
    __param(8, (0, common_1.Query)('organizationDomain')),
    __param(9, (0, common_1.Query)('modelLp')),
    __param(10, (0, common_1.Query)('closureReason')),
    __param(11, (0, common_1.Query)('bucketMode')),
    __param(12, (0, common_1.Query)('kelompok_hitung')),
    __param(13, (0, common_1.Query)('scope_satker_id')),
    __param(14, (0, common_1.Req)()),
    __param(15, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], KinerjaPerkaraController.prototype, "exportXlsx", null);
__decorate([
    (0, common_1.Get)('rekap/export.pdf'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('mode')),
    __param(3, (0, common_1.Query)('jenis_kejahatan_id')),
    __param(4, (0, common_1.Query)('golongan_id')),
    __param(5, (0, common_1.Query)('iccs_kategori_id')),
    __param(6, (0, common_1.Query)('visibility')),
    __param(7, (0, common_1.Query)('functionDomain')),
    __param(8, (0, common_1.Query)('organizationDomain')),
    __param(9, (0, common_1.Query)('modelLp')),
    __param(10, (0, common_1.Query)('closureReason')),
    __param(11, (0, common_1.Query)('bucketMode')),
    __param(12, (0, common_1.Query)('kelompok_hitung')),
    __param(13, (0, common_1.Query)('scope_satker_id')),
    __param(14, (0, common_1.Req)()),
    __param(15, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], KinerjaPerkaraController.prototype, "exportPdf", null);
exports.KinerjaPerkaraController = KinerjaPerkaraController = __decorate([
    (0, common_1.Controller)('bdb/kinerja-perkara'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __metadata("design:paramtypes", [kinerja_perkara_service_1.KinerjaPerkaraService])
], KinerjaPerkaraController);
//# sourceMappingURL=kinerja-perkara.controller.js.map
