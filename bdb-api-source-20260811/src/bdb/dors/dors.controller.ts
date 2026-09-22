import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DorsService } from './dors.service';

// Seluruh endpoint di sini khusus superadmin/admin_binops (sama seperti gate menu "Integrasi" di
// frontend) -- sebelumnya controller ini tanpa guard sama sekali, jadi bisa diakses tanpa login.
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/dors')
export class DorsController {
    constructor(private readonly service: DorsService) {}

    /** Daftar sumber DORS (dinamis dari config). */
    @Get('sources')
    sources(@Req() req: any) {
        return this.service.getSources(req.user);
    }

    /** Monitor status tiap sumber (aktif/tidak + jumlah data). */
    @Get('status')
    status(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
        return this.service.status(req.user, from, to);
    }

    /** Config efektif (client id di-mask). */
    @Get('config')
    getConfig(@Req() req: any) {
        return this.service.getConfigPublic(req.user);
    }

    /** Client ID asli (tak di-mask) -- superadmin-only, buat verifikasi saat troubleshoot koneksi. */
    @Get('config/reveal')
    getConfigReveal(@Req() req: any) {
        return this.service.getConfigReveal(req.user);
    }

    /** Ubah config (base_url/client_header/client_id/timeout_ms + penjadwalan). Client id kosong = tak diubah. */
    @Put('config')
    saveConfig(
        @Req() req: any,
        @Body()
        body: {
            base_url?: string;
            client_header?: string;
            client_id?: string;
            timeout_ms?: number;
            sync_enabled?: boolean;
            sync_cron?: string;
            sync_days_back?: number;
            data_scope?: string;
        }
    ) {
        return this.service.saveConfig(req.user, body || {});
    }

    /**
     * Mulai penarikan data LP (manual) -- balas CEPAT dgn log_id, proses sesungguhnya jalan di latar
     * belakang (bisa berjam-jam utk backfill besar) supaya tak menggantungkan 1 request HTTP lama.
     * Kosongkan tanggal = pakai default config (mundur N hari s/d hari ini). Pantau progres via
     * GET sync/status/:logId (dipoll berkala dari UI).
     */
    @Post('sync')
    sync(@Req() req: any, @Body() body: { from?: string; to?: string }) {
        return this.service.manualSyncStart(req.user, body?.from, body?.to);
    }

    /** Status live 1 job sync (poll tiap beberapa detik selama status='running'). */
    @Get('sync/status/:logId')
    syncStatus(@Req() req: any, @Param('logId') logId: string) {
        return this.service.getSyncJobStatus(req.user, parseInt(logId, 10));
    }

    /** Riwayat eksekusi sinkronisasi + info jadwal. */
    @Get('sync/logs')
    logs(@Req() req: any, @Query('limit') limit?: string) {
        return this.service.recentLogs(req.user, limit ? parseInt(limit, 10) : 20);
    }

    /** Ringkasan data LP hasil tarikan (jumlah per model + sync terakhir). */
    @Get('data/stats')
    dataStats(@Req() req: any) {
        return this.service.dataStats(req.user);
    }

    /** Normalisasi ulang data raw yang belum terpecah ke tabel relasi (data lama). */
    @Post('normalize/backfill')
    backfill(@Req() req: any, @Body() body: { limit?: number }) {
        return this.service.backfillNormalization(req.user, body?.limit ?? 1000);
    }

    /** Daftar data LP hasil tarikan (paginasi + filter). */
    @Get('data')
    listData(@Req() req: any, @Query('model') model?: string, @Query('search') search?: string, @Query('level') level?: string, @Query('page') page?: string, @Query('row') row?: string) {
        return this.service.listData(req.user, { model, search, level, page: page ? parseInt(page, 10) : 1, row: row ? parseInt(row, 10) : 25 });
    }
}
