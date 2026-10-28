import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { PanduanService } from './panduan.service';

const UPLOAD_LIMITS = { limits: { fileSize: 300 * 1024 * 1024 } }; // 300MB, cukup utk video panduan

@UseGuards(AuthGuard)
@Controller('bdb/panduan')
export class PanduanController {
    constructor(private readonly service: PanduanService) {}

    @Get(['share-challenge', 'public/captcha'])
    getShareChallenge(@Query('token') token?: string, @Query('id') id?: string) {
        return this.service.getShareChallenge(token, id ? parseInt(id, 10) : undefined);
    }

    @Post(['verify-viewer', 'public/verify-nrp'])
    verifyViewer(@Req() req: any, @Body() body: any) {
        const ip = String(req.headers?.['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '');
        const userAgent = String(req.headers?.['user-agent'] || '');
        return this.service.verifyViewer(body || {}, { ip, userAgent });
    }

    @Get('stream/:token')
    streamMedia(@Param('token') token: string, @Req() req: any, @Res() res: any) {
        return this.service.streamMedia(token, req, res);
    }

    @Get()
    @UseInterceptors(CurrentUserInterceptor)
    list(@Req() req: any, @Query('all') all?: string) {
        return this.service.list(req.user, all === 'true' || all === '1');
    }

    @Get(':id')
    @UseInterceptors(CurrentUserInterceptor)
    detail(@Req() req: any, @Param('id') id: string) {
        return this.service.detail(req.user, parseInt(id, 10));
    }

    @Post()
    @UseInterceptors(CurrentUserInterceptor, FileInterceptor('file', UPLOAD_LIMITS))
    create(@Req() req: any, @Body() body: any, @UploadedFile() file: any) {
        const mapped = file ? { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype, size: file.size } : undefined;
        return this.service.create(req.user, body || {}, mapped);
    }

    @Patch(':id')
    @UseInterceptors(CurrentUserInterceptor, FileInterceptor('file', UPLOAD_LIMITS))
    update(@Req() req: any, @Param('id') id: string, @Body() body: any, @UploadedFile() file: any) {
        const mapped = file ? { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype, size: file.size } : undefined;
        return this.service.update(req.user, parseInt(id, 10), body || {}, mapped);
    }

    @Patch(':id/status')
    @UseInterceptors(CurrentUserInterceptor)
    updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status?: string }) {
        return this.service.updateStatus(req.user, parseInt(id, 10), body?.status || '');
    }

    @Delete(':id')
    @UseInterceptors(CurrentUserInterceptor)
    remove(@Req() req: any, @Param('id') id: string) {
        return this.service.remove(req.user, parseInt(id, 10));
    }
}
