import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req } from '@nestjs/common';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { OrganisasiRoleDto, OrganisasiRoleMenuDto } from '../dto/role.dto';
import { OrganisasiRoleService } from '../service/role.service';
import { DeleteDto } from '@app_core/helper/helperDelete.dto';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';

@CoreController('master-organisasi-role', 'master/organisasi/role')
export class OrganisasiRoleController {
    constructor(private readonly service: OrganisasiRoleService) {}
    @Get('role-sub-menu')
    @Route({ name: 'master.organisasi role', parent: 'master.manajemen organisasi' })
    subMenu() {
        return 'menu';
    }

    @Get('role-menu-sub-menu')
    @Route({ name: 'master.organisasi role menu', parent: 'master.organisasi role' })
    menusubMenu() {
        return 'menu';
    }

    @Get('menu/:id')
    @Route({ name: 'master.organisasi role menu.index', parent: 'master.organisasi role menu' })
    async indexMenu(@Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.RoleMenuIndex(+id));
    }

    @Patch('menu/:id')
    @Route({ name: 'master.organisasi role menu.update', parent: 'master.organisasi role menu' })
    async UpdateMenu(@Param('id') id: string, @Body() dto: OrganisasiRoleMenuDto, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.RoleMenuUpdate(+id, dto));
    }

    @Get('generate-invitation-url/:id')
    @Route({ name: 'master.organisasi role.generate invitation url', parent: 'master.organisasi role' })
    async GenerateInvitationUrl(@CurrentUser() authUser, @Param('id') id: string, @Res() res, @Req() req) {
        return res.sendSuccess(await this.service.generateUrl(+id, authUser));
    }

    @Post()
    @Route({ name: 'master.organisasi role.create', parent: 'master.organisasi role' })
    create(@Body() dto: OrganisasiRoleDto, @Res() res) {
        return res.sendSuccess(this.service.create(dto));
    }

    @Get()
    @Route({ name: 'master.organisasi role.index', parent: 'master.organisasi role' })
    async index(@CurrentUser() authUser, @Query() query: ApplyFiltersDto, @Res() res, @Req() req) {        
        return res.sendSuccess(await this.service.findAll(req, authUser));
    }

    @Get(':id')
    @Route({ name: 'master.organisasi role.show', parent: 'master.organisasi role' })
    async findOne(@Param('id') id: string, @Res() res) {
        return res.sendSuccess(await this.service.findOne(+id));
    }

    @Patch(':id')
    @Route({ name: 'master.organisasi role.update', parent: 'master.organisasi role' })
    async update(@Param('id') id: string, @Body() dto: OrganisasiRoleDto, @Res() res) {
        return res.sendSuccess(await this.service.update(+id, dto));
    }

    @Delete('')
    @Route({ name: 'master.organisasi role.delete', parent: 'master.organisasi role' })
    remove(@Body() dto: DeleteDto) {
        return this.service.remove(dto);
    }
}
