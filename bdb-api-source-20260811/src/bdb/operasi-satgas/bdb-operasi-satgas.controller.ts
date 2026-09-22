import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { BdbOperasiSatgasService } from './bdb-operasi-satgas.service';

@UseGuards(AuthGuard)
@Controller('bdb/operasi-satgas')
export class BdbOperasiSatgasController {
    constructor(private readonly service: BdbOperasiSatgasService) {}

    @Get()
    list(@Query() query: any) {
        return this.service.list(query);
    }

    /** Register LP yang ditautkan ke operasi/satgas -- di-scope per satker (spt daftar LP lainnya). */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get('rekap-lp')
    rekapLp(@Query() query: any, @Req() req: any) {
        return this.service.rekapLp(req?.user?.id ? Number(req.user.id) : undefined, query);
    }

    /** Master ringan "Jenis Operasi"/"Jenis Satgas" -- dropdown opsional, nilai baru otomatis tersimpan saat create/update. */
    @Get('jenis-master')
    listJenisMaster(@Query('kelompok') kelompok: string) {
        return this.service.listJenisMaster(kelompok);
    }

    /** LP yang saat ini tertaut ke operasi/satgas ini -- isi awal LpPickerDialog. */
    @Get(':id/lp')
    listLinkedLp(@Param('id') id: string) {
        return this.service.listLinkedLp(Number(id));
    }

    /** Samakan tautan LP dgn hasil pilihan LpPickerDialog (bisa lewat halaman ini, atau satu-satu dari detail LP). */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post(':id/lp')
    setLinkedLp(@Param('id') id: string, @Body() body: { lp_ids?: number[] }, @Req() req: any) {
        return this.service.setLinkedLp(Number(id), body?.lp_ids || [], req?.user?.id ? Number(req.user.id) : undefined);
    }

    // ===== Lampiran (MinIO) — literal path 2 segmen, tak bentrok dengan ':id' =====
    @Post(':id/attachments')
    @UseInterceptors(FilesInterceptor('files', 20, DOC_UPLOAD_LIMITS))
    uploadAttachments(@Param('id') id: string, @UploadedFiles() files: Array<any>) {
        const mapped = (files || []).map((f) => ({ buffer: f.buffer, originalname: f.originalname, mimetype: f.mimetype, size: f.size }));
        return this.service.addAttachments(Number(id), mapped);
    }

    @Get(':id/attachments')
    listAttachments(@Param('id') id: string) {
        return this.service.listAttachments(Number(id));
    }

    @Delete('attachments/:attId')
    removeAttachment(@Param('attId') attId: string) {
        return this.service.removeAttachment(Number(attId));
    }

    @Get(':id')
    detail(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(Number(id), body);
    }

    @Post(':id/aktif')
    setAktif(@Param('id') id: string, @Body() body: { aktif?: boolean }) {
        return this.service.setAktif(Number(id), body?.aktif !== false);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}
