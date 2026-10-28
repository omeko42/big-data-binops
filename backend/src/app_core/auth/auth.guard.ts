import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
        }

        const method = String(request.method || '').toUpperCase();
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            const url = String(request.url || reqObj.url || '');
            const isAllowedSessionEndpoint =
                url.includes('/Authentication/logout') ||
                url.includes('/Authentication/refresh') ||
                url.includes('/network/probe');
            if (!isAllowedSessionEndpoint) {
                let roleBdb = String(
                    payload?.role_bdb ||
                    payload?.user?.role_bdb ||
                    payload?.role_name ||
                    payload?.user?.role_name ||
                    ''
                ).trim().toLowerCase();
                const userId = payload?.id || payload?.user?.id;
                if (!['vendor_mitra', 'vendor', 'mitra'].includes(roleBdb) && userId) {
                    try {
                        const rows = await this.dataSource.query(
                            'SELECT role_bdb, role_name FROM auth_users WHERE id = $1 LIMIT 1',
                            [Number(userId)]
                        );
                        if (rows?.[0]) {
                            roleBdb = String(rows[0].role_bdb || rows[0].role_name || roleBdb).trim().toLowerCase();
                        }
                    } catch {}
                }
                if (['vendor_mitra', 'vendor', 'mitra'].includes(roleBdb)) {
                    throw new ForbiddenException(
                        'Akses akun Vendor / Mitra bersifat Read-Only (Hanya Lihat). Anda tidak diizinkan mengubah, menambah, atau menghapus data.'
                    );
                }
            }
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

