import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { LaporanPolisiService } from './laporan-polisi.service';

@Controller('bdb/laporan-polisi')
export class LaporanPolisiController {
    constructor(private readonly service: LaporanPolisiService) {}

    /** Ringkasan per status LP (di-scope: superadmin=semua, operator=satkernya sendiri). */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get('stats')
    stats(@Req() req: any, @Query('target_satker_id') targetSatkerId?: string) {
        return this.service.stats(req?.user?.id ? Number(req.user.id) : undefined, targetSatkerId ? Number(targetSatkerId) : undefined);
    }

    /** Pilihan satker bawahan + dimensi filter yang sudah dibatasi domain fungsi akun. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get('monitoring-options')
    monitoringOptions(@Req() req: any) {
        return this.service.monitoringOptions(req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Petakan LP DORS -> Laporan Polisi (yang kode_pusiknas-nya cocok satker). */
    @UseGuards(AuthGuard)
    @Post('map')
    map() {
        return this.service.mapFromDors();
    }

    /** Petakan ulang lebih dalam (Polda/Polres/Mabes -> unit satker terdalam). */
    @UseGuards(AuthGuard)
    @Post('remap-deeper')
    async remapDeeper() {
        const updated = await this.service.remapDeeper();
        return { status: 1, data: { unit_terdalam: updated }, message: `${updated} LP dipetakan ke unit satker terdalam.` };
    }

    /** Petakan LP belum termapping via kemiripan nama (disambiguasi via induk dari no. laporan). */
    @UseGuards(AuthGuard)
    @Post('map-by-name')
    mapByName(@Body() body: { threshold?: number }) {
        return this.service.mapByNameSimilarity(body?.threshold ?? 0.9);
    }

    /** PAKSA petakan sisa LP ke satker terbaik + rekam alias (otomatis ke depan). */
    @UseGuards(AuthGuard)
    @Post('force-map')
    forceMap(@Body() body: { threshold?: number }) {
        return this.service.forceMap(body?.threshold ?? 0.4);
    }

    /** Petakan SATU LP ke satker pilihan (manual 1:1) + rekam alias. */
    @UseGuards(AuthGuard)
    @Post('map-one')
    mapOne(@Body() body: { dors_lp_id: number; model_lp: string; satker_id: number }) {
        return this.service.mapOne(Number(body?.dors_lp_id), body?.model_lp, Number(body?.satker_id));
    }

    /** Daftar LP DORS yang belum termapping. */
    @UseGuards(AuthGuard)
    @Get('unmapped')
    unmapped(@Query('search') search?: string, @Query('page') page?: string, @Query('row') row?: string) {
        return this.service.listUnmapped({ search, page: page ? parseInt(page, 10) : 1, row: row ? parseInt(row, 10) : 25 });
    }

    /** Hapus SEMUA data LP DORS yang belum termapping (staging, bukan bdb_laporan_polisi). Superadmin-only. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post('unmapped/delete-all')
    deleteAllUnmapped(@Body() body: { search?: string }, @Req() req: any) {
        return this.service.deleteAllUnmapped({ search: body?.search }, req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Set tingkat kesulitan LP. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post(':id/tingkat-kesulitan')
    setTingkatKesulitan(@Param('id') id: string, @Body() body: { tingkat_kesulitan?: string }, @Req() req: any) {
        return this.service.setTingkatKesulitan(parseInt(id, 10), body?.tingkat_kesulitan, req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Set Sub Dit/Unit yang menangani (freetext manual). */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post(':id/sub-dit-penanganan')
    setSubDitPenanganan(@Param('id') id: string, @Body() body: { sub_dit_penanganan?: string }, @Req() req: any) {
        return this.service.setSubDitPenanganan(parseInt(id, 10), body?.sub_dit_penanganan, req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Tag/lepas LP ke operasi/satgas (harus berstatus AKTIF, atau null untuk melepas). */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post(':id/operasi-satgas')
    setOperasiSatgas(@Param('id') id: string, @Body() body: { operasi_satgas_id?: number | null }, @Req() req: any) {
        const v = body?.operasi_satgas_id;
        return this.service.setOperasiSatgas(parseInt(id, 10), v === undefined || v === null || v === ('' as any) ? null : Number(v), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Hapus (soft delete) LP -- wajib keterangan alasan. Superadmin-only. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post(':id/soft-delete')
    softDelete(@Param('id') id: string, @Body() body: { keterangan?: string }, @Req() req: any) {
        return this.service.softDelete(parseInt(id, 10), body?.keterangan, req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Perbaiki satker penanganan LP secara langsung (koreksi kesalahan mapping, BUKAN pelimpahan). Superadmin-only. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post(':id/correct-satker')
    correctSatker(@Param('id') id: string, @Body() body: { satker_id?: number; keterangan?: string }, @Req() req: any) {
        return this.service.correctSatker(parseInt(id, 10), Number(body?.satker_id), body?.keterangan, req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Pencarian global No. LP / nama / NIK pihak terlibat, dedup per LP. Min. 5 karakter.
     *  Route literal ini WAJIB di atas @Get(':id') -- kalau tidak, ':id' akan menangkap
     *  "search-global" sbg nilai param id duluan (urutan route NestJS berdasarkan deklarasi). */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get('search-global')
    searchGlobal(@Query('q') q: string, @Query('page') page: string, @Query('row') row: string, @Req() req: any) {
        return this.service.searchGlobal(q, req?.user?.id ? Number(req.user.id) : undefined, { page: page ? parseInt(page, 10) : 1, row: row ? parseInt(row, 10) : 25 });
    }

    /** Detail 1 LP (param = token opaque/pid). ID DORS hanya dibuka untuk superadmin. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get(':id')
    detail(@Param('id') id: string, @Req() req: any) {
        return this.service.detail(id, req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Daftar Laporan Polisi terkelola (paginasi + filter). ID DORS hanya dibuka untuk superadmin. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get()
    list(
        @Req() req: any,
        @Query('search') search?: string,
        @Query('level') level?: string,
        @Query('model') model?: string,
        @Query('status') status?: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('target_satker_id') targetSatkerId?: string,
        @Query('jenis_kejahatan_ids') jenisKejahatanIds?: string,
        @Query('golongan_kejahatan_ids') golonganKejahatanIds?: string,
        @Query('monitoring_tags') monitoringTags?: string,
        @Query('page') page?: string,
        @Query('row') row?: string
    ) {
        return this.service.list({ search, level, model, status, from, to, targetSatkerId, jenisKejahatanIds, golonganKejahatanIds, monitoringTags, page: page ? parseInt(page, 10) : 1, row: row ? parseInt(row, 10) : 25 }, req?.user?.id ? Number(req.user.id) : undefined);
    }
}
