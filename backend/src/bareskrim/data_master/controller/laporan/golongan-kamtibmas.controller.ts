import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { GolonganKamtibmasService } from '@bareskrim/data_master/service/laporan/golongan-kamtibmas.service';
import { CreateGolonganKamtibmasDto } from '@bareskrim/data_master/dto/laporan/golongan-kamtibmas.dto';

@CoreController('Master-GolonganKamtibmas', 'master/golongan-kamtibmas')
@UseGuards(RoleInternalMiddleware)
export class GolonganKamtibmasController {
    constructor(private readonly service: GolonganKamtibmasService) {}

    @Get('')
    @Route({ name: 'master laporan.master golongan kamtibmas.index', parent: 'master laporan.master golongan kamtibmas' })
    @ApiOperation({ summary: 'Semua golongan kamtibmas' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master golongan kamtibmas.show', parent: 'master laporan.master golongan kamtibmas' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master golongan kamtibmas.create', parent: 'master laporan.master golongan kamtibmas' })
    async create(@Body() dto: CreateGolonganKamtibmasDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master golongan kamtibmas.update', parent: 'master laporan.master golongan kamtibmas' })
    async update(@Param('id') id: string, @Body() dto: CreateGolonganKamtibmasDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master golongan kamtibmas.delete', parent: 'master laporan.master golongan kamtibmas' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
