import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import * as dotenv from 'dotenv';
import { DataMasterModule } from '@bareskrim/data_master/data_master.module';
import { ReportModule } from '@bareskrim/report/report.module';
import { HelperModule } from '@app_core/helper/helper.module';
import { AuthModule } from '@app_core/auth/auth.module';
import { RouteModule } from '@app_core/auth/route/route.module';
import { PermissionModule } from '@app_core/auth/permission/permission.module';
import { BareskrimOrganisasiModule } from 'src/orgaisasi/BareskrimOrganisasi.module';
import { ExternalModule } from 'src/external/external.module';
import { setupSwaggerGroup } from './setupSwaggerGroup';
dotenv.config();

export function setupSwagger(app: INestApplication) {
    const username = process.env.SWAGGER_USERNAME || 'admin';
    const password = process.env.SWAGGER_PASSWORD || 'admin';

    const swaggerConfigs = [
        {
            path: 'swagger',
            title: 'BDB API',
            description: 'BDB API Documentation',
            modules: undefined, // semua module
            authUsers: { [username]: password }
        },
        {
            path: 'swagger/data-master',
            title: 'BDB API',
            description: 'Data Master API',
            modules: [DataMasterModule],
            authUsers: { [username]: password }
        },
        {
            path: 'swagger/bareskrim',
            title: 'BDB API',
            description: 'Bareskrim API',
            modules: [ReportModule],
            authUsers: { [username]: password }
        },
        {
            path: 'swagger/core',
            title: 'BDB API',
            description: 'Core API',
            modules: [HelperModule, AuthModule, RouteModule, PermissionModule],
            authUsers: { [username]: password }
        },
        {
            path: 'swagger/organisasi',
            title: 'BDB API',
            description: 'Organisasi API',
            modules: [BareskrimOrganisasiModule],
            authUsers: { [username]: password }
        },
        {
            path: 'swaggers/external',
            title: 'BDB External API',
            description: 'Dokumentasi api untuk external aplikasi',
            modules: [ExternalModule],
            authUsers: { external: process.env.EXTERNAL_SWAGGER_PASSWORD }
        }
    ];

    swaggerConfigs.forEach(config => setupSwaggerGroup(app, config));
}
