"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
const typeorm_1 = require("typeorm");
const device_entity_1 = require("./device/entities/device.entity");
let AuthGuard = class AuthGuard {
    jwtService;
    dataSource;
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async canActivate(context) {
        const reqObj = context.switchToHttp().getRequest();
        if (reqObj.url &&
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
                reqObj.url.includes('/bdb/system/orchestrator/queue-status'))) {
            const optToken = this.extractTokenFromHeader(reqObj);
            if (optToken) {
                try {
                    reqObj['user'] = await this.jwtService.verifyAsync(optToken, {
                        secret: constants_1.jwtConstants.secret
                    });
                }
                catch { }
            }
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            console.log('tidak ada token');
            throw new common_1.UnauthorizedException('Invalid token');
        }
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: constants_1.jwtConstants.secret
            });
        }
        catch {
            if (reqObj.url && reqObj.url.includes('/Authentication/logout')) {
                payload = this.jwtService.decode(token) || {};
                request['user'] = payload;
                return true;
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
        request['user'] = payload;
        const device = await this.dataSource.getRepository(device_entity_1.Device).findOne({ where: { device_token: payload.device_token } });
        const organisasiId = payload.user?.organisasi_id ||
            payload.user?.organisasiId ||
            payload.user?.Organisasi?.id;
        if (!organisasiId) {
            throw new common_1.UnauthorizedException('Anda belum tergabung ke Organisasi');
        }
        if (!device) {
            console.log('tidak ada device');
            throw new common_1.UnauthorizedException('Invalid token');
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
                    } catch { }
                }
                if (['vendor_mitra', 'vendor', 'mitra'].includes(roleBdb)) {
                    throw new common_1.ForbiddenException(
                        'Akses akun Vendor / Mitra bersifat Read-Only (Hanya Lihat). Anda tidak diizinkan mengubah, menambah, atau menghapus data.'
                    );
                }
            }
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, typeorm_1.DataSource])
], AuthGuard);
