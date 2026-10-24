import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CreateKabupatenDto, UpdateKabupatenDto } from '../../dto/keterlibatan/kabupaten.dto';
import { KabupatenService } from '../../service/lokasi/kabupaten.service';

@CoreController('Master-Kabupaten', 'master/kabupaten')
@UseGuards(RoleInternalMiddleware)
export class KabupatenController {
    constructor(private readonly directorateService: KabupatenService) {}

    @Get('')
    @Route({ name: 'master lokasi.master kabupaten.index', parent: 'master lokasi.master kabupaten' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.directorateService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master lokasi.master kabupaten.show', parent: 'master lokasi.master kabupaten' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.directorateService.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master lokasi.master kabupaten.create', parent: 'master lokasi.master kabupaten' })
    async create(@Body() dto: CreateKabupatenDto, @Res() res, @Req() req) {
        const results = await this.directorateService.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master lokasi.master kabupaten.update', parent: 'master lokasi.master kabupaten' })
    async update(@Param('id') id: string, @Body() dto: UpdateKabupatenDto, @Res() res, @Req() req) {
        const results = await this.directorateService.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master lokasi.master kabupaten.delete', parent: 'master lokasi.master kabupaten' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.directorateService.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
