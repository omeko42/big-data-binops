import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { IccsKategoriService } from '@bareskrim/data_master/service/laporan/iccs-kategori.service';
import { CreateIccsKategoriDto } from '@bareskrim/data_master/dto/laporan/iccs-kategori.dto';

@CoreController('Master-IccsKategori', 'master/iccs-kategori')
@UseGuards(RoleInternalMiddleware)
export class IccsKategoriController {
    constructor(private readonly service: IccsKategoriService) {}

    @Get('')
    @Route({ name: 'master laporan.master iccs kategori.index', parent: 'master laporan.master iccs kategori' })
    @ApiOperation({ summary: 'Semua kategori ICCS Level 1' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master iccs kategori.show', parent: 'master laporan.master iccs kategori' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master iccs kategori.create', parent: 'master laporan.master iccs kategori' })
    async create(@Body() dto: CreateIccsKategoriDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master iccs kategori.update', parent: 'master laporan.master iccs kategori' })
    async update(@Param('id') id: string, @Body() dto: CreateIccsKategoriDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master iccs kategori.delete', parent: 'master laporan.master iccs kategori' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
