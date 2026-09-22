import { Module } from '@nestjs/common';
import { RouteService } from '@app_core/auth/route/route.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({
    imports: [DiscoveryModule],
    controllers: [],
    providers: [RouteService],
    exports: [RouteService]
})
export class RouteModule {}
