import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req, UseInterceptors } from '@nestjs/common';
import { OrganisasiDto } from '../dto/organisasi.dto';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { OrganisasiTeamService } from '../service/organisasi-team.service';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { OrganisasiTeamDto, OrganisasiUpdateTeamDto } from '../dto/organisasi-team.dto';

@CoreController('master-organisasi', 'master/organisasi-team')
export class OrganisasiTeamController {
    constructor(private readonly service: OrganisasiTeamService) {}

    @Get('organisasi-team-sub-menu')
    @Route({ name: 'master.organisasi team', parent: 'master.manajemen organisasi' })
    organisasiSub() {
        return 'menu';
    }

    @Post()
    @Route({ name: 'master.organisasi team.create', parent: 'master.organisasi team' })
    async create(@CurrentUser() authUser, @Body() dto: OrganisasiTeamDto, @Res() res) {
        return res.sendSuccess(await this.service.create(dto, authUser));
    }

    @Get()
    @Route({ name: 'master.organisasi team.index', parent: 'master.organisasi team' })
    async index(@CurrentUser() authUser, @Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.findAll(req, authUser));
    }

    @Get(':id')
    @Route({ name: 'master.organisasi team.show', parent: 'master.organisasi team' })
    async findOne(@CurrentUser() authUser, @Param('id') id: string, @Res() res) {
        return res.sendSuccess(await this.service.findOne(+id, authUser));
    }

    @Patch(':id')
    @Route({ name: 'master.organisasi team.update', parent: 'master.organisasi team' })
    async update(@CurrentUser() authUser, @Param('id') id: string, @Body() dto: OrganisasiUpdateTeamDto, @Res() res) {
        return res.sendSuccess(await this.service.update(+id, dto, authUser));
    }

    @Delete('')
    @Route({ name: 'master.organisasi team.delete', parent: 'master.organisasi team' })
    async remove(@CurrentUser() authUser, @Body() dto: DeleteDto, @Res() res) {
        return res.sendSuccess(await this.service.remove(dto, authUser));
    }
}
