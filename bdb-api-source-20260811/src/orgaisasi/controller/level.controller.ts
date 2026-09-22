import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res } from '@nestjs/common';
import { LevelIndexDto, OrganisasiLevelAksesDto, OrganisasiLevelDto, OrganisasiLevelMenuDto } from '../dto/level.dto';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { OrganisasiLevelService } from '../service/level.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';

@CoreController('master-organisasi level', 'master/organisasi-level')
export class OrganisasiLevelController {
    constructor(private readonly service: OrganisasiLevelService) {}
    @Get('level-sub-menu')
    @Route({ name: 'master.organisasi level', parent: 'master.manajemen organisasi' })
    subMenu() {
        return 'menu';
    }

    @Post()
    @Route({ name: 'master.organisasi level.create', parent: 'master.organisasi level' })
    async create(@Body() dto: OrganisasiLevelDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.create(dto));
    }

    @Get()
    @Route({ name: 'master.organisasi level.index', parent: 'master.organisasi level' })
    async index(@Query() query: LevelIndexDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findAll(query));
    }

    @Get(':id')
    @Route({ name: 'master.organisasi level.show', parent: 'master.organisasi level' })
    async show(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Patch(':id')
    @Route({ name: 'master.organisasi level.update', parent: 'master.organisasi level' })
    async update(@Param('id') id: string, @Body() dto: OrganisasiLevelDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.update(+id, dto));
    }

    @Delete()
    @Route({ name: 'master.organisasi level.delete', parent: 'master.organisasi level' })
    async delete(@Body() deleteDto: DeleteDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.remove(deleteDto));
    }

    @Get('level-menu-sub-menu')
    @Route({ name: 'master.organisasi level menu', parent: 'master.organisasi level' })
    menusubMenu() {
        return 'menu';
    }

    @Get('menu/:id')
    @Route({ name: 'master.organisasi level menu.index', parent: 'master.organisasi level menu' })
    async indexMenu(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.LevelMenuIndex(+id));
    }

    @Patch('menu/:id')
    @Route({ name: 'master.organisasi level menu.update', parent: 'master.organisasi level menu' })
    async UpdateMenu(@Param('id') id: string, @Body() dto: OrganisasiLevelMenuDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.LevelMenuUpdate(+id, dto));
    }

    @Get('level-akses-level-sub-menu')
    @Route({ name: 'master.organisasi level akses', parent: 'master.organisasi level' })
    aksesLevelSubMenu() {
        return 'menu';
    }

    @Get('akses-level/:id')
    @Route({ name: 'master.organisasi level akses.index', parent: 'master.organisasi level akses' })
    async indexAksesLevel(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.LevelAksesIndex(+id));
    }

    @Patch('akses-level/:id')
    @Route({ name: 'master.organisasi level akses.update', parent: 'master.organisasi level akses' })
    async UpdateAksesLevel(@Param('id') id: string, @Body() dto: OrganisasiLevelAksesDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.LevelAksesUpdate(+id, dto));
    }
}
