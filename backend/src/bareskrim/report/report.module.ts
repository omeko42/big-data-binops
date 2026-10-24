import { Module } from '@nestjs/common';
import { ReportController } from '@bareskrim/report/controller/report.controller';
import { ReportService } from '@bareskrim/report/service/report.service';
import { ImportService } from '@bareskrim/report/service/import.service';
import { ExcelService } from './service/excel.service';
import { DateService } from '@app_core/helper/service/date.helper.service';
import { ReportStatusService } from './service/report-status.service';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { ReportPelaporService } from './service/report-pelapor.service';
import { ReportPelaporController } from './controller/report-pelapor.controller';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { ReportTerlaporController } from './controller/report-terlapor.controller';
import { ReportTerlaporService } from './service/report-terlapor.service';
import { ReportKorbanController } from './controller/report-korban.controller';
import { ReportSaksiController } from './controller/report-saksi.controller';
import { ReportKorbanService } from './service/report-korban.service';
import { ReportSaksiService } from './service/report-saksi.service';
import { ReportPasalService } from './service/report-pasal.service';
import { ReportPasalController } from './controller/report-pasal.controller';
import { OrganisasiService } from 'src/orgaisasi/service/organisasi.service';
import { OrganisasiLevelService } from 'src/orgaisasi/service/level.service';
import { DiscoveryService } from '@nestjs/core';
import { PermissionService } from '@app_core/auth/permission/permission.service';
import { RouteService } from '@app_core/auth/route/route.service';
import { OrganisasiTeamService } from 'src/orgaisasi/service/organisasi-team.service';
import { OrganisasiRoleService } from 'src/orgaisasi/service/role.service';
import { MailService } from '@app_core/helper/service/mail.service';
import { CacheCoreModule } from '@app_core/helper/module/cache.module';

@Module({
    controllers: [ReportController, ReportPelaporController, ReportTerlaporController, ReportKorbanController, ReportSaksiController, ReportPasalController],
    providers: [
        Auth,
        TableHelperService,
        ReportService,
        ImportService,
        ExcelService,
        DateService,
        ReportStatusService,
        ReportPelaporService,
        ReportTerlaporService,
        ReportKorbanService,
        ReportSaksiService,
        ReportPasalService,
        OrganisasiService,
        OrganisasiLevelService,
        PermissionService,
        RouteService,
        DiscoveryService,
        OrganisasiTeamService,
        OrganisasiLevelService,
        OrganisasiService,
        OrganisasiRoleService,
        MailService
    ],
    exports: [
        Auth,
        TableHelperService,
        ReportService,
        ImportService,
        ExcelService,
        DateService,
        ReportStatusService,
        ReportPelaporService,
        ReportTerlaporService,
        ReportKorbanService,
        ReportSaksiService,
        ReportPasalService,
        OrganisasiService,
        OrganisasiLevelService,
        PermissionService,
        RouteService,
        DiscoveryService,
        OrganisasiTeamService,
        OrganisasiRoleService,
        MailService
    ],
    imports: [CacheCoreModule]
})
export class ReportModule {}
