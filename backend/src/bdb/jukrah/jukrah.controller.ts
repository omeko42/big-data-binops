import { 
    Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, 
    UploadedFiles, UseGuards, UseInterceptors 
} from '@nestjs/common';
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

    // =========================================================================
    // 0 DATA LEAKAGE: TOKENIZED MEDIA STREAMING (Akses Terenkripsi & Berbatas Waktu)
    // =========================================================================
    @Get('stream/:token')
    streamMedia(@Param('token') token: string, @Res() res: any) {
        return this.service.streamMedia(token, res);
    }

    // =========================================================================
    // SHARE LINK BERHASH & PORTAL VERIFIKASI EKSTERNAL ("SIAPA KAMU?")
    // =========================================================================
    @Get('share-challenge')
    getShareChallenge(@Query('token') token?: string, @Query('id') id?: string) {
        return this.service.getShareChallenge(token, id ? parseInt(id, 10) : undefined);
    }

    @Post('verify-share')
    verifyShareViewer(@Req() req: any, @Body() body: any) {
        const ip = String(req.headers?.['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '');
        const userAgent = String(req.headers?.['user-agent'] || '');
        return this.service.verifyShareViewer(body || {}, { ip, userAgent });
    }

    @Get('shared/:token')
    getSharedPost(@Req() req: any, @Param('token') token: string) {
        return this.service.getSharedPost(req?.user, token);
    }

    // =========================================================================
    // JUKRAHCASTER SOCIAL FEED & POSTS
    // =========================================================================
    @Get('feed')
    getFeed(@Req() req: any, @Query() q: Record<string, any>) {
        return this.service.getFeed(req?.user, q || {});
    }

    @Post('post')
    @UseInterceptors(FilesInterceptor('files', 5, { limits: { fileSize: 20 * 1024 * 1024 } }))
    createSocialPost(@Req() req: any, @Body() body: any, @UploadedFiles() files: any[]) {
        let targetSatkers: number[] = [];
        if (body.target_satker_ids) {
            try {
                targetSatkers = typeof body.target_satker_ids === 'string' ? JSON.parse(body.target_satker_ids) : body.target_satker_ids;
            } catch {
                targetSatkers = [];
            }
        }
        let caseLps: string[] = [];
        if (body.case_lp_ids) {
            try {
                caseLps = typeof body.case_lp_ids === 'string' ? JSON.parse(body.case_lp_ids) : body.case_lp_ids;
            } catch {
                caseLps = [];
            }
        }

        return this.service.createSocialPost(
            req?.user, 
            {
                content: body.content,
                audience_type: body.audience_type,
                target_satker_ids: targetSatkers,
                case_lp_ids: caseLps,
                is_official_jukrah: body.is_official_jukrah,
                is_pinned: body.is_pinned,
                parent_post_id: body.parent_post_id ? parseInt(body.parent_post_id, 10) : undefined
            }, 
            files || []
        );
    }

    @Get('network/users')
    getNetworkUsers(@Req() req: any, @Query() q: Record<string, any>) {
        return this.service.getNetworkUsers(req?.user, q || {});
    }

    @Get('network/profile/:id')
    getNetworkProfile(@Req() req: any, @Param('id') id: string) {
        return this.service.getNetworkProfile(req?.user, id);
    }

    @Post('follow/:id')
    toggleFollow(@Req() req: any, @Param('id') id: string) {
        return this.service.toggleFollowUser(req?.user, parseInt(id, 10));
    }

    @Post('network/connect/:id')
    connectNetworkUser(@Req() req: any, @Param('id') id: string) {
        return this.service.connectNetworkUser(req?.user, parseInt(id, 10));
    }

    @Post('network/disconnect/:id')
    disconnectNetworkUser(@Req() req: any, @Param('id') id: string) {
        return this.service.disconnectNetworkUser(req?.user, parseInt(id, 10));
    }

    @Get('messages/conversations')
    getMessageConversations(@Req() req: any, @Query() q: Record<string, any>) {
        return this.service.getMessageConversations(req?.user, q || {});
    }

    @Get('messages/thread/:targetId')
    getMessageThread(@Req() req: any, @Param('targetId') targetId: string) {
        return this.service.getMessageThread(req?.user, parseInt(targetId, 10));
    }

    @Post('messages/send')
    sendMessage(@Req() req: any, @Body() body: any) {
        return this.service.sendSocialMessage(req?.user, body || {});
    }

    @Get('insight')
    getAccountInsight(@Req() req: any) {
        return this.service.getAccountInsight(req?.user);
    }

    @Get('pusat-bantuan-cards')
    getPusatBantuanCards(@Req() req: any) {
        return this.service.getPusatBantuanCards(req?.user);
    }

    @Get('post/:id/reactions')
    getPostReactions(@Req() req: any, @Param('id') id: string) {
        return this.service.getPostReactions(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/bookmark')
    toggleBookmark(@Req() req: any, @Param('id') id: string) {
        return this.service.toggleBookmark(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/edit')
    editSocialPost(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.editPost(req?.user, parseInt(id, 10), body || {});
    }

    @Post('post/:id/repost')
    repostSocialPost(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.repostPost(req?.user, parseInt(id, 10), body?.content);
    }

    @Post('post/:id/reaction')
    reactPost(@Req() req: any, @Param('id') id: string, @Body('reaction_type') reactionType: string) {
        return this.service.reactPost(req?.user, parseInt(id, 10), reactionType || 'like');
    }

    @Get('post/:id/comments')
    getComments(@Req() req: any, @Param('id') id: string) {
        return this.service.getComments(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/comment')
    addComment(@Req() req: any, @Param('id') id: string, @Body('content') content: string, @Body('parent_id') parentId?: string) {
        return this.service.addComment(req?.user, parseInt(id, 10), content, parentId ? parseInt(parentId, 10) : undefined);
    }

    @Delete('comment/:id')
    deleteComment(@Req() req: any, @Param('id') id: string) {
        return this.service.deleteComment(req?.user, parseInt(id, 10));
    }

    @Post('comment/:id/edit')
    editCommentPost(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.editComment(req?.user, parseInt(id, 10), body?.content);
    }

    @Patch('comment/:id')
    editCommentPatch(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.editComment(req?.user, parseInt(id, 10), body?.content);
    }

    @Post('comment/:id/reaction')
    reactComment(@Req() req: any, @Param('id') id: string) {
        return this.service.reactComment(req?.user, parseInt(id, 10));
    }

    @Post('comment/:id/like')
    likeComment(@Req() req: any, @Param('id') id: string) {
        return this.service.reactComment(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/acknowledge')
    acknowledgePost(@Req() req: any, @Param('id') id: string) {
        return this.service.acknowledgePost(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/visibility')
    updateVisibility(@Req() req: any, @Param('id') id: string, @Body('audience_type') aud: string) {
        return this.service.updateVisibility(req?.user, parseInt(id, 10), aud);
    }

    @Post('post/:id/delete')
    deleteSocialPost(@Req() req: any, @Param('id') id: string) {
        return this.service.deletePost(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/report')
    reportSocialPost(@Req() req: any, @Param('id') id: string, @Body('reason') reason: string) {
        return this.service.reportPost(req?.user, parseInt(id, 10), reason);
    }

    @Post('post/:id/panic-takedown')
    panicTakedown(@Req() req: any, @Param('id') id: string) {
        return this.service.panicTakedown(req?.user, parseInt(id, 10));
    }

    @Post('post/:id/toggle-official')
    toggleOfficialJukrah(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.toggleOfficialJukrah(req?.user, parseInt(id, 10), body?.is_official_jukrah);
    }

    @Post('post/:id/toggle-pin')
    togglePinPost(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.service.togglePinPost(req?.user, parseInt(id, 10), body?.is_pinned);
    }

    // =========================================================================
    // NOTIFIKASI DWI-FUNGSI: TAB DINAS & TAB SOSIAL
    // =========================================================================
    @Get('notifications')
    getNotifications(@Req() req: any, @Query('category') category: string) {
        return this.service.getNotifications(req?.user, category);
    }

    @Post('notifications/:id/read')
    markNotificationRead(@Req() req: any, @Param('id') id: string) {
        return this.service.markNotificationRead(req?.user, parseInt(id, 10));
    }

    @Post('notifications/read-all')
    markAllNotificationsRead(@Req() req: any, @Body('category') category: string) {
        return this.service.markAllNotificationsRead(req?.user, category || 'social');
    }

    // =========================================================================
    // WIDGET 1 BARIS DASHBOARD UTAMA
    // =========================================================================
    @Get('dashboard-widgets')
    getDashboardWidgets(@Req() req: any) {
        return this.service.getDashboardWidgets(req?.user);
    }

    // =========================================================================
    // ANALITIK KETERBACAAN SATKER (Admin / Kelola Jukrahcaster)
    // =========================================================================
    @Get('report/:id')
    getJukrahReadReport(@Req() req: any, @Param('id') id: string) {
        return this.service.getJukrahReadReport(req?.user, parseInt(id, 10));
    }

    // =========================================================================
    // LEGACY BULLETIN ENDPOINTS (Daftar kelola, list active, dll)
    // =========================================================================
    @Get()
    list(@Query() q: Record<string, any>) {
        return this.service.list(q || {});
    }

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
