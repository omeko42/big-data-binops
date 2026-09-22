import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { JukrahService } from './jukrah.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/jukrah')
export class JukrahController {
    constructor(private readonly service: JukrahService) {}

    // Daftar kelola (admin)
    @Get()
    list(@Query() q: Record<string, any>) {
        return this.service.list(q || {});
    }

    // Daftar untuk semua user (hanya aktif) — mencatat view
    @Get('active')
    active(@Req() req: any, @Query() q: Record<string, any>) {
        return this.service.active(req?.user, q || {});
    }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 1, DOC_UPLOAD_LIMITS))
    create(@Req() req: any, @Body() body: any, @UploadedFiles() files: any[]) {
        return this.service.create(req?.user, body || {}, files?.[0]);
    }

    @Post(':id/update')
    @UseInterceptors(FilesInterceptor('files', 1, DOC_UPLOAD_LIMITS))
    update(@Req() req: any, @Param('id') id: string, @Body() body: any, @UploadedFiles() files: any[]) {
        return this.service.update(req?.user, parseInt(id, 10), body || {}, files?.[0], body?.keep_lampiran);
    }

    @Post(':id/delete')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.service.remove(req?.user, parseInt(id, 10));
    }
}
