import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { DesaService } from '../../service/lokasi/desa.service';
import { CreateDesaDto, UpdateDesaDto } from '../../dto/keterlibatan/desa.dto';

@CoreController('Master-Desa', 'master/desa')
@UseGuards(RoleInternalMiddleware)
export class DesaController {
    constructor(private readonly directorateService: DesaService) {}

    @Get('')
    @Route({ name: 'master lokasi.master desa.index', parent: 'master lokasi.master desa' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master lokasi.master desa.show', parent: 'master lokasi.master desa' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master lokasi.master desa.create', parent: 'master lokasi.master desa' })
    async create(@Body() dto: CreateDesaDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master lokasi.master desa.update', parent: 'master lokasi.master desa' })
    async update(@Param('id') id: string, @Body() dto: UpdateDesaDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master lokasi.master desa.delete', parent: 'master lokasi.master desa' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
