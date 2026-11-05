import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
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

    /** Daftar Master Jenis Barang Bukti DORS untuk dropdown input manual. */
    @Get('master-jenis')
    listMasterJenis(@Query('search') search?: string) {
        return this.service.listMasterJenis(search);
    }

    /** Gabungan DORS + MANUAL utk satu LP -- dipakai tab "Barang Bukti" di halaman detail LP. */
    @Get('lp/:lpId/all')
    listByLpAll(@Req() req: any, @Param('lpId') lpId: string) {
        return this.service.listByLpAll(req.user, Number(lpId));
    }

    @Post('lp/:lpId')
    addManual(@Req() req: any, @Param('lpId') lpId: string, @Body() body: any) {
        return this.service.addManual(req.user, Number(lpId), body || {});
    }

    @Patch('manual/:id')
    updateManual(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, id, body || {});
    }

    @Put('manual/:id')
    putManual(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, id, body || {});
    }

    @Patch('dors/:id')
    updateDors(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, `dors-${String(id).replace(/^dors-/i, '')}`, body || {});
    }

    @Put('dors/:id')
    putDors(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, `dors-${String(id).replace(/^dors-/i, '')}`, body || {});
    }

    @Patch(':id')
    updateAny(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, id, body || {});
    }

    @Put(':id')
    putAny(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateManual(req.user, id, body || {});
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.service.removeManual(req.user, Number(id));
    }
}
