import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface EnqueueOptions {
    priority?: number; // Nilai lebih tinggi jalan lebih dulu bila ada antrean
}

/**
 * Service Antrean Tunggal (Sequential Job Queue).
 *
 * Mengatur agar seluruh background job (recalculate index snapshot, sync DORS, summary view, dll)
 * TIDAK PERNAH berjalan bersamaan di database.
 * Jika ada job yang sedang berjalan (berat maupun ringan), job baru akan MENUNGGU (ngantri)
 * sampai job sebelumnya selesai sepenuhnya.
 *
 * Dilengkapi dengan PostgreSQL Advisory Lock agar mutual exclusion tetap berlaku antar proses PM2.
 */
@Injectable()
export class BdbJobQueueService {
    private readonly logger = new Logger(BdbJobQueueService.name);
    private queue: {
        id: string;
        name: string;
        task: () => Promise<any>;
        resolve: (val: any) => void;
        reject: (err: any) => void;
        enqueuedAt: Date;
        priority: number;
    }[] = [];
    private isProcessing = false;
    private currentJobName: string | null = null;
    private currentJobStartTime: number = 0;

    constructor(private readonly dataSource: DataSource) {}

    /**
     * Daftarkan job ke dalam antrean.
     * Mengembalikan Promise yang selesai ketika giliran job ini dieksekusi dan tuntas.
     */
    async enqueue<T>(name: string, task: () => Promise<T>, options?: EnqueueOptions): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const id = Math.random().toString(36).substring(2, 9);
            const priority = options?.priority ?? 0;
            this.logger.log(`[JobQueue] Job "${name}" dimasukkan ke antrean. Total antrean: ${this.queue.length + 1}`);

            this.queue.push({
                id,
                name,
                task,
                resolve,
                reject,
                enqueuedAt: new Date(),
                priority,
            });

            // Urutkan prioritas (FIFO untuk prioritas yang sama)
            if (this.queue.length > 1) {
                this.queue.sort((a, b) => b.priority - a.priority);
            }

            this.processNext();
        });
    }

    private async processNext() {
        if (this.isProcessing) return;
        if (this.queue.length === 0) {
            this.currentJobName = null;
            return;
        }

        this.isProcessing = true;
        const job = this.queue.shift()!;
        this.currentJobName = job.name;
        this.currentJobStartTime = Date.now();

        const waitDuration = Date.now() - job.enqueuedAt.getTime();
        this.logger.log(`[JobQueue] >>> Memulai job "${job.name}" (menunggu antre ${waitDuration}ms). Sisa antrean: ${this.queue.length}`);

        const qr = this.dataSource.createQueryRunner();
        let lockAcquired = false;

        try {
            await qr.connect();
            const lockRes = await qr.query(`SELECT pg_try_advisory_lock(hashtext('bdb_global_job_queue_lock')) as locked`);
            lockAcquired = lockRes[0]?.locked === true;

            if (!lockAcquired) {
                this.logger.warn(`[JobQueue] Global advisory lock di Postgres sedang dipegang proses lain. Menunggu giliran...`);
                await qr.query(`SELECT pg_advisory_lock(hashtext('bdb_global_job_queue_lock'))`);
                lockAcquired = true;
            }

            const startTime = Date.now();
            const result = await job.task();
            const duration = Date.now() - startTime;
            this.logger.log(`[JobQueue] <<< Job "${job.name}" SELESAI sukses dalam ${duration}ms.`);
            job.resolve(result);
        } catch (error: any) {
            const duration = Date.now() - this.currentJobStartTime;
            this.logger.error(`[JobQueue] <<< Job "${job.name}" GAGAL setelah ${duration}ms: ${error?.message || error}`, error?.stack);
            job.reject(error);
        } finally {
            if (lockAcquired) {
                try {
                    await qr.query(`SELECT pg_advisory_unlock(hashtext('bdb_global_job_queue_lock'))`);
                } catch (unlockErr) {
                    this.logger.warn(`[JobQueue] Gagal melepas advisory lock: ${unlockErr}`);
                }
            }
            try {
                await qr.release();
            } catch {}

            this.isProcessing = false;
            this.currentJobName = null;
            setImmediate(() => this.processNext());
        }
    }

    getStatus() {
        return {
            isProcessing: this.isProcessing,
            currentJob: this.currentJobName,
            runningSinceMs: this.isProcessing ? Date.now() - this.currentJobStartTime : 0,
            queueLength: this.queue.length,
            pendingJobs: this.queue.map(j => ({ name: j.name, enqueuedAt: j.enqueuedAt })),
        };
    }
}