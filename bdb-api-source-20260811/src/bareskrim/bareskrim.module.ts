import { Module } from '@nestjs/common';

import { ReportModule } from './report/report.module';
import { AgamaService } from './data_master/service/keterlibatan/agama.service';
import { DataMasterModule } from './data_master/data_master.module';

@Module({
    controllers: [],
    providers: [AgamaService],
    imports: [DataMasterModule, ReportModule]
})
export class BareskrimModule {}
