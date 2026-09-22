import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards, UploadedFile, BadRequestException } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { JenisKejahatanService } from '@bareskrim/data_master/service/laporan/jenis-kejahatan.service';
import { CreateJenisKejahatanDto } from '@bareskrim/data_master/dto/laporan/jenis-kejahatan.dto';

@CoreController('Master-JenisKejahatan', 'master/jenis-kejahatan')
@UseGuards(RoleInternalMiddleware)
export class JenisKejahatanController {
    constructor(private readonly service: JenisKejahatanService) {}

    /** Unduh template Excel kosong (+ referensi Golongan/ICCS + Petunjuk) utk Import Massal Jenis Kejahatan. */
    @Get('bulk-import/template')
    @Route({ name: 'master laporan.master jenis kejahatan.bulk import template', parent: 'master laporan.master jenis kejahatan' })
    async bulkImportTemplate(@Res() res) {
        const buf = await this.service.buildImportTemplateBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="template-import-jenis-kejahatan.xlsx"');
        return res.send(buf);
    }

    /** Validasi file Excel (blm menyimpan apa pun) -- hasilnya ditinjau admin sblm klik Import.
     *  FileInterceptor TIDAK dipasang di sini lagi -- @Route di bawah sudah otomatis memasangnya
     *  (lihat DEFAULT_FILE_LIMITS di coreController.helper.service.ts). Dobel interceptor
     *  sebelumnya bikin "Multipart: Unexpected end of form". */
    @Post('bulk-import/preview')
    @Route({ name: 'master laporan.master jenis kejahatan.bulk import preview', parent: 'master laporan.master jenis kejahatan' })
    async bulkImportPreview(@UploadedFile() file: any, @Res() res) {
        if (!file) throw new BadRequestException('File Excel wajib diunggah.');
        const result = await this.service.previewBulkImport(file.buffer);
        return res.sendSuccess(result);
    }

    /** Eksekusi commit: create()/update() utk tiap baris yg sudah lolos preview & dikonfirmasi admin. */
    @Post('bulk-import/commit')
    @Route({ name: 'master laporan.master jenis kejahatan.bulk import commit', parent: 'master laporan.master jenis kejahatan' })
    async bulkImportCommit(@Body() body: { rows?: any[] }, @Res() res) {
        const result = await this.service.commitBulkImport(body?.rows || []);
        return res.sendSuccess(result);
    }

    @Get('')
    @Route({ name: 'master laporan.master jenis kejahatan.index', parent: 'master laporan.master jenis kejahatan' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master jenis kejahatan.show', parent: 'master laporan.master jenis kejahatan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master jenis kejahatan.create', parent: 'master laporan.master jenis kejahatan' })
    async create(@Body() dto: CreateJenisKejahatanDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master jenis kejahatan.update', parent: 'master laporan.master jenis kejahatan' })
    async update(@Param('id') id: string, @Body() dto: CreateJenisKejahatanDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master jenis kejahatan.delete', parent: 'master laporan.master jenis kejahatan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
