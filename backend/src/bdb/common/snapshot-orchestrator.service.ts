import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { isPrimaryClusterInstance } from './cluster-instance.util';
import { BdbJobQueueService } from './job-queue.service';

/**
 * Koordinator Snapshot & Recalculate Index Terjadwal (Per 30 Menit).
 *
 * Mengkoordinasikan seluruh pembaruan tabel index/snapshot agar:
 * 1. Tidak membebani DB master LP saat jam kerja.
 * 2. Menjalankan refresh secara SEKUENSIAL (bergantian):
 *    [1/4] Kinerja Perkara -> [2/4] ANEV LP Rekap -> [3/4] Pihak Terlibat -> [4/4] Barang Bukti.
 * 3. Menggunakan BdbJobQueueService agar antre dan tidak bertabrakan dengan job lain
 *    (misal: bila ada DORS sync yang sedang berjalan, recalculate ini akan mengantri sampai selesai).
 */
@Injectable()
export class BdbSnapshotOrchestratorService implements OnModuleInit {
    private readonly logger = new Logger(BdbSnapshotOrchestratorService.name);

    constructor(
        private readonly jobQueue: BdbJobQueueService,
        private readonly moduleRef: ModuleRef
    ) {}

    async onModuleInit() {
        if (!isPrimaryClusterInstance()) return;
        this.logger.log('BdbSnapshotOrchestratorService diinisialisasi pada cluster primer.');
    }

    /**
     * Jadwal utama pembaruan index penghitungan tiap 30 menit.
     */
    @Interval(30 * 60 * 1000)
    async scheduledRefresh() {
        if (!isPrimaryClusterInstance()) return;
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

    /**
     * Menjalankan 4 tahap kalkulasi secara berurutan (sekuensial) melalui antrean jobQueue.
     */
    async triggerSequentialRecalculate(triggerSource = 'Manual', onlyActivePeriod = false) {
        this.logger.log(`[SnapshotOrchestrator] Mendaftarkan siklus recalculate sekuensial (${triggerSource})...`);

        // Daftarkan keseluruhan siklus sebagai 1 rantai pekerjaan terurut di antrean
        this.jobQueue.enqueue(`Recalculate Index Siklus (${triggerSource})`, async () => {
            const cycleStart = Date.now();
            this.logger.log(`================================================================`);
            this.logger.log(`[SnapshotOrchestrator] MEMULAI SIKLUS RECALCULATE INDEX (30 MENIT)`);
            this.logger.log(`================================================================`);

            try {
                // 1/4: Kinerja Perkara
                const t1 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [1/4] Merefresh Snapshot Kinerja Perkara...');
                try {
                    const { KinerjaPerkaraService } = await import('../kinerja-perkara/kinerja-perkara.service');
                    const kinerjaService = this.moduleRef.get(KinerjaPerkaraService, { strict: false });
                    if (kinerjaService) {
                        await kinerjaService.refreshSnapshot();
                        this.logger.log(`[SnapshotOrchestrator] [1/4] Kinerja Perkara selesai dalam ${Date.now() - t1}ms.`);
                    }
                } catch (e: any) {
                    this.logger.error(`[SnapshotOrchestrator] [1/4] Kinerja Perkara gagal: ${e?.message || e}`);
                }

                // 2/4: ANEV LP Rekap
                const t2 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [2/4] Merefresh Snapshot ANEV LP Rekap...');
                try {
                    const { AnevService } = await import('../anev/anev.service');
                    const anevService = this.moduleRef.get(AnevService, { strict: false });
                    if (anevService && typeof (anevService as any).refreshRekapSnapshot === 'function') {
                        await (anevService as any).refreshRekapSnapshot();
                        if (typeof (anevService as any).refreshDashboardSnapshots === 'function') {
                            await (anevService as any).refreshDashboardSnapshots(onlyActivePeriod);
                        }
                        this.logger.log(`[SnapshotOrchestrator] [2/4] ANEV LP Rekap selesai dalam ${Date.now() - t2}ms.`);
                    }
                } catch (e: any) {
                    this.logger.error(`[SnapshotOrchestrator] [2/4] ANEV LP Rekap gagal: ${e?.message || e}`);
                }

                // 3/4: Pihak Terlibat
                const t3 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [3/4] Merefresh Snapshot Pihak Terlibat...');
                try {
                    const { PihakTerlibatService } = await import('../pihak-terlibat/pihak-terlibat.service');
                    const pihakService = this.moduleRef.get(PihakTerlibatService, { strict: false });
                    if (pihakService && typeof (pihakService as any).refreshSnapshot === 'function') {
                        await (pihakService as any).refreshSnapshot();
                        this.logger.log(`[SnapshotOrchestrator] [3/4] Pihak Terlibat selesai dalam ${Date.now() - t3}ms.`);
                    }
                } catch (e: any) {
                    this.logger.error(`[SnapshotOrchestrator] [3/4] Pihak Terlibat gagal: ${e?.message || e}`);
                }

                // 4/4: Barang Bukti
                const t4 = Date.now();
                this.logger.log('[SnapshotOrchestrator] [4/4] Merefresh Snapshot Barang Bukti...');
                try {
                    const { BarangBuktiService } = await import('../barang-bukti/barang-bukti.service');
                    const bbService = this.moduleRef.get(BarangBuktiService, { strict: false });
                    if (bbService && typeof (bbService as any).refreshSnapshot === 'function') {
                        await (bbService as any).refreshSnapshot();
                        this.logger.log(`[SnapshotOrchestrator] [4/4] Barang Bukti selesai dalam ${Date.now() - t4}ms.`);
                    }
                } catch (e: any) {
                    this.logger.error(`[SnapshotOrchestrator] [4/4] Barang Bukti gagal: ${e?.message || e}`);
                }

                this.logger.log(`================================================================`);
                this.logger.log(`[SnapshotOrchestrator] SELURUH SIKLUS SELESAI SUKSES dalam ${Date.now() - cycleStart}ms.`);
                this.logger.log(`================================================================`);
            } catch (err: any) {
                this.logger.error(`[SnapshotOrchestrator] Siklus recalculate error: ${err?.message || err}`);
            }
        });
    }
}