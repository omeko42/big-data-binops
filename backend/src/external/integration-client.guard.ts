import { CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SCOPE_KEY } from './require-scope.decorator';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const rateLimitMap = new Map<number, { count: number; resetAt: number }>();

/**
 * Auth untuk portal integrasi keluar: Basic Auth (username:password) terhadap
 * bdb_integration_client, IP Whitelist check, Rate Limiting (120 req/m),
 * lalu cek apakah scope endpoint ada di allowed_scopes klien.
 */
@Injectable()
export class IntegrationClientGuard implements CanActivate {
    constructor(
        private readonly dataSource: DataSource,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const auth = request.headers.authorization || '';
        if (!auth.startsWith('Basic ')) {
            throw new UnauthorizedException('Gunakan Basic Auth (username:password klien integrasi).');
        }

        let decoded: string;
        try {
            decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
        } catch {
            throw new UnauthorizedException('Format kredensial tidak valid.');
        }
        const sep = decoded.indexOf(':');
        if (sep < 0) throw new UnauthorizedException('Format kredensial tidak valid.');
        const username = decoded.slice(0, sep);
        const password = decoded.slice(sep + 1);

        const rows = await this.dataSource.query(
            'select id, username, password_hash, status, allowed_scopes, allowed_ips from bdb_integration_client where username=$1',
            [username]
        );
        const client = rows[0];
        if (!client) throw new UnauthorizedException('Kredensial tidak dikenali.');
        if (client.status !== 'AKTIF') throw new ForbiddenException('Klien integrasi nonaktif.');

        const valid = await bcrypt.compare(password, client.password_hash);
        if (!valid) throw new UnauthorizedException('Kredensial tidak dikenali.');

        // 1. IP Whitelist Check (bila allowed_ips terisi)
        const forwarded = request.headers['x-forwarded-for'];
        const rawClientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : (request.ip || request.socket?.remoteAddress || '');
        const clientIp = rawClientIp.replace(/^::ffff:/, '');

        const allowedIps: string[] = Array.isArray(client.allowed_ips)
            ? client.allowed_ips
            : typeof client.allowed_ips === 'string'
            ? JSON.parse(client.allowed_ips || '[]')
            : [];

        if (allowedIps.length > 0) {
            const cleanAllowed = allowedIps.map(ip => String(ip).trim().replace(/^::ffff:/, ''));
            if (!cleanAllowed.includes(clientIp)) {
                throw new ForbiddenException(`Akses ditolak: IP Anda (${clientIp}) tidak terdaftar dalam IP whitelist klien ini.`);
            }
        }

        // 2. Rate Limiting per Client (120 req / 60 detik)
        const now = Date.now();
        const record = rateLimitMap.get(client.id);
        if (record && now < record.resetAt) {
            if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
                throw new HttpException(
                    {
                        status: 0,
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        message: 'Terlalu banyak permintaan (rate limit terlampaui). Batas maksimal 120 request per menit.'
                    },
                    HttpStatus.TOO_MANY_REQUESTS
                );
            }
            record.count++;
        } else {
            rateLimitMap.set(client.id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        }

        // 3. Scope Authorization
        const requiredScope = this.reflector.get<string>(SCOPE_KEY, context.getHandler());
        const scopes: string[] = Array.isArray(client.allowed_scopes) ? client.allowed_scopes : typeof client.allowed_scopes === 'string' ? JSON.parse(client.allowed_scopes || '[]') : [];
        if (requiredScope && !scopes.includes(requiredScope)) {
            throw new ForbiddenException(`Klien "${username}" tidak memiliki izin akses "${requiredScope}".`);
        }

        (request as any).integrationClient = { id: client.id, username: client.username, allowed_scopes: scopes };

        this.dataSource.query('update bdb_integration_client set last_used_at=now(), last_used_ip=$2 where id=$1', [client.id, clientIp]).catch(() => {});

        return true;
    }
}
