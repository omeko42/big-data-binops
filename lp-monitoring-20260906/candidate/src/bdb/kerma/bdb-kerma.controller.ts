import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { BdbKermaService } from './bdb-kerma.service';

@UseGuards(AuthGuard)
@Controller('bdb/kerma')
export class BdbKermaController {
    constructor(private readonly service: BdbKermaService) {}

    @Get()
    list(@Query() query: any) {
        return this.service.list(query);
    }

    @Get('rekap')
    rekap(@Query() query: any) {
        return this.service.list(query);
    }

    /** Halaman "Lihat Kerma" (semua role) -- hanya kerma yang sudah dipublikasikan (is_tampil=true). */
    @Get('public')
    listPublic(@Query() query: any) {
        return this.service.list({ ...query, only_published: true });
    }

    /** Master Jenis Naskah (dropdown Kelola Kerma) -- literal path, tak bentrok dgn ':id'. */
    @Get('jenis-naskah')
    listJenisNaskah() {
        return this.service.listJenisNaskah();
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

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(Number(id));
    }
}
