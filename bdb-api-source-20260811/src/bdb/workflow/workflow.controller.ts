import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { DOC_UPLOAD_LIMITS } from '../common/upload-limits';
import { WorkflowService } from './workflow.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/wf')
export class WorkflowController {
    constructor(private readonly service: WorkflowService) {}

    // ---- master status ----
    @Get('status')
    statuses() {
        return this.service.statuses();
    }
    @Post('status')
    saveStatus(@Body() body: any) {
        return this.service.saveStatus(body || {});
    }

    // ---- master pasal ----
    @Get('pasal')
    pasal(@Query('search') search?: string) {
        return this.service.pasalList(search);
    }
    @Post('pasal')
    savePasal(@Body() body: any) {
        return this.service.savePasal(body || {});
    }

    // ---- master jenis surat ----
    @Get('document-types')
    documentTypes(@Query('all') all?: string) {
        return this.service.documentTypes(all === '1' || all === 'true');
    }
    @Post('document-types')
    saveDocumentType(@Body() body: any) {
        return this.service.saveDocumentType(body || {});
    }
    @Get('document-types/:code/schema')
    schema(@Param('code') code: string) {
        return this.service.schemaByCode(code);
    }

    // ---- alur per LP ----
    @Get('lp/:id/pasal')
    lpPasal(@Param('id') id: string) {
        return this.service.lpPasal(parseInt(id, 10));
    }

    // ---- tindak pidana per LP (CRUD) ----
    @Get('lp/:id/tindak-pidana')
    tindakPidana(@Param('id') id: string) {
        return this.service.tindakPidanaList(parseInt(id, 10));
    }
    @Post('lp/:id/tindak-pidana')
    saveTindakPidana(@Param('id') id: string, @Body() body: any) {
        return this.service.saveTindakPidana(parseInt(id, 10), body || {});
    }
    @Post('lp/:id/tindak-pidana/import')
    importTindakPidana(@Param('id') id: string, @Body() body: any) {
        return this.service.importTindakPidanaFromDocs(parseInt(id, 10), Array.isArray(body?.type_codes) ? body.type_codes : body?.type_code ? [body.type_code] : []);
    }
    @Post('lp/:id/tindak-pidana/:tpId/delete')
    deleteTindakPidana(@Param('id') id: string, @Param('tpId') tpId: string) {
        return this.service.deleteTindakPidana(parseInt(id, 10), parseInt(tpId, 10));
    }
    @Get('lp/:id/available-actions')
    available(@Param('id') id: string) {
        return this.service.availableActions(parseInt(id, 10));
    }
    @Get('lp/:id/timeline')
    timeline(@Param('id') id: string) {
        return this.service.timeline(parseInt(id, 10));
    }
    @Post('lp/:id/dokumen')
    @UseInterceptors(FilesInterceptor('files', 20, DOC_UPLOAD_LIMITS))
    createDokumen(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: any[], @Req() req: any) {
        return this.service.createDokumen(parseInt(id, 10), Number(body?.document_type_id), body?.data, files || [], req?.user?.id ? Number(req.user.id) : undefined);
    }
    @Post('lp/:id/dokumen/:dokId/update')
    @UseInterceptors(FilesInterceptor('files', 20, DOC_UPLOAD_LIMITS))
    updateDokumen(@Param('id') id: string, @Param('dokId') dokId: string, @Body() body: any, @UploadedFiles() files: any[], @Req() req: any) {
        return this.service.updateDokumen(parseInt(id, 10), parseInt(dokId, 10), body?.data, files || [], body?.keep_keys, req?.user?.id ? Number(req.user.id) : undefined);
    }
    @Post('lp/:id/dokumen/:dokId/delete')
    deleteDokumen(@Param('id') id: string, @Param('dokId') dokId: string, @Req() req: any) {
        return this.service.deleteDokumen(parseInt(id, 10), parseInt(dokId, 10), req?.user?.id ? Number(req.user.id) : undefined);
    }

    /** Paksa rekonsiliasi status SELURUH LP sekarang juga (superadmin) -- normalnya jalan sendiri
     *  tiap jam (lihat @Cron di workflow.service.ts), ini utk kebutuhan mendesak/verifikasi. */
    @Post('reconcile-status')
    reconcileStatus(@Req() req: any) {
        return this.service.reconcileAllLpStatusManual(req?.user?.id ? Number(req.user.id) : undefined, req?.user?.username);
    }

    /** Kapan terakhir jalan (cron/manual) & kapan berikutnya -- dipoll UI Alur Dokumen. */
    @Get('reconcile-status/info')
    reconcileStatusInfo() {
        return this.service.reconcileStatusInfo();
    }
}
