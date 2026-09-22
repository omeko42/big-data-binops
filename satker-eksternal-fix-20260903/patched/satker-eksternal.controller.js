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
exports.SatkerEksternalController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../../app_core/auth/auth.guard");
const satker_eksternal_service_1 = require("./satker-eksternal.service");
const IMPORT_FILE_LIMITS = { limits: { fileSize: 10 * 1024 * 1024 } };
let SatkerEksternalController = class SatkerEksternalController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(search, page, row) {
        return this.service.list(search, page, row);
    }
    async bulkImportTemplate(res) {
        const buf = await this.service.buildImportTemplateBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="template-import-satker-eksternal.xlsx"');
        return res.send(buf);
    }
    async bulkImportPreview(file) {
        if (!file)
            throw new common_1.BadRequestException('File Excel wajib diunggah.');
        return this.service.previewBulkImport(file.buffer);
    }
    async bulkImportCommit(body) {
        return this.service.commitBulkImport(body?.rows || []);
    }
    save(body) {
        return this.service.save(body || {});
    }
    remove(id) {
        return this.service.remove(parseInt(id, 10));
    }
};
exports.SatkerEksternalController = SatkerEksternalController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SatkerEksternalController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('bulk-import/template'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SatkerEksternalController.prototype, "bulkImportTemplate", null);
__decorate([
    (0, common_1.Post)('bulk-import/preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', IMPORT_FILE_LIMITS)),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SatkerEksternalController.prototype, "bulkImportPreview", null);
__decorate([
    (0, common_1.Post)('bulk-import/commit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SatkerEksternalController.prototype, "bulkImportCommit", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SatkerEksternalController.prototype, "save", null);
__decorate([
    (0, common_1.Post)(':id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SatkerEksternalController.prototype, "remove", null);
exports.SatkerEksternalController = SatkerEksternalController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('bdb/satker-eksternal'),
    __metadata("design:paramtypes", [satker_eksternal_service_1.SatkerEksternalService])
], SatkerEksternalController);
//# sourceMappingURL=satker-eksternal.controller.js.map
