import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { SatkerEksternalService } from './satker-eksternal.service';

const IMPORT_FILE_LIMITS = { limits: { fileSize: 10 * 1024 * 1024 } }; // 10 MB cukup utk ribuan baris

@UseGuards(AuthGuard)
@Controller('bdb/satker-eksternal')
export class SatkerEksternalController {
    constructor(private readonly service: SatkerEksternalService) {}

    @Get()
    list(@Query('search') search?: string, @Query('page') page?: string, @Query('row') row?: string) {
        return this.service.list(search, page, row);
    }

    /** Unduh template Excel kosong (+ Petunjuk) utk Import Massal Satker Eksternal. */
    @Get('bulk-import/template')
    async bulkImportTemplate(@Res() res: Response) {
        const buf = await this.service.buildImportTemplateBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="template-import-satker-eksternal.xlsx"');
        return res.send(buf);
    }

    /** Validasi file Excel (blm menyimpan apa pun) -- hasilnya ditinjau admin sblm klik Import. */
    @Post('bulk-import/preview')
    @UseInterceptors(FileInterceptor('file', IMPORT_FILE_LIMITS))
    async bulkImportPreview(@UploadedFile() file: any) {
        if (!file) throw new BadRequestException('File Excel wajib diunggah.');
        return this.service.previewBulkImport(file.buffer);
    }

    /** Eksekusi commit: create()/update() utk tiap baris yg sudah lolos preview & dikonfirmasi admin. */
    @Post('bulk-import/commit')
    async bulkImportCommit(@Body() body: { rows?: any[] }) {
        return this.service.commitBulkImport(body?.rows || []);
    }

    @Post()
    save(@Body() body: any) {
        return this.service.save(body || {});
    }

    @Post(':id/delete')
    remove(@Param('id') id: string) {
        return this.service.remove(parseInt(id, 10));
    }
}
