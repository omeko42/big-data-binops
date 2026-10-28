import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { Auth } from '@app_core/helper/service/auth.helper.service';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Device } from './device/entities/device.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly dataSource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const reqObj = context.switchToHttp().getRequest();
        if (
            reqObj.url &&
            (((reqObj.url.includes('/dpo/') || reqObj.url.includes('/pihak-terlibat/')) &&
                (reqObj.url.includes('/arsip') || reqObj.url.includes('/foto'))) ||
                reqObj.url.includes('/bdb/jukrah/stream/') ||
                reqObj.url.includes('/bdb/jukrah/share-challenge') ||
                reqObj.url.includes('/bdb/jukrah/verify-share') ||
                reqObj.url.includes('/bdb/jukrah/shared/') ||
                reqObj.url.includes('/bdb/jukrah/public/') ||
                reqObj.url.includes('/bdb/sharese/stream/') ||
                reqObj.url.includes('/bdb/sharese/share-challenge') ||
                reqObj.url.includes('/bdb/sharese/verify-share') ||
                reqObj.url.includes('/bdb/sharese/shared/') ||
                reqObj.url.includes('/bdb/sharese/public/') ||
                reqObj.url.includes('/bdb/panduan/stream/') ||
                reqObj.url.includes('/bdb/panduan/share-challenge') ||
                reqObj.url.includes('/bdb/panduan/verify-viewer') ||
                reqObj.url.includes('/bdb/panduan/public/') ||
                reqObj.url.includes('/bdb/system/orchestrator/queue-status'))
        ) {
            // Allow internal DPO archive/photo viewing, self-authenticating tokenized media stream, public sharese/panduan verification gate, and read-only queue status
            const optToken = this.extractTokenFromHeader(reqObj);
            if (optToken) {
                try {
                    reqObj['user'] = await this.jwtService.verifyAsync(optToken, {
                        secret: jwtConstants.secret
                    });
                } catch {}
            }
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            console.log('tidak ada token');

            throw new UnauthorizedException('Invalid token');
        }
        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });
        } catch {
            if (reqObj.url && reqObj.url.includes('/Authentication/logout')) {
                payload = this.jwtService.decode(token) || {};
                request['user'] = payload;
                return true;
            }
            throw new UnauthorizedException('Invalid token');
        }
        request['user'] = payload;
        const device = await this.dataSource.getRepository(Device).findOne({ where: { device_token: payload.device_token } });
        const organisasiId =
            payload.user?.organisasi_id ||
            payload.user?.organisasiId ||
            payload.user?.Organisasi?.id;

        if (!organisasiId) {
            throw new UnauthorizedException('Anda belum tergabung ke Organisasi');
        }
        if (!device) {
            console.log('tidak ada device');
            throw new UnauthorizedException('Invalid token');
        } else {
            return true;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

