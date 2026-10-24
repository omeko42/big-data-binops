import { Injectable } from '@nestjs/common';
import { CreateExternalDto } from '../dto/create-external.dto';
import { UpdateExternalDto } from '../dto/update-external.dto';
import { ReportService } from '@bareskrim/report/service/report.service';

@Injectable()
export class ExternalService {
    constructor(private readonly reportService: ReportService) {}

    create(createExternalDto: CreateExternalDto) {
        return 'This action adds a new external';
    }

    async findAll(request: any) {
        return await this.reportService.findAll(request, {}, false);
    }

    async findOne(id: number) {
        return await this.reportService.findOne(id, {}, false);
    }

    update(id: number, updateExternalDto: UpdateExternalDto) {
        return `This action updates a #${id} external`;
    }

    remove(id: number) {
        return `This action removes a #${id} external`;
    }
}
