import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { AuditService } from './audit.service';

@UseGuards(AuthGuard)
@Controller('bdb/audit-log')
export class AuditController {
    constructor(private readonly service: AuditService) {}

    @Get()
    list(@Query() q: Record<string, any>) {
        return this.service.list(q || {});
    }

    @Get('filters')
    filters() {
        return this.service.filters();
    }
}
