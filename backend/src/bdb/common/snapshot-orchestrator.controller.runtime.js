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
exports.BdbSnapshotOrchestratorController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../app_core/auth/auth.guard");
const snapshot_orchestrator_service_1 = require("./snapshot-orchestrator.service");
const job_queue_service_1 = require("./job-queue.service");
let BdbSnapshotOrchestratorController = class BdbSnapshotOrchestratorController {
    orchestrator;
    jobQueue;
    constructor(orchestrator, jobQueue) {
        this.orchestrator = orchestrator;
        this.jobQueue = jobQueue;
    }
    getQueueStatus() {
        return {
            status: 1,
            data: this.jobQueue.getStatus()
        };
    }
    async triggerRecalculate(req) {
        const isInternal = req.ip === '127.0.0.1' || req.ip === '::1' || req.headers['x-internal-secret'] === 'bdb-orchestrator-2026';
        if (!isInternal && !req.headers?.authorization) {
            throw new common_1.ForbiddenException('Akses orchestrator terbatas untuk internal.');
        }
        const user = req?.user?.email || 'internal-trigger';
        this.orchestrator.triggerSequentialRecalculate(`Triggered by ${user}`);
        return {
            status: 1,
            message: 'Siklus recalculate index sekuensial berhasil didaftarkan ke antrean.',
            data: this.jobQueue.getStatus()
        };
    }
};
exports.BdbSnapshotOrchestratorController = BdbSnapshotOrchestratorController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('queue-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BdbSnapshotOrchestratorController.prototype, "getQueueStatus", null);
__decorate([
    (0, common_1.Post)('trigger-recalculate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BdbSnapshotOrchestratorController.prototype, "triggerRecalculate", null);
exports.BdbSnapshotOrchestratorController = BdbSnapshotOrchestratorController = __decorate([
    (0, common_1.Controller)('bdb/system/orchestrator'),
    __metadata("design:paramtypes", [snapshot_orchestrator_service_1.BdbSnapshotOrchestratorService,
        job_queue_service_1.BdbJobQueueService])
], BdbSnapshotOrchestratorController);
//# sourceMappingURL=snapshot-orchestrator.controller.js.map