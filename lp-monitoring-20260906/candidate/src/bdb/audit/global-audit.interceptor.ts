import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Request } from 'express';
import { AuditService } from './audit.service';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Sudah py logging manual sendiri yang lebih detail (jangan dobel), atau bukan "aktifitas"
// yang berguna diaudit. Endpoint LAIN di controller yang sama (mis. bdb/laporan-polisi selain
// correct-satker) TIDAK dilewati -- cuma sub-rute yang sudah benar-benar py audit.log() manual.
const SKIP_PATH_PARTS = [
    '/external/',
    '/swagger',
    '/swaggers',
    '/Authentication/login',
    '/Authentication/verify-login-otp', // auth.controller.ts sudah audit.log('LOGIN_OTP')
    '/Authentication/refresh-token',
    '/Authentication/captcha',
    '/Authentication/impersonate', // auth.service.ts sudah audit.log('IMPERSONATE')
    '/bdb/menu-access', // menu-access.service.ts sudah audit.log('UPDATE', entity:'menu_access')
    '/bdb/jukrah', // jukrah.service.ts sudah audit.log CREATE/UPDATE/DELETE/VIEW entity:'jukrah'
    '/bdb/integration-client', // integration-client.service.ts sudah audit.log lengkap per aksi
    '/correct-satker', // laporan-polisi.service.ts sudah audit.log('CORRECT_SATKER')
    '/soft-delete', // laporan-polisi.service.ts sudah audit.log('SOFT_DELETE')
    '/bdb/panduan', // panduan.service.ts sudah audit.log lengkap per aksi
    '/bdb/system-setting', // system-setting.service.ts sudah audit.log per perubahan
    '/bdb/pihak-terlibat' // pihak-terlibat.service.ts sudah audit.log per perubahan
];

const SENSITIVE_KEYS = ['password', 'secret', 'token', 'otp', 'captcha', 'pin', 'totp'];

function sanitize(value: unknown, depth = 0): unknown {
    if (depth > 3 || value === null || value === undefined) return value;
    if (Array.isArray(value)) return value.map(v => sanitize(v, depth + 1));
    if (typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            out[k] = SENSITIVE_KEYS.some(s => k.toLowerCase().includes(s)) ? '***' : sanitize(v, depth + 1);
        }
        return out;
    }
    return value;
}

/** Ambil 1-2 segmen path pertama setelah prefix API sebagai nama "entity" (mis. bdb/kerma, bdb/laporan-polisi). */
function entityFromPath(path: string): string {
    const clean = path
        .split('?')[0]
        .replace(/^\/?(dev\/api\/|api\/)?/, '')
        .replace(/\/+$/, '');
    const parts = clean.split('/').filter(Boolean);
    return parts.slice(0, 2).join('/') || clean || 'unknown';
}

/**
 * Pencatat aktivitas OTOMATIS untuk SELURUH endpoint di aplikasi, terdaftar sebagai
 * APP_INTERCEPTOR global (lihat app_core.module.ts) supaya tidak ada endpoint baru yang lolos
 * tak tercatat. Login diaudit terpisah di AuthController (pre-auth, req.user belum ada di titik
 * ini). Endpoint yang sudah py logging detail sendiri (Portal Integrasi Keluar) dilewati lewat
 * SKIP_PATH_PARTS supaya tidak dobel.
 *
 * Endpoint TULIS (POST/PUT/PATCH/DELETE): dicatat SUKSES maupun ERROR (perilaku lama, tak berubah).
 * Endpoint BACA (GET dkk): HANYA dicatat kalau ERROR -- kalau tidak, tabel audit meledak isinya
 * krn tiap GET biasa (dashboard, listing, dll) ikut tercatat. Ini yg sebelumnya bikin bug SQL di
 * SatkerLegacyReconciliationService (endpoint GET) sama sekali tak kelihatan di log manapun --
 * ErrorExceptionFilter global membalasnya sbg HTTP 200 {status:0} tanpa jejak, dan interceptor ini
 * dulu skip semua GET tanpa terkecuali. Sekarang errornya tetap tercatat & bisa ditelusuri ke user
 * yang kena, dipakai jg utk cross-check klaim komplain user (`bdb_audit_log.outcome`).
 */
@Injectable()
export class GlobalAuditInterceptor implements NestInterceptor {
    constructor(private readonly audit: AuditService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method;
        const path = request.originalUrl || request.url || '';
        if (SKIP_PATH_PARTS.some(p => path.includes(p))) return next.handle();
        const isMutating = MUTATING_METHODS.has(method);

        const record = (outcome: 'SUCCESS' | 'ERROR', message?: string) => {
            const user = (request as any).user;
            const userId = user?.id ?? user?.user?.id;
            const userName = user?.name ?? user?.username ?? user?.user?.name;
            void this.audit.log({
                userId: userId ? Number(userId) : undefined,
                userName,
                action: method,
                entity: entityFromPath(path),
                meta: { path, params: request.params, query: request.query, body: sanitize(request.body), outcome, message },
                ip: request.ip,
                outcome
            });
        };

        return next.handle().pipe(
            tap((data: any) => {
                // Sebagian service balas {status:0,...} tanpa melempar exception -- hitung itu ERROR juga.
                if (data && typeof data === 'object' && data.status === 0) {
                    record('ERROR', data.message);
                } else if (isMutating) {
                    record('SUCCESS');
                }
            }),
            catchError(err => {
                const message = err?.response?.message || err?.message || 'Gagal';
                record('ERROR', typeof message === 'string' ? message : JSON.stringify(message));
                return throwError(() => err);
            })
        );
    }
}
