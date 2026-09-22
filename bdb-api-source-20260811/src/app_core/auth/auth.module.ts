import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import { DeviceModule } from './device/device.module';
import { RouteModule } from './route/route.module';
import { HelperModule } from '@app_core/helper/helper.module';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { MailService } from '@app_core/helper/service/mail.service';
import { CacheCoreModule } from '@app_core/helper/module/cache.module';
import { AuditService } from 'src/bdb/audit/audit.service';
import { SystemSettingService } from 'src/bdb/system-setting/system-setting.service';

@Module({
    imports: [
        HelperModule,
        CacheCoreModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30d' }
        }),
        UserModule,
        PermissionModule,
        DeviceModule,
        RouteModule
    ],
    controllers: [AuthController],
    providers: [Auth, AuthService, AuthGuard, MailService, AuditService, SystemSettingService],
    exports: [Auth, AuthService, AuthGuard, MailService]
})
export class AuthModule {}
