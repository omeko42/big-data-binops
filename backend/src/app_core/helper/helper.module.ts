import { Module } from '@nestjs/common';
import { HelperService } from './service/helper.service';
import { TableHelperService } from './service/table.helper.service';
import { DateService } from './service/date.helper.service';

@Module({
    controllers: [],
    providers: [HelperService, TableHelperService, DateService],
    exports: [HelperService, TableHelperService, DateService]
})
export class HelperModule {}
