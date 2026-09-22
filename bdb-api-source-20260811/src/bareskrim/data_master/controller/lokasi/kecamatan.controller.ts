import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CreateKecamatanDto, UpdateKecamatanDto } from '../../dto/keterlibatan/kecamatan.dto';
import { KecamatanService } from '../../service/lokasi/kecamatan.service';

@CoreController('Master-Kecamatan', 'master/kecamatan')
@UseGuards(RoleInternalMiddleware)
export class KecamatanController {
    constructor(private readonly directorateService: KecamatanService) {}

    @Get('')
    @Route({ name: 'master lokasi.master kecamatan.index', parent: 'master lokasi.master kecamatan' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master lokasi.master kecamatan.show', parent: 'master lokasi.master kecamatan' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master lokasi.master kecamatan.create', parent: 'master lokasi.master kecamatan' })
    async create(@Body() dto: CreateKecamatanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master lokasi.master kecamatan.update', parent: 'master lokasi.master kecamatan' })
    async update(@Param('id') id: string, @Body() dto: UpdateKecamatanDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master lokasi.master kecamatan.delete', parent: 'master lokasi.master kecamatan' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
