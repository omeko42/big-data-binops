import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CreateProvinsiDto, UpdateProvinsiDto } from '../../dto/keterlibatan/provinsi.dto';
import { ProvinsiService } from '../../service/lokasi/provinsi.service';

@CoreController('Master-Provinsi', 'master/provinsi')
@UseGuards(RoleInternalMiddleware)
export class ProvinsiController {
    constructor(private readonly directorateService: ProvinsiService) {}

    @Get('')
    @Route({ name: 'master lokasi.master provinsi.index', parent: 'master lokasi.master provinsi' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master lokasi.master provinsi.show', parent: 'master lokasi.master provinsi' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master lokasi.master provinsi.create', parent: 'master lokasi.master provinsi' })
    async create(@Body() dto: CreateProvinsiDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master lokasi.master provinsi.update', parent: 'master lokasi.master provinsi' })
    async update(@Param('id') id: string, @Body() dto: UpdateProvinsiDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master lokasi.master provinsi.delete', parent: 'master lokasi.master provinsi' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
