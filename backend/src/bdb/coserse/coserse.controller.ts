import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Optional,
    Param,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '../../app_core/auth/auth.guard';
import { CurrentUserInterceptor } from '../../app_core/helper/interceptor/current-user.interceptor';
import { CoserseDocParserService } from './coserse-doc-parser.service';
import { CoserseService } from './coserse.service';
import {
    CommitMindikDraftRequestDto,
    CoserseChatRequestDto,
    CoserseTokenBoostRequestDto,
    ProfilePersonRequestDto
} from './dto/profile-query.dto';

@UseGuards(AuthGuard)
@UseInterceptors(CurrentUserInterceptor)
@Controller('bdb/coserse')
export class CoserseController {
    constructor(
        private readonly service: CoserseService,
        @Optional() private readonly docParser?: CoserseDocParserService
    ) {}

    @Get('health')
    health() {
        return this.service.healthStatus();
    }

    @Get('profile')
    profileGet(@Req() req: any, @Query() query: ProfilePersonRequestDto) {
        return this.service.profilePersonInvolvement(req?.user, query || {}, this.extractIp(req));
    }

    @Post('profile')
    profilePost(@Req() req: any, @Body() body: ProfilePersonRequestDto) {
        return this.service.profilePersonInvolvement(req?.user, body || {}, this.extractIp(req));
    }

    @Post('ask')
    ask(@Req() req: any, @Body() body: CoserseChatRequestDto) {
        return this.service.askCoserse(req?.user, body || ({} as CoserseChatRequestDto), this.extractIp(req));
    }

    @Post('ask/stream')
    askStream(@Req() req: any, @Body() body: CoserseChatRequestDto, @Res() res: any) {
        return this.service.askCoserseStream(
            req?.user,
            body || ({} as CoserseChatRequestDto),
            res,
            this.extractIp(req)
        );
    }

    @Get('quota')
    quota(@Req() req: any, @Query('session_id') sessionId?: string) {
        return this.service.getQuotaStatus(req?.user, sessionId || 'default');
    }

    @Get('sessions')
    listSessions(@Req() req: any) {
        return this.service.listUserSessions(req?.user);
    }

    @Get('sessions/:id/messages')
    getSessionMessages(@Req() req: any, @Param('id') sessionId: string) {
        return this.service.getSessionMessages(req?.user, sessionId);
    }

    @Delete('session')
    purgeSession(@Req() req: any, @Query('session_id') sessionId?: string) {
        return this.service.purgeUserSession(req?.user, sessionId || 'default', this.extractIp(req));
    }

    @Delete('sessions')
    purgeAllSessions(@Req() req: any) {
        return this.service.purgeAllUserSessions(req?.user, this.extractIp(req));
    }

    @Post('quota/boost')
    boostQuota(@Req() req: any, @Body() body: CoserseTokenBoostRequestDto) {
        return this.service.grantEmergencyBoost(
            req?.user,
            body || ({} as CoserseTokenBoostRequestDto),
            this.extractIp(req)
        );
    }

    @Post('feedback')
    recordFeedback(
        @Req() req: any,
        @Body() body: { session_id?: string; message_id?: string; rating?: string }
    ) {
        return this.service.recordMessageFeedback(req?.user, body || {}, this.extractIp(req));
    }

    @Post('document/parse')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 15 * 1024 * 1024 }
        })
    )
    parseDocument(
        @Req() req: any,
        @UploadedFile() file: Express.Multer.File,
        @Body('hint_text') hintText?: string
    ) {
        if (!this.docParser) {
            throw new BadRequestException('CoserseDocParserService belum terpasang.');
        }
        if (!file || !file.buffer) {
            throw new BadRequestException('Pilih, drag-and-drop, atau tempel (Ctrl+V) file dokumen terlebih dahulu.');
        }
        return this.docParser.parseDocumentInRam({
            authUser: req?.user,
            fileBuffer: file.buffer,
            originalName: file.originalname || 'dokumen-mindik',
            mimeType: file.mimetype || 'application/octet-stream',
            hintText,
            clientIp: this.extractIp(req)
        });
    }

    @Post('document/commit')
    commitDocument(@Req() req: any, @Body() body: CommitMindikDraftRequestDto) {
        if (!this.docParser) {
            throw new BadRequestException('CoserseDocParserService belum terpasang.');
        }
        return this.docParser.commitDocumentDraft(
            req?.user,
            body || ({} as CommitMindikDraftRequestDto),
            this.extractIp(req)
        );
    }

    @Post('document/commit-batch')
    commitDocumentBatch(@Req() req: any, @Body() body: any) {
        if (!this.docParser) {
            throw new BadRequestException('CoserseDocParserService belum terpasang.');
        }
        return this.docParser.commitBatchUpdateLp(req?.user, body || {}, this.extractIp(req));
    }

    private extractIp(req: any): string {
        const xff = req?.headers?.['x-forwarded-for'];
        if (typeof xff === 'string' && xff.trim()) {
            return xff.split(',')[0].trim();
        }
        return req?.ip || req?.connection?.remoteAddress || '';
    }
}
