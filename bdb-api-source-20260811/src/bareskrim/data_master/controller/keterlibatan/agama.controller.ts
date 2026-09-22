import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req, UseGuards } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { AgamaService } from '../../service/keterlibatan/agama.service';
import { CreateAgamaDto } from '../../dto/keterlibatan/agama.dto';

@CoreController('Master-Agama', 'master/agama')
@UseGuards(RoleInternalMiddleware)
export class AgamaController {
    constructor(private readonly service: AgamaService) {}

    @Get('')
    @Route({ name: 'master keterlibatan.master agama.index', parent: 'master keterlibatan.master agama' })
    @ApiOperation({ summary: 'Semua report hasil transform' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        const results = await this.service.findAll(req);
        return res.sendSuccess(results);
    }

    @Get(':id')
    @Route({ name: 'master keterlibatan.master agama.show', parent: 'master keterlibatan.master agama' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Post('')
    @Route({ name: 'master keterlibatan.master agama.create', parent: 'master keterlibatan.master agama' })
    async create(@Body() dto: CreateAgamaDto, @Res() res, @Req() req) {
        const results = await this.service.create(dto);
        return res.sendSuccess(results);
    }

    @Patch(':id')
    @Route({ name: 'master keterlibatan.master agama.update', parent: 'master keterlibatan.master agama' })
    async update(@Param('id') id: string, @Body() dto: CreateAgamaDto, @Res() res, @Req() req) {
        const results = await this.service.update(+id, dto);
        return res.sendSuccess(results);
    }

    @Delete('')
    @Route({ name: 'master keterlibatan.master agama.delete', parent: 'master keterlibatan.master agama' })
    async remove(@Body() deleteDto: DeleteDto, @Res() res) {
        const results = await this.service.remove(deleteDto);
        return res.sendSuccess(results);
    }
}
