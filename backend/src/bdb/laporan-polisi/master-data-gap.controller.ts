import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { MasterDataGapService } from './master-data-gap.service';

@UseGuards(AuthGuard)
@Controller('bdb/master-data-gap')
export class MasterDataGapController {
    constructor(private readonly service: MasterDataGapService) {}

    /** Ringkasan jumlah ID unik & LP terdampak per dimensi (jenis kejahatan, lokasi, dst). */
    @Get('stats')
    stats(@Query('refresh') refresh?: string) {
        return this.service.stats(refresh === '1' || refresh === 'true');
    }

    /** Daftar rinci ID yang tidak termapping (paginasi + filter dimensi/search). */
    @Get('list')
    list(
        @Query('dimensi') dimensi?: string,
        @Query('search') search?: string,
        @Query('page') page?: string,
        @Query('row') row?: string,
        @Query('refresh') refresh?: string,
    ) {
        return this.service.list({
            dimensi: dimensi as any,
            search,
            page: page ? parseInt(page, 10) : 1,
            row: row ? parseInt(row, 10) : 25,
            refresh: refresh === '1' || refresh === 'true',
        });
    }
}
