import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { DpoService } from './dpo.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/dpo')
export class DpoController {
    constructor(private readonly service: DpoService) {}

    @Get('stats')
    stats(@Req() req: any) {
        return this.service.stats(req?.user);
    }

    @Get()
    list(@Req() req: any, @Query() query: any) {
        return this.service.list(req?.user, query || {});
    }

    @Get(':id')
    detail(@Param('id') id: string) {
        return this.service.detail(Number(id));
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 },
        { name: 'dokumen', maxCount: 1 }
    ], DOC_UPLOAD_LIMITS))
    create(@Req() req: any, @Body() body: any, @UploadedFiles() files: { foto?: any[]; dokumen?: any[] }) {
        return this.service.create(req?.user, body || {}, {
            foto: files?.foto?.[0],
            dokumen: files?.dokumen?.[0]
        });
    }

    @Post(':id/cabut')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'dokumen', maxCount: 1 }
    ], DOC_UPLOAD_LIMITS))
    cabut(@Req() req: any, @Param('id') id: string, @Body() body: any, @UploadedFiles() files: { dokumen?: any[] }) {
        return this.service.cabut(req?.user, Number(id), body || {}, files?.dokumen?.[0]);
    }

    @Post(':id/link-lp')
    linkLp(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.linkLp(req?.user, Number(id), body || {});
    }
}
