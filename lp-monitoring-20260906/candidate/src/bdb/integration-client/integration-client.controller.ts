import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';
import { IntegrationClientService } from './integration-client.service';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/integration-client')
export class IntegrationClientController {
    constructor(private readonly service: IntegrationClientService) {}

    @Get('scopes')
    scopes(@Req() req: any) {
        return this.service.scopesRegistry(req.user);
    }

    @Get('access-log')
    accessLog(@Req() req: any, @Query() query: { search?: string; page?: string; row?: string }) {
        return this.service.accessLog(req.user, query);
    }

    @Get()
    list(@Req() req: any, @Query('search') search?: string) {
        return this.service.list(req.user, search);
    }

    @Post()
    create(@Req() req: any, @Body() body: any) {
        return this.service.create(req.user, body || {});
    }

    @Post(':id/regenerate-secret')
    regenerateSecret(@Req() req: any, @Param('id') id: string, @Body() body: { password?: string }) {
        return this.service.regenerateSecret(req.user, parseInt(id, 10), body?.password);
    }

    @Post(':id/scopes')
    updateScopes(@Req() req: any, @Param('id') id: string, @Body() body: { allowed_scopes?: string[] }) {
        return this.service.updateScopes(req.user, parseInt(id, 10), body?.allowed_scopes || []);
    }

    @Post(':id/status')
    updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status?: string }) {
        return this.service.updateStatus(req.user, parseInt(id, 10), body?.status || '');
    }

    @Post(':id/delete')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.service.remove(req.user, parseInt(id, 10));
    }

    /** Simulasikan panggilan klien ini dari CMS (tanpa perlu password asli) -- lihat hasilnya. */
    @Post(':id/test')
    testCall(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.testCall(req.user, parseInt(id, 10), body || {});
    }

    /**
     * Dokumentasi API PDF khusus klien ini (isi sesuai scope-nya saat ini). Ini SEKALIAN membuat
     * ulang password API klien & menyertakannya di dalam PDF yg terkunci -- password lama klien
     * langsung tidak berlaku begitu endpoint ini dipanggil (sama spt regenerate-secret).
     */
    @Post(':id/docs/generate')
    async generateDocs(@Req() req: any, @Param('id') id: string, @Body() body: { password?: string }, @Res() res: Response) {
        const { buffer, pdfPassword, apiPassword, filename } = await this.service.generateDocumentation(req.user, parseInt(id, 10), body?.password);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('X-Doc-Password', pdfPassword);
        res.setHeader('X-Api-Password', apiPassword);
        res.setHeader('Access-Control-Expose-Headers', 'X-Doc-Password, X-Api-Password, Content-Disposition');
        res.send(buffer);
    }
}
