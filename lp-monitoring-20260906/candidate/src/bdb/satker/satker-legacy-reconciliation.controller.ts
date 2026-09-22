import { Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { SatkerLegacyReconciliationService } from './satker-legacy-reconciliation.service';

type Level = 'Mabes' | 'Polda' | 'Polres' | 'Polsek';

type GroupKeyBody = { level: Level; kode_pusiknas: string | null; nama: string; unit_nama?: string | null };
type AddToTreeBody = GroupKeyBody & { kode?: string; parent_id?: number; segment?: string };
type ForceMapBody = GroupKeyBody & { satker_id: number };

@UseGuards(AuthGuard)
@Controller('bdb/satker-legacy')
export class SatkerLegacyReconciliationController {
    constructor(private readonly service: SatkerLegacyReconciliationService) {}

    /** Ringkasan jumlah grup satker & LP yang belum termapping, per level. */
    @Get('stats')
    stats() {
        return this.service.stats();
    }

    /** Daftar grup satker (dari LP DORS yang belum termapping) -- paginasi + filter. */
    @Get('list')
    list(
        @Query('level') level?: Level,
        @Query('search') search?: string,
        @Query('onlyUnmatched') onlyUnmatched?: string,
        @Query('page') page?: string,
        @Query('row') row?: string
    ) {
        return this.service.list({
            level,
            search,
            onlyUnmatched: onlyUnmatched === 'true',
            page: page ? parseInt(page, 10) : 1,
            row: row ? parseInt(row, 10) : 25,
        });
    }

    /** Detail LP dalam satu grup. */
    @Get('group-detail')
    groupDetail(@Query('level') level: Level, @Query('kode_pusiknas') kodePusiknas: string | undefined, @Query('nama') nama: string | undefined) {
        return this.service.groupDetail(level, kodePusiknas || null, nama || null);
    }

    /** Info sebelum tambah ke tree (nama, kode_pusiknas, induk yg akan ketemu otomatis). */
    @Get('add-to-tree/preview')
    previewAddToTree(
        @Query('level') level: Level,
        @Query('kode_pusiknas') kodePusiknas: string | undefined,
        @Query('nama') nama: string | undefined,
        @Query('unit_nama') unitNama?: string
    ) {
        return this.service.previewAddToTree(level, kodePusiknas || null, nama || null, unitNama || null);
    }

    /** Tambahkan satker baru ke tree (otomatis dari kode_pusiknas, atau induk manual) + petakan grup LP ini. */
    @Post('add-to-tree')
    addToTree(@Body() body: AddToTreeBody) {
        return this.service.addToTree(body);
    }

    /** Paksa petakan semua LP grup ini ke satker yang sudah ada di tree (pilih manual). */
    @Post('force-map')
    forceMap(@Body() body: ForceMapBody) {
        return this.service.forceMap(body);
    }

    /** Jalur root->node satker (posisi kandidat di tree Puskarda). */
    @Get('path')
    path(@Query('id') id: string) {
        return this.service.path(parseInt(id, 10));
    }

    /** Hapus SEMUA data LP DORS (staging) yang cocok filter halaman ini. Superadmin-only. */
    @UseInterceptors(CurrentUserInterceptor)
    @Post('delete-all')
    deleteAll(
        @Body() body: { level?: Level; search?: string; onlyUnmatched?: boolean },
        @Req() req: any
    ) {
        return this.service.deleteAllUnmapped(
            { level: body?.level, search: body?.search, onlyUnmatched: !!body?.onlyUnmatched },
            req?.user?.id ? Number(req.user.id) : undefined
        );
    }
}
