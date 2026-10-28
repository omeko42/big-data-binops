import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { BdbKasusAtensiService } from './bdb-kasus-atensi.service';

@Controller('bdb/kasus-atensi')
@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
export class BdbKasusAtensiController {
    constructor(private readonly service: BdbKasusAtensiService) {}

    private uid(req: any): number | undefined {
        return req?.user?.id ? Number(req.user.id) : undefined;
    }

    @Get()
    list(@Query() query: any, @Req() req: any) {
        return this.service.list(this.uid(req), query);
    }

    // ===== Lampiran (MinIO) — mendukung pemisahan SPRIN (multi-revisi) vs DOKUMENTASI =====
    @Post(':id/attachments')
    @UseInterceptors(AnyFilesInterceptor(DOC_UPLOAD_LIMITS))
    uploadAttachments(@Param('id') id: string, @UploadedFiles() files: Array<any>, @Body() body: any, @Req() req: any) {
        const mapped = (files || []).map((f) => ({ buffer: f.buffer, originalname: f.originalname, mimetype: f.mimetype, size: f.size }));
        return this.service.addAttachments(Number(id), this.uid(req), mapped, body || {});
    }

    @Post(':id/lampiran')
    @UseInterceptors(AnyFilesInterceptor(DOC_UPLOAD_LIMITS))
    uploadLampiran(@Param('id') id: string, @UploadedFiles() files: Array<any>, @Body() body: any, @Req() req: any) {
        const mapped = (files || []).map((f) => ({ buffer: f.buffer, originalname: f.originalname, mimetype: f.mimetype, size: f.size }));
        return this.service.addAttachments(Number(id), this.uid(req), mapped, body || {});
    }

    @Get(':id/attachments')
    listAttachments(@Param('id') id: string, @Req() req: any) {
        return this.service.listAttachments(Number(id), this.uid(req));
    }

    @Get(':id/lampiran')
    listLampiran(@Param('id') id: string, @Req() req: any) {
        return this.service.listAttachments(Number(id), this.uid(req));
    }

    @Delete('attachments/:attId')
    removeAttachment(@Param('attId') attId: string, @Req() req: any) {
        return this.service.removeAttachment(Number(attId), this.uid(req));
    }

    @Delete('lampiran/:attId')
    removeLampiran(@Param('attId') attId: string, @Req() req: any) {
        return this.service.removeAttachment(Number(attId), this.uid(req));
    }

    @Get(':id/lp')
    listLp(@Param('id') id: string, @Req() req: any) {
        return this.service.listLp(Number(id), this.uid(req));
    }

    @Get(':id')
    detail(@Param('id') id: string, @Req() req: any) {
        return this.service.findOne(Number(id), this.uid(req));
    }

    @Post()
    create(@Body() body: any, @Req() req: any) {
        return this.service.create(this.uid(req), body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
        return this.service.update(Number(id), this.uid(req), body);
    }

    @Post(':id/pin')
    pinPost(@Param('id') id: string, @Body() body: any, @Req() req: any) {
        return this.service.setPin(Number(id), this.uid(req), body?.is_pinned ?? body?.pinned);
    }

    @Patch(':id/pin')
    pinPatch(@Param('id') id: string, @Body() body: any, @Req() req: any) {
        return this.service.setPin(Number(id), this.uid(req), body?.is_pinned ?? body?.pinned);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        return this.service.remove(Number(id), this.uid(req));
    }
}
