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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnevController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const auth_guard_1 = require("../../app_core/auth/auth.guard");
const anev_service_1 = require("./anev.service");
let AnevController = class AnevController {
    service;
    constructor(service) {
        this.service = service;
    }
    meta() {
        return this.service.meta();
    }
    dashboard(q, req) {
        const uid = req?.user?.id ? Number(req.user.id) : undefined;
        return this.service.dashboard(q || {}, uid);
    }
    petaKejahatan(q, req) {
        const uid = req?.user?.id ? Number(req.user.id) : undefined;
        return this.service.petaKejahatan(q || {}, uid);
    }
    rekap(q) {
        return this.service.rekap(q || {}, q?.parent);
    }
    async export(q, res) {
        const { columns, rows } = await this.service.exportRows(q || {});
        const lbl = { PENYELIDIKAN: 'LIDIK', PENYIDIKAN: 'SIDIK' };
        const header = ['Kode', 'Satker', ...columns.map((c) => `${lbl[c.code] || c.code.replace(/_/g, ' ')} (${c.kategori})`), 'CT', 'CC', 'TOTAL', '% CC'];
        const esc = (v) => {
            const s = v == null ? '' : String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const lines = [header.map(esc).join(',')];
        for (const r of rows) {
            const pct = r.TOTAL ? Math.round((r.CC / r.TOTAL) * 100) + '%' : '';
            const line = [r.kode, r.satker, ...columns.map((c) => r[c.code] ?? 0), r.CT, r.CC, r.TOTAL, pct];
            lines.push(line.map(esc).join(','));
        }
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="anev-ct-cc-${stamp}.csv"`);
        return res.send('\uFEFF' + lines.join('\n'));
    }
    async generateLampiran(body, req) {
        const uid = req?.user?.id ? Number(req.user.id) : undefined;
        return this.service.generateLampiranData(body || {}, uid);
    }
    async logPrintLampiran(body, req) {
        const uid = req?.user?.id ? Number(req.user.id) : undefined;
        const ip = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress;
        const ua = req?.headers?.['user-agent'];
        return this.service.saveLampiranLog({
            ...body,
            userId: uid,
            ipAddress: Array.isArray(ip) ? ip[0] : ip,
            userAgent: ua
        });
    }
    async getLampiranArchives(limit) {
        return this.service.getLampiranArchives(undefined, limit ? parseInt(limit, 10) : 50);
    }
    async getLampiranArchiveDetail(id) {
        return this.service.getLampiranArchiveDetail(parseInt(id, 10));
    }
};
exports.AnevController = AnevController;
__decorate([
    (0, common_1.Get)('meta'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnevController.prototype, "meta", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AnevController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('peta-kejahatan'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AnevController.prototype, "petaKejahatan", null);
__decorate([
    (0, common_1.Get)('rekap'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnevController.prototype, "rekap", null);
__decorate([
    (0, common_1.Get)('rekap/export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], AnevController.prototype, "export", null);
__decorate([
    (0, common_1.Post)('lampiran/generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnevController.prototype, "generateLampiran", null);
__decorate([
    (0, common_1.Post)('lampiran/log-print'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnevController.prototype, "logPrintLampiran", null);
__decorate([
    (0, common_1.Get)('lampiran/archives'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnevController.prototype, "getLampiranArchives", null);
__decorate([
    (0, common_1.Get)('lampiran/archives/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnevController.prototype, "getLampiranArchiveDetail", null);
exports.AnevController = AnevController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('bdb/anev'),
    __metadata("design:paramtypes", [anev_service_1.AnevService])
], AnevController);
