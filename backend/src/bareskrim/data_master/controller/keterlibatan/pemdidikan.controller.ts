import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { PendidikanService } from '../../service/keterlibatan/pendidikan.service';
import { CreatePendidikanDto } from '../../dto/keterlibatan/pendidikan.dto';

@CoreController('Master-Pendidikan', 'master/pendidikan')
@UseGuards(RoleInternalMiddleware)
export class PendidikanController {
    constructor(private readonly directorateService: PendidikanService) {}

    @Get('')
    @Route({ name: 'master keterlibatan.master pendidikan.index', parent: 'master keterlibatan.master pendidikan' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master keterlibatan.master pendidikan.show', parent: 'master keterlibatan.master pendidikan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master keterlibatan.master pendidikan.create', parent: 'master keterlibatan.master pendidikan' })
    async create(@Body() dto: CreatePendidikanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master keterlibatan.master pendidikan.update', parent: 'master keterlibatan.master pendidikan' })
    async update(@Param('id') id: string, @Body() dto: CreatePendidikanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master keterlibatan.master pendidikan.delete', parent: 'master keterlibatan.master pendidikan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
