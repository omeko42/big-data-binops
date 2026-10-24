import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppCoreModule } from './app_core/app_core.module';
import { SwaggerModule } from './app_core/swagger/swagger.module';
import { RouteModule } from './app_core/auth/route/route.module';
import { BareskrimModule } from './bareskrim/bareskrim.module';
import { ResponseFormatService } from '@app_core/helper/service/response-format.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BareskrimOrganisasiModule } from './orgaisasi/BareskrimOrganisasi.module';
import { ThrottlerModule } from '@nestjs/throttler/dist';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ExternalModule } from './external/external.module';
import { BdbModule } from './bdb/bdb.module';
import { AuditService } from './bdb/audit/audit.service';
import { GlobalAuditInterceptor } from './bdb/audit/global-audit.interceptor';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 1000
                }
            ]
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'public'),
            serveRoot: `/${(process.env.GLOBAL_PREFIX || '').replace(/^\/|\/$/g, '')}/public` // aman dari slash ganda
        }),
        AppCoreModule,
        SwaggerModule,
        BareskrimModule,
        BareskrimOrganisasiModule,
        RouteModule,
        DashboardModule,
        ExternalModule,
        BdbModule
    ],
    controllers: [AppController],
    providers: [AppService, AuditService, { provide: APP_INTERCEPTOR, useClass: GlobalAuditInterceptor }]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ResponseFormatService).forRoutes('*'); // Apply to all routes or specify specific routes
    }
}

