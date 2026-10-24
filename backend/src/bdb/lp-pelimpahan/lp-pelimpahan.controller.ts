import { Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { LpPelimpahanService } from './lp-pelimpahan.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/lp-pelimpahan')
export class LpPelimpahanController {
    constructor(private readonly service: LpPelimpahanService) {}

    /** Pilihan satker tujuan internal yang valid (1 tingkat ke atas, 1 tingkat ke bawah, atau sesama tingkat) utk LP ini. */
    @Get(':lpId/allowed-targets')
    allowedTargets(@Param('lpId') lpId: string, @Req() req: any) {
        return this.service.allowedTargets(parseInt(lpId, 10), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Pilihan satker eksternal yang valid (berada di wilayah yurisdiksi yang sama / instansi pusat) utk LP ini. */
    @Get(':lpId/allowed-external-targets')
    allowedExternalTargets(@Param('lpId') lpId: string, @Req() req: any) {
        return this.service.allowedExternalTargets(parseInt(lpId, 10), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Riwayat pelimpahan 1 LP. */
    @Get(':lpId/riwayat')
    riwayat(@Param('lpId') lpId: string, @Req() req: any) {
        return this.service.riwayat(parseInt(lpId, 10), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Lakukan pelimpahan LP ke satker tujuan. */
    @Post()
    create(@Body() body: { lp_id: number; satker_tujuan_id: number; keterangan?: string; nomor_dokumen?: string; tanggal_dokumen?: string; pernyataan_tindakan?: string; alasan_tindakan?: string }, @Req() req: any) {
        return this.service.create({
            lpId: Number(body?.lp_id),
            satkerTujuanId: Number(body?.satker_tujuan_id),
            keterangan: body?.keterangan,
            nomorDokumen: body?.nomor_dokumen,
            tanggalDokumen: body?.tanggal_dokumen,
            userId: req?.user?.id ? Number(req.user.id) : undefined,
            statement: { pernyataan: body?.pernyataan_tindakan, alasan: body?.alasan_tindakan }
        });
    }

    /** Limpahkan LP ke Satker Eksternal (instansi di luar hierarki bdb_satker, mis. Kejaksaan). */
    @Post('eksternal')
    createEksternal(@Body() body: { lp_id: number; satker_eksternal_id: number; keterangan?: string; nomor_dokumen?: string; tanggal_dokumen?: string; pernyataan_tindakan?: string; alasan_tindakan?: string }, @Req() req: any) {
        return this.service.createEksternal({
            lpId: Number(body?.lp_id),
            satkerEksternalId: Number(body?.satker_eksternal_id),
            keterangan: body?.keterangan,
            nomorDokumen: body?.nomor_dokumen,
            tanggalDokumen: body?.tanggal_dokumen,
            userId: req?.user?.id ? Number(req.user.id) : undefined,
            statement: { pernyataan: body?.pernyataan_tindakan, alasan: body?.alasan_tindakan }
        });
    }

    // ===== Lampiran dokumen pelimpahan (MinIO) — literal path 2 segmen, tak bentrok dgn ':lpId' =====
    @Post(':pelimpahanId/attachments')
    @UseInterceptors(FilesInterceptor('files', 20, DOC_UPLOAD_LIMITS))
    uploadAttachments(@Param('pelimpahanId') pelimpahanId: string, @UploadedFiles() files: Array<any>, @Req() req: any) {
        const mapped = (files || []).map((f) => ({ buffer: f.buffer, originalname: f.originalname, mimetype: f.mimetype, size: f.size }));
        return this.service.addAttachments(Number(pelimpahanId), req?.user?.id ? Number(req.user.id) : undefined, mapped);
    }

    @Get(':pelimpahanId/attachments')
    listAttachments(@Param('pelimpahanId') pelimpahanId: string, @Req() req: any) {
        return this.service.listAttachments(Number(pelimpahanId), req?.user?.id ? Number(req.user.id) : undefined);
    }

    @Delete('attachments/:attId')
    removeAttachment(@Param('attId') attId: string, @Req() req: any) {
        return this.service.removeAttachment(Number(attId), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Daftar LP yang pernah dilimpahkan, di-scope ke satker yg pernah terlibat (asal/tujuan). */
    @Get('arsip')
    arsip(@Query('search') search: string | undefined, @Query('page') page: string | undefined, @Query('row') row: string | undefined, @Req() req: any) {
        return this.service.arsip({
            userId: req?.user?.id ? Number(req.user.id) : undefined,
            search,
            page: page ? parseInt(page, 10) : 1,
            row: row ? parseInt(row, 10) : 25,
        });
    }

    /** Detail arsip 1 LP (profil read-only + riwayat lengkap). */
    @Get('arsip/:lpId')
    arsipDetail(@Param('lpId') lpId: string, @Req() req: any) {
        return this.service.arsipDetail(parseInt(lpId, 10), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Batalkan pelimpahan ke instansi eksternal (mengembalikan LP ke satker penanganan internal Polri). */
    @Post(':lpId/batal-eksternal')
    batalEksternal(@Param('lpId') lpId: string, @Req() req: any) {
        return this.service.batalEksternal(parseInt(lpId, 10), req?.user?.id ? Number(req.user.id) : undefined);
    }

}
