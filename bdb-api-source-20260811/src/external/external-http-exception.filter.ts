import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuditService } from '../bdb/audit/audit.service';

/**
 * Filter khusus /external/v1/*: kembalikan status HTTP asli (401/403/404/...) alih-alih
 * konvensi internal aplikasi (selalu HTTP 200 + {status:0,...}, lihat ErrorExceptionFilter)
 * yang cocok untuk frontend CMS sendiri tapi menyesatkan bagi klien pihak luar yang lazimnya
 * memeriksa status code HTTP untuk menentukan sukses/gagal. Juga mencatat setiap kegagalan
 * (auth/izin/lainnya) ke log akses — pemanggilan sukses dicatat oleh ExternalAccessLogInterceptor.
 */
@Injectable()
@Catch()
export class ExternalHttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly audit: AuditService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const body = exception.getResponse();
            message = typeof body === 'string' ? body : (body as any)?.message || exception.message;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        const client = (request as any).integrationClient;
        void this.audit.log({
            userId: client?.id,
            userName: client?.username || this.attemptedUsername(request),
            action: 'EXTERNAL_API_CALL',
            entity: 'external_api',
            entityId: client?.id,
            meta: { method: request.method, path: request.originalUrl, query: request.query, outcome: 'ERROR', statusCode: status, message },
            ip: request.ip
        });

        response.status(status).json({ status: 0, statusCode: status, message });
    }

    /** Kalau guard gagal sebelum menemukan klien (mis. username salah), ambil dari header Basic Auth buat jejak audit. */
    private attemptedUsername(request: Request): string | undefined {
        try {
            const auth = request.headers.authorization || '';
            if (!auth.startsWith('Basic ')) return undefined;
            const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
            return decoded.split(':')[0] || undefined;
        } catch {
            return undefined;
        }
    }
}
