import { Module } from '@nestjs/common';
import { SummaryTableService } from './service/summary-view.service';
import { TableHelperService } from '@app_core/helper/service/table.helper.service';
import { DateService } from '@app_core/helper/service/date.helper.service';
import { HelperModule } from '@app_core/helper/helper.module';
import { LaporanController } from './controller/laporan.controller';
import { LaporanService } from './service/laporan.service';

@Module({
    imports: [HelperModule],
    controllers: [LaporanController],
    providers: [LaporanService, TableHelperService, SummaryTableService]
})
export class DashboardModule {}
