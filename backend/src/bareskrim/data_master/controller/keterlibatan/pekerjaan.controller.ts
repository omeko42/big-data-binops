import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { PekerjaanService } from '../../service/keterlibatan/pekerjaan.service';
import { CreatePekerjaanDto, UpdatePekerjaanDto } from '../../dto/keterlibatan/pekerjaan';

@CoreController('Master-Pekerjaan', 'master/pekerjaan')
@UseGuards(RoleInternalMiddleware)
export class PekerjaanController {
    constructor(private readonly directorateService: PekerjaanService) {}

    @Get('')
    @Route({ name: 'master keterlibatan.master pekerjaan.index', parent: 'master keterlibatan.master pekerjaan' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master keterlibatan.master pekerjaan.show', parent: 'master keterlibatan.master pekerjaan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master keterlibatan.master pekerjaan.create', parent: 'master keterlibatan.master pekerjaan' })
    async create(@Body() dto: CreatePekerjaanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master keterlibatan.master pekerjaan.update', parent: 'master keterlibatan.master pekerjaan' })
    async update(@Param('id') id: string, @Body() dto: UpdatePekerjaanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master keterlibatan.master pekerjaan.delete', parent: 'master keterlibatan.master pekerjaan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
