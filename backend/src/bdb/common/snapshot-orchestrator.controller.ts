import { Controller, ForbiddenException, Get, Post, Req } from '@nestjs/common';
import { BdbSnapshotOrchestratorService } from './snapshot-orchestrator.service';
import { BdbJobQueueService } from './job-queue.service';

@Controller('bdb/system/orchestrator')
export class BdbSnapshotOrchestratorController {
    constructor(
        private readonly orchestrator: BdbSnapshotOrchestratorService,
        private readonly jobQueue: BdbJobQueueService
    ) {}

    @Get('queue-status')
    getQueueStatus() {
        return {
            status: 1,
            data: this.jobQueue.getStatus()
        };
    }

    @Post('trigger-recalculate')
    async triggerRecalculate(@Req() req: any) {
        const isInternal = req.ip === '127.0.0.1' || req.ip === '::1' || req.headers['x-internal-secret'] === 'bdb-orchestrator-2026';
        if (!isInternal && !req.headers?.authorization) {
            throw new ForbiddenException('Akses orchestrator terbatas untuk internal.');
        }
        const user = req?.user?.email || 'internal-trigger';
        this.orchestrator.triggerSequentialRecalculate(`Triggered by ${user}`);
        return {
            status: 1,
            message: 'Siklus recalculate index sekuensial berhasil didaftarkan ke antrean.',
            data: this.jobQueue.getStatus()
        };
    }
}