import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { GolonganKejahatanService } from '@bareskrim/data_master/service/laporan/golongan-kejahatan.service';
import { CreateGolonganKejahatanDto } from '@bareskrim/data_master/dto/laporan/golongan-kejahatan.dto';

@CoreController('Master-GolonganKejahatan', 'master/golongan-kejahatan')
@UseGuards(RoleInternalMiddleware)
export class GolonganKejahatanController {
    constructor(private readonly service: GolonganKejahatanService) {}

    @Get('')
    @Route({ name: 'master laporan.master golongan kejahatan.index', parent: 'master laporan.master golongan kejahatan' })
    @ApiOperation({ summary: 'Semua golongan kejahatan' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master golongan kejahatan.show', parent: 'master laporan.master golongan kejahatan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master golongan kejahatan.create', parent: 'master laporan.master golongan kejahatan' })
    async create(@Body() dto: CreateGolonganKejahatanDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master golongan kejahatan.update', parent: 'master laporan.master golongan kejahatan' })
    async update(@Param('id') id: string, @Body() dto: CreateGolonganKejahatanDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master golongan kejahatan.delete', parent: 'master laporan.master golongan kejahatan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
