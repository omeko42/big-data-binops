import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { SatkerService } from './satker.service';

type SatkerBody = {
    kode?: string;
    deskripsi?: string;
    parent_id?: number;
    segment?: string;
    alamat?: string;
    provinsi?: string;
    kabupaten_kota?: string;
    kecamatan?: string;
    desa?: string;
    kode_pos?: string;
    longitude?: string;
    latitude?: string;
    keanggotaan?: string;
    fungsi?: string;
    kinerja_aktif?: boolean;
};

type SatkerProfileBody = {
    alamat?: string;
    provinsi?: string;
    kabupaten_kota?: string;
    kecamatan?: string;
    desa?: string;
    kode_pos?: string;
    longitude?: string;
    latitude?: string;
    jumlah_penduduk?: string;
};

@UseGuards(AuthGuard)
@Controller('bdb/satker')
export class SatkerController {
    constructor(private readonly service: SatkerService) {}

    /** Ringkasan (total node, kedalaman, sync terakhir). */
    @Get('stats')
    stats() {
        return this.service.stats();
    }

    /** Node akar (root POLRI) untuk treeview. */
    @Get('roots')
    roots() {
        return this.service.roots();
    }

    /** Anak langsung dari sebuah node (lazy load treeview). */
    @Get('children')
    children(@Query('parentId') parentId: string) {
        return this.service.children(parseInt(parentId, 10));
    }

    /** Jalur id root->node (pra-isi pemilih induk saat edit). */
    @Get('path')
    path(@Query('id') id: string) {
        return this.service.path(parseInt(id, 10));
    }

    /** Cari satker + jalur ke root. */
    @Get('search')
    search(@Query('q') q: string, @Query('limit') limit?: string) {
        return this.service.search(q, limit ? parseInt(limit, 10) : 50);
    }

    /** Daftar satker (grid) — paginasi + pencarian. */
    @Get('list')
    list(@Query('search') search?: string, @Query('page') page?: string, @Query('row') row?: string) {
        return this.service.list({ search, page: page ? parseInt(page, 10) : 1, row: row ? parseInt(row, 10) : 25 });
    }

    /** Data wilayah/demografi satker SENDIRI (operator/admin_binops) -- id diambil dari sesi, bukan client. */
    @UseInterceptors(CurrentUserInterceptor)
    @Get('me/profile')
    myProfile(@Req() req: any) {
        return this.service.getMyProfile(req?.user);
    }

    /** Ubah data wilayah/demografi satker SENDIRI -- hanya alamat/lokasi/jumlah_penduduk, bukan kode/hierarki. */
    @UseInterceptors(CurrentUserInterceptor)
    @Patch('me/profile')
    updateMyProfile(@Req() req: any, @Body() body: SatkerProfileBody) {
        return this.service.updateMyProfile(req?.user, body || {});
    }

    /** Tambah satker (manual). */
    @Post()
    create(@Body() body: SatkerBody) {
        return this.service.create(body || ({} as any));
    }

    /** Ubah nama / kode Puskarda / alamat & lokasi. */
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: SatkerBody) {
        return this.service.update(parseInt(id, 10), body || {});
    }

    /** Hapus satker (sub-satker naik ke induk terdekat). */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(parseInt(id, 10));
    }

    /** Toggle cepat "tampil di rekap Kinerja Perkara" langsung dari grid (tanpa buka dialog edit penuh). */
    @Patch(':id/kinerja-aktif')
    setKinerjaAktif(@Param('id') id: string, @Body() body: { kinerja_aktif?: boolean }) {
        return this.service.setKinerjaAktif(parseInt(id, 10), body?.kinerja_aktif !== false);
    }

    /** Buat admin operator utk semua satker yang belum punya (sekali jalan). */
    @Post('admins/backfill')
    backfillAdmins() {
        return this.service.backfillAdmins();
    }
}
