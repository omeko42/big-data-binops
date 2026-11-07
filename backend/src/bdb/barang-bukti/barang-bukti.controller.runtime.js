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
exports.BarangBuktiController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../app_core/auth/auth.guard");
const current_user_interceptor_1 = require("../../app_core/helper/interceptor/current-user.interceptor");
const barang_bukti_service_1 = require("./barang-bukti.service");
let BarangBuktiController = class BarangBuktiController {
    constructor(service) {
        this.service = service;
    }
    /** Rekap lintas-LP (dipaginasi) -- dipakai halaman Rekap Barang Bukti. */
    list(req, query) {
        return this.service.list(req.user, query);
    }
    /** Daftar Master Jenis Barang Bukti DORS untuk dropdown input manual. */
    listMasterJenis(search) {
        return this.service.listMasterJenis(search);
    }
    /** Daftar Master Referensi Satuan Barang Bukti (auto-enrichment & anti-duplikasi). */
    listMasterSatuan(search) {
        return this.service.listMasterSatuan(search);
    }
    createMasterSatuan(req, body) {
        return this.service.createMasterSatuan(req.user, body || {});
    }
    updateMasterSatuan(req, id, body) {
        return this.service.updateMasterSatuan(req.user, Number(id), body || {});
    }
    deleteMasterSatuan(req, id) {
        return this.service.deleteMasterSatuan(req.user, Number(id));
    }
    /** Gabungan DORS + MANUAL utk satu LP -- dipakai tab "Barang Bukti" di halaman detail LP. */
    listByLpAll(req, lpId) {
        return this.service.listByLpAll(req.user, Number(lpId));
    }
    addManual(req, lpId, body) {
        return this.service.addManual(req.user, Number(lpId), body || {});
    }
    updateManual(req, id, body) {
        return this.service.updateManual(req.user, id, body || {});
    }
    putManual(req, id, body) {
        return this.service.updateManual(req.user, id, body || {});
    }
    updateDors(req, id, body) {
        return this.service.updateManual(req.user, `dors-${String(id).replace(/^dors-/i, '')}`, body || {});
    }
    putDors(req, id, body) {
        return this.service.updateManual(req.user, `dors-${String(id).replace(/^dors-/i, '')}`, body || {});
    }
    updateAny(req, id, body) {
        return this.service.updateManual(req.user, id, body || {});
    }
    putAny(req, id, body) {
        return this.service.updateManual(req.user, id, body || {});
    }
    remove(req, id) {
        return this.service.removeManual(req.user, Number(id));
    }
};
exports.BarangBuktiController = BarangBuktiController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('master-jenis'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "listMasterJenis", null);
__decorate([
    (0, common_1.Get)('master-satuan'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "listMasterSatuan", null);
__decorate([
    (0, common_1.Post)('master-satuan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "createMasterSatuan", null);
__decorate([
    (0, common_1.Patch)('master-satuan/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "updateMasterSatuan", null);
__decorate([
    (0, common_1.Delete)('master-satuan/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "deleteMasterSatuan", null);
__decorate([
    (0, common_1.Get)('lp/:lpId/all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('lpId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "listByLpAll", null);
__decorate([
    (0, common_1.Post)('lp/:lpId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('lpId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "addManual", null);
__decorate([
    (0, common_1.Patch)('manual/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "updateManual", null);
__decorate([
    (0, common_1.Put)('manual/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "putManual", null);
__decorate([
    (0, common_1.Patch)('dors/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "updateDors", null);
__decorate([
    (0, common_1.Put)('dors/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "putDors", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "updateAny", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "putAny", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BarangBuktiController.prototype, "remove", null);
exports.BarangBuktiController = BarangBuktiController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    (0, common_1.Controller)('bdb/barang-bukti'),
    __metadata("design:paramtypes", [typeof (_a = typeof barang_bukti_service_1.BarangBuktiService !== "undefined" && barang_bukti_service_1.BarangBuktiService) === "function" ? _a : Object])
], BarangBuktiController);
