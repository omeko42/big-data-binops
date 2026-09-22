import { Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { NotificationsService } from './notifications.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    /** Badge angka topbar -- jumlah item baru per jenis (Pengumuman/Satgas/Operasi). */
    @Get('summary')
    summary(@Req() req: any) {
        return this.service.summary(req.user);
    }

    /** Daftar item baru utk dropdown notifikasi. */
    @Get('list')
    list(@Req() req: any, @Query('limit') limit?: string) {
        return this.service.list(req.user, limit ? parseInt(limit, 10) : 20);
    }

    /** Tandai sudah dilihat -- dipanggil saat dropdown notifikasi dibuka. */
    @Post('mark-seen')
    markSeen(@Req() req: any, @Body() body: { entity?: string }) {
        return this.service.markSeen(req.user, body?.entity);
    }
}
