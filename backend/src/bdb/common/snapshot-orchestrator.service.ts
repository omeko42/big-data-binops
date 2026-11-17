import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { isPrimaryClusterInstance } from './cluster-instance.util';
import { BdbJobQueueService } from './job-queue.service';

/**
 * Koordinator Snapshot & Recalculate Index Terjadwal (Per 30 Menit).
 *
 * Dilengkapi:
 * 1. Guard DISABLE_CRON=true & isPrimaryClusterInstance()
 * 2. Redis Distributed Leader Lock (`SET bdb:snapshot:leader <instance_id> NX PX ...`)
 *    agar pada arsitektur multi-instance (`bdb-api-1` & `bdb-api-2`) tidak pernah berjalan ganda.
 */
@Injectable()
export class BdbSnapshotOrchestratorService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(BdbSnapshotOrchestratorService.name);
    private readonly instanceId = `${process.env.HOSTNAME || 'bdb-api'}-${process.env.PORT || 3850}-${process.pid}`;
    private redisLeader: Redis | null = null;

    constructor(
        private readonly jobQueue: BdbJobQueueService,
        private readonly moduleRef: ModuleRef
    ) {
        this.initRedisLeaderClient();
    }

    private initRedisLeaderClient() {
        try {
            const host = process.env.COSERSE_REDIS_HOST || process.env.REDIS_HOST || 'bdb-redis';
            const port = Number(process.env.COSERSE_REDIS_PORT || process.env.REDIS_PORT || 6379);
            const client = new Redis({
                host,
                port,
                lazyConnect: true,
                maxRetriesPerRequest: 1,
                enableOfflineQueue: false
            });
            client.on('error', () => {});
            client.connect().catch(() => {});
            this.redisLeader = client;
        } catch {
            this.redisLeader = null;
        }
    }

    async onModuleInit() {
        if (!isPrimaryClusterInstance()) {
            this.logger.log(
                `[SnapshotOrchestrator] Non-primary / DISABLE_CRON aktif pada instance ${this.instanceId}; scheduler dinonaktifkan.`
            );
            return;
        }
        this.logger.log(`BdbSnapshotOrchestratorService diinisialisasi pada cluster primer (${this.instanceId}).`);
    }

    async onModuleDestroy() {
        if (this.redisLeader) {
            try {
                await this.redisLeader.quit();
            } catch {
                this.redisLeader.disconnect();
            }
            this.redisLeader = null;
        }
    }

    private async tryAcquireDistributedLeaderLock(ttlMs = 25 * 60 * 1000): Promise<boolean> {
        if (!this.redisLeader) return true;
        try {
            const res = await this.redisLeader.set('bdb:snapshot:leader', this.instanceId, 'PX', ttlMs, 'NX');
            if (res === 'OK') return true;
            const currentOwner = await this.redisLeader.get('bdb:snapshot:leader');
            if (currentOwner === this.instanceId) {
                await this.redisLeader.pexpire('bdb:snapshot:leader', ttlMs);
                return true;
            }
            this.logger.warn(
                `[SnapshotOrchestrator] Leader lock bdb:snapshot:leader sedang dipegang oleh ${currentOwner}; instance ${this.instanceId} melewati siklus ini.`
            );
            return false;
        } catch {
            return true;
        }
    }

    private async releaseDistributedLeaderLock(): Promise<void> {
        if (!this.redisLeader) return;
        try {
            const owner = await this.redisLeader.get('bdb:snapshot:leader');
            if (owner === this.instanceId) {
                await this.redisLeader.del('bdb:snapshot:leader');
            }
        } catch {}
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
        if (!isPrimaryClusterInstance() && triggerSource.includes('Jadwal Otomatis')) {
            return;
        }
        this.logger.log(`[SnapshotOrchestrator] Mendaftarkan siklus recalculate sekuensial (${triggerSource})...`);

        // Daftarkan keseluruhan siklus sebagai 1 rantai pekerjaan terurut di antrean
        this.jobQueue.enqueue(`Recalculate Index Siklus (${triggerSource})`, async () => {
            const acquiredLeader = await this.tryAcquireDistributedLeaderLock();
            if (!acquiredLeader) {
                return;
            }
            const renewTimer = setInterval(() => {
                void this.tryAcquireDistributedLeaderLock();
            }, 60_000);
            if (typeof (renewTimer as any).unref === 'function') {
                (renewTimer as any).unref();
            }

            const cycleStart = Date.now();
            this.logger.log(`================================================================`);
            this.logger.log(
                `[SnapshotOrchestrator] MEMULAI SIKLUS RECALCULATE INDEX (Leader: ${this.instanceId})`
            );
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
                this.logger.log('[SnapshotOrchestrator] [3/4] Merefresh Snapshot Pihak Terlibat (Dirty-Partition Atomic Batch)...');
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
            } finally {
                clearInterval(renewTimer);
                await this.releaseDistributedLeaderLock();
            }
        });
    }
}