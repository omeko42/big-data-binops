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
var BdbSnapshotOrchestratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BdbSnapshotOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const cluster_instance_util_1 = require("./cluster-instance.util");
const job_queue_service_1 = require("./job-queue.service");
let BdbSnapshotOrchestratorService = BdbSnapshotOrchestratorService_1 = class BdbSnapshotOrchestratorService {
    jobQueue;
    moduleRef;
    logger = new common_1.Logger(BdbSnapshotOrchestratorService_1.name);
    constructor(jobQueue, moduleRef) {
        this.jobQueue = jobQueue;
        this.moduleRef = moduleRef;
    }
    async onModuleInit() {
        if (!(0, cluster_instance_util_1.isPrimaryClusterInstance)())
            return;
        this.logger.log('BdbSnapshotOrchestratorService diinisialisasi pada cluster primer.');
    }
    async scheduledRefresh() {
        if (!(0, cluster_instance_util_1.isPrimaryClusterInstance)())
            return;
        const qStatus = this.jobQueue.getStatus();
        if (qStatus.isProcessing && qStatus.currentJob?.includes('Recalculate Index Siklus')) {
            this.logger.warn('[SnapshotOrchestrator] Siklus recalculate sebelumnya masih berjalan, lewati jadwal ini.');
            return;
        }
        if (qStatus.queueLength > 0 && qStatus.pendingJobs.some(j => j.name.includes('Recalculate Index Siklus'))) {
            this.logger.warn('[SnapshotOrchestrator] Siklus recalculate sebelumnya masih antre, lewati jadwal ini.');
            return;
        }
        await this.triggerSequentialRecalculate('Jadwal Otomatis 30 Menit', true);
    }
    async triggerSequentialRecalculate(triggerSource = 'Manual', onlyActivePeriod = false) {
        this.logger.log(`[SnapshotOrchestrator] Mendaftarkan siklus recalculate sekuensial (${triggerSource})...`);
        this.jobQueue.enqueue(`Recalculate Index Siklus (${triggerSource})`, async () => {
            const cycleStart = Date.now();
            this.logger.log(`================================================================`);
            this.logger.log(`[SnapshotOrchestrator] MEMULAI SIKLUS RECALCULATE INDEX (30 MENIT)`);
            this.logger.log(`================================================================`);
            try {
                const t1 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [1/4] Merefresh Snapshot Kinerja Perkara...');
                try {
                    const { KinerjaPerkaraService } = await Promise.resolve().then(() => require('../kinerja-perkara/kinerja-perkara.service'));
                    const kinerjaService = this.moduleRef.get(KinerjaPerkaraService, { strict: false });
                    if (kinerjaService) {
                        await kinerjaService.refreshSnapshot();
                        this.logger.log(`[SnapshotOrchestrator] [1/4] Kinerja Perkara selesai dalam ${Date.now() - t1}ms.`);
                    }
                }
                catch (e) {
                    this.logger.error(`[SnapshotOrchestrator] [1/4] Kinerja Perkara gagal: ${e?.message || e}`);
                }
                const t2 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [2/4] Merefresh Snapshot ANEV LP Rekap...');
                try {
                    const { AnevService } = await Promise.resolve().then(() => require('../anev/anev.service'));
                    const anevService = this.moduleRef.get(AnevService, { strict: false });
                    if (anevService && typeof anevService.refreshRekapSnapshot === 'function') {
                        await anevService.refreshRekapSnapshot();
                        if (typeof anevService.refreshDashboardSnapshots === 'function') {
                            await anevService.refreshDashboardSnapshots(onlyActivePeriod);
                        }
                        this.logger.log(`[SnapshotOrchestrator] [2/4] ANEV LP Rekap selesai dalam ${Date.now() - t2}ms.`);
                    }
                }
                catch (e) {
                    this.logger.error(`[SnapshotOrchestrator] [2/4] ANEV LP Rekap gagal: ${e?.message || e}`);
                }
                const t3 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [3/4] Merefresh Snapshot Pihak Terlibat...');
                try {
                    const { PihakTerlibatService } = await Promise.resolve().then(() => require('../pihak-terlibat/pihak-terlibat.service'));
                    const pihakService = this.moduleRef.get(PihakTerlibatService, { strict: false });
                    if (pihakService && typeof pihakService.refreshSnapshot === 'function') {
                        await pihakService.refreshSnapshot();
                        this.logger.log(`[SnapshotOrchestrator] [3/4] Pihak Terlibat selesai dalam ${Date.now() - t3}ms.`);
                    }
                }
                catch (e) {
                    this.logger.error(`[SnapshotOrchestrator] [3/4] Pihak Terlibat gagal: ${e?.message || e}`);
                }
                const t4 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [4/4] Merefresh Snapshot Barang Bukti...');
                try {
                    const { BarangBuktiService } = await Promise.resolve().then(() => require('../barang-bukti/barang-bukti.service'));
                    const bbService = this.moduleRef.get(BarangBuktiService, { strict: false });
                    if (bbService && typeof bbService.refreshSnapshot === 'function') {
                        await bbService.refreshSnapshot();
                        this.logger.log(`[SnapshotOrchestrator] [4/4] Barang Bukti selesai dalam ${Date.now() - t4}ms.`);
                    }
                }
                catch (e) {
                    this.logger.error(`[SnapshotOrchestrator] [4/4] Barang Bukti gagal: ${e?.message || e}`);
                }
                this.logger.log(`================================================================`);
                this.logger.log(`[SnapshotOrchestrator] SELURUH SIKLUS SELESAI SUKSES dalam ${Date.now() - cycleStart}ms.`);
                this.logger.log(`================================================================`);
            }
            catch (err) {
                this.logger.error(`[SnapshotOrchestrator] Siklus recalculate error: ${err?.message || err}`);
            }
        });
    }
};
exports.BdbSnapshotOrchestratorService = BdbSnapshotOrchestratorService;
__decorate([
    (0, schedule_1.Interval)(30 * 60 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BdbSnapshotOrchestratorService.prototype, "scheduledRefresh", null);
exports.BdbSnapshotOrchestratorService = BdbSnapshotOrchestratorService = BdbSnapshotOrchestratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [job_queue_service_1.BdbJobQueueService,
        core_1.ModuleRef])
], BdbSnapshotOrchestratorService);
//# sourceMappingURL=snapshot-orchestrator.service.js.map