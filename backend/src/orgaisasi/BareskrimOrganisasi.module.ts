import { Module } from '@nestjs/common';
import {  } from '@nestjs/cache-manager';
import { DiscoveryService } from '@nestjs/core';

import { OrganisasiLevelController } from './controller/level.controller';
import { OrganisasiRoleController } from './controller/role.controller';
import { OrganisasiTeamController } from './controller/organisasi-team.controller';

import { OrganisasiService } from './service/organisasi.service';
import { OrganisasiLevelService } from './service/level.service';
import { OrganisasiRoleService } from './service/role.service';
import { OrganisasiTeamService } from './service/organisasi-team.service';

import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { MailService } from '@app_core/helper/service/mail.service';
import { PermissionService } from '@app_core/auth/permission/permission.service';
import { RouteService } from '@app_core/auth/route/route.service';
import { CacheCoreModule } from '@app_core/helper/module/cache.module';

@Module({
    imports: [CacheCoreModule],
    controllers: [OrganisasiRoleController, OrganisasiLevelController, OrganisasiTeamController],
    providers: [MailService, TableHelperService, PermissionService, RouteService, DiscoveryService, OrganisasiTeamService, OrganisasiLevelService, OrganisasiService, OrganisasiRoleService],
    exports: [MailService, TableHelperService, PermissionService, RouteService, DiscoveryService, OrganisasiTeamService, OrganisasiLevelService, OrganisasiService, OrganisasiRoleService]
})
export class BareskrimOrganisasiModule {}
