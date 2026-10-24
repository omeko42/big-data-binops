import { Module } from '@nestjs/common';
import { PermissionService } from '@app_core/auth/permission/permission.service';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { RouteService } from '../route/route.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({
    imports: [DiscoveryModule],
    controllers: [],
    providers: [PermissionService, TableHelperService, RouteService],
    exports: [PermissionService, TableHelperService, RouteService]
})
export class PermissionModule {}
