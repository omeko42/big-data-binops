"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const app_core_module_1 = require("./app_core/app_core.module");
const swagger_module_1 = require("./app_core/swagger/swagger.module");
const route_module_1 = require("./app_core/auth/route/route.module");
const bareskrim_module_1 = require("./bareskrim/bareskrim.module");
const response_format_service_1 = require("./app_core/helper/service/response-format.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const BareskrimOrganisasi_module_1 = require("./orgaisasi/BareskrimOrganisasi.module");
const dist_1 = require("@nestjs/throttler/dist");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const schedule_1 = require("@nestjs/schedule");
const external_module_1 = require("./external/external.module");
const bdb_module_1 = require("./bdb/bdb.module");
const audit_service_1 = require("./bdb/audit/audit.service");
const global_audit_interceptor_1 = require("./bdb/audit/global-audit.interceptor");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(response_format_service_1.ResponseFormatService).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            dist_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 1000
                    }
                ]
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public'),
                serveRoot: `/${(process.env.GLOBAL_PREFIX || '').replace(/^\/|\/$/g, '')}/public`
            }),
            app_core_module_1.AppCoreModule,
            schedule_1.ScheduleModule.forRoot({
                timezone: 'Asia/Jakarta'
            }),
            swagger_module_1.SwaggerModule,
            bareskrim_module_1.BareskrimModule,
            BareskrimOrganisasi_module_1.BareskrimOrganisasiModule,
            route_module_1.RouteModule,
            dashboard_module_1.DashboardModule,
            external_module_1.ExternalModule,
            bdb_module_1.BdbModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, audit_service_1.AuditService, { provide: core_1.APP_INTERCEPTOR, useClass: global_audit_interceptor_1.GlobalAuditInterceptor }]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map