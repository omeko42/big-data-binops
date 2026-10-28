import { BadRequestException, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Res, Req, UsePipes, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ReviewUserApprovalDto, SelfDeactivateDto, UpdateUserDto } from './dto/updateUser.dto';
import { RouteName } from '../route/route-name.decorator';
import { ApplyFiltersDto } from '@app_core/helper/helperTable.dto';
import { CoreController, Route } from '@app_core/helper/service/coreController.helper.service';
import { RoleInternalMiddleware } from '@bareskrim/midleware/internal-role.middleware';
import { CurrentUser } from '@app_core/helper/decoration/current-user.decorator';
import { CurrentUserInterceptor } from '@app_core/helper/interceptor/current-user.interceptor';

@CoreController('master-user', 'user')
@UseGuards(RoleInternalMiddleware)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('management-user')
    @Route({ name: 'master.manajemen pengguna (akun user)', parent: 'master' })
    async managementDataMaster(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        return res.sendSuccess('module');
    }

    @Post()
    @Route({ name: 'master.manajemen pengguna (akun user).create', parent: 'master.manajemen pengguna (akun user)' })
    async create(@CurrentUser() authUser, @Body() createUserDto: CreateUserDto, @Res() res) {
        const results = await this.userService.create(createUserDto, authUser);
        return res.sendSuccess(results);
    }

    @Get()
    @Route({ name: 'master.manajemen pengguna (akun user).index', parent: 'master.manajemen pengguna (akun user)' })
    async findAll(@Query() query: ApplyFiltersDto, @Res() res, @Req() req) {
        let results = await this.userService.findAll(req);
        return res.sendSuccess(results);
    }

    @Get('check-availability')
    @Route({ name: 'master.manajemen pengguna (akun user).check availability', parent: 'master.manajemen pengguna (akun user)' })
    async checkAvailability(@Query('field') field: string, @Query('value') value: string, @Query('exclude') exclude: string, @Res() res) {
        if (field !== 'username' && field !== 'email_polri') return res.sendSuccess({ available: true });
        const result = await this.userService.checkIdentifierAvailability(field, value, exclude ? Number(exclude) : undefined);
        return res.sendSuccess(result);
    }

    /** Unduh template Excel kosong (+ sheet Petunjuk) utk Import Massal Pengguna. */
    @Get('bulk-import/template')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk import template', parent: 'master.manajemen pengguna (akun user)' })
    async bulkImportTemplate(@Res() res: Response) {
        const buf = await this.userService.buildImportTemplateBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="template-import-pengguna.xlsx"');
        return res.send(buf);
    }

    /** Validasi file Excel (blm menyimpan apa pun) -- hasilnya ditinjau admin sblm klik Import.
     *  FileInterceptor TIDAK dipasang di sini lagi -- @Route di bawah sudah otomatis memasangnya
     *  (dgn limit yg sama, lihat DEFAULT_FILE_LIMITS di coreController.helper.service.ts). Dobel
     *  interceptor sebelumnya bikin "Multipart: Unexpected end of form" (2 multer baca stream yg
     *  sama, cuma bisa dibaca sekali). */
    @Post('bulk-import/preview')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk import preview', parent: 'master.manajemen pengguna (akun user)' })
    async bulkImportPreview(@CurrentUser() authUser, @UploadedFile() file: any, @Res() res) {
        if (!file) throw new BadRequestException('File Excel wajib diunggah.');
        const result = await this.userService.previewBulkImport(file.buffer, authUser);
        return res.sendSuccess(result);
    }

    /** Eksekusi commit: buat akun utk baris yg sudah lolos preview & dikonfirmasi admin. */
    @Post('bulk-import/commit')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk import commit', parent: 'master.manajemen pengguna (akun user)' })
    async bulkImportCommit(@CurrentUser() authUser, @Body() body: { rows?: any[] }, @Res() res) {
        const result = await this.userService.commitBulkImport(body?.rows || [], authUser);
        return res.sendSuccess(result);
    }

    /** Reset password SATU akun + kirim kredensial baru ke emailnya (tombol per-baris di Data Pengguna). */
    @Post(':id/reset-password-email')
    @Route({ name: 'master.manajemen pengguna (akun user).reset password kirim email', parent: 'master.manajemen pengguna (akun user)' })
    async resetPasswordEmail(@CurrentUser() authUser, @Param('id') id: string, @Res() res) {
        const result = await this.userService.resetPasswordAndNotify(+id, authUser);
        return res.sendSuccess(result);
    }

    /** Jumlah akun yg akan kena kalau reset massal dimulai -- dipakai layar konfirmasi. Superadmin only. */
    @Get('bulk-reset-password/preview')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk reset password preview', parent: 'master.manajemen pengguna (akun user)' })
    async bulkResetPasswordPreview(@CurrentUser() authUser, @Res() res) {
        return res.sendSuccess(await this.userService.getBulkPasswordResetPreviewCount(authUser));
    }

    /** Mulai proses reset password + kirim email massal (background job, balas langsung dgn jobId). Superadmin only. */
    @Post('bulk-reset-password/start')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk reset password start', parent: 'master.manajemen pengguna (akun user)' })
    async bulkResetPasswordStart(@CurrentUser() authUser, @Res() res) {
        return res.sendSuccess(await this.userService.startBulkPasswordReset(authUser));
    }

    /** Job reset massal terakhir -- dipakai utk resume polling kalau dialog dibuka ulang. Superadmin only. */
    @Get('bulk-reset-password/status/latest')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk reset password status latest', parent: 'master.manajemen pengguna (akun user)' })
    async bulkResetPasswordLatest(@CurrentUser() authUser, @Res() res) {
        return res.sendSuccess(await this.userService.getLatestBulkPasswordResetJob(authUser));
    }

    @Get('bulk-reset-password/status/:jobId')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk reset password status', parent: 'master.manajemen pengguna (akun user)' })
    async bulkResetPasswordStatus(@CurrentUser() authUser, @Param('jobId') jobId: string, @Res() res) {
        return res.sendSuccess(await this.userService.getBulkPasswordResetJob(+jobId, authUser));
    }

    @Get('bulk-reset-password/status/:jobId/items')
    @Route({ name: 'master.manajemen pengguna (akun user).bulk reset password items', parent: 'master.manajemen pengguna (akun user)' })
    async bulkResetPasswordItems(@CurrentUser() authUser, @Param('jobId') jobId: string, @Query('page') page: string, @Query('row') row: string, @Query('onlyFailed') onlyFailed: string, @Res() res) {
        return res.sendSuccess(await this.userService.getBulkPasswordResetItems(+jobId, { page, row, onlyFailed: onlyFailed === 'true' }, authUser));
    }

    @Get('approval-queue')
    @Route({ name: 'master.manajemen pengguna (akun user).approval queue', parent: 'master.manajemen pengguna (akun user)' })
    async approvalQueue(@CurrentUser() authUser, @Res() res) {
        return res.sendSuccess(await this.userService.approvalQueue(authUser));
    }

    @Patch('approval/:id')
    @Route({ name: 'master.manajemen pengguna (akun user).approval review', parent: 'master.manajemen pengguna (akun user)' })
    async reviewApproval(@CurrentUser() authUser, @Param('id') id: string, @Body() dto: ReviewUserApprovalDto, @Res() res) {
        return res.sendSuccess(await this.userService.reviewApproval(authUser, +id, dto));
    }

    /** Lihat profil sendiri (siapa pun) -- termasuk foto profil, satker, role. */
    @Get('me/profile')
    @Route({ name: 'master.manajemen pengguna (akun user).lihat profil sendiri', parent: 'master.manajemen pengguna (akun user)' })
    async getOwnProfile(@CurrentUser() authUser, @Res() res) {
        const result = await this.userService.getOwnProfile(authUser);
        return res.sendSuccess(result);
    }

    /** Edit profil sendiri (siapa pun) -- hanya data personil non-sensitif, bukan role/scope/status. */
    @Patch('me/profile')
    @Route({ name: 'master.manajemen pengguna (akun user).edit profil sendiri', parent: 'master.manajemen pengguna (akun user)' })
    async updateOwnProfile(@CurrentUser() authUser, @Body() dto: any, @UploadedFile() file: any, @Res() res) {
        const result = await this.userService.updateOwnProfile(authUser, dto, file);
        return res.sendSuccess(result);
    }

    @Post('me/deactivate')
    @Route({ name: 'master.manajemen pengguna (akun user).self deactivate', parent: 'master.manajemen pengguna (akun user)' })
    async selfDeactivate(@CurrentUser() authUser, @Body() dto: SelfDeactivateDto, @Res() res) {
        const payload = await this.userService.validateEmailOtp(dto.otp_id, dto.otp_token);
        if (payload?.action && payload.action !== 'self_deactivate') {
            throw new BadRequestException({ errors: { otp_token: ['OTP tidak sesuai untuk tindakan ini'] } });
        }
        if (payload?.user_id && Number(payload.user_id) !== Number(authUser.id)) {
            throw new BadRequestException({ errors: { otp_token: ['OTP tidak sesuai untuk akun ini'] } });
        }
        return res.sendSuccess(await this.userService.selfDeactivate(authUser, dto.reason));
    }

    @Get('reset-totp/:email')
    @Route({ name: 'master.manajemen pengguna (akun user).reset totp', parent: 'master.manajemen pengguna (akun user)' })
    async resetTotp(@CurrentUser() authUser, @Param('email') email: string, @Res() res, @Req() req) {
        let results = await this.userService.resetTotp(email, authUser);
        return res.sendSuccess(results);
    }
    @Get(':id')
    @Route({ name: 'master.manajemen pengguna (akun user).show', parent: 'master.manajemen pengguna (akun user)' })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @Route({ name: 'master.manajemen pengguna (akun user).update', parent: 'master.manajemen pengguna (akun user)' })
    update(@CurrentUser() authUser, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto, authUser);
    }

    @Delete(':id')
    @Route({ name: 'master.manajemen pengguna (akun user).delete', parent: 'master.manajemen pengguna (akun user)' })
    async remove(@CurrentUser() authUser, @Param('id') id: string, @Res() res) {
        const results = await this.userService.remove(+id, authUser);
        return res.sendSuccess(results);
    }

    @Post(':id/request-deletion')
    @Route({ name: 'master.manajemen pengguna (akun user).request deletion', parent: 'master.manajemen pengguna (akun user)' })
    async requestDeletion(@CurrentUser() authUser, @Param('id') id: string, @Body() body: { type: string; reason: string }, @Res() res) {
        const results = await this.userService.requestDeletion(+id, body, authUser);
        return res.sendSuccess(results);
    }

    @Post(':id/review-deletion')
    @Route({ name: 'master.manajemen pengguna (akun user).review deletion', parent: 'master.manajemen pengguna (akun user)' })
    async reviewDeletion(@CurrentUser() authUser, @Param('id') id: string, @Body() body: { action: string }, @Res() res) {
        const results = await this.userService.reviewDeletion(+id, body, authUser);
        return res.sendSuccess(results);
    }

    
    @Get(':id/activity-detail')
    @Route({ name: 'master.manajemen pengguna (akun user).activity detail', parent: 'master.manajemen pengguna (akun user)' })
    async getActivityDetail(@Param('id') id: string, @Res() res) {
        const results = await this.userService.getUserActivityDetail(+id);
        return res.sendSuccess(results);
    }

    @Post(':id/mutate')
    @Route({ name: 'master.manajemen pengguna (akun user).mutate', parent: 'master.manajemen pengguna (akun user)' })
    async mutateUser(@CurrentUser() authUser, @Param('id') id: string, @Body() body: any, @Res() res) {
        const results = await this.userService.mutateUser(+id, body, authUser);
        return res.sendSuccess(results);
    }

    @Get(':id/mutations')
    @Route({ name: 'master.manajemen pengguna (akun user).mutations', parent: 'master.manajemen pengguna (akun user)' })
    async getMutations(@Param('id') id: string, @Res() res) {
        const results = await this.userService.getUserMutations(+id);
        return res.sendSuccess(results);
    }
}
