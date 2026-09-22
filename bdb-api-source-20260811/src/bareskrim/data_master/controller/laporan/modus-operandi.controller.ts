import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { ModusOperandiService } from '@bareskrim/data_master/service/laporan/modus-operandi.service';
import { CreateModusOperandiDto } from '@bareskrim/data_master/dto/laporan/modus-operandi.dto';

@CoreController('Master-ModusOperandi', 'master/modus-operandi')
@UseGuards(RoleInternalMiddleware)
export class ModusOperandiController {
    constructor(private readonly service: ModusOperandiService) {}

    @Get('')
    @Route({ name: 'master laporan.master modus operandi.index', parent: 'master laporan.master modus operandi' })
    @ApiOperation({ summary: 'Semua modus operandi' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master modus operandi.show', parent: 'master laporan.master modus operandi' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master modus operandi.create', parent: 'master laporan.master modus operandi' })
    async create(@Body() dto: CreateModusOperandiDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master modus operandi.update', parent: 'master laporan.master modus operandi' })
    async update(@Param('id') id: string, @Body() dto: CreateModusOperandiDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master modus operandi.delete', parent: 'master laporan.master modus operandi' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
