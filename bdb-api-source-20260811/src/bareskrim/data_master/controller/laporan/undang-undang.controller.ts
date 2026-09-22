import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { UndangUndangService } from '@bareskrim/data_master/service/laporan/undang-undang.service';
import { CreateUndangUndangDto } from '@bareskrim/data_master/dto/laporan/undang-undang.dto';

@CoreController('Master-UndangUndang', 'master/undang-undang')
@UseGuards(RoleInternalMiddleware)
export class UndangUndangController {
    constructor(private readonly service: UndangUndangService) {}

    @Get('')
    @Route({ name: 'master laporan.master undang undang.index', parent: 'master laporan.master undang undang' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master laporan.master undang undang.show', parent: 'master laporan.master undang undang' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master laporan.master undang undang.create', parent: 'master laporan.master undang undang' })
    async create(@Body() dto: CreateUndangUndangDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master laporan.master undang undang.update', parent: 'master laporan.master undang undang' })
    async update(@Param('id') id: string, @Body() dto: CreateUndangUndangDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master laporan.master undang undang.delete', parent: 'master laporan.master undang undang' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
