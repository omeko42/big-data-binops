import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { MotifKejahatanService } from '@bareskrim/data_master/service/laporan/motif-kejahatan.service';
import { CreateMotifKejahatanDto } from '@bareskrim/data_master/dto/laporan/motif-kejahatan.dto';

@CoreController('Master-MotifKejahatan', 'master/motif-kejahatan')
@UseGuards(RoleInternalMiddleware)
export class MotifKejahatanController {
    constructor(private readonly service: MotifKejahatanService) {}

    @Get('')
    @Route({ name: 'master laporan.master motif kejahatan.index', parent: 'master laporan.master motif kejahatan' })
    @ApiOperation({ summary: 'Semua motif kejahatan' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master motif kejahatan.show', parent: 'master laporan.master motif kejahatan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master motif kejahatan.create', parent: 'master laporan.master motif kejahatan' })
    async create(@Body() dto: CreateMotifKejahatanDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master motif kejahatan.update', parent: 'master laporan.master motif kejahatan' })
    async update(@Param('id') id: string, @Body() dto: CreateMotifKejahatanDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master motif kejahatan.delete', parent: 'master laporan.master motif kejahatan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
