import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CreateAgamaDto } from '../../dto/keterlibatan/agama.dto';
import { SukuService } from '../../service/keterlibatan/suku.service';

@CoreController('Master-Suku', 'master/suku')
@UseGuards(RoleInternalMiddleware)
export class SukuController {
    constructor(private readonly service: SukuService) {}

    @Get('')
    @Route({ name: 'master keterlibatan.master suku.index', parent: 'master keterlibatan.master suku' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master keterlibatan.master suku.show', parent: 'master keterlibatan.master suku' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master keterlibatan.master suku.create', parent: 'master keterlibatan.master suku' })
    async create(@Body() dto: CreateAgamaDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master keterlibatan.master suku.updateindex', parent: 'master keterlibatan.master suku' })
    async update(@Param('id') id: string, @Body() dto: CreateAgamaDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master keterlibatan.master suku.delete', parent: 'master keterlibatan.master suku' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
