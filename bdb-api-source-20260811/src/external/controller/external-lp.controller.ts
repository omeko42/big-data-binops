import { Controller, Get, Param, Query, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntegrationClientGuard } from '../integration-client.guard';
import { RequireScope } from '../require-scope.decorator';
import { ExternalLpService } from '../service/external-lp.service';
import { ExternalHttpExceptionFilter } from '../external-http-exception.filter';
import { ExternalAccessLogInterceptor } from '../external-access-log.interceptor';
import { buildLpDataFlags } from '../../bdb/integration-client/scopes';

/**
 * Contoh API keluar (Portal Integrasi). Auth: HTTP Basic Auth pakai username/password
 * klien integrasi (dibuat di CMS → Integrasi → Portal Integrasi Keluar), bukan token internal.
 * Tiap klien hanya bisa memanggil endpoint yang scope-nya sudah diberikan (lihat allowed_scopes).
 * Pakai ExternalHttpExceptionFilter agar gagal auth/izin balas status HTTP asli (401/403),
 * bukan konvensi internal (HTTP 200 + status:0) yang menyesatkan bagi klien di luar aplikasi ini.
 * Setiap panggilan (sukses maupun gagal) dicatat ke log akses (CMS → Portal Integrasi Keluar → Log Akses).
 */
@ApiTags('external-v1')
@UseGuards(IntegrationClientGuard)
@UseFilters(ExternalHttpExceptionFilter)
@UseInterceptors(ExternalAccessLogInterceptor)
@Controller('external/v1')
export class ExternalLpController {
    constructor(private readonly service: ExternalLpService) {}

    @Get('laporan-polisi')
    @RequireScope('laporan_polisi.read')
    @ApiOperation({ summary: 'external.laporan-polisi.index — data keluar Laporan Polisi (scope dasar: laporan_polisi.read, field tambahan sesuai scope lain yg dimiliki klien)' })
    list(
        @Req() req: any,
        @Query() query: { page?: string; limit?: string; no_laporan?: string; status?: string; status_kategori?: string; satker?: string; updated_from?: string; updated_to?: string }
    ) {
        return this.service.list(query, buildLpDataFlags(req.integrationClient?.allowed_scopes || []));
    }

    @Get('laporan-polisi/:id')
    @RequireScope('laporan_polisi.read')
    @ApiOperation({ summary: 'external.laporan-polisi.show — data keluar Laporan Polisi (scope dasar: laporan_polisi.read, field tambahan sesuai scope lain yg dimiliki klien)' })
    detail(@Req() req: any, @Param('id') id: string) {
        return this.service.detail(id, buildLpDataFlags(req.integrationClient?.allowed_scopes || []));
    }
}
