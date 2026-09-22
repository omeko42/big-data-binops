import { Module } from '@nestjs/common';
import { ExternalController } from './controller/external.controller';
import { ExternalService } from './service/external.service';
import { ReportService } from '@bareskrim/report/service/report.service';
import { CacheCoreModule } from '@app_core/helper/module/cache.module';
import { ReportModule } from '@bareskrim/report/report.module';
import { ExternalLpController } from './controller/external-lp.controller';
import { ExternalLpService } from './service/external-lp.service';
import { IntegrationClientGuard } from './integration-client.guard';
import { ExternalHttpExceptionFilter } from './external-http-exception.filter';
import { ExternalAccessLogInterceptor } from './external-access-log.interceptor';
import { AuditService } from '../bdb/audit/audit.service';

@Module({
    imports: [CacheCoreModule, ReportModule],
    controllers: [ExternalController, ExternalLpController],
    providers: [ExternalService, ReportService, ExternalLpService, IntegrationClientGuard, ExternalHttpExceptionFilter, ExternalAccessLogInterceptor, AuditService],
    exports: [ExternalService, ReportService, ExternalLpService]
})
export class ExternalModule {}
