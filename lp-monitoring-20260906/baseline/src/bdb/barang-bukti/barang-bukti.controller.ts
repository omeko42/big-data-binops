import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { BarangBuktiService } from './barang-bukti.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/barang-bukti')
export class BarangBuktiController {
    constructor(private readonly service: BarangBuktiService) {}

    /** Rekap lintas-LP (dipaginasi) -- dipakai halaman Rekap Barang Bukti. */
    @Get()
    list(@Req() req: any, @Query() query: any) {
        return this.service.list(req.user, query);
    }

    /** Gabungan DORS + MANUAL utk satu LP -- dipakai tab "Barang Bukti" di halaman detail LP. */
    @Get('lp/:lpId/all')
    listByLpAll(@Param('lpId') lpId: string) {
        return this.service.listByLpAll(Number(lpId));
    }

    @Post('lp/:lpId')
    addManual(@Req() req: any, @Param('lpId') lpId: string, @Body() body: any) {
        return this.service.addManual(req.user, Number(lpId), body || {});
    }

    @Patch('manual/:id')
    updateManual(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, Number(id), body || {});
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.service.removeManual(req.user, Number(id));
    }
}
