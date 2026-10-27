import { Body, Res, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { PihakTerlibatService } from './pihak-terlibat.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/pihak-terlibat')
export class PihakTerlibatController {
    constructor(private readonly service: PihakTerlibatService) {}

    @Get()
    list(@Req() req: any, @Query() query: any) {
        return this.service.list(req.user, query);
    }

    @Get('recent-global')
    recentGlobal(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.service.recentGlobal(Math.max(1, Number(page || 1)), Math.max(1, Math.min(Number(limit || 20), 100)));
    }

    @Get('ranking')
    ranking(@Req() req: any, @Query() query: any) {
        return this.service.ranking(req.user, query);
    }

    @Get('laporan-by-nik/:nik')
    getLaporanByNik(@Req() req: any, @Param('nik') nik: string, @Query() query: any) {
        return this.service.getLaporanByNik(req.user, nik, query);
    }

    @Get('lp/:lpId')
    listByLp(@Req() req: any, @Param('lpId') lpId: string) {
        return this.service.listByLp(req.user, Number(lpId));
    }

    /** Gabungan DORS + MANUAL utk satu LP -- dipakai tab "Pihak Terlibat" di halaman detail LP. */
    @Get('lp/:lpId/all')
    listByLpAll(@Req() req: any, @Param('lpId') lpId: string) {
        return this.service.listByLpAll(req.user, Number(lpId));
    }

    @Post('lp/:lpId')
    @UseInterceptors(FileInterceptor('file', DOC_UPLOAD_LIMITS))
    addManual(@Req() req: any, @Param('lpId') lpId: string, @Body() body: any, @UploadedFile() file: any) {
        const mapped = file ? { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype, size: file.size } : undefined;
        return this.service.addManual(req.user, Number(lpId), body || {}, mapped);
    }

    @Patch('dors/:id')
    updateDors(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.updateDors(req.user, Number(id), body || {});
    }

    @Patch('manual/:id')
    @UseInterceptors(FileInterceptor('file', DOC_UPLOAD_LIMITS))
    updateManual(@Req() req: any, @Param('id') id: string, @Body() body: any, @UploadedFile() file: any) {
        const mapped = file ? { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype, size: file.size } : undefined;
        return this.service.updateManual(req.user, Number(id), body || {}, mapped);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.service.removeManual(req.user, Number(id));
    }

    @Get('dpo/:id/arsip')
    getDpoArsip(@Param('id') id: string, @Res() res: any) {
        return this.service.getDpoArsip(Number(id), res);
    }

    @Get('dpo/:id/foto')
    getDpoFoto(@Param('id') id: string, @Res() res: any) {
        return this.service.getDpoFoto(Number(id), res);
    }
}
