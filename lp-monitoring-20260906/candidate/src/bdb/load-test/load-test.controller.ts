import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { LoadTestService } from './load-test.service';

/**
 * Uji beban (load test) -- superadmin-only. Dibuat khusus utk membuktikan angka kapasitas dari
 * audit performa 2026-08-05 (256 koneksi DB, PM2 instances tetap, dst) TANPA perlu tool
 * command-line terpisah (k6/autocannon manual) -- lihat percakapan sesi ini.
 *
 * PENTING soal keamanan/blast-radius -- ini BUKAN endpoint biasa, WAJIB dijaga ketat krn menembak
 * beban nyata ke server produksi sungguhan (aplikasi ini cuma py 3 server: web/api/db, TIDAK ADA
 * staging terpisah -- keputusan sadar user, bukan kelalaian):
 *  - Target dikunci allowlist di load-test.service.ts (TARGET_ALLOWLIST) -- TIDAK BISA diarahkan
 *    ke URL bebas dari body request. Cuma endpoint GET baca-saja yg boleh masuk daftar itu.
 *  - concurrency & duration di-clamp KERAS di service (maks 1000 koneksi / 60 detik) -- parameter
 *    dari user cuma memilih ANGKA DI DALAM batas itu (utk pembuktian angka spesifik, mis. tes
 *    persis di 500 sesuai skenario yg didiskusikan), bukan lepas tanpa batas.
 *  - Superadmin-only (dicek scope.isSuper di service, pola sama spt endpoint sensitif lain di app
 *    ini, mis. laporan-polisi soft-delete).
 *  - POST -- otomatis kecatat GlobalAuditInterceptor (siapa/kapan/parameter apa), tak perlu
 *    audit.log() manual terpisah.
 *  - Beban ditembak ke localhost server API itu sendiri (bukan lewat reverse-proxy publik) --
 *    tetap lewat AuthGuard & seluruh pipeline NestJS sungguhan (pakai token sesi superadmin yg
 *    menjalankan, bukan bypass), cuma TIDAK ikut menguji lapisan reverse-proxy/jaringan publik.
 */
@Controller('bdb/load-test')
export class LoadTestController {
    constructor(private readonly service: LoadTestService) {}

    /** Dipoll UI tiap ~1 detik sebelum/saat/sesudah uji beban jalan -- ringan (2 query cepat), aman
     *  dipanggil sesering itu. */
    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Get('koneksi')
    async koneksi(@Req() req: any) {
        const data = await this.service.koneksiInfo(req?.user?.id ? Number(req.user.id) : undefined);
        return { status: 1, data };
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(CurrentUserInterceptor)
    @Post('run')
    async run(@Body() body: { target?: string; concurrency?: number; duration_detik?: number; alasan?: string; password?: string }, @Req() req: any) {
        const token = (req.headers?.authorization || '').replace(/^Bearer\s+/i, '');
        const data = await this.service.run(
            req?.user?.id ? Number(req.user.id) : undefined,
            req?.user?.username,
            body?.target || 'laporan_polisi_list',
            Number(body?.concurrency),
            Number(body?.duration_detik),
            body?.alasan,
            body?.password,
            token
        );
        return { status: 1, data, message: 'Uji beban selesai.' };
    }
}
