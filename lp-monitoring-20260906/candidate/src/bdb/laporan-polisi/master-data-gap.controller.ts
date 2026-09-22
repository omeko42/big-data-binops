import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { MasterDataGapService } from './master-data-gap.service';

@UseGuards(AuthGuard)
@Controller('bdb/master-data-gap')
export class MasterDataGapController {
    constructor(private readonly service: MasterDataGapService) {}

    /** Ringkasan jumlah ID unik & LP terdampak per dimensi (jenis kejahatan, lokasi, dst). */
    @Get('stats')
    stats() {
        return this.service.stats();
    }

    /** Daftar rinci ID yang tidak termapping (paginasi + filter dimensi/search). */
    @Get('list')
    list(@Query('dimensi') dimensi?: string, @Query('search') search?: string, @Query('page') page?: string, @Query('row') row?: string) {
        return this.service.list({
            dimensi: dimensi as any,
            search,
            page: page ? parseInt(page, 10) : 1,
            row: row ? parseInt(row, 10) : 25,
        });
    }
}
