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
        if (reqObj.url && ((reqObj.url.includes('/dpo/') || reqObj.url.includes('/pihak-terlibat/')) && (reqObj.url.includes('/arsip') || reqObj.url.includes('/foto')) || reqObj.url.includes('/bdb/jukrah/stream/'))) {
            // Allow internal DPO archive/photo viewing and self-authenticating tokenized media stream
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            console.log('tidak ada token');

            throw new UnauthorizedException('Invalid token');
        }
        const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret
        });
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

