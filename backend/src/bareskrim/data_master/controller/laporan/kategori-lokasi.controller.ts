import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { KategoriLokasiService } from '@bareskrim/data_master/service/laporan/kategori-lokasi.service';
import { CreateKategoriLokasiDto } from '@bareskrim/data_master/dto/laporan/kategori-lokasi.dto';

@CoreController('Master-KategoriLokasi', 'master/kategori-lokasi')
@UseGuards(RoleInternalMiddleware)
export class KategoriLokasiController {
    constructor(private readonly service: KategoriLokasiService) {}

    @Get('')
    @Route({ name: 'master laporan.master kategori lokasi.index', parent: 'master laporan.master kategori lokasi' })
    @ApiOperation({ summary: 'Semua kategori lokasi' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master kategori lokasi.show', parent: 'master laporan.master kategori lokasi' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master kategori lokasi.create', parent: 'master laporan.master kategori lokasi' })
    async create(@Body() dto: CreateKategoriLokasiDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master kategori lokasi.update', parent: 'master laporan.master kategori lokasi' })
    async update(@Param('id') id: string, @Body() dto: CreateKategoriLokasiDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master kategori lokasi.delete', parent: 'master laporan.master kategori lokasi' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
