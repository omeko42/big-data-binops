import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { MailService } from '@app_core/helper/service/mail.service';
import { AuditService } from 'src/bdb/audit/audit.service';

@Module({
    controllers: [UserController],
    providers: [Auth, UserService, MailService, AuditService],
    exports: [Auth, UserService]
})
export class UserModule {}
