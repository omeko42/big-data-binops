import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CreateKewarganegaraanDto, UpdateKewarganegaraanDto } from '../../dto/keterlibatan/kewarganegaraan.dto';
import { KewarganegaraanService } from '../../service/keterlibatan/kewarganegaraan.service';

@CoreController('Master-Kewarganegaraan', 'master/kewarganegaraan')
@UseGuards(RoleInternalMiddleware)
export class KewarganegaraanController {
    constructor(private readonly directorateService: KewarganegaraanService) {}

    @Get('')
    @Route({ name: 'master keterlibatan.master kewarganegaraan.index', parent: 'master keterlibatan.master kewarganegaraan' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master keterlibatan.master kewarganegaraan.show', parent: 'master keterlibatan.master kewarganegaraan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master keterlibatan.master kewarganegaraan.create', parent: 'master keterlibatan.master kewarganegaraan' })
    async create(@Body() dto: CreateKewarganegaraanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master keterlibatan.master kewarganegaraan.update', parent: 'master keterlibatan.master kewarganegaraan' })
    async update(@Param('id') id: string, @Body() dto: UpdateKewarganegaraanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master keterlibatan.master kewarganegaraan.delete', parent: 'master keterlibatan.master kewarganegaraan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
